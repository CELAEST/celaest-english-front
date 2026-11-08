#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Centro de control de producción Pathway: audita y construye bases sin ir pista por pista.

Comandos:
  python pathway.py status                  # matriz de TODAS las bases (audio, casos, registro, cierre)
  python pathway.py audit --base base_03    # gates + lista exacta de lo que falta/falla + reporte .md
  python pathway.py audit --all             # audita todas
  python pathway.py build --base base_03    # audita, genera SOLO lo que falta/falla, re-audita y corre tests

Salida: exit code 0 si la base queda en verde; 1 si hay algo que resolver.
Los reportes quedan en `.pathway_reports/<base>.md`.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_profile import parse_profile, sanitize, validate  # noqa: E402
from guion_lint import lint as lint_guion, print_report as print_guion  # noqa: E402
from check_audio import true_peak_and_lra  # noqa: E402
from curriculum_audit import audit as fidelity_audit, curriculum_blocks  # noqa: E402

PROFILES_DIR = Path("src/features/pathway/speech/profiles")
MANIFEST = Path("src/features/pathway/data/a1AudioManifest.json")
AUDIO_ROOT = Path("public/audio/pathway/a1")
REGISTRY = PROFILES_DIR / "index.ts"
COVERAGE = Path("src/features/pathway/services/__tests__/speechCoverage.test.ts")
REPORTS = Path(".pathway_reports")
THRESHOLD = 0.95
WORKSPACE = Path(os.environ.get(
    "PATHWAY_WORKSPACE",
    str(Path.home() / "OneDrive/Documentos/deepseek-harness/default-workspace"),
))


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def load_manifest() -> dict:
    return json.loads(read(MANIFEST))


def state_info(base: str) -> tuple[dict[str, float], float]:
    """Ratios del estado incremental y mtime del archivo de estado.

    Si el mp3 es más nuevo que el estado, el ratio está viejo: se descarta y el audit
    lo vuelve a medir con Whisper. Así el panel no acusa pistas que ya se regeneraron.
    """
    merged: dict[str, float] = {}
    newest = 0.0
    for candidate in (
        Path(f"_{base.replace('_', '')}_state.json"),
        WORKSPACE / f"_{base.replace('_', '')}_state.json",
        Path(f".pathway_state_{base}.json"),
        WORKSPACE / f".pathway_state_{base}.json",
    ):
        if candidate.exists():
            try:
                data = json.loads(read(candidate))
                merged.update({k: float(v["ratio"]) for k, v in data.items() if isinstance(v, dict) and "ratio" in v})
                newest = max(newest, candidate.stat().st_mtime)
            except Exception:
                continue
    return merged, newest


def norm_words(text: str) -> str:
    import unicodedata
    t = unicodedata.normalize("NFD", text or "")
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    return __import__("re").sub(r"\s+", " ", __import__("re").sub(r"[^a-z0-9\s]", " ", t)).strip()


def registered_bases() -> set[str]:
    if not REGISTRY.exists():
        return set()
    text = read(REGISTRY)
    return set(__import__("re").findall(r'from "\./(base_\d+)"', text))


def closed_bases() -> set[str]:
    if not COVERAGE.exists():
        return set()
    text = read(COVERAGE)
    m = __import__("re").search(r"CLOSED_BASES[^=]*=\s*\[(.*?)\]", text, __import__("re").S)
    if not m:
        return set()
    return set(__import__("re").findall(r'"(base_\d+)"', m.group(1)))


