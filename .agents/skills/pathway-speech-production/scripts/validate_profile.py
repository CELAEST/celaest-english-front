#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida un perfil de guion Pathway (src/features/pathway/speech/profiles/base_XX.ts)
contra el contrato de producción.

Uso:
  python validate_profile.py --profile src/features/pathway/speech/profiles/base_02.ts --cases 2
  python validate_profile.py --all --profiles-dir src/features/pathway/speech/profiles

Salida: PASS/FAIL + lista de errores y advertencias. Exit code 1 si hay errores.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HOOK_IDS = [
    "build.transition",
    "build.success",
    "build.error",
    "speak.lead",
    "speak.model",
    "speak.instruction",
    "voice.victory",
    "voice.retry",
    "voice.not_heard",
    "trapcheck.error",
    "trapcheck.success",
    "mic.error",
]

BEAT_ORDER = ["FORMULA", "TRAP", "TRAP_CHECK", "EXAMPLES", "BUILD", "SPEAK"]
VALID_PAUSES = {260, 380, 750}

# Palabras que delatan una frase inglesa dentro de una pista española (Ley 1).
# "am", "is", "ar", "not" se permiten: son las parejas que el mentor nombra.
EN_LEAK = {
    "the", "you", "we", "they", "today", "ready", "isn't", "aren't", "have",
    "years", "old", "important", "cold", "warm", "sunny", "practice", "every",
    "day", "very", "late", "learn", "english", "work", "focused", "start",
    "lesson", "meeting", "busy", "hungry", "thirsty", "outside", "morning",
    "team", "step", "by", "to", "at", "in", "on", "for", "with", "my", "your",
}


def read_text(path: Path) -> str:
    # utf-8-sig tolera BOM: un archivo guardado por PowerShell puede traerlo.
    return path.read_text(encoding="utf-8-sig")


def parse_profile(path: Path) -> dict:
    src = read_text(path)
    header = {}
    for key in ("baseId", "orderIndex", "title", "targetSentence", "voiceProfile"):
        m = re.search(rf'\b{key}:\s*"((?:[^"\\]|\\.)*)"', src)
        if m:
            header[key] = json.loads(f'"{m.group(1)}"')
    m = re.search(r"\borderIndex:\s*(\d+)", src)
    if m:
        header["orderIndex"] = int(m.group(1))

    starts = [m.start() for m in re.finditer(r'\bid:\s*"', src)]
    moments = []
    for i, start in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(src)
        chunk = src[start:end]

        def grab(pattern):
            hit = re.search(pattern, chunk)
            return hit.group(1) if hit else None

        raw_text = grab(r'text:\s*"((?:[^"\\]|\\.)*)"')
        if not raw_text:
            continue
        raw_canon = grab(r'canonical:\s*"((?:[^"\\]|\\.)*)"')
        raw_badge = grab(r'badgeLabel:\s*"((?:[^"\\]|\\.)*)"')
        cue_block = re.search(r"cue:\s*\{([^}]*)\}", chunk)
        cue = {}
        if cue_block:
            for key in ("formulaRevealCount", "activeFormulaCaseIndex", "activeExampleIndex", "trapPhase"):
                cm = re.search(rf"{key}:\s*(\d+)", cue_block.group(1))
                if cm:
                    cue[key] = int(cm.group(1))
        pause = re.search(r"pauseAfterMs:\s*(PAUSE\.\w+|\d+)", chunk)
        if pause:
            raw_pause = pause.group(1)
            pause_ms = {
                "PAUSE.standard": 260,
                "PAUSE.beforeNativeModel": 380,
                "PAUSE.afterNativeModel": 750,
            }.get(raw_pause, int(raw_pause) if raw_pause.isdigit() else None)
        else:
            pause_ms = None
        moments.append(
            {
                "id": grab(r'id:\s*"([^"]+)"'),
                "beat": grab(r'beat:\s*"([^"]+)"') or "DIALOG",
                "language": grab(r'language:\s*"(es|en)"'),
                "text": json.loads(f'"{raw_text}"'),
                "canonical": json.loads(f'"{raw_canon}"') if raw_canon else None,
                "badge": json.loads(f'"{raw_badge}"') if raw_badge else None,
                "cue": cue,
                "pause": pause_ms,
            }
        )
    return {"header": header, "moments": moments, "path": path}


