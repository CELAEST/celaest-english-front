import asyncio
import os
import shutil
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_03"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_03"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

TRACKS = [
    # 6. trap_error.mp3 -> Clean respiratory pauses before "is"
    (
        "trap_error.mp3",
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que para una sola persona ajena como ella, la pareja fija siempre es... is... diciendo... She is ready... Toca la otra opción en tu pantalla."
    ),
    # 7. trap_success.mp3 -> Clean respiratory pauses before "is"
    (
        "trap_success.mp3",
        "¡Exacto! Cazaste la trampa a la perfección... Una sola persona siempre va con... is... Escucha ahora con atención cómo suena en ejemplos reales."
    ),
    # 8. seg_05.mp3 -> Clean phonetic breath
    (
        "seg_05.mp3",
        "Escucha con atención cómo se unen las palabras al decir... I am ready to start my lesson... El secreto de pronunciación es sentir la unión del sujeto con am... ai am rédi, tu start mai léson."
    )
]

async def main():
    print(f"Synthesizing {len(TRACKS)} remaining phonetic tracks for Base 03...")
    for fn, text in TRACKS:
        out_front = os.path.join(FRONT_DIR, fn)
        out_lab = os.path.join(LAB_DIR, fn)
        for attempt in range(4):
            try:
                print(f" -> Synthesizing {fn} (attempt {attempt + 1})...", flush=True)
                comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                await comm.save(out_front)
                shutil.copy2(out_front, out_lab)
                print(f"    [OK] Saved {fn} ({os.path.getsize(out_front)} bytes)", flush=True)
                break
            except Exception as e:
                print(f"    [WARN] Attempt {attempt + 1} failed: {e}", flush=True)
                await asyncio.sleep(2.0)
        await asyncio.sleep(0.8)
    print("All remaining Base 03 phonetic tracks successfully synthesized!")

if __name__ == "__main__":
    asyncio.run(main())
