#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cierra B1 08-09, importa B1 17-32 y encadena B2 local + import B2."""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
CLOUD = ROOT / ".agents/skills/pathway-speech-production/cloud"
SCRIPTS = ROOT / ".agents/skills/pathway-speech-production/scripts"
REGEN_LOG = ROOT / ".pathway_b1_regen_08_09.log"
B2_LOG = ROOT / ".pathway_b2_batch_1_16.log"
B1_ZIP = ROOT / "pathway_cloud_b1_17_32.zip"
B2_ZIP = ROOT / "pathway_cloud_b2_17_32.zip"


def run(cmd):
    print("$", " ".join(str(x) for x in cmd), flush=True)
    return subprocess.run(cmd).returncode


def wait_text(path: Path, needle: str, timeout_h: float = 3) -> bool:
    end = time.time() + timeout_h * 3600
    while time.time() < end:
        if path.exists() and needle in path.read_text(encoding="utf-8", errors="replace"):
            return True
        time.sleep(60)
    return False


def main() -> int:
    print("finish queue start", flush=True)
    print("esperando regen B1 08-09", flush=True)
    if not wait_text(REGEN_LOG, "resumen A2"):
        print("regen B1 no terminó", flush=True)
        return 1

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

    if B2_ZIP.exists():
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b2", "--zip", str(B2_ZIP), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b2"])
    else:
        print("falta ZIP B2 17-32", flush=True)

    print("finish queue done", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
