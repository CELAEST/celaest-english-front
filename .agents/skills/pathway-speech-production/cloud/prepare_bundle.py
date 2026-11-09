#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arma `pathway_cloud_bundle.zip` con lo mínimo para generar en Colab/Kaggle.

Uso (desde la raíz del repo):
  python .agents/skills/pathway-speech-production/cloud/prepare_bundle.py
  python .../prepare_bundle.py --bases 06-11 --ref C:\\ruta\\ref_larga.wav

El bundle conserva la estructura del repo para que `gen_base.py` funcione igual.
"""
from __future__ import annotations

import argparse
import os
import sys
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/pathway-speech-production"
SCRIPTS = SKILL / "scripts"
PROFILES = ROOT / "src/features/pathway/speech/profiles"
MANIFEST = ROOT / "src/features/pathway/data/a1AudioManifest.json"
DEFAULT_REF = Path(os.environ.get(
    "PATHWAY_TTS_REF",
    str(Path.home() / "OneDrive/Documentos/deepseek-harness/default-workspace/_voces/ref_larga.wav"),
))
NOT_INCLUDED = {"pathway.py", "check_audio.py", "guion_lint.py", "curriculum_audit.py"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="pathway_cloud_bundle.zip")
    ap.add_argument("--ref", default=str(DEFAULT_REF))
    ap.add_argument("--bases", default=None, help="06-11 (opcional, solo informativo)")
    args = ap.parse_args()

    ref = Path(args.ref)
    if not ref.exists():
        print(f"FAIL: no existe la voz de referencia {ref}")
        return 1
    if not MANIFEST.exists():
        print(f"FAIL: no existe {MANIFEST}")
        return 1

    profiles = sorted(PROFILES.glob("base_*.ts"))
    a2_profiles = sorted((PROFILES / "a2").glob("base_*.ts"))
    b1_profiles = sorted((PROFILES / "b1").glob("base_*.ts"))
    b2_profiles = sorted((PROFILES / "b2").glob("base_*.ts"))
    c1_profiles = sorted((PROFILES / "c1").glob("base_*.ts"))
    c2_profiles = sorted((PROFILES / "c2").glob("base_*.ts"))
    if not profiles:
        print("FAIL: no hay perfiles")
        return 1

    out = Path(args.out)
    root_name = "pathway_cloud"
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for script in sorted(SCRIPTS.glob("*.py")):
            if script.name in NOT_INCLUDED:
                continue
            zf.write(script, f"{root_name}/scripts/{script.name}")
            count += 1
        zf.write(SKILL / "cloud/run_cloud.py", f"{root_name}/cloud/run_cloud.py")
        zf.write(SKILL / "cloud/README.md", f"{root_name}/README_CLOUD.md")
        for profile in profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/{profile.name}")
            count += 1
        for profile in a2_profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/a2/{profile.name}")
            count += 1
        for profile in b1_profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/b1/{profile.name}")
            count += 1
        for profile in b2_profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/b2/{profile.name}")
            count += 1
        for profile in c1_profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/c1/{profile.name}")
            count += 1
        for profile in c2_profiles:
            zf.write(profile, f"{root_name}/src/features/pathway/speech/profiles/c2/{profile.name}")
            count += 1
        zf.write(ROOT / "src/features/pathway/speech/types.ts",
                 f"{root_name}/src/features/pathway/speech/types.ts")
        zf.write(MANIFEST, f"{root_name}/src/features/pathway/data/a1AudioManifest.json")
        a2_manifest = ROOT / "src/features/pathway/data/a2AudioManifest.json"
        zf.write(a2_manifest, f"{root_name}/src/features/pathway/data/a2AudioManifest.json")
        b1_manifest = ROOT / "src/features/pathway/data/b1AudioManifest.json"
        zf.write(b1_manifest, f"{root_name}/src/features/pathway/data/b1AudioManifest.json")
        b2_manifest = ROOT / "src/features/pathway/data/b2AudioManifest.json"
        zf.write(b2_manifest, f"{root_name}/src/features/pathway/data/b2AudioManifest.json")
        c1_manifest = ROOT / "src/features/pathway/data/c1AudioManifest.json"
        zf.write(c1_manifest, f"{root_name}/src/features/pathway/data/c1AudioManifest.json")
        c2_manifest = ROOT / "src/features/pathway/data/c2AudioManifest.json"
        zf.write(c2_manifest, f"{root_name}/src/features/pathway/data/c2AudioManifest.json")
        zf.write(ref, f"{root_name}/ref_larga.wav")
        count += 4

    print(f"bundle: {out} ({out.stat().st_size/1e6:.1f} MB)")
    print(f"perfiles incluidos: {len(profiles)} A1 + {len(a2_profiles)} A2 + {len(b1_profiles)} B1")
    print("Subilo a Colab/Kaggle y corré cloud/run_cloud.py --from NN --to NN")
    return 0


if __name__ == "__main__":
    sys.exit(main())
