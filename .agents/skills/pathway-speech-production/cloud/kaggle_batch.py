#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Automatiza un lote en la GPU gratis de Kaggle con la API oficial.

Setup UNA vez:
  1. pip install kaggle
  2. Kaggle → Account → Create New API Token → guardá `kaggle.json` en `~/.kaggle/kaggle.json`
  3. Verificá tu teléfono en Kaggle (requisito para GPU)

Uso:
  python .agents/skills/pathway-speech-production/cloud/kaggle_batch.py --from 12 --to 17
  ... --dry-run            # muestra qué haría, sin subir nada
  ... --no-import          # solo deja el ZIP descargado

Hace todo: bundle → dataset → kernel con GPU → espera → descarga → importa a tu repo.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/pathway-speech-production"
CLOUD = SKILL / "cloud"
DATASET_SLUG = "pathway-bundle"
KERNEL_SLUG = "pathway-batch"


def kaggle_bin() -> str:
    return shutil.which("kaggle") or "kaggle"


def username() -> str | None:
    env = os.environ.get("KAGGLE_USERNAME")
    if env:
        return env
    cfg = Path.home() / ".kaggle" / "kaggle.json"
    if cfg.exists():
        try:
            name = json.loads(cfg.read_text(encoding="utf-8")).get("username")
            if name:
                return name
        except Exception:
            pass
    # Token nuevo (KGAT_...): el username vive en la config del CLI.
    try:
        proc = subprocess.run(["kaggle", "config", "view"], capture_output=True, text=True)
        hit = __import__("re").search(r"username:\s*(\S+)", proc.stdout + proc.stderr)
        if hit:
            return hit.group(1)
    except Exception:
        pass
    return None


