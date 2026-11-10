#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera un lote de bases en una GPU gratuita (Colab/Kaggle) y empaqueta el resultado.

Se ejecuta DESDE la raíz del bundle (`pathway_cloud/`):
  python cloud/run_cloud.py --from 06 --to 08
  python cloud/run_cloud.py --from 06 --to 11 --qa-model small --keep-going

Salida: `pathway_cloud_out.zip` con `public/audio/pathway/a1/base_XX/*.mp3`
y los reportes `.pathway_qa_base_XX.json`.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path.cwd()
GEN = ROOT / "scripts" / "gen_base.py"
REF = ROOT / "ref_larga.wav"
LEVEL = "a1"
MANIFEST = ROOT / "src/features/pathway/data/a1AudioManifest.json"
AUDIO = ROOT / "public/audio/pathway/a1"
OUT = ROOT / "pathway_cloud_out.zip"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a1", choices=["a1", "a2", "b1", "b2", "c1", "c2"])
    ap.add_argument("--from", dest="from_base", default=None)
    ap.add_argument("--to", dest="to_base", default=None)
    ap.add_argument("--common", action="store_true", help="Generar frases universales y de onboarding")
    ap.add_argument("--qa-model", default="small", choices=["small", "medium"])
    ap.add_argument("--seeds", default="11,22,33")
    ap.add_argument("--keep-going", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not args.common and (not args.from_base or not args.to_base):
        print("FAIL: especifica --common o define --from y --to")
        return 1

    bases = []
    level = args.level
    manifest_path = ROOT / f"src/features/pathway/data/{level}AudioManifest.json"
    audio_root = ROOT / f"public/audio/pathway/{level}"

    if args.from_base and args.to_base:
        start = int(args.from_base.replace("base_", ""))
        end = int(args.to_base.replace("base_", ""))
        prefix = "base" if level == "a1" else f"base_{level}"
        bases = [f"{prefix}_{n:02d}" for n in range(start, end + 1)]

    print("bundle:", ROOT)
    if bases:
        print("bases:", ", ".join(bases))
    if args.common:
        print("modo: frases universales y onboarding global")

    if not REF.exists():
        print(f"FAIL: falta ref_larga.wav en {ROOT}")
        return 1

    failed = []

    if args.common:
        print("\n=== FRASES UNIVERSALES & ONBOARDING ===", flush=True)
        common_script = ROOT / "scripts" / "gen_common.py"
        cmd = [sys.executable, str(common_script), "--ref", str(REF), "--outdir", str(ROOT / "public/audio/pathway/common")]
        if args.dry_run:
            cmd.append("--dry-run")
        rc = subprocess.run(cmd).returncode
        if rc != 0:
            print("FAIL: error al generar frases universales")
            failed.append("common")

    for base in bases:
        print(f"\n=== {base} ===", flush=True)
        profile = ROOT / f"src/features/pathway/speech/profiles/{level}/base_{base[-2:]}.ts"
        cmd = [
            sys.executable, str(GEN), "--level", level, "--base", base,
            "--profile", str(profile),
            "--ref", str(REF),
            "--manifest", str(manifest_path),
            "--qa-model", args.qa_model,
            "--seeds", args.seeds,
        ]
        rc = subprocess.run(cmd).returncode
        if rc != 0:
            failed.append(base)
            print(f"{base}: terminó con código {rc}")
            if not args.keep_going:
                break

    files = []
    common_dir = ROOT / "public/audio/pathway/common"
    if common_dir.exists():
        files.extend(sorted(common_dir.glob("*.mp3")))
    for base in bases:
        folder = audio_root / base
        if folder.exists():
            files.extend(sorted(folder.glob("*.mp3")))
    report_files = [ROOT / f".pathway_qa_{b}.json" for b in bases if (ROOT / f".pathway_qa_{b}.json").exists()]
    if not files:
        print("No hay mp3 para empaquetar.")
        return 1

    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.write(f, f.relative_to(ROOT))
        for f in report_files:
            zf.write(f, f.name)
    print(f"\nZIP: {OUT} ({OUT.stat().st_size/1e6:.1f} MB, {len(files)} pistas)")
    print("Descargá ese archivo y corré el importador local.")
    if failed:
        print("Bases con problemas:", ", ".join(failed))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
