import asyncio
import os
import shutil
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_05"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_05"

LEGACY_TO_REFRESH = [
    (
        "seg_05.mp3",
        "Are you ready for the meeting?"
    ),
    (
        "seg_06.mp3",
        "Escucha con atención cómo se unen las palabras al preguntar... Are you ready for the meeting?... El secreto de pronunciación es unir are con you suavemente:... ar yu rédi for de míting."
    ),
    (
        "seg_07.mp3",
        "He isn't busy right now."
    ),
    (
        "challenge_success.mp3",
        "¡Impecable! Invertiste la posición y abriste con Are you. Avanza al reto de voz para entrenar tu pronunciación."
    ),
    (
        "challenge_error.mp3",
        "¡Ojo al orden! Coloca primero el verbo Are antes de la persona you... Toca una ficha para reorganizarla."
    ),
    (
        "voice_instruction.mp3",
        "Ahora es tu turno de hablar. Escucha con atención: Are you ready today? Toca el micrófono y pronúncialo con calma."
    ),
    (
        "voice_victory.mp3",
        "¡Excelente pronunciación! Dominaste ser o estar en preguntas y negativos. Ya estás listo para continuar."
    ),
]

async def refresh():
    print("🔄 RE-GENERANDO PISTAS RESTANTES CON ANDREW MULTILINGUAL (FRESH)...")
    for filename, text in LEGACY_TO_REFRESH:
        front_path = os.path.join(FRONT_DIR, filename)
        lab_path = os.path.join(LAB_DIR, filename)
        for attempt in range(1, 5):
            try:
                print(f"🎙️ Generando {filename}...")
                comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                await comm.save(front_path)
                size = os.path.getsize(front_path)
                if size > 1000:
                    shutil.copy2(front_path, lab_path)
                    print(f"   ✓ OK: {size} bytes -> {filename}")
                    await asyncio.sleep(0.5)
                    break
            except Exception as e:
                print(f"   ⚠️ Reintentando {filename}: {e}")
                await asyncio.sleep(1.5 * attempt)
    print("✅ PISTAS DE BASE 05 ACTUALIZADAS AL 100%.")

if __name__ == "__main__":
    asyncio.run(refresh())