def rows_for(profile: dict, manifest: dict, base: str) -> list[dict]:
    ratios, state_mtime = state_info(base)
    out = []
    for m in profile["moments"]:
        mid = m["id"]
        key = sanitize(m["text"])
        rel = manifest.get(key) or manifest.get(m["text"].strip())
        row = {
            "id": mid,
            "beat": m["beat"],
            "language": m["language"],
            "words": len(m["text"].split()),
            "text": m["text"],
            "canonical": m.get("canonical"),
            "cue": m["cue"],
            "rel": rel,
            "ratio": ratios.get(mid),
            "stale": False,
            "status": "OK",
            "detail": "",
        }
        if not rel:
            row.update(status="SIN_MANIFIESTO", detail="el texto no tiene clave en el manifiesto")
        elif f"/{base}/" not in rel:
            row.update(status="OTRA_BASE", detail=rel)
        else:
            file = Path("public") / rel.lstrip("/")
            if not file.exists():
                row.update(status="SIN_ARCHIVO", detail=str(file))
            elif file.stat().st_size <= 1000:
                row.update(status="ARCHIVO_VACIO", detail=f"{file.stat().st_size} B")
            else:
                if row["ratio"] is not None and file.stat().st_mtime > state_mtime + 2:
                    row["ratio"] = None
                    row["stale"] = True
                if row["ratio"] is not None and row["ratio"] < THRESHOLD:
                    row.update(status="GATE", detail=f"ratio {row['ratio']:.3f} < {THRESHOLD}")
        out.append(row)
    return out


def refresh(summary: dict) -> None:
    summary["ok"] = sum(1 for r in summary["rows"] if r["status"] == "OK")
    summary["bad"] = [r for r in summary["rows"] if r["status"] != "OK"]
    ratios = [r["ratio"] for r in summary["rows"] if r["ratio"] is not None]
    summary["min_ratio"] = min(ratios) if ratios else None


def asr_verify(summary: dict) -> int:
    """Re-mide con Whisper las pistas sin ratio o bajo el gate (estado viejo o dudoso)."""
    targets = [
        r for r in summary["rows"]
        if r["status"] in ("OK", "GATE") and r.get("rel")
        and (r["ratio"] is None or r["ratio"] < THRESHOLD)
    ]
    if not targets:
        return 0
    try:
        import difflib
        import subprocess
        import numpy as np
        from faster_whisper import WhisperModel
    except Exception as exc:  # noqa: BLE001
        print(f"  (ASR no disponible: {type(exc).__name__}; no se re-midieron {len(targets)} pistas)")
        return 0
    model = WhisperModel("small", device="cpu", compute_type="int8")
    for r in targets:
        path = Path("public") / r["rel"].lstrip("/")
        if not path.exists():
            continue
        try:
            out = subprocess.run(
                ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                capture_output=True, check=True,
            )
            audio = np.frombuffer(out.stdout, np.float32)
            segs, _ = model.transcribe(audio, language=r["language"], beam_size=5)
            heard = " ".join(s.text.strip() for s in segs).strip()
            target = r["canonical"] or r["text"]
            ratio = difflib.SequenceMatcher(None, norm_words(target).split(), norm_words(heard).split()).ratio()
            r["ratio"] = round(ratio, 3)
            r["detail"] = f"ASR {ratio:.3f}" + (" (estado viejo)" if r.get("stale") else "")
            r["status"] = "OK" if ratio >= THRESHOLD else "GATE"
        except Exception as exc:  # noqa: BLE001
            print(f"  (ASR falló en {r['id']}: {type(exc).__name__})")
    return len(targets)


def base_summary(base: str, manifest: dict) -> dict:
    path = PROFILES_DIR / f"{base}.ts"
    profile = parse_profile(path)
    rows = rows_for(profile, manifest, base)
    cases = sorted({
        m["cue"].get("activeFormulaCaseIndex")
        for m in profile["moments"]
        if "activeFormulaCaseIndex" in m["cue"]
    })
    ratios = [r["ratio"] for r in rows if r["ratio"] is not None]
    return {
        "base": base,
        "profile": profile,
        "rows": rows,
        "cases": (max(cases) + 1) if cases else 1,
        "moments": len(rows),
        "ok": sum(1 for r in rows if r["status"] == "OK"),
        "bad": [r for r in rows if r["status"] != "OK"],
        "min_ratio": min(ratios) if ratios else None,
        "registered": base in registered_bases(),
        "closed": base in closed_bases(),
    }


