#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera el audio de UNA base Pathway desde su perfil declarativo, con gate de calidad,
y reconstruye sus entradas del manifiesto.

Uso típico (desde la raíz del repo):
  python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_03 --dry-run
  python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_03

Requisitos: torch (CUDA), chatterbox-tts, faster-whisper, ffmpeg, la voz de referencia.

Reglas:
  - una pista = un idioma (el perfil ya lo garantiza);
  - gate Whisper con idioma forzado contra `canonical` o `text`, ratio >= 0.95;
  - reintenta con varias semillas y se queda con la mejor;
  - incremental: si el hash del texto no cambió y el mp3 existe (>1000 B), reutiliza;
  - el manifiesto se reconstruye para esta base: borra claves viejas y agrega una por momento.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_profile import parse_profile, sanitize  # noqa: E402

DEFAULT_REF = os.environ.get(
    "PATHWAY_TTS_REF",
    os.path.expanduser(r"~\OneDrive\Documentos\deepseek-harness\default-workspace\_voces\ref_larga.wav"),
)


def decode(path: Path, sr: int = 16000):
    import numpy as np

    out = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
        capture_output=True, check=True,
    )
    return np.frombuffer(out.stdout, np.float32)


def rebuild_manifest(base: str, moments: list[dict], manifest_path: Path, outdir: Path) -> tuple[int, int]:
    """Reconstruye las entradas de una base desde sus mp3 existentes (sin generar audio)."""
    data = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    prefix = f"/audio/pathway/a1/{base}/"
    data = {k: v for k, v in data.items() if not (isinstance(v, str) and prefix in v)}
    added = 0
    for m in moments:
        rel = prefix + m["id"] + ".mp3"
        if not (outdir / f"{m['id']}.mp3").exists():
            continue
        for key in {sanitize(m["text"]), m["text"].strip()}:
            if key and key not in data:
                data[key] = rel
                added += 1
    manifest_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return added, len(data)


def norm_es(text: str) -> str:
    """Normalización fonética del español para el QA: seseo (z/ce/ci -> s) y b/v.
    Evita regenerar una pista correcta solo porque Whisper escribió 'casaste' por 'cazaste'."""
    t = norm(text)
    t = t.replace("z", "s")
    t = re.sub(r"c(?=[ei])", "s", t)
    t = t.replace("v", "b")
    # Respelling del verbo: "tu bi" puede oírse/escribirse "tu vi", "tuí", "tuy" o "to be".
    t = re.sub(r"\b(?:tu\s*(?:bi|vi|be|i|y)|to\s*be|tuy|tui|tuí|tuví|tuvi|tubi)\b", "tobi", t)
    # "con tener" suena igual que "contener".
    t = t.replace("con tener", "contener")
    # Clíticos que el ASR separa: "repítela" vs "repite la".
    t = t.replace("repítela", "repitela").replace("repite la", "repitela")
    # Nombre de la letra: el guion dice "la ese", el ASR escribe "la S".
    t = t.replace("la ese", "la s")
    return t


def acoustic_stats(path: Path) -> dict:
    """Pico de muestra, true peak intermuestras, clipping y RMS (gate antigrito)."""
    import numpy as np

    x = decode(path)
    if len(x) == 0:
        return {"peak": 1.0, "peak_db": 0.0, "true_peak_db": 0.0, "clip": 10**9, "rms_db": -120.0}
    peak = float(np.max(np.abs(x)))
    # true peak: el mp3 puede sobrepasar 0 dBFS entre muestras aunque el pcm no.
    true_peak_db = None
    try:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
            capture_output=True, text=True,
        )
        hits = re.findall(r"True peak:\s*Peak:\s*(-?[\d.]+) dBFS", proc.stderr)
        if hits:
            true_peak_db = float(hits[-1])
    except Exception:
        pass
    if true_peak_db is None:
        true_peak_db = round(20 * (np.log10(max(peak, 1e-9))), 2)
    return {
        "peak": peak,
        "peak_db": round(20 * (np.log10(max(peak, 1e-9))), 2),
        "true_peak_db": true_peak_db,
        "clip": int(np.sum(np.abs(x) > 0.999)),
        "rms_db": round(20 * (np.log10(max(float(np.sqrt(np.mean(x**2))), 1e-9))), 2),
    }


