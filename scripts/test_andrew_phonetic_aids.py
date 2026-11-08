import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

CANDIDATES = [
    ("test_as_is.mp3", "El reto de esta base es el verbo to be sin enredos..."),
    ("test_capitalized.mp3", "El reto de esta base es el verbo To Be sin enredos..."),
    ("test_phonetic_tu_bi.mp3", "El reto de esta base es el verbo... tu bi... sin enredos..."),
    ("test_phonetic_tu_bi_natural.mp3", "El reto de esta base es el verbo tu bi sin enredos..."),
    ("test_quotes.mp3", 'El reto de esta base es el verbo "To Be" sin enredos...'),
    ("test_pause_english.mp3", "El reto de esta base es el verbo... To Be... sin enredos..."),
    ("test_phonetic_tu_bii.mp3", "El reto de esta base es el famoso verbo tu bi... ser o estar..."),
]

async def main():
    print("Testing phonetic aids for Andrew Multilingual...")
    for filename, text in CANDIDATES:
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(filename)
        print(f"Saved {filename}: {os.path.getsize(filename)} bytes | Text: {text}")

if __name__ == "__main__":
    asyncio.run(main())

