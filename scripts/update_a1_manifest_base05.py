import json
import re

MANIFEST_PATH = "src/features/pathway/data/a1AudioManifest.json"

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

NEW_ENTRIES = {
    # 1. Introducción
    "¡Bienvenido a tu clase! Hoy vas a dominar cómo negar y cómo preguntar con el verbo tu bi sin enredos... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.": "/audio/pathway/a1/base_05/lesson_intro.mp3",
    "¡Bienvenido a tu clase! Hoy vas a dominar cómo negar y cómo preguntar con el verbo To Be sin enredos... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.": "/audio/pathway/a1/base_05/lesson_intro.mp3",
    "El reto de hoy es Ser o Estar en Negativo & Pregunta. Con To Be niegas agregando 'not' al verbo y preguntas moviendo el verbo al inicio. Sigue la explicación aquí mismo o toca Preguntar para cualquier duda.": "/audio/pathway/a1/base_05/lesson_intro.mp3",
    "El reto de hoy es Ser o Estar en Negativo & Pregunta. Con To Be niegas agregando not al verbo y preguntas moviendo el verbo al inicio. Sigue la explicación aquí mismo o toca Preguntar para cualquier duda.": "/audio/pathway/a1/base_05/lesson_intro.mp3",

    # 2. VÍA A: Caso 1 (01 · Negar (+ not))
    "El reto de esta base es dominar negativos y preguntas... Para decir que alguien no está o no es algo, simplemente agregamos la palabra not después del verbo tu bi... Por ejemplo, para él decimos:": "/audio/pathway/a1/base_05/seg_01_case1_intro.mp3",
    "El reto de esta base es dominar negativos y preguntas... Para decir que alguien no está o no es algo, simplemente agregamos la palabra not después del verbo To Be... Por ejemplo, para él decimos:": "/audio/pathway/a1/base_05/seg_01_case1_intro.mp3",
    "He isn't busy right now.": "/audio/pathway/a1/base_05/seg_01_case1_model.mp3",
    "He isn't busy right now": "/audio/pathway/a1/base_05/seg_01_case1_model.mp3",
    "He isnt busy right now.": "/audio/pathway/a1/base_05/seg_01_case1_model.mp3",

    # 3. VÍA A: Caso 2 (02 · Preguntar (Invertir))
    "Y para hacer una pregunta en inglés no necesitas una palabra adicional: simplemente inviertes el orden y colocas el verbo antes de la persona... Por ejemplo, para preguntar si tú estás listo decimos:": "/audio/pathway/a1/base_05/seg_01_case2_intro.mp3",
    "Y para hacer una pregunta en inglés no necesitas una palabra adicional simplemente inviertes el orden y colocas el verbo antes de la persona... Por ejemplo, para preguntar si tú estás listo decimos:": "/audio/pathway/a1/base_05/seg_01_case2_intro.mp3",
    "Are you ready today?": "/audio/pathway/a1/base_05/seg_01_case2_model.mp3",
    "Are you ready today": "/audio/pathway/a1/base_05/seg_01_case2_model.mp3",

    # 4. VÍA A: Trampa Desacoplada
    "Fíjate bien en la alerta en rojo de tu pizarra... En español solemos preguntar manteniendo el orden afirmativo y solo subiendo el tono de voz... pero en inglés nunca hacemos eso... Por eso nunca decimos:": "/audio/pathway/a1/base_05/seg_03_part1_intro.mp3",
    "You are ready?": "/audio/pathway/a1/base_05/seg_03_part2_wrong.mp3",
    "You are ready": "/audio/pathway/a1/base_05/seg_03_part2_wrong.mp3",
    "Sino que en inglés siempre invertimos el orden diciendo:": "/audio/pathway/a1/base_05/seg_03_part3_pivot.mp3",
    "Tu ancla mental para no dudar jamás: en preguntas directas con el verbo tu bi, primero colocas el verbo y luego la persona.": "/audio/pathway/a1/base_05/seg_03_part5_anchor.mp3",
    "Tu ancla mental para no dudar jamás: en preguntas directas con el verbo To Be, primero colocas el verbo y luego la persona.": "/audio/pathway/a1/base_05/seg_03_part5_anchor.mp3",

    # 5. Trampa Master Concat
    "Fíjate bien en la alerta en rojo de tu pizarra... En español solemos preguntar manteniendo el orden afirmativo y solo subiendo el tono de voz... pero en inglés nunca hacemos eso... Por eso nunca decimos: You are ready? Sino que en inglés siempre invertimos el orden diciendo: Are you ready? Tu ancla mental para no dudar jamás: en preguntas directas con el verbo tu bi, primero colocas el verbo y luego la persona.": "/audio/pathway/a1/base_05/seg_03.mp3",

    # 6. Reto / Trap Check
    "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.": "/audio/pathway/a1/base_05/trap_intro.mp3",
    "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés": "/audio/pathway/a1/base_05/trap_intro.mp3",
    "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que en preguntas directas colocamos primero el verbo: diciendo... Are you ready?... Toca la otra opción en tu pantalla.": "/audio/pathway/a1/base_05/trap_error.mp3",
    "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que en preguntas directas colocamos primero el verbo: diciendo... Are you ready?... Toca la otra opción en tu pantalla": "/audio/pathway/a1/base_05/trap_error.mp3",
    "¡Exacto! Cazaste la trampa a la perfección... En preguntas siempre invertimos el orden... Escucha ahora con atención cómo suena en ejemplos reales.": "/audio/pathway/a1/base_05/trap_success.mp3",
    "¡Exacto! Cazaste la trampa a la perfección... En preguntas siempre invertimos el orden... Escucha ahora con atención cómo suena en ejemplos reales": "/audio/pathway/a1/base_05/trap_success.mp3",

    # 7. Ejemplos
    "Are you ready for the meeting?": "/audio/pathway/a1/base_05/seg_05.mp3",
    "Are you ready for the meeting": "/audio/pathway/a1/base_05/seg_05.mp3",
    "Escucha con atención cómo se unen las palabras al preguntar... Are you ready for the meeting?... El secreto de pronunciación es unir are con you suavemente:... ar yu rédi for de míting.": "/audio/pathway/a1/base_05/seg_06.mp3",
    "Escucha con atención cómo se unen las palabras al preguntar... Are you ready for the meeting?... El secreto de pronunciación es unir are con you suavemente:... ar yu rédi for de míting": "/audio/pathway/a1/base_05/seg_06.mp3",
    "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!": "/audio/pathway/a1/base_05/seg_08.mp3",

    # 8. Reto BUILD
    "Arma la pregunta: ¿Estás listo hoy? Toca primero Are, luego you y después ready today?.": "/audio/pathway/a1/base_05/build_intro.mp3",
    "Arma la pregunta: ¿Estás listo hoy? Toca primero Are, luego you y después ready today?": "/audio/pathway/a1/base_05/build_intro.mp3",
    "¡Impecable! Invertiste la posición y abriste con Are you. Avanza al reto de voz para entrenar tu pronunciación.": "/audio/pathway/a1/base_05/challenge_success.mp3",
    "¡Impecable! Invertiste la posición y abriste con Are you. Avanza al reto de voz para entrenar tu pronunciación": "/audio/pathway/a1/base_05/challenge_success.mp3",
    "¡Ojo al orden! Coloca primero el verbo Are antes de la persona you... Toca una ficha para reorganizarla.": "/audio/pathway/a1/base_05/challenge_error.mp3",
    "¡Ojo al orden! Coloca primero el verbo Are antes de la persona you... Toca una ficha para reorganizarla": "/audio/pathway/a1/base_05/challenge_error.mp3",

    # 9. Reto SPEAK
    "Ahora es tu turno de hablar. Escucha con atención: Are you ready today? Toca el micrófono y pronúncialo con calma.": "/audio/pathway/a1/base_05/voice_instruction.mp3",
    "Ahora es tu turno de hablar. Escucha con atención: Are you ready today? Toca el micrófono y pronúncialo con calma": "/audio/pathway/a1/base_05/voice_instruction.mp3",
    "¡Excelente pronunciación! Dominaste ser o estar en preguntas y negativos. Ya estás listo para continuar.": "/audio/pathway/a1/base_05/voice_victory.mp3",
    "¡Excelente pronunciación! Dominaste ser o estar en preguntas y negativos. Ya estás listo para continuar": "/audio/pathway/a1/base_05/voice_victory.mp3",
    "Casi lo tienes. Recuerda la entonación limpia: Are you ready today? Inténtalo de nuevo tocando el micrófono.": "/audio/pathway/a1/base_05/voice_retry.mp3",
    "No logré escucharte con claridad. Asegúrate de permitir el micrófono y repite la frase con calma.": "/audio/pathway/a1/base_05/voice_not_heard.mp3",
    "Parece que el navegador no tiene permiso para el micrófono. Actívalo en la barra de direcciones para certificar tu voz.": "/audio/pathway/a1/base_05/mic_error.mp3",
}

count_added = 0
for text, audio_url in NEW_ENTRIES.items():
    manifest[text] = audio_url
    count_added += 1

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"✅ Agregadas/Actualizadas {count_added} entradas para Base 05 en a1AudioManifest.json.")