def print_status(bases: list[str], as_json: bool = False) -> int:
    manifest = load_manifest()
    summaries = [base_summary(b, manifest) for b in bases]
    if as_json:
        print(json.dumps(
            [{k: v for k, v in s.items() if k not in ("profile", "rows")} | {"bad": len(s["bad"])} for s in summaries],
            ensure_ascii=False, indent=2,
        ))
        return 0

    print(f"{'BASE':<9} {'CASOS':>5} {'PISTAS':>6} {'AUDIO':>7} {'MIN':>6} {'REG':>4} {'CERRADA':>8}")
    for s in summaries:
        ratio = f"{s['min_ratio']:.2f}" if s["min_ratio"] is not None else "  - "
        print(f"{s['base']:<9} {s['cases']:>5} {s['moments']:>6} {s['ok']:>3}/{s['moments']:<3} "
              f"{ratio:>6} {'sí' if s['registered'] else 'NO':>4} {'sí' if s['closed'] else 'NO':>8}")
        for r in s["bad"][:6]:
            print(f"   · {r['id']:<24} {r['status']:<14} {r['detail'][:70]}")
        if len(s["bad"]) > 6:
            print(f"   · … y {len(s['bad']) - 6} pista(s) más")

    # colisiones globales de texto (misma clave = mismo mp3)
    owners: dict[str, list[str]] = {}
    for s in summaries:
        for m in s["profile"]["moments"]:
            owners.setdefault(sanitize(m["text"]), []).append(f"{s['base']}/{m['id']}")
    collisions = {k: v for k, v in owners.items() if len({x.split('/')[0] for x in v}) > 1}
    if collisions:
        print("\nCOLISIONES DE TEXTO ENTRE BASES (la segunda usaría el audio de la primera):")
        for text, where in list(collisions.items())[:10]:
            print(f"  · {where} -> {text[:60]!r}")
    unregistered = [s["base"] for s in summaries if not s["registered"]]
    if unregistered:
        print(f"\nPerfiles escritos pero NO registrados: {', '.join(unregistered)}")
    return 0


def run_tests() -> tuple[bool, str]:
    npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
    tsc = subprocess.run([npx, "tsc", "--noEmit"], capture_output=True, text=True)
    if tsc.returncode != 0:
        return False, (tsc.stdout + tsc.stderr).strip()[-900:]
    vit = subprocess.run([npx, "vitest", "run", "src/features/pathway"], capture_output=True, text=True)
    out = ((vit.stdout or "") + (vit.stderr or "")).strip()
    ok = vit.returncode == 0 and "failed" not in out.lower()
    tail = "\n".join([ln for ln in out.splitlines() if "Test Files" in ln or "Tests " in ln or "FAIL" in ln][-4:])
    return ok, tail or out[-500:]