def run(cmd: list[str]) -> int:
    print("$", " ".join(cmd), flush=True)
    return subprocess.run(cmd).returncode


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a1", choices=["a1", "a2", "b1", "b2", "c1", "c2"])
    ap.add_argument("--from", dest="from_base", required=True)
    ap.add_argument("--to", dest="to_base", required=True)
    ap.add_argument("--qa-model", default="small", choices=["small", "medium"])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-import", action="store_true")
    ap.add_argument("--timeout-min", type=int, default=240)
    args = ap.parse_args()

    user = username()
    if not user and not args.dry_run:
        print("FAIL: falta ~/.kaggle/kaggle.json o KAGGLE_USERNAME.")
        print("Kaggle → Account → Create New API Token. Después: pip install kaggle")
        return 1
    user = user or "TU_USUARIO"

    bundle = ROOT / "pathway_cloud_bundle.zip"
    print("1) Bundle")
    cmd = [sys.executable, str(CLOUD / "prepare_bundle.py")]
    if args.dry_run:
        print("   (dry-run) se ejecutaría:", " ".join(cmd))
    elif run(cmd) != 0:
        return 1
    print("   bundle:", bundle, f"{bundle.stat().st_size/1e6:.1f} MB" if bundle.exists() else "")

    tmp = Path(tempfile.mkdtemp(prefix="pathway_kaggle_"))
    ds_dir = tmp / "dataset"
    kn_dir = tmp / "kernel"
    ds_dir.mkdir()
    kn_dir.mkdir()

    shutil.copy2(bundle, ds_dir / bundle.name)
    (ds_dir / "dataset-metadata.json").write_text(json.dumps({
        "title": "Pathway speech bundle",
        "subtitle": "Pathway TTS scripts, profiles and voice reference",
        "id": f"{user}/{DATASET_SLUG}",
        "licenses": [{"name": "CC0-1.0"}],
    }, indent=1), encoding="utf-8")

    script = f'''# Generado por kaggle_batch.py
import subprocess, sys, glob, os, shutil
print("INPUT:", os.listdir("/kaggle/input"), flush=True)
hits = glob.glob("/kaggle/input/**/cloud/run_cloud.py", recursive=True)
print("HITS:", hits, flush=True)
if not hits:
    for root, dirs, files in os.walk("/kaggle/input"):
        print("DIR", root, dirs[:5], files[:5], flush=True)
    sys.exit(2)
src = os.path.dirname(os.path.dirname(hits[0]))
shutil.copytree(src, "/kaggle/working/pathway_cloud", dirs_exist_ok=True)
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "chatterbox-tts", "faster-whisper"], check=True)
# Kaggle trae torchvision incompatible con torch y rompe el import de Chatterbox.
subprocess.run([sys.executable, "-m", "pip", "uninstall", "-y", "-q", "torchvision"], check=False)
root = "/kaggle/working/pathway_cloud"
cmd = [sys.executable, "cloud/run_cloud.py", "--level", "{args.level}", "--from", "{args.from_base}", "--to", "{args.to_base}", "--qa-model", "{args.qa_model}"]
print("RUN", cmd, flush=True)
rc = subprocess.run(cmd, cwd=root).returncode
sys.exit(rc)'''
    (kn_dir / "script.py").write_text(script, encoding="utf-8")
    (kn_dir / "kernel-metadata.json").write_text(json.dumps({
        "id": f"{user}/{KERNEL_SLUG}",
        "title": "Pathway batch",
        "code_file": "script.py",
        "language": "python",
        "kernel_type": "script",
        "is_private": True,
        "enable_gpu": True,
        "enable_internet": True,
        "dataset_sources": [f"{user}/{DATASET_SLUG}"],
        "competition_sources": [],
        "kernel_sources": [],
    }, indent=1), encoding="utf-8")

    print("2) Dataset")
    print("   ", ds_dir)
    print("3) Kernel")
    print("   ", kn_dir)
    if args.dry_run:
        print("\nDRY RUN: metadata generada, no se subió nada.")
        print("dataset-metadata.json y kernel-metadata.json listos en", tmp)
        return 0

    kg = kaggle_bin()
    # Crear o versionar el dataset (Kaggle devuelve "already in use" con exit 0 a veces)
    proc = subprocess.run([kg, "datasets", "create", "-p", str(ds_dir)], capture_output=True, text=True)
    out = (proc.stdout or "") + (proc.stderr or "")
    print(out.strip()[-400:])
    if proc.returncode != 0 or "already in use" in out.lower() or "already exists" in out.lower():
        print("   dataset existente: subiendo versión nueva...")
        if run([kg, "datasets", "version", "-p", str(ds_dir), "-m", "bundle update"]) != 0:
            print("FAIL: no se pudo actualizar el dataset")
            return 1

    print("   esperando a que Kaggle procese el dataset...")
    for _ in range(30):
        st = subprocess.run([kg, "datasets", "status", f"{user}/{DATASET_SLUG}"],
                            capture_output=True, text=True)
        if "ready" in (st.stdout + st.stderr).lower():
            break
        time.sleep(10)
    else:
        print("   aviso: el dataset no reportó ready; sigo igual")

    print("4) Subiendo kernel con GPU...")
    if run([kg, "kernels", "push", "-p", str(kn_dir)]) != 0:
        print("FAIL: no se pudo lanzar el kernel")
        return 1

    print("5) Esperando a Kaggle (puede tardar 1-4 h)...")
    deadline = time.time() + args.timeout_min * 60
    status = ""
    while time.time() < deadline:
        proc = subprocess.run([kg, "kernels", "status", f"{user}/{KERNEL_SLUG}"],
                              capture_output=True, text=True)
        status = (proc.stdout + proc.stderr).strip()
        print("   ", status, flush=True)
        if "complete" in status.lower():
            break
        if "error" in status.lower() or "failed" in status.lower():
            print("FAIL: el kernel terminó con error. Revisá la pestaña Logs en Kaggle.")
            return 1
        time.sleep(60)
    else:
        print("FAIL: timeout esperando Kaggle")
        return 1

    out_dir = tmp / "output"
    print("6) Descargando salida...")
    if run([kg, "kernels", "output", f"{user}/{KERNEL_SLUG}", "-p", str(out_dir)]) != 0:
        print("FAIL: no se pudo descargar la salida")
        return 1
    zips = sorted(out_dir.rglob("pathway_cloud_out.zip"))
    if not zips:
        print("FAIL: la salida no contiene pathway_cloud_out.zip")
        return 1
    local_zip = ROOT / "pathway_cloud_out.zip"
    shutil.copy2(zips[0], local_zip)
    print("   ", local_zip, f"{local_zip.stat().st_size/1e6:.1f} MB")

    if not args.no_import:
        print("7) Importando a tu repo...")
        cmd = [sys.executable, str(CLOUD / "import_cloud_audio.py"), "--level", args.level, "--zip", str(local_zip)]
        if run(cmd) != 0:
            print("FAIL: el importador terminó con error")
            return 1

    print("\nLISTO: lote generado, descargado e importado.")
    print("Revisá: python .agents/skills/pathway-speech-production/scripts/pathway.py plan")
    return 0


if __name__ == "__main__":
    sys.exit(main())
