import os
import shutil
import json
import re
import edge_tts
import asyncio

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_04"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_04"
MANIFEST_PATH = "src/features/pathway/data/a1AudioManifest.json"

TRANSITIONS = [
    (
        "seg_01_case1_intro.mp3",
        "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: usas el verbo estar diciendo:"
    ),
    (
        "seg_01_case2_intro.mp3",
        "Y con la edad pasa exactamente lo mismo: no tienes años, sino que usas el verbo ser... Por ejemplo, para él decimos:"
    ),
]

def sanitize(text: str) -> str:
    if not text:
        return ""
    t = re.sub(r'[\u00ab\u00bb\u201c\u201d\u2018\u2019"\'`]', " ", text)
    t = re.sub(r'[\[\]\(\)\{\}\*\#\_\~\<\>]', " ", t)
    t = re.sub(r'[\u2014\u2013;]', ", ", t)
    t = re.sub(r'\s*[\/\\]\s*', " o ", t)
    t = re.sub(r'&', " y ", t)
    t = re.sub(r':\s*', ", ", t)
    t = re.sub(r'^\s*\d+\.\s*', "", t, flags=re.MULTILINE)
    t = re.sub(r'\s+', " ", t)
    return t.strip()

async def main():
    for filename, text in TRANSITIONS:
        front_path = os.path.join(FRONT_DIR, filename)
        lab_path = os.path.join(LAB_DIR, filename)
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(front_path)
        shutil.copy2(front_path, lab_path)
        size = os.path.getsize(front_path)
        print(f" -> [UPDATED OK] {filename} ({size} bytes)")

    # Update Manifest
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    for filename, text in TRANSITIONS:
        target_url = f"/audio/pathway/a1/base_04/{filename}"
        manifest[text] = target_url
        clean = sanitize(text)
        if clean:
            manifest[clean] = target_url
            no_dot = re.sub(r'[\.:!]+$', '', text).strip()
            manifest[no_dot] = target_url
            manifest[sanitize(no_dot)] = target_url

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(" -> Manifest updated successfully with clean transitions!")

if __name__ == "__main__":
    asyncio.run(main())

