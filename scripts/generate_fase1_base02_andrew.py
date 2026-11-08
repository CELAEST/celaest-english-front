import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%" # Calibrated natural pedagogical pace

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_02"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_02"
LAB_SAMPLES_DIR = "C:/Users/user/Music/lab/public/audio_samples"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)
os.makedirs(LAB_SAMPLES_DIR, exist_ok=True)

# Fase 1: La Regla (RULE Stage) + Complete Base 02 with Phonetic & Oral Best Practices (7 Golden Rules)
FASE_1_BASE02_TRACKS = [
    # 1. Introducción General
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el sujeto impersonal It... el ancla para frases donde no hay persona humana... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "1. Bienvenida a la Clase Base 02"
    ),
    # 2. Regla Central (Sujeto Impersonal It Obligatorio)
    (
        "El reto de esta base es el sujeto impersonal It... En español decimos simplemente hace frío o es tarde, sin nombrar a ninguna persona... pero en inglés una oración nunca puede abrir con el verbo huérfano... siempre colocamos el sujeto neutro It... Mira cómo se ilumina la fórmula, pieza por pieza: primero el sujeto neutro It... luego el verbo is... y luego el estado:... It is cold today.",
        ["seg_01.mp3", "seg_01_desktop.mp3"],
        "2. Regla Central: Sujeto Impersonal It"
    ),
    # 3. Orientación y Mentalidad de Fluidez
    (
        "¡Bienvenido a tu clase! Hoy vamos a desbloquear una base fundamental para tu fluidez:... el sujeto impersonal It... En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta... Te voy a enseñar el secreto exacto para que lo sientas completamente natural, y nunca más dudes al hablar.",
        ["seg_02.mp3", "seg_02_desktop.mp3"],
        "3. Orientación y Mentalidad de Fluidez"
    ),
    # 4. Alerta de la Trampa del Español
    (
        "Fíjate bien en la alerta en rojo de tu pizarra... En español solemos decir simplemente está frío o hace frío, pero en inglés nunca abras una oración con Is sin su sujeto neutro... diciendo por ejemplo: It is cold... o It is late... Por eso tachamos is cold today, y decimos:... It is cold today... Tu ancla mental para no dudar jamás: en inglés el sujeto impersonal It siempre es obligatorio.",
        "seg_03.mp3",
        "4. Alerta de la Trampa del Español"
    ),
    # 5. Discriminación de Oído: Muestra Incorrecta
    (
        "Is cold today.",
        "trap_wrong.mp3",
        "5. Discriminación: Error 'Is cold today'"
    ),
    # 6. Discriminación de Oído: Muestra Correcta
    (
        "It is cold today.",
        "trap_sample.mp3",
        "6. Discriminación: Modelo 'It is cold today'"
    ),
    # 7. Introducción al Reto Oído (TRAP_CHECK)
    (
        "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.",
        "trap_intro.mp3",
        "7. Reto Oído: Invitación"
    ),
    # 8. Feedback de Error en Trampa
    (
        "¡Mucho ojo! Esa es justo la trampa del español... En inglés nunca dejes el verbo huérfano: coloca siempre el sujeto neutro It diciendo por ejemplo:... It is cold today... Toca la otra opción en tu pantalla.",
        "trap_error.mp3",
        "8. Feedback: Trampa Cazada"
    ),
    # 9. Feedback de Éxito en Trampa
    (
        "¡Exacto! Cazaste la trampa a la perfección... Nunca dejamos el verbo huérfano... Escucha ahora con atención cómo suena en ejemplos reales.",
        "trap_success.mp3",
        "9. Feedback: Acierto en Trampa"
    ),
    # 10. Ejemplo 1
    (
        "It is sunny and warm today.",
        "seg_04.mp3",
        "10. Ejemplo 1: 'It is sunny and warm today'"
    ),
    # 11. Truco Fonético de Unión
    (
        "Escucha con atención cómo se unen las palabras al decir:... It is sunny and warm today... El secreto de pronunciación es sentir la unión del sujeto con el verbo:... it is sáni and uórm tudéi.",
        "seg_05.mp3",
        "11. Truco Fonético y Unión"
    ),
    # 12. Ejemplo 2
    (
        "It is very important to practice every day.",
        "seg_06.mp3",
        "12. Ejemplo 2: 'It is very important to practice every day'"
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
        "Coloca siempre el sujeto neutro It al inicio:... It... luego el verbo:... is... y al final:... cold today.",
        "challenge_error.mp3",
        "15. Build: Corrección de Fichas"
    ),
    # 16. Fase 2: Éxito de Fichas
    (
        "¡Excelente trabajo! Lo armaste en orden natural:... It is cold today... Ahora vamos a certificar tu propia voz.",
        "challenge_success.mp3",
        "16. Build: Éxito de Ensamblaje"
    ),
    # 17. Fase 3 (SPEAK): Instrucción de Micrófono
    (
        "Escucha con atención cómo lo pronuncio yo:... It is cold today... Ahora activa tu micrófono y dilo tú para certificar tu avance.",
        "voice_instruction.mp3",
        "17. Speak: Instrucción de Micrófono"
    ),
    # 18. Fase 3: Modelo para Micrófono
    (
        "It is cold today.",
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
        "No logré escucharte con claridad... Repite conmigo:... It is cold today... Toca el micrófono para intentarlo.",
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
        
    print(f"[{index}/{total}] Generando Base 02: {label} ({filenames[0]})...")
    
    for attempt in range(max_retries):
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            temp_path = f"C:/Users/user/Music/lab/public/audio_samples/_tmp_base02_{index}.mp3"
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
                    
            special_name = f"andrew_base02_{filenames[0]}"
            p_special = os.path.join(LAB_SAMPLES_DIR, special_name)
            with open(p_special, "wb") as f_out:
                f_out.write(data)
                
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            print(f"  -> [OK] Guardado ({len(data)} bytes)")
            return
        except Exception as e:
            print(f"  [Intento {attempt+1}/{max_retries}] Reintentando por: {e}")
            await asyncio.sleep(1.5)
            
    raise RuntimeError(f"Fallo al generar {filenames[0]} después de {max_retries} intentos")

async def main():
    print("=" * 70)
    print("INICIANDO PRODUCCION BASE 02 COMPLETA CON ANDREW MULTILINGUAL")
    print("El 'It' Fantasma: Frases sin Persona Humana")
    print("=" * 70)
    
    total = len(FASE_1_BASE02_TRACKS)
    for i, (text, fnames, label) in enumerate(FASE_1_BASE02_TRACKS, start=1):
        await generate_track(text, fnames, label, i, total)
        await asyncio.sleep(0.3)
        
    print("\n" + "=" * 70)
    print("¡PRODUCCION DE BASE 02 CON ANDREW COMPLETADA AL 100%!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())

