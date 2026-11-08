import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

TESTS = [
    # 1. To Be variations
    ("t1_as_is.mp3", "Hoy vas a dominar el verbo To Be sin enredos."),
    ("t1_phonetic_tubi.mp3", "Hoy vas a dominar el verbo tu bi sin enredos."),
    ("t1_phonetic_pause.mp3", "Hoy vas a dominar el verbo... tu bi... sin enredos."),
    ("t1_quotes.mp3", 'Hoy vas a dominar el verbo "To Be" sin enredos.'),
    ("t1_el_to_be.mp3", "Hoy vas a dominar el famoso... To Be... sin enredos."),
    
    # 2. "es is" vs aids
    ("t2_es_is_raw.mp3", "Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es is..."),
    ("t2_es_is_pause.mp3", "Cuando hablas de una sola persona ajena como él o ella, su pareja fija siempre es... is..."),
    ("t2_es_is_palabra.mp3", "Cuando hablas de una sola persona ajena como él o ella, su pareja fija es la palabra... is..."),
    ("t2_es_is_ejemplo.mp3", "Cuando hablas de una sola persona ajena como él o ella, su pareja fija es:... is... diciendo por ejemplo: he is... o she is..."),

    # 3. "con am" vs aids
    ("t3_con_am_raw.mp3", "Contigo mismo la pareja exclusiva es am."),
    ("t3_con_am_pause.mp3", "Contigo mismo la pareja exclusiva es... am... diciendo: I am."),
    
    # 4. "con are" vs aids
    ("t4_con_are_raw.mp3", "Y con los grupos la pareja fija es are."),
    ("t4_con_are_pause.mp3", "Y con los grupos la pareja fija es... are... diciendo: we are.")
]

OUT_DIR = "c:/Users/user/Music/lab/public/audio_samples/phonetic_tests"
os.makedirs(OUT_DIR, exist_ok=True)

async def main():
    print(f"Generating {len(TESTS)} phonetic aid audio tests in {OUT_DIR}...")
    for filename, text in TESTS:
        path = os.path.join(OUT_DIR, filename)
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(path)
        print(f" -> Generated {filename} ({os.path.getsize(path)} bytes)")
    print("All generated!")

if __name__ == "__main__":
    asyncio.run(main())

