import asyncio
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

TEST_PAIRS = [
    (
        "test_c1_estar.mp3",
        "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: usas el verbo estar diciendo:"
    ),
    (
        "test_c2_ser.mp3",
        "Y con la edad pasa exactamente lo mismo: no tienes años, sino que usas el verbo ser... Por ejemplo, para él decimos:"
    ),
]

async def main():
    for fn, txt in TEST_PAIRS:
        comm = edge_tts.Communicate(txt, VOICE, rate=RATE)
        await comm.save(fn)
        print(f"[OK] {fn}")

if __name__ == "__main__":
    asyncio.run(main())

