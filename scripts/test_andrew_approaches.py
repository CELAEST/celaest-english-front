import asyncio
import edge_tts
import soundfile as sf
import numpy as np

# Test 1: Punctuation-based pacing directly inside Edge TTS with rate=-4%
async def test_punctuation():
    text = "¡Bienvenido a tu clase! ... Hoy vamos a desbloquear una base fundamental para tu fluidez: El Orden Mágico — Quién más Acción. ... En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta: el verbo nunca va solo: siempre nombra primero quién realiza la acción. ... Fíjate bien: I work every day. ... Y ahora el siguiente paso: I learn English step by step."
    comm = edge_tts.Communicate(text, 'en-US-AndrewMultilingualNeural', rate='-4%', pitch='+0Hz')
    out = 'C:/Users/user/Music/lab/public/audio_samples/test_andrew_calibrated_punctuation.mp3'
    await comm.save(out)
    print("Saved test_andrew_calibrated_punctuation.mp3")

# Test 2: Audio-engine precision stitching with exact 400ms organic breaths
async def test_audio_stitching():
    units = [
        "¡Bienvenido a tu clase!",
        "Hoy vamos a desbloquear una base fundamental para tu fluidez: El Orden Mágico: Quién más Acción.",
        "En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta.",
        "Te voy a enseñar el secreto exacto para que lo sientas natural y nunca más dudes al hablar.",
        "Fíjate bien en el modelo:",
        "I work every day.",
        "Y ahora el siguiente paso:",
        "I learn English step by step."
    ]
    
    parts = []
    sr = 24000
    for i, u in enumerate(units):
        comm = edge_tts.Communicate(u, 'en-US-AndrewMultilingualNeural', rate='-4%', pitch='+0Hz')
        temp_file = f'C:/Users/user/Music/lab/public/audio_samples/_temp_u_{i}.mp3'
        await comm.save(temp_file)
        data, file_sr = sf.read(temp_file)
        if len(data.shape) > 1:
            data = data.mean(axis=1)
            
        # Half cosine fade at boundaries (12ms)
        fade_len = int(file_sr * 0.012)
        if len(data) > fade_len * 2:
            t = np.linspace(0, np.pi/2, fade_len)
            data[:fade_len] *= np.sin(t)
            data[-fade_len:] *= np.cos(t)
            
        parts.append(data)
        
        # Add clean pedagogical pause (380ms)
        pause = np.zeros(int(file_sr * 0.38), dtype=np.float32)
        parts.append(pause)
        
    final_wave = np.concatenate(parts[:-1]) # omit trailing pause
    out_stitch = 'C:/Users/user/Music/lab/public/audio_samples/test_andrew_calibrated_stitched.mp3'
    sf.write(out_stitch, final_wave, 24000)
    print("Saved test_andrew_calibrated_stitched.mp3")

async def main():
    await test_punctuation()
    await test_audio_stitching()

if __name__ == '__main__':
    asyncio.run(main())

