#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sin watchers: importa B1, triage, genera B2 01-16, importa B2, triage."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
CLOUD = ROOT / ".agents/skills/pathway-speech-production/cloud"
SCRIPTS = ROOT / ".agents/skills/pathway-speech-production/scripts"
B2_LOG = ROOT / ".pathway_b2_batch_1_16.log"


def run(cmd):
    print("$", " ".join(str(x) for x in cmd), flush=True)
    return subprocess.run(cmd).returncode


def main() -> int:
    print("resume B1/B2 start", flush=True)

    b1 = ROOT / "pathway_cloud_b1_17_32.zip"
    if b1.exists():
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b1", "--zip", str(b1), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b1"])
    else:
        print("falta zip B1", flush=True)

    print("B2 local 01-16", flush=True)
    with B2_LOG.open("w", encoding="utf-8") as log:
        subprocess.run([sys.executable, str(CLOUD / "a2_batch.py"),
                        "--level", "b2", "--from", "1", "--to", "16"],
                       stdout=log, stderr=subprocess.STDOUT)

    b2 = ROOT / "pathway_cloud_b2_17_32.zip"
    if b2.exists():
        run([sys.executable, str(CLOUD / "import_cloud_audio.py"),
             "--level", "b2", "--zip", str(b2), "--skip-tests"])
        run([sys.executable, str(SCRIPTS / "qa_triage.py"), "--level", "b2"])
    else:
        print("falta zip B2", flush=True)

    print("resume B1/B2 done", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