def sanitize(text: str) -> str:
    t = re.sub(r'[«»\u201c\u201d\u2018\u2019"\'`]', " ", text)
    t = re.sub(r"[\[\]\(\)\{\}\*\#\_\~\<\>]", " ", t)
    t = re.sub(r"[\u2014\u2013;]", ", ", t)
    t = re.sub(r"\s*[\/\\]\s*", " o ", t)
    t = t.replace("&", " y ")
    t = re.sub(r":\s*", ", ", t)
    t = re.sub(r"^\s*\d+\.\s*", "", t, flags=re.M)
    return re.sub(r"\s+", " ", t).strip()


def tokens(text: str) -> set[str]:
    t = unicodedata.normalize("NFD", text.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return set(re.findall(r"[a-z']+", t))


def validate(profile: dict, expected_cases: int | None) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    ms = profile["moments"]
    base = profile["header"].get("baseId", profile["path"].stem)

    if len(ms) < 25:
        errors.append(f"[{base}] perfil incompleto: {len(ms)} momentos (mínimo 25)")
    ids = [m["id"] for m in ms]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        errors.append(f"[{base}] ids duplicados: {sorted(dup)}")

    for hid in HOOK_IDS:
        if hid not in ids:
            errors.append(f"[{base}] falta el id de hook obligatorio: {hid}")

    seen_beats: list[str] = []
    for m in ms:
        mid = m["id"]
        if m["language"] not in ("es", "en"):
            errors.append(f"[{base}/{mid}] language inválido: {m['language']!r}")
        if not m["text"].strip():
            errors.append(f"[{base}/{mid}] text vacío")

        if m["pause"] is None:
            warnings.append(f"[{base}/{mid}] sin pauseAfterMs")
        elif m["pause"] not in VALID_PAUSES:
            warnings.append(f"[{base}/{mid}] pauseAfterMs={m['pause']} fuera de 260/380/750")
        if m["language"] == "es" and not m.get("canonical"):
            leak = sorted(tokens(m["text"]) & EN_LEAK)
            if leak:
                warnings.append(f"[{base}/{mid}] posible inglés en pista ES: {leak}")
        if m["beat"] in BEAT_ORDER and (not seen_beats or seen_beats[-1] != m["beat"]):
            seen_beats.append(m["beat"])

    order = [b for b in BEAT_ORDER if b in seen_beats]
    if seen_beats != order:
        errors.append(f"[{base}] beats fuera de orden: {seen_beats} (esperado {order})")

    formula = [m for m in ms if m["beat"] == "FORMULA"]
    cases = sorted({m["cue"].get("activeFormulaCaseIndex") for m in formula if "activeFormulaCaseIndex" in m["cue"]})
    if not formula:
        errors.append(f"[{base}] no hay pistas FORMULA")
    elif not cases:
        warnings.append(f"[{base}] FORMULA sin activeFormulaCaseIndex (válido solo si la regla tiene 1 caso)")
    else:
        if cases != list(range(len(cases))):
            errors.append(f"[{base}] casos de fórmula no contiguos desde 0: {cases}")
        if expected_cases is not None and len(cases) != expected_cases:
            errors.append(
                f"[{base}] el currículo declara {expected_cases} caso(s) y el perfil explica {len(cases)}"
            )
        for idx in range(len(cases)):
            intros = [
                m for m in formula
                if m["cue"].get("activeFormulaCaseIndex") == idx and m["cue"].get("formulaRevealCount") == 1
            ]
            models = [
                m for m in formula
                if m["cue"].get("activeFormulaCaseIndex") == idx and m["cue"].get("formulaRevealCount") == 3
            ]
            if not intros:
                errors.append(f"[{base}] caso {idx} sin intro en español (formulaRevealCount: 1)")
            if not models:
                errors.append(f"[{base}] caso {idx} sin modelo nativo en inglés (formulaRevealCount: 3)")
            if not any(m["beat"] == "FORMULA" and m["language"] == "en" and
                       m["cue"].get("activeFormulaCaseIndex") == idx for m in formula):
                errors.append(f"[{base}] caso {idx} sin pista en inglés")
        if len(cases) > 1:
            missing_badge = [m["id"] for m in formula if m["cue"].get("activeFormulaCaseIndex") is not None and not m["badge"]]
            if missing_badge:
                errors.append(f"[{base}] casos múltiples sin badgeLabel: {missing_badge}")

    traps = [m for m in ms if m["beat"] == "TRAP"]
    phases = [m["cue"].get("trapPhase") for m in traps if "trapPhase" in m["cue"]]
    if traps and phases:
        if phases != sorted(phases):
            errors.append(f"[{base}] trapPhase fuera de orden: {phases}")
        if phases[0] != 0:
            errors.append(f"[{base}] la trampa no empieza en trapPhase 0")
        if 1 not in phases or 2 not in phases:
            errors.append(f"[{base}] la trampa no recorre trapPhase 1 y 2")
        if not any(m["language"] == "en" and m["cue"].get("trapPhase") == 1 for m in traps):
            errors.append(f"[{base}] falta el modelo nativo del error (TRAP en inglés, fase 1)")
        if not any(m["language"] == "en" and m["cue"].get("trapPhase") == 2 for m in traps):
            errors.append(f"[{base}] falta la forma natural (TRAP en inglés, fase 2)")

    if traps and "trap.anchor" not in ids:
        warnings.append(f"[{base}] falta el ancla mental (id trap.anchor)")

    examples = [m for m in ms if m["beat"] == "EXAMPLES"]
    ex_idx = sorted({m["cue"].get("activeExampleIndex") for m in examples if "activeExampleIndex" in m["cue"]})
    if not examples:
        errors.append(f"[{base}] no hay pistas EXAMPLES")
    elif ex_idx != list(range(len(ex_idx))):
        errors.append(f"[{base}] activeExampleIndex no contiguo desde 0: {ex_idx}")
    if not any(m["language"] == "es" and m.get("canonical") for m in examples):
        warnings.append(f"[{base}] no hay pista fonética ES con canonical (secreto de pronunciación)")

    texts = [sanitize(m["text"]) for m in ms]
    repeated = {t for t in texts if texts.count(t) > 1}
    if repeated:
        warnings.append(
            f"[{base}] textos repetidos dentro de la base (comparten mp3 en el manifiesto): "
            + "; ".join(sorted(t[:60] for t in repeated))
        )
    return errors, warnings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--profile")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--profiles-dir", default="src/features/pathway/speech/profiles")
    ap.add_argument("--cases", type=int, default=None, help="casos de fórmula que declara el currículo")
    ap.add_argument("--allow-collisions", action="store_true")
    args = ap.parse_args()

    root = Path.cwd()
    paths: list[Path] = []
    if args.all:
        paths = sorted(Path(args.profiles_dir).glob("base_*.ts"))
        if not paths:
            paths = sorted((root / args.profiles_dir).glob("base_*.ts"))
    elif args.profile:
        paths = [Path(args.profile)]
    else:
        ap.error("pasá --profile o --all")

    all_errors: list[str] = []
    all_warnings: list[str] = []
    parsed = []
    for p in paths:
        if not p.exists():
            all_errors.append(f"no existe: {p}")
            continue
        profile = parse_profile(p)
        parsed.append(profile)
        e, w = validate(profile, args.cases if len(paths) == 1 else None)
        all_errors.extend(e)
        all_warnings.extend(w)

    # Líneas de sistema genéricas: pueden compartir MP3 entre bases (misma voz y misma frase).
    SHARED_OK_IDS = {
        "trapcheck.intro", "trapcheck.error", "trapcheck.success",
        "build.transition", "build.intro", "build.error", "build.success",
        "speak.lead", "speak.instruction",
        "voice.retry", "voice.not_heard", "mic.error",
    }

    if len(parsed) > 1 and not args.allow_collisions:
        owners: dict[str, list[str]] = {}
        for profile in parsed:
            base = profile["header"].get("baseId", profile["path"].stem)
            for m in profile["moments"]:
                owners.setdefault(sanitize(m["text"]), []).append(f"{base}/{m['id']}")
        for text, where in owners.items():
            bases = {w.split("/")[0] for w in where}
            ids = {w.split("/", 1)[1] for w in where}
            if len(bases) > 1 and not ids.issubset(SHARED_OK_IDS):
                all_errors.append(f"texto compartido entre bases (mismo mp3): {where} -> {text[:70]!r}")

    for p in paths:
        print(f"- {p}")
    for w in all_warnings:
        print(f"  WARN  {w}")
    for e in all_errors:
        print(f"  ERROR {e}")

    if all_errors:
        print(f"\nFAIL: {len(all_errors)} error(es), {len(all_warnings)} advertencia(s)")
        return 1
    print(f"\nPASS: {len(parsed)} perfil(es), {len(all_warnings)} advertencia(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
