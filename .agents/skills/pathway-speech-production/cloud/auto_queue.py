#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Worker local: espera perfiles, genera audio, cierra y sigue con la próxima base.

Uso:
  python .agents/skills/pathway-speech-production/cloud/auto_queue.py --from 24 --to 32

- Espera a que `base_XX.ts` exista y pase `validate_profile`.
- Antes de cada base, si el ZIP de Kaggle 18-23 está listo, lo importa (sin pisar el manifiesto).
- Corre `pathway.py batch --from XX --to XX` (genera, audita, registra y cierra).
- Si una base falla, lo registra y sigue con la siguiente (no se queda trabado).
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/pathway-speech-production"
SCRIPTS = SKILL / "scripts"
PROFILES = ROOT / "src/features/pathway/speech/profiles"
KAGGLE_ZIP = ROOT / "pathway_cloud_out.zip"
KAGGLE_MARKER = ROOT / ".kaggle_18_23_imported"
KAGGLE_FAILED = ROOT / ".kaggle_18_23_import_failed"


def run(cmd: list[str]) -> int:
    print("$", " ".join(cmd), flush=True)
    return subprocess.run(cmd).returncode


def wait_profile(base: str, timeout_min: int) -> bool:
    path = PROFILES / f"{base}.ts"
    deadline = time.time() + timeout_min * 60
    while time.time() < deadline:
        if path.exists():
            rc = subprocess.run(
                [sys.executable, str(SCRIPTS / "validate_profile.py"), "--profile", str(path)],
                capture_output=True, text=True,
            )
            if rc.returncode == 0:
                print(f"{base}: perfil listo", flush=True)
                return True
            print(f"{base}: perfil presente pero aún no válido", flush=True)
        time.sleep(30)
    return False


def maybe_import_kaggle() -> None:
    if KAGGLE_MARKER.exists() or KAGGLE_FAILED.exists() or not KAGGLE_ZIP.exists():
        return
    try:
        with zipfile.ZipFile(KAGGLE_ZIP) as zf:
            names = zf.namelist()
        if not any("base_18/" in n for n in names):
            return
    except Exception as exc:  # noqa: BLE001
        print(f"kaggle: ZIP ilegible ({exc}); sigo", flush=True)
        return
    print("kaggle: importando 18-23 antes de la próxima base", flush=True)
    rc = run([sys.executable, str(SKILL / "cloud/import_cloud_audio.py"),
              "--zip", str(KAGGLE_ZIP), "--skip-tests"])
    if rc == 0:
        KAGGLE_MARKER.write_text("ok", encoding="utf-8")
    else:
        KAGGLE_FAILED.write_text("falló; revisar .pathway_import_*.log", encoding="utf-8")
        print("kaggle: import falló; sigo con la cola local", flush=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="from_base", required=True)
    ap.add_argument("--to", dest="to_base", required=True)
    ap.add_argument("--timeout-min", type=int, default=120)
    ap.add_argument("--skip-tests", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    start = int(args.from_base.replace("base_", ""))
    end = int(args.to_base.replace("base_", ""))
    bases = [f"base_{n:02d}" for n in range(start, end + 1)]
    failed: list[str] = []

    for base in bases:
        print(f"\n=== auto {base} ===", flush=True)
        if not wait_profile(base, args.timeout_min):
            print(f"{base}: sin perfil válido a tiempo; salto", flush=True)
            failed.append(base)
            continue
        if args.dry_run:
            print(f"{base}: DRY RUN", flush=True)
            continue
        maybe_import_kaggle()
        cmd = [sys.executable, str(SCRIPTS / "pathway.py"), "batch",
               "--from", base.replace("base_", ""), "--to", base.replace("base_", "")]
        rc = run(cmd)
        if rc != 0:
            print(f"{base}: batch rojo; sigo con la siguiente", flush=True)
            failed.append(base)

    print("\n=== auto resumen ===", flush=True)
    print("fallidas:", ", ".join(failed) if failed else "ninguna", flush=True)
    run([sys.executable, str(SCRIPTS / "pathway.py"), "plan"])
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
