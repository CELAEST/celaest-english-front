#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sanea picos de las pistas ya generadas: baja el volumen justo lo necesario para que
ningún mp3 clipee entre muestras (true peak), sin tocar el resto del audio.

Uso:
  python fix_peaks.py --all
  python fix_peaks.py --base base_02 --dry-run
  python fix_peaks.py --base base_03 --target -1.5
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def true_peak(path: Path) -> float | None:
    try:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
            capture_output=True, text=True,
        )
    except Exception:
        return None
    hits = re.findall(r"True peak:\s*Peak:\s*(-?[\d.]+) dBFS", proc.stderr)
    return float(hits[-1]) if hits else None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--target", type=float, default=-1.5, help="true peak objetivo (dBTP)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    root = Path("public/audio/pathway/a1")
    bases = [args.base] if args.base else [p.name for p in sorted(root.glob("base_*"))] if args.all else []
    if not bases:
        ap.error("pasá --base base_0N o --all")

    fixed = 0
    for base in bases:
        for mp3 in sorted((root / base).glob("*.mp3")):
            tp = true_peak(mp3)
            if tp is None or tp <= args.target:
                continue
            print(f"{base}/{mp3.name}: TP {tp} dBTP -> {args.target}")
            if args.dry_run:
                fixed += 1
                continue
            for _ in range(3):
                gain = 10 ** ((args.target - tp) / 20)
                tmp = mp3.with_suffix(".tmp.mp3")
                subprocess.run(
                    ["ffmpeg", "-y", "-v", "quiet", "-i", str(mp3), "-af", f"volume={gain:.4f}",
                     "-codec:a", "libmp3lame", "-b:a", "128k", str(tmp)],
                    check=True,
                )
                tmp.replace(mp3)
                tp = true_peak(mp3)
                if tp is None or tp <= args.target:
                    break
            print(f"   -> TP {tp} dBTP")
            fixed += 1

    print(f"\n{'(dry-run) ' if args.dry_run else ''}{fixed} pista(s) saneada(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
