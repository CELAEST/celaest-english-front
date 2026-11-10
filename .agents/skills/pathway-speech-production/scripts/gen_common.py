#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera los audios universales de CELAEST (Liam) desde `common_universal.ts`.

Uso:
  python .agents/skills/pathway-speech-production/scripts/gen_common.py
  python gen_common.py --dry-run
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
PROFILE_PATH = ROOT / "src/features/pathway/speech/profiles/common_universal.ts"
OUT_DIR = ROOT / "public/audio/pathway/common"
DEFAULT_REF = os.environ.get(
    "PATHWAY_TTS_REF",
    os.path.expanduser(r"~\OneDrive\Documentos\deepseek-harness\default-workspace\_voces\ref_larga.wav"),
)

MOMENTS = [
    {"id": "intro_welcome", "text": "¡Hola! Soy Liam, tu mentor personal en CELAEST. Sin importar en qué nivel estés comenzando hoy, en este curso no vamos a memorizar gramática aburrida."},
    {"id": "intro_philosophy", "text": "Tu cerebro aprende inglés interiorizando patrones estructurales, cazando las trampas donde solemos tropezar los hispanohablantes, y activando tu voz desde el primer día."},
    {"id": "intro_method", "text": "En cada base trabajaremos juntos: primero entenderás la regla en la pizarra, luego cazaremos la trampa común, armarás la frase y la dirás en voz alta. ¿Listo para pensar en inglés? Vamos con tu primera lección."},
    {"id": "welcome_returning", "text": "¡Qué gusto verte de nuevo! Vamos a retomar justo donde lo dejamos para consolidar tu fluidez."},
    {"id": "trap_alert", "text": "¡Cuidado aquí! El noventa por ciento de los hispanohablantes tropieza aquí por traducir literal del español."},
    {"id": "trap_pass", "text": "¡Exacto! Viste la trampa al instante. Tu cerebro ya no está traduciendo, está reconociendo el patrón natural."},
    {"id": "trap_fail", "text": "No pasa nada, para esto estamos aquí. Fíjate bien en la diferencia entre el español y el inglés."},
    {"id": "build_intro", "text": "Tienes la regla clara. Ahora te toca a ti: une las piezas y arma la frase en la pizarra."},
    {"id": "speak_intro", "text": "Es momento de activar tu voz. Escucha el ritmo nativo y dilo al micrófono con confianza."},
    {"id": "speak_pass", "text": "¡Impecable! Ritmo, entonación y claridad desbloqueados con éxito."},
    {"id": "speak_retry", "text": "Muy cerca. Presta atención al sonido final y pruébalo una vez más."},
    {"id": "base_mastered", "text": "¡Base completada con maestría! Has interiorizado este patrón para siempre y tu progreso CEFR ha aumentado."},
    {"id": "qa_open", "text": "Aquí estoy. ¿Qué parte de esta regla te genera dudas o fricción?"},
    {"id": "qa_close", "text": "Duda resuelta. Sigamos construyendo en la pizarra."},
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", default=DEFAULT_REF)
    ap.add_argument("--outdir", default=str(OUT_DIR))
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--seeds", default="11,22,33")
    args = ap.parse_args()

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    ref = Path(args.ref)
    if not ref.exists() and (Path.cwd() / "ref_larga.wav").exists():
        ref = Path.cwd() / "ref_larga.wav"

    print("=== Generador de Frases Universales CELAEST ===")
    print(f"Salida: {outdir}")
    print(f"Referencia de voz: {ref}")
    print(f"Total frases: {len(MOMENTS)}")

    if args.dry_run:
        for m in MOMENTS:
            print(f"  [DRY-RUN] {m['id']:<20} -> {m['text'][:60]}...")
        return 0

    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    model = ChatterboxMultilingualTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
    seeds = [int(s) for s in args.seeds.split(",")]

    for i, m in enumerate(MOMENTS, 1):
        mid = m["id"]
        text = m["text"]
        mp3_path = outdir / f"{mid}.mp3"
        tmp_wav = outdir / f"_{mid}.wav"

        print(f"[{i:2}/{len(MOMENTS)}] Generando {mid}...", flush=True)
        torch.manual_seed(seeds[0])
        wav = model.generate(
            text,
            language_id="es",
            audio_prompt_path=str(ref),
            exaggeration=1.05,
            cfg_weight=0.5,
            temperature=0.75,
        )
        wav = wav.cpu() if hasattr(wav, "cpu") else wav
        ta.save(str(tmp_wav), wav, model.sr)
        subprocess.run(
            ["ffmpeg", "-y", "-v", "quiet", "-i", str(tmp_wav), "-codec:a", "libmp3lame", "-b:a", "128k", str(mp3_path)],
            check=True,
        )
        tmp_wav.unlink(missing_ok=True)
        print(f"    ✓ OK: {mp3_path.name} ({mp3_path.stat().st_size} bytes)")

    print("\n¡Todas las frases universales generadas con éxito!")
    return 0


if __name__ == "__main__":
    sys.exit(main())

