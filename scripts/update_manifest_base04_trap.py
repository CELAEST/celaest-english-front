import json
import re

MANIFEST_PATH = "src/features/pathway/data/a1AudioManifest.json"

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

NEW_ENTRIES = [
    ("Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca usamos ese verbo para la edad ni para el hambre... Por eso nunca decimos:", "/audio/pathway/a1/base_04/seg_03_part1_intro.mp3"),
    ("I have 25 years.", "/audio/pathway/a1/base_04/seg_03_part2_wrong.mp3"),
    ("Sino que en inglés siempre decimos:", "/audio/pathway/a1/base_04/seg_03_part3_pivot.mp3"),
    ("I am 25 years old.", "/audio/pathway/a1/base_04/seg_03_part4_correct.mp3"),
    ("Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi.", "/audio/pathway/a1/base_04/seg_03_part5_anchor.mp3"),
]

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

for raw_text, path in NEW_ENTRIES:
    manifest[raw_text] = path
    clean = sanitize(raw_text)
    if clean:
        manifest[clean] = path
        no_dot = re.sub(r'[\.:!]+$', '', raw_text).strip()
        manifest[no_dot] = path
        manifest[sanitize(no_dot)] = path

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("Updated manifest with Base 04 Decoupled Trap parts!")

