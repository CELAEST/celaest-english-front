import json
import os
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

MANIFEST_PATH = "src/features/pathway/data/a1AudioManifest.json"

def sanitize_speech_for_voice(text: str) -> str:
    if not text:
        return ""
    t = text
    t = re.sub(r'[\u00ab\u00bb\u201c\u201d\u2018\u2019"\'`]', " ", t)
    t = re.sub(r'[\[\]\(\)\{\}\*\#\_\~\<\>]', " ", t)
    t = re.sub(r'[\u2014\u2013;]', ", ", t)
    t = re.sub(r'\s*[\/\\]\s*', " o ", t)
    t = re.sub(r'&', " y ", t)
    t = re.sub(r':\s*', ", ", t)
    t = re.sub(r'^\s*\d+\.\s*', "", t, flags=re.MULTILINE)
    t = re.sub(r'\s+', " ", t)
    return t.strip()

# Import FASE_1_TRACKS
sys.path.insert(0, os.path.abspath("scripts"))
from generate_fase1_andrew_master import FASE_1_TRACKS

def main():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    initial_count = len(manifest)
    added = 0

    for text, filenames, label in FASE_1_TRACKS:
        fn_list = [filenames] if isinstance(filenames, str) else filenames
        primary_fn = fn_list[0]
        path = f"/audio/pathway/a1/base_01/{primary_fn}"

        variants = {
            text.strip(),
            sanitize_speech_for_voice(text),
            text.replace("...", ".").strip(),
            sanitize_speech_for_voice(text.replace("...", ".")),
            text.replace("...", ", ").strip(),
            sanitize_speech_for_voice(text.replace("...", ", ")),
            text.replace("...", "").strip(),
            sanitize_speech_for_voice(text.replace("...", "")),
        }

        # Also add variants for other filenames if any
        for v in variants:
            if v and manifest.get(v) != path:
                manifest[v] = path
                added += 1

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"Manifest updated successfully. Initial: {initial_count}, Added/Updated: {added}, Final: {len(manifest)}")

if __name__ == "__main__":
    main()

