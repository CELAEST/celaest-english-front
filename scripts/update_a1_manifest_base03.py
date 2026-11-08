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

# Import FASE_1_BASE03_TRACKS
sys.path.insert(0, os.path.abspath("scripts"))
from generate_fase1_base03_andrew import FASE_1_BASE03_TRACKS

ADDITIONAL_BASE03_TRACKS = [
    # Multi-case formula tracks (with bilingual cue, quotes, and phonetic variants)
    (
        'El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo en inglés: "I am ready."',
        "seg_01.mp3",
        "Base 03: Caso 1 (Am) Cue"
    ),
    (
        'El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo: "I am ready."',
        "seg_01.mp3",
        "Base 03: Caso 1 (Am) Direct"
    ),
    (
        "El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo... I am ready.",
        "seg_01.mp3",
        "Base 03: Caso 1 (Am) Phonetic"
    ),
    (
        "El reto de esta base es el verbo To Be sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo... I am ready.",
        "seg_01.mp3",
        "Base 03: Caso 1 (Am) Text"
    ),
    (
        'La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos en inglés: "She is ready."',
        "seg_01_case2.mp3",
        "Base 03: Caso 2 (Is) Cue"
    ),
    (
        'La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos: "She is ready."',
        "seg_01_case2.mp3",
        "Base 03: Caso 2 (Is) Direct"
    ),
    (
        "La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos... she is ready.",
        "seg_01_case2.mp3",
        "Base 03: Caso 2 (Is)"
    ),
    (
        'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos en inglés: "We are ready."',
        "seg_01_case3.mp3",
        "Base 03: Caso 3 (Are) Cue"
    ),
    (
        'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos: "We are ready."',
        "seg_01_case3.mp3",
        "Base 03: Caso 3 (Are) Direct"
    ),
    (
        "Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos... we are ready.",
        "seg_01_case3.mp3",
        "Base 03: Caso 3 (Are)"
    ),
    # Lesson intro (both variants)
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el verbo tu bi sin enredos: cómo decir quién eres y cómo estás con sus tres parejas fijas... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "Base 03: Intro Phonetic"
    ),
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el verbo To Be sin enredos: cómo decir quién eres y cómo estás con sus tres parejas fijas... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "Base 03: Intro Text"
    ),
    # Trampa (both variants)
    (
        "Fíjate bien en la alerta en rojo de tu pizarra... Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es... is... diciendo por ejemplo: he is... o she is... Por eso tachamos she are ready, y decimos... She is ready... Tu ancla mental para no dudar jamás: una sola persona siempre camina con... is.",
        "seg_03.mp3",
        "Base 03: Trampa Phonetic"
    ),
    # Trap feedbacks
    (
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que para una sola persona ajena como ella, la pareja fija siempre es... is... diciendo... She is ready... Toca la otra opción en tu pantalla.",
        "trap_error.mp3",
        "Base 03: Trap Error Phonetic"
    ),
    (
        "¡Exacto! Cazaste la trampa a la perfección... Una sola persona siempre va con... is... Escucha ahora con atención cómo suena en ejemplos reales.",
        "trap_success.mp3",
        "Base 03: Trap Success Phonetic"
    ),
    # Fonética
    (
        "Escucha con atención cómo se unen las palabras al decir... I am ready to start my lesson... El secreto de pronunciación es sentir la unión del sujeto con am... ai am rédi, tu start mai léson.",
        "seg_05.mp3",
        "Base 03: Fonética Phonetic"
    )
]

def main():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    initial_count = len(manifest)
    added = 0

    all_tracks = list(FASE_1_BASE03_TRACKS) + ADDITIONAL_BASE03_TRACKS

    for text, filenames, label in all_tracks:
        fn_list = [filenames] if isinstance(filenames, str) else filenames
        primary_fn = fn_list[0]
        path = f"/audio/pathway/a1/base_03/{primary_fn}"

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

        for v in variants:
            if v and manifest.get(v) != path:
                manifest[v] = path
                added += 1

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"Manifest updated successfully for Base 03. Initial: {initial_count}, Added/Updated: {added}, Final: {len(manifest)}")

if __name__ == "__main__":
    main()
