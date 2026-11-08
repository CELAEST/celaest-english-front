import asyncio
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

TESTS = [
    # Case 1 variations
    ("c1_as_is.mp3", "El reto de esta base es la trampa de tener. En inglés no tienes hambre ni frío: estás en ese estado con am:"),
    ("c1_opt1_diciendo.mp3", "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: describes ese estado diciendo:"),
    ("c1_opt2_palabra_am.mp3", "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: describes ese estado con am... Escucha cómo suena:"),
    ("c1_opt3_con_am_pausa.mp3", "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: estás en ese estado con... am... Por ejemplo:"),
    ("c1_opt4_natural.mp3", "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: tú estás en ese estado... Escucha el modelo:"),

    # Case 2 variations
    ("c2_as_is.mp3", "Y con la edad pasa exactamente lo mismo: no tienes años, eres tus años usando is:"),
    ("c2_opt1_diciendo.mp3", "Y con la edad pasa exactamente lo mismo: en inglés no tienes años, eres tus años... Por ejemplo, para él decimos:"),
    ("c2_opt2_usando_is_pausa.mp3", "Y con la edad pasa exactamente lo mismo: no tienes años, eres tus años usando... is... Escucha el modelo:"),
    ("c2_opt3_palabra_is.mp3", "Y con la edad pasa exactamente lo mismo: no tienes años, eres tus años con la palabra is... Por ejemplo:"),
    ("c2_opt4_natural.mp3", "Y con la edad pasa exactamente lo mismo: en inglés tú no tienes años, eres tus años... Escucha cómo suena:"),
]

async def main():
    for filename, text in TESTS:
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(filename)
        print(f"[OK] {filename}")

if __name__ == "__main__":
    asyncio.run(main())