def build_report(base: str, summary: dict, verdict: str, actions: list[str], tests: tuple[bool, str] | None) -> Path:
    REPORTS.mkdir(exist_ok=True)
    path = REPORTS / f"{base}.md"
    p = summary["profile"]["header"]
    examples = sum(1 for r in summary["rows"] if r["beat"] == "EXAMPLES" and r["language"] == "en")
    phonetic = any(r["beat"] == "EXAMPLES" and r["language"] == "es" and r.get("canonical") for r in summary["rows"])
    anchor = any(r["id"] == "trap.anchor" for r in summary["rows"])
    pedagogy = "PASS" if examples >= 2 and anchor and summary["cases"] >= 1 else "REVISAR"
    lines = [
        f"# {base} — reporte de producción",
        "",
        f"- Título: {p.get('title', '')}",
        f"- orderIndex: {p.get('orderIndex', '')}",
        f"- Generado: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"- Veredicto: **{verdict}**",
        "",
        "## Gates",
        "",
        "| Gate | Estado | Detalle |",
        "|---|---|---|",
        f"| Perfil | {'PASS' if not summary.get('profile_errors') else 'FAIL'} | {len(summary['rows'])} momentos |",
        f"| Casos de fórmula | {'PASS' if not summary.get('case_error') else 'FAIL'} | {summary['cases']} explicado(s) |",
        f"| Pedagogía | {pedagogy} | {examples} ejemplo(s) · fonética {'sí' if phonetic else 'no'} · ancla {'sí' if anchor else 'no'} |",
        f"| Picos | {'PASS' if not any(r['status'] == 'CLIP' for r in summary['rows']) else 'FAIL'} | "
        f"{sum(1 for r in summary['rows'] if r['status'] == 'CLIP')} pista(s) clipeada(s) |",
        f"| Currículo | {'PASS' if not summary.get('fidelity_errors') else 'FAIL'} | "
        f"{len(summary.get('fidelity_errors', []))} diferencia(s) |",
        f"| Guion (calidad) | {'PASS' if not summary.get('guion', {}).get('errors') else 'FAIL'} | "
        f"{len(summary.get('guion', {}).get('errors', []))} error(es), "
        f"{len(summary.get('guion', {}).get('warnings', []))} aviso(s) · "
        f"{sum(1 for s in summary.get('guion', {}).get('uc', {}).values() if s['ok'])}/{len(summary.get('guion', {}).get('uc', {}))} UC |",
        f"| Audio | {'PASS' if not summary['bad'] else 'FAIL'} | {summary['ok']}/{summary['moments']} con mp3 |",
        f"| Registro | {'PASS' if summary['registered'] else 'PENDIENTE'} | speech/profiles/index.ts |",
        f"| Base cerrada | {'PASS' if summary['closed'] else 'PENDIENTE'} | CLOSED_BASES |",
        f"| Tests | {'PASS' if tests and tests[0] else ('FAIL' if tests else 'NO EJECUTADO')} | tsc + vitest |",
        "",
        "## Pistas",
        "",
        "| id | beat | idioma | palabras | ratio | estado | detalle |",
        "|---|---|---|---|---|---|---|",
    ]
    for r in summary["rows"]:
        ratio = f"{r['ratio']:.3f}" if r["ratio"] is not None else "-"
        lines.append(f"| {r['id']} | {r['beat']} | {r['language']} | {r['words']} | {ratio} | {r['status']} | {r['detail']} |")
    if actions:
        lines += ["", "## Qué hacer", ""] + [f"- {a}" for a in actions]
    if tests:
        lines += ["", "## Tests", "", "```", tests[1], "```"]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def audit(base: str, expected_cases: int | None, with_tests: bool, quiet: bool = False, use_asr: bool = True) -> tuple[dict, list[str], list[str], bool]:
    manifest = load_manifest()
    summary = base_summary(base, manifest)
    errors, warnings = validate(summary["profile"], None)

    case_error = None
    if expected_cases is not None and summary["cases"] != expected_cases:
        case_error = f"el currículo declara {expected_cases} caso(s) y el perfil explica {summary['cases']}"
        errors.append(case_error)
    summary["profile_errors"] = [e for e in errors if "caso" not in e.lower()]
    summary["case_error"] = case_error

    blocks = curriculum_blocks()
    index = int(base.replace("base_", "")) - 1
    fidelity = fidelity_audit(base, blocks[index]) if 0 <= index < len(blocks) else []
    summary["fidelity_errors"] = fidelity
    errors.extend(fidelity)

    guion = lint_guion(summary["profile"], None)
    summary["guion"] = guion
    errors.extend(guion["errors"])
    warnings.extend(f"GUION {w}" for w in guion["warnings"])

    asr_n = asr_verify(summary) if use_asr else 0
    refresh(summary)

    # Gate acústico: un ratio 1.000 no salva una pista que clipea.
    for r in summary["rows"]:
        if r["status"] in ("OK", "GATE") and r.get("rel"):
            file = Path("public") / r["rel"].lstrip("/")
            tp, lra = true_peak_and_lra(file)
            if tp is not None and tp > -0.5:
                r["status"] = "CLIP"
                r["detail"] = f"true peak {tp} dBTP (clipea)"
            elif tp is not None and tp > -1.0:
                warnings.append(f"[{r['id']}] true peak {tp} dBTP: sin margen")
    refresh(summary)
    if asr_n:
        print(f"  ASR: {asr_n} pista(s) re-medida(s) por estado viejo o ratio bajo")

    actions = []
    for r in summary["bad"]:
        if r["status"] == "SIN_MANIFIESTO":
            actions.append(f"generar {r['id']} (no tiene MP3 ni clave)")
        elif r["status"] in ("SIN_ARCHIVO", "ARCHIVO_VACIO", "OTRA_BASE"):
            actions.append(f"regenerar {r['id']} ({r['status']}: {r['detail']})")
        elif r["status"] == "GATE":
            actions.append(f"revisar/regenerar {r['id']} ({r['detail']})")
        elif r["status"] == "CLIP":
            actions.append(f"sanea el pico de {r['id']} ({r['detail']}) o regenéralo")
    if not summary["registered"]:
        actions.append(f"registrar {base} en speech/profiles/index.ts")
    if not summary["closed"]:
        actions.append(f"agregar {base} a CLOSED_BASES en speechCoverage.test.ts")
    for e in summary.get("fidelity_errors", []):
        actions.append(f"currículo: {e}")
    for e in summary["guion"]["errors"]:
        actions.append(f"guion: {e}")
    for name, state in summary["guion"]["uc"].items():
        if state["missing"]:
            actions.append(f"caso de uso {name}: agregar {', '.join(state['missing'])}")

    tests = run_tests() if with_tests else None
    verdict = "VERDE" if not errors and not summary["bad"] else "ROJO"
    path = build_report(base, summary, verdict, actions, tests)

    if not quiet:
        print(f"\n=== {base} ===")
        print(f"perfil: {summary['moments']} momentos · {summary['cases']} caso(s) · "
              f"audio {summary['ok']}/{summary['moments']}")
        for e in errors:
            print(f"  ERROR  {e}")
        for w in warnings:
            print(f"  WARN   {w}")
        for r in summary["bad"]:
            print(f"  PISTA  {r['id']:<24} {r['status']:<14} {r['detail']}")
        print(f"registro: {'sí' if summary['registered'] else 'NO'} · "
              f"cerrada: {'sí' if summary['closed'] else 'NO'} · reporte: {path}")
        if tests:
            print(f"tests: {'PASS' if tests[0] else 'FAIL'} · {tests[1]}")

    ok = not errors and not summary["bad"]
    return summary, errors, warnings, ok


