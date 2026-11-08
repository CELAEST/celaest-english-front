import json
import re
import sys

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

BASE04_ENTRIES = [
    # Lesson Intro
    ("¡Bienvenido a tu clase! Hoy vas a dominar la trampa de tener: por qué en inglés nunca dices que tienes hambre ni años... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.", "/audio/pathway/a1/base_04/lesson_intro.mp3"),
    ('Bienvenido a tu clase con Liam. Hoy vas a dominar "La Trampa de \'Tener\' Estados y Edad". Toca "Comenzar Clase" para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.', "/audio/pathway/a1/base_04/lesson_intro.mp3"),
    
    # Formula Vía A
    ("El reto de esta base es la trampa de tener. En inglés no tienes hambre ni frío: estás en ese estado con am:", "/audio/pathway/a1/base_04/seg_01_case1_intro.mp3"),
    ("I am hungry now.", "/audio/pathway/a1/base_04/seg_01_case1_model.mp3"),
    ("Y con la edad pasa exactamente lo mismo: no tienes años, eres tus años usando is:", "/audio/pathway/a1/base_04/seg_01_case2_intro.mp3"),
    ("He is 30 years old.", "/audio/pathway/a1/base_04/seg_01_case2_model.mp3"),
    
    # Trap Explanations & Checks
    ("Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca uses el verbo have para la edad ni para el hambre... Por eso tachamos I have 25 years, y decimos... I am 25 years old... Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi.", "/audio/pathway/a1/base_04/seg_03.mp3"),
    ("Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca uses el verbo have para la edad ni para el hambre... Por eso tachamos I have 25 years, y decimos... I am 25 years old... Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo To Be.", "/audio/pathway/a1/base_04/seg_03.mp3"),
    ("I have 25 years.", "/audio/pathway/a1/base_04/trap_wrong.mp3"),
    ("I am 25 years old.", "/audio/pathway/a1/base_04/trap_sample.mp3"),
    ("¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.", "/audio/pathway/a1/base_04/trap_intro.mp3"),
    ("¡Mucho ojo! Esa es justo la trampa del español... Recuerda que la edad en inglés se dice con am o is, nunca con have... diciendo... I am 25 years old... Toca la otra opción en tu pantalla.", "/audio/pathway/a1/base_04/trap_error.mp3"),
    ("¡Exacto! Cazaste la trampa a la perfección... La edad se dice con el verbo tu bi... Escucha ahora con atención cómo suena en ejemplos reales.", "/audio/pathway/a1/base_04/trap_success.mp3"),
    ("¡Exacto! Cazaste la trampa a la perfección... La edad se dice con el verbo To Be... Escucha ahora con atención cómo suena en ejemplos reales.", "/audio/pathway/a1/base_04/trap_success.mp3"),
    
    # Examples
    ("I am hungry and thirsty.", "/audio/pathway/a1/base_04/seg_04.mp3"),
    ("Escucha con atención cómo se unen las palabras al decir... I am hungry and thirsty... El secreto de pronunciación es sentir la unión del sujeto con am:... ai am jángri and zérsti.", "/audio/pathway/a1/base_04/seg_05.mp3"),
    ("He is 30 years old.", "/audio/pathway/a1/base_04/seg_06.mp3"),
    ("Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!", "/audio/pathway/a1/base_04/seg_07.mp3"),
    
    # Build stage
    ("Ahora es tu turno de construir... Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz... ¡Adelante, tú puedes!", "/audio/pathway/a1/base_04/build_intro.mp3"),
    ("Recuerda la clave:... en inglés no tienes hambre con have, estás en ese estado diciendo:... I am hungry now... Inténtalo de nuevo.", "/audio/pathway/a1/base_04/challenge_error.mp3"),
    ("En inglés dices 'I am hungry', no uses el verbo 'have'.", "/audio/pathway/a1/base_04/challenge_error.mp3"),
    ("¡Excelente trabajo! No caíste en la trampa de have:... I am hungry now... Ahora vamos a certificar tu propia voz.", "/audio/pathway/a1/base_04/challenge_success.mp3"),
    ("¡Excelente! Lo armaste en orden natural: I am hungry now. Ahora vamos a certificar tu voz.", "/audio/pathway/a1/base_04/challenge_success.mp3"),
    
    # Speak stage
    ("Escucha con atención cómo lo pronuncio yo:... I am hungry now... Ahora activa tu micrófono y dilo tú para certificar tu avance.", "/audio/pathway/a1/base_04/voice_instruction.mp3"),
    ("Escucha con atención cómo lo pronuncio yo: I am hungry now.. Ahora activa tu micrófono y dilo tú para certificar tu avance.", "/audio/pathway/a1/base_04/voice_instruction.mp3"),
    ("I am hungry now.", "/audio/pathway/a1/base_04/voice_sample.mp3"),
    ("¡Casi lo tienes! Escucha el modelo una vez más con atención, y dilo con calma para certificar tu avance.", "/audio/pathway/a1/base_04/voice_retry.mp3"),
    ("No logré escucharte con claridad... Repite conmigo:... I am hungry now... Toca el micrófono para intentarlo.", "/audio/pathway/a1/base_04/voice_not_heard.mp3"),
    ("¡Impecable! Dominaste la trampa de tener y tu pronunciación fue completamente natural... ¡Base conquistada!", "/audio/pathway/a1/base_04/voice_victory.mp3"),
    ("No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.", "/audio/pathway/a1/base_04/mic_error.mp3"),
]

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

count_before = len(manifest)
for raw_text, path in BASE04_ENTRIES:
    manifest[raw_text] = path
    clean = sanitize(raw_text)
    if clean:
        manifest[clean] = path
        no_dot = re.sub(r'[\.:!]+$', '', raw_text).strip()
        manifest[no_dot] = path
        manifest[sanitize(no_dot)] = path

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"Manifest updated for Base 04! Before: {count_before}, After: {len(manifest)}")

