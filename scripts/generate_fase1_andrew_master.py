import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%" # Calibrated pedagogical pace

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_01"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_01"
LAB_SAMPLES_DIR = "C:/Users/user/Music/lab/public/audio_samples"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)
os.makedirs(LAB_SAMPLES_DIR, exist_ok=True)

# Fase 1: La Regla (RULE Stage) + Complete Base 01 with Phonetic & Oral Best Practices
FASE_1_TRACKS = [
    # 1. Introducción General
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el orden mágico: primero quién, más la acción... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "1. Bienvenida a la Clase"
    ),
    # 2. Regla Central (Sujeto Obligatorio + Verbo)
    (
        "El reto de esta base es el orden mágico: primero quién, más la acción... En inglés el verbo nunca va solo: siempre debes nombrar primero a la persona que realiza la acción... Mira cómo se ilumina la fórmula, pieza por pieza: primero quién... luego la acción... y luego el momento:... I work every day.",
        ["seg_01.mp3", "seg_01_desktop.mp3"],
        "2. Regla Central: Quién más la acción"
    ),
    # 3. Orientación y Mentalidad de Fluidez
    (
        "¡Bienvenido a tu clase! Hoy vamos a desbloquear una base fundamental para tu fluidez:... el orden mágico: primero quién, más la acción... En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta... Te voy a enseñar el secreto exacto para que lo sientas completamente natural, y nunca más dudes al hablar.",
        ["seg_02.mp3", "seg_02_desktop.mp3"],
        "3. Orientación y Mentalidad de Fluidez"
    ),
    # 4. Alerta de la Trampa del Español
    (
        "Fíjate bien en la alerta en rojo de tu pizarra... Siempre abre tu frase nombrando a la persona: ya sea I, you, we, o they... Por eso tachamos work every day, y decimos:... I work every day... Tu ancla mental para no dudar jamás: en inglés el verbo nunca va solo... siempre nombra primero quién realiza la acción.",
        "seg_03.mp3",
        "4. Alerta de la Trampa del Español"
    ),
    # 5. Discriminación de Oído: Muestra Incorrecta
    (
        "Work every day.",
        "trap_wrong.mp3",
        "5. Discriminación: Error 'Work every day'"
    ),
    # 6. Discriminación de Oído: Muestra Correcta
    (
        "I work every day.",
        "trap_sample.mp3",
        "6. Discriminación: Modelo 'I work every day'"
    ),
    # 7. Feedback de Error en Trampa
    (
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda siempre abrir tu frase nombrando a la persona: ya sea I, you, we, o they... Toca la otra opción en tu pantalla.",
        "trap_error.mp3",
        "7. Feedback: Trampa Cazada"
    ),
    # 8. Feedback de Éxito en Trampa
    (
        "¡Exacto! Cazaste la trampa a la perfección... Escucha ahora con atención cómo suena en ejemplos reales.",
        "trap_success.mp3",
        "8. Feedback: Acierto en Trampa"
    ),
    # 9. Ejemplo 1
    (
        "I learn English step by step.",
        "seg_04.mp3",
        "9. Ejemplo 1: 'I learn English step by step'"
    ),
    # 10. Truco Fonético de Unión
    (
        "Escucha con atención cómo se unen las palabras al decir:... I learn English step by step... El secreto de pronunciación es sentir la unión:... ai lérn ínglish, step bai step.",
        "seg_05.mp3",
        "10. Truco Fonético y Unión de Palabras"
    ),
    # 11. Ejemplo 2
    (
        "I work with my team every morning.",
        "seg_06.mp3",
        "11. Ejemplo 2: 'I work with my team...'"
    ),
    # 12. Ejemplo 3
    (
        "I work every morning.",
        "seg_06_alt.mp3",
        "12. Ejemplo 3: 'I work every morning'"
    ),
    # 13. Pase a la Construcción Motriz
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
        "Empieza siempre con quién:... I... luego la acción:... learn... y al final:... English today.",
        "challenge_error.mp3",
        "15. Build: Corrección de Fichas"
    ),
    # 16. Fase 2: Éxito de Fichas
    (
        "¡Excelente trabajo! Lo armaste en orden natural:... I learn English today... Ahora vamos a certificar tu propia voz.",
        "challenge_success.mp3",
        "16. Build: Éxito de Ensamblaje"
    ),
    # 17. Fase 3 (SPEAK): Instrucción de Micrófono
    (
        "Escucha con atención cómo lo pronuncio yo:... I learn English today... Ahora activa tu micrófono y dilo tú para certificar tu avance.",
        "voice_instruction.mp3",
        "17. Speak: Instrucción de Micrófono"
    ),
    # 18. Fase 3: Modelo para Micrófono
    (
        "I learn English today.",
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
        "No logré escucharte con claridad... Repite conmigo:... I learn English today... Toca el micrófono para intentarlo.",
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
        
    print(f"[{index}/{total}] Generando: {label} ({filenames[0]})...")
    
    for attempt in range(max_retries):
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            temp_path = f"C:/Users/user/Music/lab/public/audio_samples/_tmp_master_{index}.mp3"
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
                    
            special_name = f"andrew_master_{filenames[0]}"
            p_special = os.path.join(LAB_SAMPLES_DIR, special_name)
            with open(p_special, "wb") as f_out:
                f_out.write(data)
                
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            print(f"  -> [OK] Guardado en front y lab ({len(data)} bytes)")
            return
        except Exception as e:
            print(f"  [Intento {attempt+1}/{max_retries}] Reintentando por: {e}")
            await asyncio.sleep(1.5)
            
    raise RuntimeError(f"Fallo al generar {filenames[0]} después de {max_retries} intentos")

async def main():
    print("=" * 70)
    print("INICIANDO PRODUCCION FASE 1 & BASE 01 COMPLETA CON ANDREW MULTILINGUAL")
    print("Estrategia Fonética Inteligente: 1 Sola Toma Continua, Cero Símbolos Rígidos")
    print("=" * 70)
    
    total = len(FASE_1_TRACKS)
    for i, (text, fnames, label) in enumerate(FASE_1_TRACKS, start=1):
        await generate_track(text, fnames, label, i, total)
        await asyncio.sleep(0.3)
        
    print("\n" + "=" * 70)
    print("¡PRODUCCION DE FASE 1 Y BASE 01 COMPLETADA AL 100% SIN NINGUN PROBLEMA!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