MODULES = [
    "module1Identity.ts",
    "module2Routines.ts",
    "module3ObjectsPossession.ts",
    "module4SpaceTimeQuantity.ts",
    "module5Communication.ts",
    "module6FluencyAndBridge.ts",
]


def curriculum_titles() -> list[str]:
    titles: list[str] = []
    for name in MODULES:
        path = Path("src/features/pathway/curriculum/a1") / name
        if not path.exists():
            continue
        titles.extend(__import__("re").findall(r'title:\s*"((?:[^"\\]|\\.)*)"', read(path)))
    return titles


def print_plan(as_json: bool = False) -> int:
    titles = curriculum_titles()
    manifest = load_manifest()
    reg, closed = registered_bases(), closed_bases()
    rows = []
    for i, title in enumerate(titles, 1):
        base = f"base_{i:02d}"
        profile = PROFILES_DIR / f"{base}.ts"
        if profile.exists():
            s = base_summary(base, manifest)
            rows.append({"base": base, "title": title, "cases": s["cases"], "moments": s["moments"],
                         "ok": s["ok"], "registered": base in reg, "closed": base in closed,
                         "state": "CERRADA" if base in closed else ("PERFIL" if profile.exists() else "FALTA")})
        else:
            rows.append({"base": base, "title": title, "cases": "-", "moments": "-", "ok": "-",
                         "registered": base in reg, "closed": base in closed, "state": "FALTA"})
    if as_json:
        import json as _json
        print(_json.dumps(rows, ensure_ascii=False, indent=2))
        return 0
    print(f"{'BASE':<9} {'CASOS':>5} {'PISTAS':>6} {'AUDIO':>7} {'ESTADO':<8} TÍTULO")
    for r in rows:
        print(f"{r['base']:<9} {str(r['cases']):>5} {str(r['moments']):>6} {str(r['ok']):>7} "
              f"{r['state']:<8} {r['title'][:58]}")
    pend = [r["base"] for r in rows if r["state"] != "CERRADA"]
    print(f"\n{sum(1 for r in rows if r['state'] == 'CERRADA')}/{len(rows)} cerradas · pendientes: {', '.join(pend)}")
    return 0


