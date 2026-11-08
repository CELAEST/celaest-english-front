#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifica el audio de una base contra su perfil y el manifiesto.

Uso:
  python check_audio.py --base base_02
  python check_audio.py --base base_02 --profile ... --manifest ... --audio-root public/audio/pathway/a1

Chequea:
  - cada momento tiene clave en el manifiesto y archivo real (>1000 bytes);
  - el manifiesto no apunta a otra base;
  - duración coherente con el texto (warn);
  - silencio inicial/final sospechoso (warn, requiere ffmpeg);
  - claves del manifiesto de esta base que ningún momento usa (stale);
  - mp3 en disco sin entrada en el manifiesto (huérfanos).
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_profile import parse_profile, sanitize  # noqa: E402


def ffprobe_duration(path: Path) -> float | None:
    if not shutil.which("ffprobe"):
        return None
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout.strip().replace(",", ".")
        return float(out)
    except Exception:
        return None


def true_peak_and_lra(path: Path) -> tuple[float | None, float | None]:
    """True peak (dBTP) y LRA (LU) vía ebur128: detecta clipping intermuestras y gritos."""
    if not shutil.which("ffmpeg"):
        return None, None
    try:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
            capture_output=True, text=True,
        )
    except Exception:
        return None, None
    out = (proc.stderr or "") + (proc.stdout or "")
    tp = re.findall(r"True peak:\s*Peak:\s*(-?[\d.]+) dBFS", out)
    lra = re.findall(r"LRA:\s*(-?[\d.]+) LU", out)
    return (float(tp[-1]) if tp else None, float(lra[-1]) if lra else None)


def edge_silences(path: Path) -> list[tuple[float, float]]:
    """Devuelve (start, end) de silencios >= 0.35 s a -50 dB."""
    if not shutil.which("ffmpeg"):
        return []
    try:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-i", str(path), "-af", "silencedetect=noise=-50dB:d=0.35",
             "-f", "null", "-"],
            capture_output=True, text=True,
        )
    except Exception:
        return []
    out = (proc.stderr or "") + (proc.stdout or "")
    starts = [float(x) for x in re.findall(r"silence_start:\s*(-?[\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", out)]
    return list(zip(starts, ends + [float("inf")] * (len(starts) - len(ends))))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True, help="base_02")
    ap.add_argument("--profile", default=None)
    ap.add_argument("--manifest", default="src/features/pathway/data/a1AudioManifest.json")
    ap.add_argument("--audio-root", default="public/audio/pathway/a1")
    args = ap.parse_args()

    profile_path = Path(args.profile or f"src/features/pathway/speech/profiles/{args.base}.ts")
    if not profile_path.exists():
        print(f"FAIL: no existe el perfil {profile_path}")
        return 1
    profile = parse_profile(profile_path)
    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8-sig"))
    base_dir = Path(args.audio_root) / args.base

    errors: list[str] = []
    warnings: list[str] = []
    used_paths: set[str] = set()
    total_seconds = 0.0

    for m in profile["moments"]:
        mid = m["id"]
        rel = manifest.get(sanitize(m["text"])) or manifest.get(m["text"].strip())
        if not rel:
            errors.append(f"[{mid}] sin entrada en el manifiesto (texto: {m['text'][:60]!r})")
            continue
        used_paths.add(rel)
        if f"/{args.base}/" not in rel:
            errors.append(f"[{mid}] el manifiesto apunta a otra base: {rel}")
            continue
        file = Path("public") / rel.lstrip("/")
        if not file.exists():
            errors.append(f"[{mid}] archivo inexistente: {file}")
            continue
        size = file.stat().st_size
        if size <= 1000:
            errors.append(f"[{mid}] archivo demasiado pequeño ({size} B): {file}")
        dur = ffprobe_duration(file)
        words = len(m["text"].split())
        if dur is None:
            warnings.append(f"[{mid}] no pude medir duración (ffprobe)")
        else:
            total_seconds += dur
            if dur < max(0.8, 0.15 * words):
                warnings.append(f"[{mid}] duración {dur:.1f}s muy corta para {words} palabras")
            if dur > 1.2 * words + 3:
                warnings.append(f"[{mid}] duración {dur:.1f}s muy larga para {words} palabras")
            tp, lra = true_peak_and_lra(file)
            if tp is not None:
                if tp > -0.5:
                    errors.append(f"[{mid}] true peak {tp} dBTP: clipea/grita")
                elif tp > -1.0:
                    warnings.append(f"[{mid}] true peak {tp} dBTP: sin margen (ideal ≤ -1.0)")
            # En clips de 2-3 s el LRA es un artefacto del gating; solo se evalúa en locuciones.
            if lra is not None and dur is not None and 4 <= dur <= 30 and lra > 9.0:
                warnings.append(f"[{mid}] LRA {lra} LU: rango dinámico muy amplio (posible grito)")
            for start, end in edge_silences(file):
                if start <= 0.05 and end > 0.35:
                    warnings.append(f"[{mid}] silencio inicial de {end:.1f}s (retrasa el cambio de idioma)")
                if dur and start >= dur - 0.15 and (dur - start) > 0.9:
                    warnings.append(f"[{mid}] silencio final de {dur - start:.1f}s")

    # claves del manifiesto de esta base que ya nadie usa
    stale = {
        key: rel for key, rel in manifest.items()
        if isinstance(rel, str) and f"/{args.base}/" in rel and rel not in used_paths
    }
    for key, rel in list(stale.items())[:20]:
        warnings.append(f"manifiesto stale: {key[:55]!r} -> {rel}")

    # archivos huérfanos
    orphan = [
        p for p in sorted(base_dir.glob("*.mp3"))
        if "/" + p.as_posix().split("public/", 1)[-1] not in used_paths
        and not p.name.startswith("_")
    ]
    for p in orphan:
        warnings.append(f"mp3 sin referencia en el manifiesto: {p.name}")

    for w in warnings:
        print(f"  WARN  {w}")
    for e in errors:
        print(f"  ERROR {e}")

    print(f"\n{args.base}: {len(profile['moments'])} momentos, {total_seconds/60:.1f} min de audio, "
          f"{len(errors)} error(es), {len(warnings)} advertencia(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
