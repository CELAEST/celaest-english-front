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

# Tracks needing phonetic adaptation in Base 03
UPDATED_TRACKS = [
    # 1. lesson_intro.mp3 -> "el verbo tu bi sin enredos"
    {
        "file": "lesson_intro.mp3",
        "text": "¡Bienvenido a tu clase! Hoy vas a dominar el verbo tu bi sin enredos: cómo decir quién eres y cómo estás con sus tres parejas fijas... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada."
    },
    # 2. seg_01.mp3 -> Full overview with "el verbo tu bi sin enredos"
    {
        "file": "seg_01.mp3",
        "text": "El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... dividida en tres parejas fijas según la persona... Mira cómo se ilumina la fórmula, pieza por pieza: conmigo diciendo:... I am ready... con ella diciendo:... she is ready... y con el grupo diciendo:... we are ready."
    },
    # 3. seg_01_case1.mp3 (Case 1 in multi-case) -> "el verbo tu bi"
    {
        "file": "seg_01_case1.mp3",
        "text": "El reto de esta base es el verbo tu bi sin enredos... En inglés una sola palabra sirve para decir ser y estar... La primera pareja fija es contigo mismo, diciendo:... I am ready."
    },
    # 4. seg_01_case2.mp3 (Case 2 in multi-case)
    {
        "file": "seg_01_case2.mp3",
        "text": "La segunda pareja es cuando hablas de una sola persona ajena... con él o con ella siempre decimos:... she is ready."
    },
    # 5. seg_01_case3.mp3 (Case 3 in multi-case)
    {
        "file": "seg_01_case3.mp3",
        "text": "Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos:... we are ready."
    },
    # 6. seg_03.mp3 -> Phonetic breath before "is"
    {
        "file": "seg_03.mp3",
        "text": "Fíjate bien en la alerta en rojo de tu pizarra... Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es:... is... diciendo por ejemplo: he is... o she is... Por eso tachamos she are ready, y decimos:... She is ready... Tu ancla mental para no dudar jamás: una sola persona siempre camina con:... is."
    },
    # 7. trap_error.mp3 -> Phonetic breath before "is"
    {
        "file": "trap_error.mp3",
        "text": "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que para una sola persona ajena como ella, la pareja fija siempre es:... is... diciendo:... She is ready... Toca la otra opción en tu pantalla."
    },
    # 8. trap_success.mp3 -> Phonetic breath before "is"
    {
        "file": "trap_success.mp3",
        "text": "¡Exacto! Cazaste la trampa a la perfección... Una sola persona siempre va con:... is... Escucha ahora con atención cómo suena en ejemplos reales."
    },
    # 9. seg_05.mp3 -> Phonetic breath before "am"
    {
        "file": "seg_05.mp3",
        "text": "Escucha con atención cómo se unen las palabras al decir:... I am ready to start my lesson... El secreto de pronunciación es sentir la unión del sujeto con:... am:... ai am rédi, tu start mai léson."
    }
]

async def generate_single_track(fn, text, max_retries=5):
    out_front = os.path.join(FRONT_DIR, fn)
    out_lab = os.path.join(LAB_DIR, fn)
    
    for attempt in range(max_retries):
        try:
            print(f" -> Generating {fn} (attempt {attempt + 1})...", flush=True)
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await asyncio.wait_for(comm.save(out_front), timeout=12)
            shutil.copy2(out_front, out_lab)
            print(f"    [OK] Saved {fn} ({os.path.getsize(out_front)} bytes)", flush=True)
            return
        except Exception as e:
            print(f"    [WARN] Attempt {attempt + 1} failed: {e}", flush=True)
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2.0)

async def main():
    print("Resynthesizing Base 03 with phonetic aids ('el verbo tu bi', respiratory pauses)...")
    for t in UPDATED_TRACKS:
        await generate_single_track(t["file"], t["text"])
        await asyncio.sleep(0.8) # polite delay for Edge TTS
        
    print("Base 03 phonetic aids resynthesis completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
