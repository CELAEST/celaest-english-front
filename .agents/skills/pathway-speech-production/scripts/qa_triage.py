#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Triage de pistas rojas A2: large-v3 antes de regenerar.

Para cada pista con status != OK:
  - transcribe con large-v3;
  - recalcula ratio con la normalización real;
  - si >= 0.95, actualiza state y reporte a OK;
  - si sigue roja, la deja listada para regeneración.

Uso:
  python qa_triage.py --level a2
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_base  # noqa: E402
from validate_profile import parse_profile  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

THRESHOLD = 0.95


def audio_ratio(model, path: Path, target: str, lang: str) -> tuple[float, str]:
    proc = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "f32le",
         "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    )
    x = np.frombuffer(proc.stdout, np.float32)
    segs, _ = model.transcribe(x, language=lang, beam_size=5,
                               condition_on_previous_text=False)
    heard = " ".join(s.text.strip() for s in segs).strip()
    normalizer = gen_base.norm_es if lang == "es" else gen_base.norm
    return gen_base.qa_ratio(target, heard, lang, normalizer), heard


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a2", choices=["a1", "a2", "b1", "b2", "c1", "c2"])
    args = ap.parse_args()

    from faster_whisper import WhisperModel
    model = WhisperModel("large-v3", device="cpu", compute_type="int8")

    root = Path("src/features/pathway/speech/profiles")
    audio_root = Path(f"public/audio/pathway/{args.level}")
    reports = sorted(Path(".").glob(f".pathway_qa_base_{args.level}_*.json"))
    resolved, residual = 0, []

    for report_path in reports:
        base = report_path.stem.replace(".pathway_qa_", "")
        report = json.loads(report_path.read_text(encoding="utf-8-sig"))
        bad = [r for r in report if r.get("status") != "OK"]
        if not bad:
            continue
        profile_path = (root / args.level / f"base_{base[-2:]}.ts") if args.level != "a1" else (root / f"{base}.ts")
        profile = parse_profile(profile_path)
        by_id = {m["id"]: m for m in profile["moments"]}
        state_path = Path(f".pathway_state_{base}.json")
        state = json.loads(state_path.read_text(encoding="utf-8-sig")) if state_path.exists() else {}

        print(f"\n=== {base}: {len(bad)} rojas ===", flush=True)
        for row in bad:
            mid = row.get("id")
            moment = by_id.get(mid)
            audio = audio_root / base / f"{mid}.mp3"
            if not moment or not audio.exists():
                residual.append((base, mid, "sin audio/perfil"))
                continue
            target = moment.get("canonical") or moment["text"]
            ratio, heard = audio_ratio(model, audio, target, moment["language"])
            print(f"  {mid:<24} large={ratio:.3f} | {heard[:90]}", flush=True)
            if ratio >= THRESHOLD:
                row["ratio"] = round(ratio, 3)
                row["status"] = "OK"
                row["heard"] = heard + " [large-v3]"
                state.setdefault(mid, {})["ratio"] = round(ratio, 3)
                state[mid]["qa_model"] = "large-v3"
                resolved += 1
            else:
                residual.append((base, mid, round(ratio, 3)))

        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
        state_path.write_text(json.dumps(state, ensure_ascii=False, indent=1), encoding="utf-8")

    print("\n=== triage ===", flush=True)
    print(f"resueltas por large-v3: {resolved}", flush=True)
    print(f"residuales: {len(residual)}", flush=True)
    for base, mid, ratio in residual:
        print(f"  {base}/{mid} -> {ratio}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
