import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%" # Calibrated natural pedagogical pace

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_03"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_03"
LAB_SAMPLES_DIR = "C:/Users/user/Music/lab/public/audio_samples"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)
os.makedirs(LAB_SAMPLES_DIR, exist_ok=True)

# Fase 1: La Regla (RULE Stage) + Complete Base 03 with Phonetic & Oral Best Practices (7 Golden Rules)
FASE_1_BASE03_TRACKS = [
    # 1. Introducción General
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el verbo To Be sin enredos: cómo decir quién eres y cómo estás con sus tres parejas fijas... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "1. Bienvenida a la Clase Base 03"
    ),
    # 2. Regla Central (Verbo To Be en presente y contracciones)
    (
        "El reto de esta base es el verbo To Be sin enredos... En inglés una sola palabra sirve para decir ser y estar... dividida en tres parejas fijas según la persona... Mira cómo se ilumina la fórmula, pieza por pieza: conmigo diciendo:... I am ready... con ella diciendo:... she is ready... y con el grupo diciendo:... we are ready.",
        ["seg_01.mp3", "seg_01_desktop.mp3"],
        "2. Regla Central: Verbo To Be sin Enredos"
    ),
    # 3. Orientación y Mentalidad de Fluidez
    (
        "¡Bienvenido a tu clase! Hoy vamos a desbloquear una base fundamental para tu fluidez:... ser o estar sin enredos... En español diferenciamos ser de estar, pero en inglés el cerebro opera con parejas fijas directas... Te voy a enseñar el secreto exacto para que lo sientas completamente natural, y nunca más dudes al hablar.",
        ["seg_02.mp3", "seg_02_desktop.mp3"],
        "3. Orientación y Mentalidad de Fluidez"
    ),
    # 4. Alerta de la Trampa del Español
    (
        "Fíjate bien en la alerta en rojo de tu pizarra... Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es is... diciendo por ejemplo: he is... o she is... Por eso tachamos she are ready, y decimos:... She is ready... Tu ancla mental para no dudar jamás: una sola persona siempre camina con is.",
        "seg_03.mp3",
        "4. Alerta de la Trampa del Español"
    ),
    # 5. Discriminación de Oído: Muestra Incorrecta
    (
        "She are ready.",
        "trap_wrong.mp3",
        "5. Discriminación: Error 'She are ready'"
    ),
    # 6. Discriminación de Oído: Muestra Correcta
    (
        "She is ready.",
        "trap_sample.mp3",
        "6. Discriminación: Modelo 'She is ready'"
    ),
    # 7. Introducción al Reto Oído (TRAP_CHECK)
    (
        "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.",
        "trap_intro.mp3",
        "7. Reto Oído: Invitación"
    ),
    # 8. Feedback de Error en Trampa
    (
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que para una sola persona ajena como ella la pareja fija es is diciendo:... She is ready... Toca la otra opción en tu pantalla.",
        "trap_error.mp3",
        "8. Feedback: Trampa Cazada"
    ),
    # 9. Feedback de Éxito en Trampa
    (
        "¡Exacto! Cazaste la trampa a la perfección... Una sola persona siempre va con is... Escucha ahora con atención cómo suena en ejemplos reales.",
        "trap_success.mp3",
        "9. Feedback: Acierto en Trampa"
    ),
    # 10. Ejemplo 1
    (
        "I am ready to start my lesson.",
        "seg_04.mp3",
        "10. Ejemplo 1: 'I am ready to start my lesson'"
    ),
    # 11. Truco Fonético de Unión
    (
        "Escucha con atención cómo se unen las palabras al decir:... I am ready to start my lesson... El secreto de pronunciación es sentir la unión del sujeto con am:... ai am rédi, tu start mai léson.",
        "seg_05.mp3",
        "11. Truco Fonético y Unión"
    ),
    # 12. Ejemplo 2
    (
        "She is very focused right now.",
        "seg_06.mp3",
        "12. Ejemplo 2: 'She is very focused right now'"
    ),
    # 13. Pase al Ensamblaje Motriz
    (
        "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!",
        ["seg_07.mp3", "seg_07_desktop.mp3"],
        "13. Pase al Ensamblaje Motriz"
    ),
    # 14. Fase 2 (BUILD): Apertura de Fichas
    (
        "Ahora es tu turno de construir... Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz... ¡Adelante, tú puedes!",
        "build_intro.mp3",
        "14. Build: Apertura de Fichas"
    ),
    # 15. Fase 2: Corrección de Fichas
    (
        "Recuerda la pareja fija exclusiva:... I... camina siempre de la mano con:... am... diciendo:... I am ready today.",
        "challenge_error.mp3",
        "15. Build: Corrección de Fichas"
    ),
    # 16. Fase 2: Éxito de Fichas
    (
        "¡Excelente trabajo! Lo armaste en orden natural:... I am ready today... Ahora vamos a certificar tu propia voz.",
        "challenge_success.mp3",
        "16. Build: Éxito de Ensamblaje"
    ),
    # 17. Fase 3 (SPEAK): Instrucción de Micrófono
    (
        "Escucha con atención cómo lo pronuncio yo:... I am ready today... Ahora activa tu micrófono y dilo tú para certificar tu avance.",
        "voice_instruction.mp3",
        "17. Speak: Instrucción de Micrófono"
    ),
    # 18. Fase 3: Modelo para Micrófono
    (
        "I am ready today.",
        "voice_sample.mp3",
        "18. Speak: Modelo para Micrófono"
    ),
    # 19. Fase 3: Reintento Pedagógico
    (
        "¡Casi lo tienes! Escucha el modelo una vez más con atención, y dilo con calma para certificar tu avance.",
        "voice_retry.mp3",
        "19. Speak: Reintento Pedagógico"
    ),
    # 20. Fase 3: No Escuchado
    (
        "No logré escucharte con claridad... Repite conmigo:... I am ready today... Toca el micrófono para intentarlo.",
        "voice_not_heard.mp3",
        "20. Speak: No Escuchado"
    ),
    # 21. Fase 3: Permiso de Micrófono
    (
        "No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.",
        "mic_error.mp3",
        "21. Speak: Alerta de Permiso de Micrófono"
    ),
    # 22. Fase 3: Victoria y Certificación de la Base
    (
        "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con una cadencia impecable... Base conquistada con éxito.",
        ["voice_victory.mp3", "voice_victory_alt.mp3"],
        "22. Speak: Victoria y Certificación de Base"
    ),
]

