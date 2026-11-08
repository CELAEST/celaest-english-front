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
    # 1. lesson_intro.mp3 with "verbo tu bi"
    (
        "lesson_intro.mp3",
        '¡Bienvenido a tu clase! Hoy vas a dominar el verbo tu bi sin enredos: cómo decir quién eres y cómo estás con sus tres parejas fijas... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.'
    ),
    # 2. Case 1: "I am ready"
    (
        "seg_01.mp3",
        'El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo en inglés: "I am ready."'
    ),
    # 3. Case 2: "She is ready"
    (
        "seg_01_case2.mp3",
        'La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos en inglés: "She is ready."'
    ),
    # 4. Case 3: "We are ready"
    (
        "seg_01_case3.mp3",
        'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos en inglés: "We are ready."'
    ),
]

async def main():
    print("Re-synthesizing Base 03 with bilingual cues and oral phonetic respelling...")
    for fn, text in TRACKS:
        out_front = os.path.join(FRONT_DIR, fn)
        out_lab = os.path.join(LAB_DIR, fn)
        for attempt in range(3):
            try:
                c = edge_tts.Communicate(text, VOICE, rate=RATE)
                await c.save(out_front)
                shutil.copy2(out_front, out_lab)
                print(f" -> [OK] {fn} ({os.path.getsize(out_front)} bytes)")
                break
            except Exception as e:
                print(f" -> [RETRY {attempt+1}] {fn}: {e}")
                await asyncio.sleep(1.5)
        await asyncio.sleep(0.4)
    print("Base 03 tracks successfully updated!")

if __name__ == "__main__":
    asyncio.run(main())

