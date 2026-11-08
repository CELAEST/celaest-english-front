import asyncio
import os
import shutil
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_04"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_04"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

TRACKS_BASE04 = [
    # 1. Introducción General
    (
        "lesson_intro.mp3",
        "¡Bienvenido a tu clase! Hoy vas a dominar la trampa de tener: por qué en inglés nunca dices que tienes hambre ni años... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada."
    ),
    # 2. VÍA A: Caso 1 (Sensaciones) Intro
    (
        "seg_01_case1_intro.mp3",
        "El reto de esta base es la trampa de tener. En inglés no tienes hambre ni frío: estás en ese estado con am:"
    ),
    # 3. VÍA A: Caso 1 Modelo Nativo (Inglés Puro)
    (
        "seg_01_case1_model.mp3",
        "I am hungry now."
    ),
    # 4. VÍA A: Caso 2 (Edad) Intro
    (
        "seg_01_case2_intro.mp3",
        "Y con la edad pasa exactamente lo mismo: no tienes años, eres tus años usando is:"
    ),
    # 5. VÍA A: Caso 2 Modelo Nativo (Inglés Puro)
    (
        "seg_01_case2_model.mp3",
        "He is 30 years old."
    ),
    # 6. Alerta de la Trampa
    (
        "seg_03.mp3",
        "Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca uses el verbo have para la edad ni para el hambre... Por eso tachamos I have 25 years, y decimos... I am 25 years old... Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi."
    ),
    # 7. Modelo Erróneo de Oído
    (
        "trap_wrong.mp3",
        "I have 25 years."
    ),
    # 8. Modelo Correcto de Oído
    (
        "trap_sample.mp3",
        "I am 25 years old."
    ),
    # 9. Invitación al Reto
    (
        "trap_intro.mp3",
        "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés."
    ),
    # 10. Feedback de Error en Trampa
    (
        "trap_error.mp3",
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que la edad en inglés se dice con am o is, nunca con have... diciendo... I am 25 years old... Toca la otra opción en tu pantalla."
    ),
    # 11. Feedback de Acierto en Trampa
    (
        "trap_success.mp3",
        "¡Exacto! Cazaste la trampa a la perfección... La edad se dice con el verbo tu bi... Escucha ahora con atención cómo suena en ejemplos reales."
    ),
    # 12. Ejemplo 1 (Inglés Puro)
    (
        "seg_04.mp3",
        "I am hungry and thirsty."
    ),
    # 13. Secreto Fonético
    (
        "seg_05.mp3",
        "Escucha con atención cómo se unen las palabras al decir... I am hungry and thirsty... El secreto de pronunciación es sentir la unión del sujeto con am:... ai am jángri and zérsti."
    ),
    # 14. Ejemplo 2 (Inglés Puro)
    (
        "seg_06.mp3",
        "He is 30 years old."
    ),
    # 15. Pase al Ensamblaje Motriz
    (
        "seg_07.mp3",
        "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!"
    ),
    # 16. Build: Apertura
    (
        "build_intro.mp3",
        "Ahora es tu turno de construir... Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz... ¡Adelante, tú puedes!"
    ),
    # 17. Build: Error
    (
        "challenge_error.mp3",
        "Recuerda la clave:... en inglés no tienes hambre con have, estás en ese estado diciendo:... I am hungry now... Inténtalo de nuevo."
    ),
    # 18. Build: Éxito
    (
        "challenge_success.mp3",
        "¡Excelente trabajo! No caíste en la trampa de have:... I am hungry now... Ahora vamos a certificar tu propia voz."
    ),
    # 19. Speak: Instrucción
    (
        "voice_instruction.mp3",
        "Escucha con atención cómo lo pronuncio yo:... I am hungry now... Ahora activa tu micrófono y dilo tú para certificar tu avance."
    ),
    # 20. Speak: Modelo
    (
        "voice_sample.mp3",
        "I am hungry now."
    ),
    # 21. Speak: Reintento
    (
        "voice_retry.mp3",
        "¡Casi lo tienes! Escucha el modelo una vez más con atención, y dilo con calma para certificar tu avance."
    ),
    # 22. Speak: No escuchado
    (
        "voice_not_heard.mp3",
        "No logré escucharte con claridad... Repite conmigo:... I am hungry now... Toca el micrófono para intentarlo."
    ),
    # 23. Speak: Victoria
    (
        "voice_victory.mp3",
        "¡Impecable! Dominaste la trampa de tener y tu pronunciación fue completamente natural... ¡Base conquistada!"
    ),
    # 24. Mic Error
    (
        "mic_error.mp3",
        "No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso."
    ),
]

async def synthesize(filename, text):
    front_path = os.path.join(FRONT_DIR, filename)
    lab_path = os.path.join(LAB_DIR, filename)
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await comm.save(front_path)
            shutil.copy2(front_path, lab_path)
            size = os.path.getsize(front_path)
            print(f" -> [OK] {filename} ({size} bytes)")
            if size > 1000:
                return
        except Exception as e:
            print(f" -> [RETRY {attempt+1}] {filename}: {e}")
            await asyncio.sleep(1.8)

async def main():
    print(f"Synthesizing {len(TRACKS_BASE04)} VÍA A SOTA tracks for Base 04...")
    for fn, txt in TRACKS_BASE04:
        await synthesize(fn, txt)
        await asyncio.sleep(0.4)
    print("All Base 04 tracks successfully synthesized!")

if __name__ == "__main__":
    asyncio.run(main())

