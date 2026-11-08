import json
import re

MANIFEST_PATH = "src/features/pathway/data/a1AudioManifest.json"

def sanitize(text):
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

via_a_map = {
    "El reto de esta base es el verbo tu bi sin enredos. Contigo mismo usamos la pareja fija am:": "/audio/pathway/a1/base_03/seg_01_case1_intro.mp3",
    "I am ready.": "/audio/pathway/a1/base_03/seg_01_case1_model.mp3",
    "Para una sola persona ajena como él o ella, la pareja fija siempre es is:": "/audio/pathway/a1/base_03/seg_01_case2_intro.mp3",
    "She is ready.": "/audio/pathway/a1/base_03/seg_01_case2_model.mp3",
    "Y para ti o los grupos, la pareja fija siempre es are:": "/audio/pathway/a1/base_03/seg_01_case3_intro.mp3",
    "We are ready.": "/audio/pathway/a1/base_03/seg_01_case3_model.mp3",
}

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

count_before = len(manifest)
for raw_text, path in via_a_map.items():
    manifest[raw_text] = path
    clean = sanitize(raw_text)
    if clean:
        manifest[clean] = path
        no_dot = re.sub(r'[\.:!]+$', '', raw_text).strip()
        manifest[no_dot] = path
        manifest[sanitize(no_dot)] = path

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"Manifest updated for VÍA A! Before: {count_before}, After: {len(manifest)}")

