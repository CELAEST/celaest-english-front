import json, re, os
from pathlib import Path

# Load c2 manifest
manifest_path = Path("src/features/pathway/data/c2AudioManifest.json")
manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))

# Read c2 speech profiles
c2_dir = Path("src/features/pathway/speech/profiles/c2")
profiles = []

# Helper to sanitize as in levelsSpeechCoverage
def sanitize(text: str) -> str:
    if not text: return ""
    s = re.sub(r'[\u00ab\u00bb\u201c\u201d\u2018\u2019"\'`]', ' ', text)
    s = re.sub(r'[\[\]\(\)\{\}\*\#\_\~\<\>]', ' ', s)
    s = re.sub(r'[\u2014\u2013;]', ', ', s)
    s = re.sub(r'\s*[\/\\]\s*', ' o ', s)
    s = s.replace('&', ' y ')
    s = re.sub(r':\s*', ', ', s)
    s = re.sub(r'^\s*\d+\.\s*', '', s, flags=re.MULTILINE)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

# Let's extract moments from c2 profiles by parsing ts files
import glob

missing = []
for p_path in sorted(glob.glob("src/features/pathway/speech/profiles/c2/base_*.ts")):
    content = Path(p_path).read_text(encoding="utf-8")
    m_base = re.search(r'baseId:\s*"([^"]+)"', content)
    if not m_base:
        continue
    base_id = m_base.group(1)
    
    # find moments
    # simple moment regex
    # match each moment block
    moments_raw = re.findall(r'\{\s*id:\s*"([^"]+)",\s*beat:\s*"([^"]+)",\s*language:\s*"([^"]+)",\s*text:\s*"([^"]+)"', content)
    for mid, beat, lang, text in moments_raw:
        k_san = sanitize(text)
        k_raw = text.strip()
        in_manifest = (k_san in manifest) or (k_raw in manifest)
        
        mp3_path = Path(f"public/audio/pathway/c2/{base_id}/{mid}.mp3")
        mp3_exists = mp3_path.exists()
        mp3_size = mp3_path.stat().st_size if mp3_exists else 0
        
        if not in_manifest:
            missing.append({
                "base_id": base_id,
                "mid": mid,
                "lang": lang,
                "text": text,
                "mp3_exists": mp3_exists,
                "mp3_size": mp3_size,
            })

print(f"Total missing in C2 manifest: {len(missing)}")
for m in missing:
    print(f"{m['base_id']}/{m['mid']} (mp3 exists: {m['mp3_exists']}, size: {m['mp3_size']}B)")
    print(f"  TEXT: {m['text'][:80]}...")

