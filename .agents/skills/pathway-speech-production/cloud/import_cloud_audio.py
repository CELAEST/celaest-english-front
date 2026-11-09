#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Importa el ZIP generado en Colab/Kaggle y deja las bases integradas y cerradas.

Uso (desde la raíz del repo):
  python .agents/skills/pathway-speech-production/cloud/import_cloud_audio.py --zip ruta.zip
  ... --skip-tests --skip-qa --dry-run
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/pathway-speech-production/scripts"
GEN = SKILL / "gen_base.py"
PATHWAY = SKILL / "pathway.py"
AUDIO = ROOT / "public/audio/pathway/a1"


def run(cmd: list[str]) -> int:
    print("$", " ".join(cmd), flush=True)
    return subprocess.run(cmd).returncode


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a1", choices=["a1", "a2", "b1", "b2", "c1", "c2"])
    ap.add_argument("--zip", required=True)
    ap.add_argument("--skip-qa", action="store_true")
    ap.add_argument("--skip-tests", action="store_true")
    ap.add_argument("--no-close", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    zip_path = Path(args.zip)
    if not zip_path.exists():
        print(f"FAIL: no existe {zip_path}")
        return 1

    with tempfile.TemporaryDirectory() as tmp:
        with zipfile.ZipFile(zip_path) as zf:
            zf.extractall(tmp)
        tmp_path = Path(tmp)
        folders = sorted({
            p.parent for p in tmp_path.rglob("base_*/*.mp3")
            if p.parent.name.startswith("base_")
        })
        if not folders:
            print("FAIL: el ZIP no contiene carpetas base_XX con mp3")
            return 1
        print("bases en el ZIP:", ", ".join(f.name for f in folders))
        if args.dry_run:
            for folder in folders:
                print(f"  {folder.name}: {len(list(folder.glob('*.mp3')))} pistas")
            print("DRY RUN: no se copió nada.")
            return 0

        bases = []
        audio_root = ROOT / f"public/audio/pathway/{args.level}"
        for folder in folders:
            base = folder.name
            dest = audio_root / base
            dest.mkdir(parents=True, exist_ok=True)
            for mp3 in folder.glob("*.mp3"):
                shutil.copy2(mp3, dest / mp3.name)
            for report in tmp_path.glob(f".pathway_qa_{base}.json"):
                shutil.copy2(report, ROOT / report.name)
            bases.append(base)
            print(f"{base}: {len(list(folder.glob('*.mp3')))} pistas copiadas")

    failed: list[str] = []
    for base in bases:
        print(f"\n--- {base} ---")
        manifest_cmd = [sys.executable, str(GEN), "--level", args.level, "--base", base, "--manifest-only"]
        if args.level != "a1":
            manifest_cmd += ["--profile", str(ROOT / f"src/features/pathway/speech/profiles/{args.level}/base_{base[-2:]}.ts")]
        if run(manifest_cmd) != 0:
            print(f"{base}: falló el manifiesto")
            failed.append(base)
            continue
        if not args.skip_qa:
            qa_cmd = [sys.executable, str(GEN), "--level", args.level, "--base", base,
                      "--qa-only", "--force", "--qa-model", "small"]
            if args.level != "a1":
                qa_cmd += ["--profile", str(ROOT / f"src/features/pathway/speech/profiles/{args.level}/base_{base[-2:]}.ts")]
            if run(qa_cmd) != 0:
                print(f"{base}: QA con pistas fuera del gate; queda para revisión")
                failed.append(base)
                continue
        if args.level == "a1":
            if run([sys.executable, str(PATHWAY), "audit", "--base", base, "--no-asr"]) != 0:
                print(f"{base}: audit rojo; no se cierra")
                failed.append(base)
                continue
            if not args.no_close:
                if run([sys.executable, str(PATHWAY), "close", "--base", base]) != 0:
                    print(f"{base}: no se pudo registrar")
                    failed.append(base)
                    continue

    if not args.skip_tests:
        npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
        print("\n--- tests ---")
        if run([npx, "tsc", "--noEmit"]) != 0:
            return 1
        if run([npx, "vitest", "run", "src/features/pathway"]) != 0:
            return 1

    if failed:
        print(f"\nimportadas con pendientes: {len(bases)-len(failed)}/{len(bases)}; revisar: {', '.join(failed)}")
        return 1
    print(f"\nlisto: {len(bases)} base(s) importadas desde {zip_path.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