def close_base(base: str) -> bool:
    """Registra el perfil y lo agrega a CLOSED_BASES. Idempotente."""
    profile = PROFILES_DIR / f"{base}.ts"
    if not profile.exists():
        print(f"FAIL: no existe {profile}")
        return False
    camel = base.replace("base_", "base") + "SpeechProfile"
    reg_text = read(REGISTRY)
    changed = []
    if f'from "./{base}"' not in reg_text:
        anchor_import = f'import {{ {camel} }} from "./{base}";'
        lines = reg_text.splitlines()
        last_import = max(i for i, line in enumerate(lines) if line.startswith("import "))
        lines.insert(last_import + 1, anchor_import)
        reg_text = "\n".join(lines) + "\n"
        changed.append("import")
    if f"{camel}," not in reg_text:
        import re as _re
        m = _re.search(r"(export const speechProfiles: BaseSpeechProfile\[\] = \[)(.*?)(\];)", reg_text, _re.S)
        if m:
            body = m.group(2)
            if f"{camel}," not in body:
                body = body.rstrip()
                if not body.endswith(","):
                    body += ","
                body += f"\n  {camel},\n"
                reg_text = reg_text[:m.start(2)] + body + reg_text[m.end(2):]
                changed.append("array")
    REGISTRY.write_text(reg_text, encoding="utf-8")

    cov = read(COVERAGE)
    import re as _re
    m = _re.search(r"(const CLOSED_BASES: string\[\] = \[)(.*?)(\];)", cov, _re.S)
    if m and f'"{base}"' not in m.group(2):
        body = m.group(2).rstrip()
        if not body.endswith(",") and body.strip():
            body += ","
        body += f' "{base}"'
        cov = cov[:m.start(2)] + body + cov[m.end(2):]
        COVERAGE.write_text(cov, encoding="utf-8")
        changed.append("CLOSED_BASES")
    print(f"{base}: " + (", ".join(changed) if changed else "ya estaba registrada y cerrada"))
    return True


