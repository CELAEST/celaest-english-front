import asyncio
import os
import shutil
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"
DEST_FRONT = "public/audio/pathway/a1/base_03"
DEST_LAB = "c:/Users/user/Music/lab/public/audio_samples/base_03"

os.makedirs(DEST_FRONT, exist_ok=True)
os.makedirs(DEST_LAB, exist_ok=True)

TRACKS = [
    {
        "file": "seg_01.mp3",
        "text": "El reto de esta base es el verbo To Be sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo:... I am ready."
    },
    {
        "file": "seg_01_case2.mp3",
        "text": "La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos:... she is ready."
    },
    {
        "file": "seg_01_case3.mp3",
        "text": "Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos:... we are ready."
    }
]

async def main():
    print("Synthesizing Base 03 multi-case formula tracks...")
    for t in TRACKS:
        out_path = os.path.join(DEST_FRONT, t["file"])
        comm = edge_tts.Communicate(t["text"], VOICE, rate=RATE)
        await comm.save(out_path)
        shutil.copy2(out_path, os.path.join(DEST_LAB, t["file"]))
        print(f" -> [OK] {t['file']} ({os.path.getsize(out_path)} bytes)")
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())

