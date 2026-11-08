#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Configura y verifica las credenciales de Kaggle (una sola vez).

Uso:
  python .agents/skills/pathway-speech-production/cloud/kaggle_setup.py
  ... --open    # abre la página de cuenta de Kaggle en el navegador
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import time
import webbrowser
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HOME = Path.home()
KAGGLE_DIR = HOME / ".kaggle"
KAGGLE_JSON = KAGGLE_DIR / "kaggle.json"
ACCOUNT_URL = "https://www.kaggle.com/settings/account"


def find_downloaded() -> Path | None:
    candidates: list[Path] = []
    for folder in (HOME / "Downloads", HOME / "Desktop", HOME / "OneDrive/Desktop"):
        if folder.exists():
            candidates.extend(folder.glob("kaggle*.json"))
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)


def validate(path: Path) -> tuple[bool, str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
    except Exception as exc:  # noqa: BLE001
        return False, f"JSON inválido: {exc}"
    if isinstance(data, dict) and data.get("username") and (data.get("key") or data.get("token")):
        return True, f"usuario {data['username']}"
    return False, "faltan username/key en kaggle.json"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--open", action="store_true")
    args = ap.parse_args()

    KAGGLE_DIR.mkdir(parents=True, exist_ok=True)
    if args.open:
        print("Abriendo", ACCOUNT_URL)
        webbrowser.open(ACCOUNT_URL)

    token_file = KAGGLE_DIR / "access_token"
    if token_file.exists() and token_file.read_text(encoding="utf-8").strip().startswith("KGAT_"):
        print(f"Token de acceso: {token_file}")
        proc = subprocess.run(["kaggle", "quota"], capture_output=True, text=True)
        if proc.returncode != 0:
            print("La API rechazó el token:")
            print((proc.stdout + proc.stderr).strip()[:400])
            return 1
        cfg = subprocess.run(["kaggle", "config", "view"], capture_output=True, text=True)
        user = next((ln.strip() for ln in cfg.stdout.splitlines() if "username:" in ln), "")
        print("API de Kaggle: OK", user)
        print(proc.stdout.strip()[:300])
        print("\nSiguiente paso:")
        print("  python .agents/skills/pathway-speech-production/cloud/kaggle_batch.py --from 12 --to 17")
        return 0

    if not KAGGLE_JSON.exists():
        downloaded = find_downloaded()
        if downloaded:
            shutil.copy2(downloaded, KAGGLE_JSON)
            print(f"Copiado {downloaded.name} -> {KAGGLE_JSON}")
        else:
            print("Falta el token de Kaggle.")
            print("\nPasos (una sola vez):")
            print("1. Entrá a", ACCOUNT_URL)
            print("2. Creá la cuenta o iniciá sesión.")
            print("3. Verificá tu teléfono (Settings → Phone Verification). Kaggle lo exige para GPU.")
            print("4. Bajá 'Create New API Token': se descarga kaggle.json.")
            print("5. Volvé a correr este script: copia el archivo solo.")
            return 1

    ok, detail = validate(KAGGLE_JSON)
    if not ok:
        print(f"FAIL: {detail}")
        return 1
    print(f"Credenciales: {detail}")

    proc = subprocess.run(["kaggle", "datasets", "list", "-m", "1"], capture_output=True, text=True)
    if proc.returncode != 0:
        print("La API rechazó las credenciales:")
        print((proc.stdout + proc.stderr).strip()[:500])
        return 1
    print("API de Kaggle: OK")
    print("\nSiguiente paso:")
    print("  python .agents/skills/pathway-speech-production/cloud/kaggle_batch.py --from 12 --to 17")
    return 0


if __name__ == "__main__":
    sys.exit(main())
