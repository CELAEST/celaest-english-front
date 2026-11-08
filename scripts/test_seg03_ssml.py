import asyncio
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"

# Test 1: SSML with embedded en-US tags
ssml_text = '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-ES">
<voice name="en-US-AndrewMultilingualNeural">
Fíjate bien en la alerta en rojo de tu pizarra...
En español decimos tengo 25 años con el verbo tener...
pero en inglés nunca uses el verbo <lang xml:lang="en-US">have</lang> para la edad ni para el hambre...
Por eso tachamos <lang xml:lang="en-US">I have 25 years</lang>,
y decimos... <lang xml:lang="en-US">I am 25 years old</lang>...
Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi.
</voice>
</speak>'''

async def main():
    try:
        comm = edge_tts.Communicate(ssml_text, VOICE, rate="-4%")
        await comm.save("test_seg03_ssml.mp3")
        print("[OK] test_seg03_ssml.mp3 generated successfully")
    except Exception as e:
        print("[ERROR]", e)

if __name__ == "__main__":
    asyncio.run(main())

