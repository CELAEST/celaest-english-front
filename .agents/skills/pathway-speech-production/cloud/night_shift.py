#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Turno noche: completa B1, arranca B2 y deja todo importado/triaged.

Secuencia:
  1. espera a que termine B1 local 01-16;
  2. importa B1 17-32 (ZIP ya descargado);
  3. triage B1;
  4. arranca B2 local 01-16;
  5. espera B2 local y el ZIP de Kaggle B2 17-32;
  6. importa B2 17-32;
  7. triage B2.

No genera casos/perfiles nuevos; solo audio/QA de lo que ya está aprobado.
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/pathway-speech-production"
CLOUD = SKILL / "cloud"
SCRIPTS = SKILL / "scripts"
B1_LOG = ROOT / ".pathway_b1_batch_1_16.log"
B2_LOG = ROOT / ".pathway_b2_batch_1_16.log"
B1_ZIP = ROOT / "pathway_cloud_b1_17_32.zip"
B2_ZIP = ROOT / "pathway_cloud_b2_17_32.zip"
ROOT_ZIP = ROOT / "pathway_cloud_out.zip"


def run(cmd):
    print("$", " ".join(str(x) for x in cmd), flush=True)
    return subprocess.run(cmd).returncode


def wait_text(path: Path, needle: str, timeout_h: float = 8) -> bool:
    deadline = time.time() + timeout_h * 3600
    while time.time() < deadline:
        if path.exists() and needle in path.read_text(encoding="utf-8", errors="replace"):
            return True
        time.sleep(60)
    return False


def zip_has(path: Path, needle: str) -> bool:
    try:
        with zipfile.ZipFile(path) as zf:
            return any(needle in n for n in zf.namelist())
    except Exception:
        return False


def wait_zip(path: Path, needle: str, timeout_h: float = 6) -> bool:
    deadline = time.time() + timeout_h * 3600
    while time.time() < deadline:
        if path.exists() and zip_has(path, needle):
            return True
        time.sleep(60)
    return False


def main() -> int:
    print("night shift start", flush=True)

    print("esperando B1 local 01-16...", flush=True)
    if not wait_text(B1_LOG, "resumen A2"):
        print("B1 local no terminó a tiempo", flush=True)
        return 1
    print("B1 local terminado", flush=True)

    if B1_ZIP.exists():
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b1", "--zip", str(B1_ZIP), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b1"])
    else:
        print("falta ZIP B1 17-32", flush=True)

    print("arrancando B2 local 01-16", flush=True)
    with B2_LOG.open("w", encoding="utf-8") as log:
        subprocess.run([sys.executable, str(CLOUD / "a2_batch.py"),
                        "--level", "b2", "--from", "1", "--to", "16"],
                       stdout=log, stderr=subprocess.STDOUT)

    print("esperando ZIP Kaggle B2 17-32", flush=True)
    if B2_ZIP.exists() and zip_has(B2_ZIP, "base_b2_17"):
        print("ZIP B2 ya guardado", flush=True)
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b2", "--zip", str(B2_ZIP), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b2"])
        print("night shift done", flush=True)
        return 0
    if wait_zip(ROOT_ZIP, "base_b2_17"):
        shutil.copy2(ROOT_ZIP, B2_ZIP)
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b2", "--zip", str(B2_ZIP), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b2"])
    else:
        print("no apareció ZIP B2 17-32", flush=True)

    print("night shift done", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
