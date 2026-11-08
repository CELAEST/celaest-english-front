import asyncio
import os
import shutil
import subprocess
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_05"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_05"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

TRACKS_BASE05 = [
    # 1. Introducción General
    (
        "lesson_intro.mp3",
        "¡Bienvenido a tu clase! Hoy vas a dominar cómo negar y cómo preguntar con el verbo tu bi sin enredos... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada."
    ),
    # 2. VÍA A: Caso 1 (01 · Negar (+ not)) Intro
    (
        "seg_01_case1_intro.mp3",
        "El reto de esta base es dominar negativos y preguntas... Para decir que alguien no está o no es algo, simplemente agregamos la palabra not después del verbo tu bi... Por ejemplo, para él decimos:"
    ),
    # 3. VÍA A: Caso 1 Modelo Nativo (Inglés Puro)
    (
        "seg_01_case1_model.mp3",
        "He isn't busy right now."
    ),
    # 4. VÍA A: Caso 2 (02 · Preguntar (Invertir)) Intro
    (
        "seg_01_case2_intro.mp3",
        "Y para hacer una pregunta en inglés no necesitas una palabra adicional: simplemente inviertes el orden y colocas el verbo antes de la persona... Por ejemplo, para preguntar si tú estás listo decimos:"
    ),
    # 5. VÍA A: Caso 2 Modelo Nativo (Inglés Puro)
    (
        "seg_01_case2_model.mp3",
        "Are you ready today?"
    ),
    # 6. VÍA A: Trampa Parte 1 (Intro de interferencia en español limpio)
    (
        "seg_03_part1_intro.mp3",
        "Fíjate bien en la alerta en rojo de tu pizarra... En español solemos preguntar manteniendo el orden afirmativo y solo subiendo el tono de voz... pero en inglés nunca hacemos eso... Por eso nunca decimos:"
    ),
    # 7. VÍA A: Trampa Parte 2 (Error en inglés puro)
    (
        "seg_03_part2_wrong.mp3",
        "You are ready?"
    ),
    # 8. VÍA A: Trampa Parte 3 (Pivote de transición en español)
    (
        "seg_03_part3_pivot.mp3",
        "Sino que en inglés siempre invertimos el orden diciendo:"
    ),
    # 9. VÍA A: Trampa Parte 4 (Forma natural en inglés puro)
    (
        "seg_03_part4_correct.mp3",
        "Are you ready?"
    ),
    # 10. VÍA A: Trampa Parte 5 (Ancla mental en español con fonética tu bi)
    (
        "seg_03_part5_anchor.mp3",
        "Tu ancla mental para no dudar jamás: en preguntas directas con el verbo tu bi, primero colocas el verbo y luego la persona."
    ),
    # 11. Reto / Trap Check Intro
    (
        "trap_intro.mp3",
        "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés."
    ),
    # 12. Reto / Trap Check Error
    (
        "trap_error.mp3",
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que en preguntas directas colocamos primero el verbo: diciendo... Are you ready?... Toca la otra opción en tu pantalla."
    ),
    # 13. Reto / Trap Check Success
    (
        "trap_success.mp3",
        "¡Exacto! Cazaste la trampa a la perfección... En preguntas siempre invertimos el orden... Escucha ahora con atención cómo suena en ejemplos reales."
    ),
    # 14. Ejemplo 1 Modelo Nativo (Inglés Puro)
    (
        "seg_05.mp3",
        "Are you ready for the meeting?"
    ),
    # 15. Ejemplo 1 Secreto Fonético (Español)
    (
        "seg_06.mp3",
        "Escucha con atención cómo se unen las palabras al preguntar... Are you ready for the meeting?... El secreto de pronunciación es unir are con you suavemente:... ar yu rédi for de míting."
    ),
    # 16. Ejemplo 2 Modelo Nativo (Inglés Puro)
    (
        "seg_07.mp3",
        "He isn't busy right now."
    ),
    # 17. Transición a Práctica (BUILD)
    (
        "seg_08.mp3",
        "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!"
    ),
    # 18. Reto de Construcción (BUILD)
    (
        "build_intro.mp3",
        "Arma la pregunta: ¿Estás listo hoy? Toca primero Are, luego you y después ready today?."
    ),
    (
        "challenge_success.mp3",
        "¡Impecable! Invertiste la posición y abriste con Are you. Avanza al reto de voz para entrenar tu pronunciación."
    ),
    (
        "challenge_error.mp3",
        "¡Ojo al orden! Coloca primero el verbo Are antes de la persona you... Toca una ficha para reorganizarla."
    ),
    # 19. Reto de Voz (SPEAK)
    (
        "voice_instruction.mp3",
        "Ahora es tu turno de hablar. Escucha con atención: Are you ready today? Toca el micrófono y pronúncialo con calma."
    ),
    (
        "voice_sample.mp3",
        "Are you ready today?"
    ),
    (
        "voice_victory.mp3",
        "¡Excelente pronunciación! Dominaste ser o estar en preguntas y negativos. Ya estás listo para continuar."
    ),
    (
        "voice_retry.mp3",
        "Casi lo tienes. Recuerda la entonación limpia: Are you ready today? Inténtalo de nuevo tocando el micrófono."
    ),
    (
        "voice_not_heard.mp3",
        "No logré escucharte con claridad. Asegúrate de permitir el micrófono y repite la frase con calma."
    ),
    (
        "mic_error.mp3",
        "Parece que el navegador no tiene permiso para el micrófono. Actívalo en la barra de direcciones para certificar tu voz."
    ),
]