async def generate_track(text, filenames, label, index, total, max_retries=3):
    if isinstance(filenames, str):
        filenames = [filenames]
        
    print(f"[{index}/{total}] Generando Base 03: {label} ({filenames[0]})...", flush=True)
    
    for attempt in range(max_retries):
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            temp_path = f"C:/Users/user/Music/lab/public/audio_samples/_tmp_base03_{index}.mp3"
            await comm.save(temp_path)
            
            with open(temp_path, "rb") as f:
                data = f.read()
                
            for fn in filenames:
                p_front = os.path.join(FRONT_DIR, fn)
                p_lab = os.path.join(LAB_DIR, fn)
                with open(p_front, "wb") as f_out:
                    f_out.write(data)
                with open(p_lab, "wb") as f_out:
                    f_out.write(data)
                    
            special_name = f"andrew_base03_{filenames[0]}"
            p_special = os.path.join(LAB_SAMPLES_DIR, special_name)
            with open(p_special, "wb") as f_out:
                f_out.write(data)
                
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            print(f"  -> [OK] Guardado ({len(data)} bytes)", flush=True)
            return
        except Exception as e:
            print(f"  [Intento {attempt+1}/{max_retries}] Reintentando por: {e}", flush=True)
            await asyncio.sleep(1.5)
            
    raise RuntimeError(f"Fallo al generar {filenames[0]} después de {max_retries} intentos")

async def main():
    print("=" * 70, flush=True)
    print("INICIANDO PRODUCCION BASE 03 COMPLETA CON ANDREW MULTILINGUAL", flush=True)
    print("Ser o Estar sin Enredos (Am · Is · Are)", flush=True)
    print("=" * 70, flush=True)
    
    total = len(FASE_1_BASE03_TRACKS)
    for i, (text, fnames, label) in enumerate(FASE_1_BASE03_TRACKS, start=1):
        await generate_track(text, fnames, label, i, total)
        await asyncio.sleep(0.3)
        
    print("\n" + "=" * 70, flush=True)
    print("¡PRODUCCION DE BASE 03 CON ANDREW COMPLETADA AL 100%!", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    asyncio.run(main())

