import asyncio
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"

TESTS = [
    ("test_have_plain.mp3", "En inglés nunca uses el verbo have para la edad."),
    ("test_have_phonetic_jav.mp3", "En inglés nunca uses el verbo jav para la edad."),
    ("test_have_phonetic_jaav.mp3", "En inglés nunca uses el verbo jaav para la edad."),
    ("test_have_quotes.mp3", 'En inglés nunca uses el verbo "have" para la edad.'),
    ("test_ssml_lang.mp3", '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-ES"><voice name="en-US-AndrewMultilingualNeural">En inglés nunca uses el verbo <lang xml:lang="en-US">have</lang> para la edad.</voice></speak>'),
]

async def run():
    for name, text in TESTS:
        try:
            comm = edge_tts.Communicate(text, VOICE, rate="-4%")
            await comm.save(name)
            print(f"[OK] {name}")
        except Exception as e:
            print(f"[ERROR] {name}: {e}")

if __name__ == "__main__":
    asyncio.run(run())

