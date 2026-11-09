#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Espera a que terminen Base 01-02, corrige la trampa de Base 01 y encola 03-32.

Se lanza desde la raíz del repo, en background:
  python .agents/skills/pathway-speech-production/cloud/a2_pipeline.py
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
GEN = ROOT / ".agents/skills/pathway-speech-production/scripts/gen_base.py"
BATCH = ROOT / ".agents/skills/pathway-speech-production/cloud/a2_batch.py"
LOG = ROOT / ".pathway_a2_gen_12.log"
PROFILE01 = ROOT / "src/features/pathway/speech/profiles/a2/base_01.ts"


def main() -> int:
    deadline = time.time() + 3 * 3600
    print("esperando Base 01-02...", flush=True)
    while time.time() < deadline:
        if LOG.exists() and LOG.read_text(encoding="utf-8", errors="replace").count("RESUMEN") >= 2:
            break
        time.sleep(30)
    else:
        print("timeout esperando Base 01-02", flush=True)
        return 1

    print("generando/completando A2 desde Base 01", flush=True)
    return subprocess.run([
        sys.executable, str(BATCH), "--from", "1", "--to", "32",
    ]).returncode


if __name__ == "__main__":
    sys.exit(main())