def norm(text: str) -> str:
    import unicodedata

    t = unicodedata.normalize("NFD", text or "")
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    t = re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", t)).strip()
    # Homófonos de las trampas: "no"/"know" y el respelling "dount" (don't/dont/down).
    t = re.sub(r"\bknow\b", "no", t)
    t = t.replace("don t", "dount").replace("dont", "dount").replace("down", "dount")
    return t


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True, help="base_03")
    ap.add_argument("--profile", default=None)
    ap.add_argument("--audio-root", default="public/audio/pathway/a1")
    ap.add_argument("--manifest", default="src/features/pathway/data/a1AudioManifest.json")
    ap.add_argument("--state", default=None, help="estado incremental (default: .pathway_state_<base>.json)")
    ap.add_argument("--report", default=None, help="reporte QA (default: .pathway_qa_<base>.json)")
    ap.add_argument("--ref", default=DEFAULT_REF, help="wav de referencia de la voz clonada")
    ap.add_argument("--seeds", default="11,22,33")
    ap.add_argument("--threshold", type=float, default=0.95)
    ap.add_argument("--only", default=None, help="ids separados por coma")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true", help="regenerar los momentos seleccionados aunque el hash coincida")
    ap.add_argument("--max-peak-db", type=float, default=-1.0, help="pico máximo permitido por pista (dBFS)")
    ap.add_argument("--exaggeration", type=float, default=0.7, help="expresividad de la voz (0.7 = curso)")
    ap.add_argument("--cfg-weight", type=float, default=0.3, help="adherencia al texto")
    ap.add_argument("--temperature", type=float, default=0.8, help="variación de la muestra")
    ap.add_argument("--qa-model", default="small", choices=["small", "medium"], help="modelo Whisper del gate")
    ap.add_argument("--qa-only", action="store_true", help="re-evaluar pistas existentes sin generar audio")
    ap.add_argument("--no-manifest", action="store_true")
    ap.add_argument("--manifest-only", action="store_true", help="solo reconstruir el manifiesto con los mp3 existentes")
    args = ap.parse_args()

    profile_path = Path(args.profile or f"src/features/pathway/speech/profiles/{args.base}.ts")
    if not profile_path.exists():
        print(f"FAIL: no existe {profile_path}")
        return 1
    profile = parse_profile(profile_path)
    all_moments = profile["moments"]
    moments = list(all_moments)
    if args.only:
        wanted = {x.strip() for x in args.only.split(",")}
        moments = [m for m in moments if m["id"] in wanted]
        missing = wanted - {m["id"] for m in moments}
        if missing:
            print(f"FAIL: ids inexistentes en el perfil: {sorted(missing)}")
            return 1

    outdir = Path(args.audio_root) / args.base
    state_path = Path(args.state or f".pathway_state_{args.base}.json")
    report_path = Path(args.report or f".pathway_qa_{args.base}.json")
    seeds = [int(s) for s in args.seeds.split(",") if s.strip()]

    print(f"base={args.base} momentos={len(moments)} salida={outdir}")
    for m in moments:
        print(f"  {m['id']:<24} {m['language']} {len(m['text'].split()):>3}w  {m['text'][:64]}")
    if args.dry_run:
        print("\nDRY RUN: no se generó nada.")
        return 0
    if args.manifest_only:
        outdir.mkdir(parents=True, exist_ok=True)
        added, total = rebuild_manifest(args.base, all_moments, Path(args.manifest), outdir)
        print(f"manifiesto: +{added} entradas de {args.base}, total {total}")
        return 0
    if not Path(args.ref).exists():
        print(f"FAIL: falta la voz de referencia: {args.ref}\nDefiní PATHWAY_TTS_REF o pasá --ref.")
        return 1

    outdir.mkdir(parents=True, exist_ok=True)
    state = {}
    legacy_candidates = [
        Path(f"_{args.base.replace('_', '')}_state.json"),
        Path(os.environ.get("PATHWAY_WORKSPACE", str(Path.home() / "OneDrive/Documentos/deepseek-harness/default-workspace")))
        / f"_{args.base.replace('_', '')}_state.json",
    ]
    for candidate in [*legacy_candidates, state_path]:
        if candidate.exists():
            try:
                state.update(json.loads(candidate.read_text(encoding="utf-8-sig")))
            except Exception:
                continue

    import torch
    import torchaudio as ta
    import difflib
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from faster_whisper import WhisperModel

    print("cargando modelos...", flush=True)
    model = None if args.qa_only else ChatterboxMultilingualTTS.from_pretrained(device="cuda")
    asr = WhisperModel(args.qa_model, device="cpu", compute_type="int8")
    tmp = outdir / "_tmp.wav"
    report = []

    for i, m in enumerate(moments, 1):
        mid, lang, text = m["id"], m["language"], m["text"]
        target = m["canonical"] or text
        digest = hashlib.sha256(f"{text}|{m['canonical'] or ''}|v2".encode()).hexdigest()[:16]
        mp3 = outdir / f"{mid}.mp3"

        if (not args.force and not args.qa_only) and state.get(mid, {}).get("hash") == digest and mp3.exists() and mp3.stat().st_size > 1000:
            report.append({**m, "ratio": state[mid].get("ratio"), "status": "REUSE"})
            print(f"[{i:2}/{len(moments)}] REUSE  {mid}", flush=True)
            continue

        if args.qa_only:
            if not mp3.exists():
                print(f"[{i:2}/{len(moments)}] FALTA  {mid}", flush=True)
                continue
            segs, _ = asr.transcribe(decode(mp3), language=lang, beam_size=5)
            heard = " ".join(s.text.strip() for s in segs).strip()
            normalizer = norm_es if lang == "es" else norm
            ratio = difflib.SequenceMatcher(
                None, normalizer(target).split(), normalizer(heard).split()
            ).ratio()
            previous = state.get(mid, {})
            state[mid] = {"hash": digest, "ratio": round(ratio, 3), "seed": previous.get("seed")}
            status = "OK" if ratio >= args.threshold else "REVISAR"
            report.append({**m, "ratio": round(ratio, 3), "seed": previous.get("seed"),
                           "heard": heard[:160], "status": status})
            print(f"[{i:2}/{len(moments)}] {status:<7} {mid:<24} {ratio:.3f}", flush=True)
            continue

        best = None
        for seed in seeds:
            try:
                torch.manual_seed(seed)
                wav = model.generate(text, language_id=lang, audio_prompt_path=args.ref,
                                     exaggeration=args.exaggeration, cfg_weight=args.cfg_weight,
                                     temperature=args.temperature)
                wav = wav.cpu() if hasattr(wav, "cpu") else wav
                ta.save(str(tmp), wav, model.sr)
                subprocess.run(
                    ["ffmpeg", "-y", "-v", "quiet", "-i", str(tmp), "-codec:a", "libmp3lame",
                     "-b:a", "128k", str(mp3)],
                    check=True,
                )
                segs, _ = asr.transcribe(decode(mp3), language=lang, beam_size=5)
                heard = " ".join(s.text.strip() for s in segs).strip()
                normalizer = norm_es if lang == "es" else norm
                ratio = difflib.SequenceMatcher(
                    None, normalizer(target).split(), normalizer(heard).split()
                ).ratio()
                acoustics = acoustic_stats(mp3)
                safe = acoustics["clip"] == 0 and acoustics["true_peak_db"] <= 0.0
                if not safe:
                    print(f"   [{mid}] seed {seed}: clip {acoustics['clip']} / TP {acoustics['true_peak_db']} -> descartada (distorsión)", flush=True)
                candidate = (ratio if safe else ratio - 1.0, heard, seed, acoustics, safe)
                if best is None or candidate[0] > best[0]:
                    best = candidate
                if safe and ratio >= args.threshold:
                    break
            except Exception as exc:  # noqa: BLE001
                print(f"   [{mid}] error {type(exc).__name__}: {exc}", flush=True)
                torch.cuda.empty_cache()
                continue

        if best is None:
            report.append({**m, "ratio": 0.0, "status": "FALLO"})
            print(f"[{i:2}/{len(moments)}] FALLO  {mid}", flush=True)
            continue

        score, heard, seed, acoustics, safe = best
        ratio = score if safe else score + 1.0
        # Seguridad de pico: si el true peak supera el techo, se atenúa y se re-mide.
        for _ in range(3):
            if acoustics["true_peak_db"] <= args.max_peak_db:
                break
            gain = 10 ** ((args.max_peak_db - acoustics["true_peak_db"]) / 20)
            tmp2 = outdir / "_gain.wav"
            subprocess.run(["ffmpeg", "-y", "-v", "quiet", "-i", str(mp3), "-af", f"volume={gain:.4f}",
                            str(tmp2)], check=True)
            subprocess.run(["ffmpeg", "-y", "-v", "quiet", "-i", str(tmp2), "-codec:a", "libmp3lame",
                            "-b:a", "128k", str(mp3)], check=True)
            tmp2.unlink(missing_ok=True)
            acoustics = acoustic_stats(mp3)
            safe = acoustics["true_peak_db"] <= args.max_peak_db and acoustics["clip"] == 0
        state[mid] = {"hash": digest, "ratio": round(ratio, 3), "seed": seed,
                      "peak_db": acoustics["peak_db"], "true_peak_db": acoustics["true_peak_db"],
                      "clip": acoustics["clip"]}
        state_path.write_text(json.dumps(state, ensure_ascii=False, indent=1), encoding="utf-8")
        status = "OK" if ratio >= args.threshold and safe else "REVISAR"
        report.append({**m, "ratio": round(ratio, 3), "seed": seed, "heard": heard[:160],
                       "peak_db": acoustics["peak_db"], "true_peak_db": acoustics["true_peak_db"], "clip": acoustics["clip"], "status": status})
        print(f"[{i:2}/{len(moments)}] {status:<7} {mid:<24} {ratio:.3f} TP {acoustics['true_peak_db']} (seed {seed})", flush=True)
        torch.cuda.empty_cache()

    # Persistir siempre el estado (incluye el modo --qa-only).
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=1), encoding="utf-8")

    if tmp.exists():
        tmp.unlink()
    # Si se regeneró un subconjunto, no borrar el QA de las demás pistas.
    if args.only and report_path.exists():
        try:
            previous = json.loads(report_path.read_text(encoding="utf-8-sig"))
            merged = {item.get("id"): item for item in previous if isinstance(item, dict)}
            for item in report:
                merged[item.get("id")] = item
            order = [m["id"] for m in all_moments]
            report = [merged[mid] for mid in order if mid in merged]
        except Exception:
            pass
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")

    if not args.no_manifest:
        added, total = rebuild_manifest(args.base, all_moments, Path(args.manifest), outdir)
        print(f"\nmanifiesto: +{added} entradas de {args.base}, total {total}")

    ok = sum(1 for r in report if r["status"] in ("OK", "REUSE"))
    bad = sum(1 for r in report if r["status"] == "REVISAR")
    fail = sum(1 for r in report if r["status"] == "FALLO")
    print(f"RESUMEN: {ok}/{len(report)} listos, {bad} a revisar, {fail} fallos")
    if fail:
        return 1
    if bad:
        print("OJO: hay pistas bajo el gate. Revisá el reporte antes de cerrar la base.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