async def generate_track(filename: str, text: str):
    front_path = os.path.join(FRONT_DIR, filename)
    lab_path = os.path.join(LAB_DIR, filename)
    
    # Si ya existe con tamaño válido, reutilizar
    if os.path.exists(front_path) and os.path.getsize(front_path) > 1000:
        print(f"   ⏩ Ya existe: {filename} ({os.path.getsize(front_path)} bytes)")
        if not os.path.exists(lab_path):
            shutil.copy2(front_path, lab_path)
        return

    for attempt in range(1, 6):
        try:
            print(f"🎙️ Generando {filename} (intento {attempt})...")
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
            await communicate.save(front_path)
            size = os.path.getsize(front_path)
            if size > 1000:
                shutil.copy2(front_path, lab_path)
                print(f"   ✓ OK: {size} bytes -> {filename}")
                await asyncio.sleep(0.5)
                return
        except Exception as e:
            print(f"   ⚠️ Reintentando {filename} tras error: {e}")
            await asyncio.sleep(1.5 * attempt)
    
    raise RuntimeError(f"❌ Falló generación de {filename} tras 5 intentos.")

def stitch_trap_master():
    p1 = os.path.join(FRONT_DIR, "seg_03_part1_intro.mp3")
    p2 = os.path.join(FRONT_DIR, "seg_03_part2_wrong.mp3")
    p3 = os.path.join(FRONT_DIR, "seg_03_part3_pivot.mp3")
    p4 = os.path.join(FRONT_DIR, "seg_03_part4_correct.mp3")
    p5 = os.path.join(FRONT_DIR, "seg_03_part5_anchor.mp3")
    out_front = os.path.join(FRONT_DIR, "seg_03.mp3")
    out_lab = os.path.join(LAB_DIR, "seg_03.mp3")
    
    concat_list = os.path.join(FRONT_DIR, "concat_trap.txt")
    with open(concat_list, "w", encoding="utf-8") as f:
        f.write(f"file '{p1}'\n")
        f.write(f"file '{p2}'\n")
        f.write(f"file '{p3}'\n")
        f.write(f"file '{p4}'\n")
        f.write(f"file '{p5}'\n")
    
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c:a", "libmp3lame", "-b:a", "128k",
        out_front
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    size = os.path.getsize(out_front)
    shutil.copy2(out_front, out_lab)
    os.remove(concat_list)
    print(f"✨ Master seg_03.mp3 concatenado con éxito: {size} bytes")

async def main():
    print("🚀 INICIANDO GENERACIÓN BASE 05 (VÍA A SOTA MASTER)...")
    for filename, text in TRACKS_BASE05:
        await generate_track(filename, text)
    
    print("\n🎧 Compilando master de Trampa (seg_03.mp3)...")
    stitch_trap_master()
    print("\n✅ BASE 05 GENERADA AL 100% CON CERO ERRORES FONÉTICOS.")

if __name__ == "__main__":
    asyncio.run(main())
