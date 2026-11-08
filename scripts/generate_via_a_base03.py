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

VIA_A_TRACKS = [
    # Caso 1 (Am)
    (
        "seg_01_case1_intro.mp3",
        "El reto de esta base es el verbo tu bi sin enredos. Contigo mismo usamos la pareja fija am:"
    ),
    (
        "seg_01_case1_model.mp3",
        "I am ready."
    ),
    # Caso 2 (Is)
    (
        "seg_01_case2_intro.mp3",
        "Para una sola persona ajena como él o ella, la pareja fija siempre es is:"
    ),
    (
        "seg_01_case2_model.mp3",
        "She is ready."
    ),
    # Caso 3 (Are)
    (
        "seg_01_case3_intro.mp3",
        "Y para ti o los grupos, la pareja fija siempre es are:"
    ),
    (
        "seg_01_case3_model.mp3",
        "We are ready."
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
            print(f"[OK] {filename} ({os.path.getsize(front_path)} bytes)")
            return
        except Exception as e:
            print(f"[RETRY {attempt+1}] {filename}: {e}")
            await asyncio.sleep(1.8)

async def main():
    print("Synthesizing VÍA A decoupled tracks for Base 03...")
    for fn, txt in VIA_A_TRACKS:
        await synthesize(fn, txt)
        await asyncio.sleep(0.5)
    print("VÍA A tracks synthesis finished!")

if __name__ == "__main__":
    asyncio.run(main())

