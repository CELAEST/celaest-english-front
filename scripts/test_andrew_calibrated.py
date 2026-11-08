import asyncio
import re
import edge_tts
import edge_tts.communicate

orig_esc = edge_tts.communicate.escape
def custom_esc(t):
    parts = re.split(r'(<break[^>]+/>)', t)
    return ''.join(p if p.startswith('<break') else orig_esc(p) for p in parts)

edge_tts.communicate.escape = custom_esc

async def main():
    text_ssml = """¡Bienvenido a tu clase! <break time="450ms"/> Hoy vamos a desbloquear una base fundamental para tu fluidez: <break time="300ms"/> El Orden Mágico: Quién + Acción. <break time="450ms"/> En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta: <break time="350ms"/> el verbo nunca va solo: siempre nombra primero quién realiza la acción. <break time="500ms"/> Fíjate bien: <break time="350ms"/> I work every day. <break time="400ms"/> Y si añadimos el ritmo: <break time="300ms"/> I learn English step by step."""
    
    comm = edge_tts.Communicate(text_ssml, 'en-US-AndrewMultilingualNeural', rate='-4%', pitch='+0Hz')
    out_file = 'C:/Users/user/Music/lab/public/audio_samples/test_andrew_ssml_breaks.mp3'
    await comm.save(out_file)
    print("SUCCESS: Generated test_andrew_ssml_breaks.mp3 with exact SSML breaks!")

if __name__ == '__main__':
    asyncio.run(main())

