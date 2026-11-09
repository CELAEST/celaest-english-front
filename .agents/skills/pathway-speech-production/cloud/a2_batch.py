#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera audio A2 por bases y sigue aunque una falle.

Uso:
  python a2_batch.py --from 3 --to 32
  python a2_batch.py --from 3 --to 6 --stop-on-error
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
GEN = ROOT / ".agents/skills/pathway-speech-production/scripts/gen_base.py"
PROFILES = ROOT / "src/features/pathway/speech/profiles" / args.level if False else ROOT / "src/features/pathway/speech/profiles"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a2", choices=["a1","a2","b1","b2","c1"])
    ap.add_argument("--from", dest="from_base", type=int, required=True)
    ap.add_argument("--to", dest="to_base", type=int, required=True)
    ap.add_argument("--seeds", default="11,22,33")
    ap.add_argument("--stop-on-error", action="store_true")
    args = ap.parse_args()

    failed: list[str] = []
    for n in range(args.from_base, args.to_base + 1):
        base = f"base_{args.level}_{n:02d}"
        profile = PROFILES / args.level / f"base_{n:02d}.ts"
        print(f"\n=== {base} ===", flush=True)
        if not profile.exists():
            print(f"{base}: falta {profile}; salto", flush=True)
            failed.append(base)
            continue
        rc = subprocess.run([
            sys.executable, str(GEN), "--level", args.level,
            "--base", base, "--profile", str(profile),
            "--seeds", args.seeds,
        ]).returncode
        if rc != 0:
            print(f"{base}: gate rojo; queda para revisión", flush=True)
            failed.append(base)
            if args.stop_on_error:
                break
        time.sleep(1)

    print("\n=== resumen A2 ===", flush=True)
    print("fallidas:", ", ".join(failed) if failed else "ninguna", flush=True)
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
