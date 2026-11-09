import os, sys, json, re, hashlib, subprocess
from pathlib import Path
import numpy as np

# Set stdout encoding
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, ".agents/skills/pathway-speech-production/scripts")
import gen_base
from validate_profile import parse_profile, sanitize

DEFAULT_REF = os.environ.get(
    "PATHWAY_TTS_REF",
    os.path.expanduser(r"~\OneDrive\Documentos\deepseek-harness\default-workspace\_voces\ref_larga.wav"),
)

manifest_path = Path("src/features/pathway/data/c2AudioManifest.json")
manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))

# Find missing tracks
import glob
missing_jobs = []

for p_path in sorted(glob.glob("src/features/pathway/speech/profiles/c2/base_*.ts")):
    content = Path(p_path).read_text(encoding="utf-8")
    m_base = re.search(r'baseId:\s*"([^"]+)"', content)
    if not m_base:
        continue
    base_id = m_base.group(1)
    profile = parse_profile(Path(p_path))
    
    for m in profile["moments"]:
        mid = m["id"]
        text = m["text"]
        k_san = sanitize(text)
        k_raw = text.strip()
        in_manifest = (k_san in manifest) or (k_raw in manifest)
        
        mp3_path = Path(f"public/audio/pathway/c2/{base_id}/{mid}.mp3")
        
        if not in_manifest:
            missing_jobs.append({
                "base_id": base_id,
                "profile_path": p_path,
                "moment": m,
                "mp3_path": str(mp3_path),
            })

print(f"Total missing jobs to generate: {len(missing_jobs)}")
for j in missing_jobs:
    print(f"  {j['base_id']}/{j['moment']['id']}: {j['moment']['text'][:60]}")

if len(missing_jobs) == 0:
    print("Nothing to generate!")
    sys.exit(0)

# Import TTS and ASR
print("\nLoading models on GPU/CPU...")
import torch
import torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

model = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
asr = WhisperModel("small", device="cpu", compute_type="int8")

seeds = [11, 22, 33]
threshold = 0.90
max_peak_db = -1.0

success_count = 0
for idx, job in enumerate(missing_jobs, 1):
    base_id = job["base_id"]
    m = job["moment"]
    mid, lang, text = m["id"], m["language"], m["text"]
    target = m.get("canonical") or text
    mp3 = Path(job["mp3_path"])
    mp3.parent.mkdir(parents=True, exist_ok=True)
    tmp = mp3.parent / f"_{mid}_tmp.wav"
    
    print(f"\n[{idx}/{len(missing_jobs)}] Generating {base_id}/{mid} ({lang}): {text[:60]}...", flush=True)
    
    best = None
    for seed in seeds:
        try:
            torch.manual_seed(seed)
            wav = model.generate(text, language_id=lang, audio_prompt_path=DEFAULT_REF,
                                 exaggeration=0.7, cfg_weight=0.3, temperature=0.8)
            wav = wav.cpu() if hasattr(wav, "cpu") else wav
            ta.save(str(tmp), wav, model.sr)
            subprocess.run(
                ["ffmpeg", "-y", "-v", "quiet", "-i", str(tmp), "-codec:a", "libmp3lame",
                 "-b:a", "128k", str(mp3)],
                check=True,
            )
            segs, _ = asr.transcribe(gen_base.decode(mp3), language=lang, beam_size=5)
            heard = " ".join(s.text.strip() for s in segs).strip()
            normalizer = gen_base.norm_es if lang == "es" else gen_base.norm
            ratio = gen_base.qa_ratio(target, heard, lang, normalizer)
            acoustics = gen_base.acoustic_stats(mp3)
            safe = acoustics["clip"] == 0 and acoustics["true_peak_db"] <= 0.0
            
            candidate = (ratio if safe else ratio - 1.0, heard, seed, acoustics, safe)
            if best is None or candidate[0] > best[0]:
                best = candidate
            if safe and ratio >= 0.95:
                break
        except Exception as exc:
            print(f"   [{mid}] error {type(exc).__name__}: {exc}", flush=True)
            torch.cuda.empty_cache()
            continue

    if tmp.exists():
        tmp.unlink(missing_ok=True)
        
    if best is None:
        print(f"   FAILED to generate {mid}")
        continue
        
    score, heard, seed, acoustics, safe = best
    ratio = score if safe else score + 1.0
    
    # Peak attenuation if needed
    for _ in range(3):
        if acoustics["true_peak_db"] <= max_peak_db:
            break
        gain = 10 ** ((max_peak_db - acoustics["true_peak_db"]) / 20)
        tmp2 = mp3.parent / "_gain.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "quiet", "-i", str(mp3), "-af", f"volume={gain:.4f}",
                        str(tmp2)], check=True)
        subprocess.run(["ffmpeg", "-y", "-v", "quiet", "-i", str(tmp2), "-codec:a", "libmp3lame",
                        "-b:a", "128k", str(mp3)], check=True)
        tmp2.unlink(missing_ok=True)
        acoustics = gen_base.acoustic_stats(mp3)
        
    print(f"   -> OK: ratio={ratio:.3f}, TP={acoustics['true_peak_db']:.1f}dB, heard='{heard[:80]}'")
    
    # Update manifest
    rel_url = f"/audio/pathway/c2/{base_id}/{mid}.mp3"
    for key in {sanitize(text), text.strip()}:
        if key:
            manifest[key] = rel_url
            
    # Save manifest incrementally
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    success_count += 1
    torch.cuda.empty_cache()

print(f"\nDONE! Successfully generated {success_count}/{len(missing_jobs)} tracks.")