def batch(from_base: str, to_base: str, skip_tests: bool) -> int:
    start = int(from_base.replace("base_", ""))
    end = int(to_base.replace("base_", ""))
    for n in range(start, end + 1):
        base = f"base_{n:02d}"
        if not (PROFILES_DIR / f"{base}.ts").exists():
            print(f"ABORTO: falta el perfil {base}. Los perfiles se escriben antes de generar audio.")
            return 1
        print(f"\n=== batch {base} ===", flush=True)
        rc = subprocess.run([sys.executable, str(Path(__file__).resolve()), "build", "--base", base]).returncode
        if rc != 0:
            print(f"ABORTO: {base} no quedó en verde. Revisá .pathway_reports/{base}.md")
            return rc
        close_base(base)
    if not skip_tests:
        ok, detail = run_tests()
        print(f"\ntests: {'PASS' if ok else 'FAIL'} · {detail}")
        if not ok:
            return 1
    print("\nbatch completo y cerrado.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    st = sub.add_parser("status", help="matriz de todas las bases")
    st.add_argument("--bases", default=None, help="01,02,03")
    st.add_argument("--json", action="store_true")

    au = sub.add_parser("audit", help="gates + lista exacta de lo que falta")
    au.add_argument("--base")
    au.add_argument("--all", action="store_true")
    au.add_argument("--cases", type=int, default=None)
    au.add_argument("--tests", action="store_true")
    au.add_argument("--no-asr", action="store_true", help="no re-medir ratios con Whisper")

    bu = sub.add_parser("build", help="audita, genera solo lo que falta y re-audita")
    bu.add_argument("--base", required=True)
    bu.add_argument("--cases", type=int, default=None)
    bu.add_argument("--plan", action="store_true", help="solo muestra qué generaría")
    bu.add_argument("--no-tests", action="store_true")
    bu.add_argument("--force-ids", default=None, help="ids extra a regenerar (coma)")
    bu.add_argument("--no-asr", action="store_true", help="no re-medir ratios con Whisper")

    pl = sub.add_parser("plan", help="las 32 bases: perfil, audio, registro y cierre")
    pl.add_argument("--json", action="store_true")

    cl = sub.add_parser("close", help="registrar una base y agregarla a CLOSED_BASES")
    cl.add_argument("--base", required=True)

    ba = sub.add_parser("batch", help="construir y cerrar un rango de bases en serie")
    ba.add_argument("--from", dest="from_base", required=True)
    ba.add_argument("--to", dest="to_base", required=True)
    ba.add_argument("--skip-tests", action="store_true")

    gu = sub.add_parser("guion", help="solo calidad del guion (pedagogía, flujo, fluidez, UC)")
    gu.add_argument("--base", required=True)
    gu.add_argument("--cases", type=int, default=None)
    gu.add_argument("--json", action="store_true")

    args = ap.parse_args()

    if args.cmd == "status":
        if args.bases:
            bases = [b if b.startswith("base_") else f"base_{b}" for b in args.bases.split(",")]
        else:
            bases = sorted(p.stem for p in PROFILES_DIR.glob("base_*.ts"))
        return print_status(bases, args.json)

    if args.cmd == "audit":
        if args.all:
            bases = sorted(p.stem for p in PROFILES_DIR.glob("base_*.ts"))
        elif args.base:
            bases = [args.base]
        else:
            ap.error("pasá --base o --all")
        all_ok = True
        for b in bases:
            _, _, _, ok = audit(b, args.cases if len(bases) == 1 else None, args.tests, use_asr=not args.no_asr)
            all_ok = all_ok and ok
        return 0 if all_ok else 1

    if args.cmd == "plan":
        return print_plan(args.json)

    if args.cmd == "close":
        return 0 if close_base(args.base) else 1

    if args.cmd == "batch":
        return batch(args.from_base, args.to_base, args.skip_tests)

    if args.cmd == "guion":
        path = PROFILES_DIR / f"{args.base}.ts"
        if not path.exists():
            print(f"FAIL: no existe {path}")
            return 1
        result = lint_guion(parse_profile(path), args.cases)
        print_guion(result)
        if args.json:
            import json as _json
            print(_json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if not result["errors"] else 1

    if args.cmd == "build":
        summary, errors, _, ok = audit(args.base, args.cases, False, quiet=True, use_asr=True)
        if errors:
            for e in errors:
                print(f"  ERROR  {e}")
            print("\nABORTO: el guion tiene errores de contrato o de calidad; corregilos antes de gastar GPU.")
            return 1
        ids = [r["id"] for r in summary["bad"]]
        if args.force_ids:
            ids += [x.strip() for x in args.force_ids.split(",") if x.strip()]
        ids = sorted(set(ids))
        if not ids:
            print(f"\n{args.base}: no hay nada que generar (audio completo).")
        else:
            print(f"\nSe generarán {len(ids)} pista(s): {', '.join(ids)}")
            if args.plan:
                print("PLAN: no se generó nada.")
                return 0
            cmd = [sys.executable, str(Path(__file__).with_name("gen_base.py")),
                   "--base", args.base, "--only", ",".join(ids), "--force"]
            rc = subprocess.run(cmd).returncode
            if rc != 0:
                print("La generación terminó con fallos; revisá el reporte QA antes de seguir.")
        # re-auditar
        with_tests = not args.no_tests
        summary, errors, _, ok = audit(args.base, args.cases, with_tests, use_asr=not args.no_asr)
        return 0 if ok else 1

    return 1


if __name__ == "__main__":
    sys.exit(main())
