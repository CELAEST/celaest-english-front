import soundfile as sf
import numpy as np
from kokoro_onnx import Kokoro

kokoro = Kokoro(
    'C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/kokoro-v1.0.onnx',
    'C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/voices-v1.0.bin'
)

v_alex = kokoro.get_voice_style('em_alex')
blends = {
    'liam': (v_alex * 0.52 + kokoro.get_voice_style('am_liam') * 0.48, 'Alex + Liam (Moderno)'),
    'adam': (v_alex * 0.50 + kokoro.get_voice_style('am_adam') * 0.50, 'Alex + Adam (Barítono)'),
    'eric': (v_alex * 0.50 + kokoro.get_voice_style('am_eric') * 0.50, 'Alex + Eric (Conversacional)')
}

def apply_cosine_fades(audio, fade_ms=18, sr=24000):
    fade_len = int(sr * (fade_ms / 1000.0))
    if len(audio) < fade_len * 2:
        return audio
    t = np.linspace(0, np.pi/2, fade_len)
    fade_in = np.sin(t)
    fade_out = np.cos(t)
    audio = audio.copy()
    audio[:fade_len] *= fade_in
    audio[-fade_len:] *= fade_out
    return audio

def make_organic_pause(ms, sr=24000):
    n = int(sr * (ms / 1000.0))
    amb = np.random.normal(0, 0.000025, n).astype(np.float32)
    if n > 200:
        edge = min(120, n // 3)
        t = np.linspace(0, np.pi/2, edge)
        amb[:edge] *= np.sin(t)
        amb[-edge:] *= np.cos(t)
    return amb

calibrations = [
    {
        'id': 'mentor_pedagogic',
        'name': 'Cadencia de Mentor Pedagógico',
        'speeds': [0.95, 0.95, 0.94, 0.92, 0.96],
        'pauses': [360, 420, 300, 480, 100]
    },
    {
        'id': 'conversational_fluid',
        'name': 'Conversacional Fluido y Dinámico',
        'speeds': [0.98, 0.98, 0.97, 0.96, 0.98],
        'pauses': [240, 280, 220, 320, 100]
    },
    {
        'id': 'deep_reflexive',
        'name': 'Estudio Ejecutivo Reflexivo',
        'speeds': [0.93, 0.93, 0.92, 0.90, 0.94],
        'pauses': [440, 520, 380, 560, 100]
    }
]

units_text = [
    ('Hola, bienvenido a tu clase en CELAEST.', 'es'),
    ('Hoy vamos a dominar el sujeto obligatorio.', 'es'),
    ('En español decimos trabajo hoy, pero en inglés decimos:', 'es'),
    ('I work every day, and I learn English step by step.', 'en-us'),
    ('Toca las fichas en la pantalla para empezar.', 'es')
]

for blend_key, (v_style, blend_name) in blends.items():
    for cal in calibrations:
        audio_parts = []
        for i, (text, lang) in enumerate(units_text):
            spd = cal['speeds'][i]
            pause_ms = cal['pauses'][i]
            s, _ = kokoro.create(text, voice=v_style, speed=spd, lang=lang)
            s = apply_cosine_fades(s, fade_ms=16)
            audio_parts.append(s)
            audio_parts.append(make_organic_pause(pause_ms))
        
        final_wave = np.concatenate(audio_parts[:-1])
        cal_id = cal['id']
        out_name = f'kokoro_{blend_key}_{cal_id}.wav'
        out_path = f'c:/Users/user/Music/lab/public/audio_samples/{out_name}'
        sf.write(out_path, final_wave, 24000)
        dur = round(len(final_wave) / 24000, 2)
        print(f'Generated {out_name}: duration={dur}s')

print('ALL 9 CALIBRATED KOKORO SAMPLES GENERATED SUCCESSFULLY!')

