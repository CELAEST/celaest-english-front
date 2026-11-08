import asyncio
import os
import shutil
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_03"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_03"

TEXT_SEG_03 = (
    "Fíjate bien en la alerta en rojo de tu pizarra... "
    "Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es... is... "
    "diciendo por ejemplo... he is... o she is... "
    "Por eso tachamos she are ready, y decimos... She is ready... "
    "Tu ancla mental para no dudar jamás: una sola persona siempre camina con... is."
)

async def main():
    out_front = os.path.join(FRONT_DIR, "seg_03.mp3")
    out_lab = os.path.join(LAB_DIR, "seg_03.mp3")
    
    print("Synthesizing seg_03.mp3 for Base 03...")
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(TEXT_SEG_03, VOICE, rate=RATE)
            await comm.save(out_front)
            shutil.copy2(out_front, out_lab)
            size = os.path.getsize(out_front)
            print(f" -> [OK] seg_03.mp3: {size} bytes")
            if size > 1000:
                break
        except Exception as e:
            print(f" -> [RETRY {attempt+1}] {e}")
            await asyncio.sleep(2.0)

if __name__ == "__main__":
    asyncio.run(main())

