import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"
OUT_DIR = "c:/Users/user/Music/lab/public/audio_samples/bilingual_switch_tests"
os.makedirs(OUT_DIR, exist_ok=True)

tests = [
    (
        "test_base03_case1_v1.mp3",
        'El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo: "I am ready."'
    ),
    (
        "test_base03_case2_v1.mp3",
        'La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos: "She is ready."'
    ),
    (
        "test_base03_case3_v1.mp3",
        'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos: "We are ready."'
    ),
    (
        "test_base03_case3_english_only.mp3",
        "We are ready."
    ),
    (
        "test_base03_case3_cue.mp3",
        'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos en inglés: "We are ready."'
    ),
]

async def run():
    for fn, txt in tests:
        path = os.path.join(OUT_DIR, fn)
        try:
            c = edge_tts.Communicate(txt, VOICE, rate=RATE)
            await c.save(path)
            print(f"[OK] {fn}: {os.path.getsize(path)} bytes")
        except Exception as e:
            print(f"[FAIL] {fn}: {e}")

if __name__ == "__main__":
    asyncio.run(run())

