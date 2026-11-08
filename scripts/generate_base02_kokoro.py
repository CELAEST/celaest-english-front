import os
import soundfile as sf
import numpy as np
from kokoro_onnx import Kokoro

# Setup Kokoro Model
kokoro = Kokoro(
    'C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/kokoro-v1.0.onnx',
    'C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/voices-v1.0.bin'
)

# Chosen Blend: Alex + Eric (Conversacional) - 50% Alex + 50% Eric
v_alex = kokoro.get_voice_style('em_alex')
v_eric = kokoro.get_voice_style('am_eric')
v_blend = v_alex * 0.50 + v_eric * 0.50

OUTPUT_DIR = 'C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_02'
os.makedirs(OUTPUT_DIR, exist_ok=True)

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

# Function to synthesize mixed bilingual text with organic breath units
def synthesize_bilingual(units, out_filename):
    parts = []
    for text, lang, spd, pause_ms in units:
        s, _ = kokoro.create(text, voice=v_blend, speed=spd, lang=lang)
        s = apply_cosine_fades(s, fade_ms=16)
        parts.append(s)
        if pause_ms > 0:
            parts.append(make_organic_pause(pause_ms))
    
    final_wave = np.concatenate(parts)
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    sf.write(out_path, final_wave, 24000)
    dur = round(len(final_wave) / 24000, 2)
    print(f'Generated {out_filename} ({dur}s)')

# Master Segments for Base 02 (Pedagogic Optimum Calibration: es=0.95x, en=0.92x)
segments = [
    # 1. Lesson Intro (Card before starting class)
    (
        [
            ('Bienvenido a tu clase.', 'es', 0.95, 300),
            ('Hoy vas a dominar El It Fantasma: Frases sin Persona Humana.', 'es', 0.95, 380),
            ('Toca Comenzar Clase para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.', 'es', 0.96, 0),
        ],
        'lesson_intro.mp3'
    ),
    # 2. seg_01: Formula Overview (Use 1 & Use 2)
    (
        [
            ('Hoy veremos El It Fantasma: Frases sin Persona Humana paso a paso en dos usos claros.', 'es', 0.95, 380),
            ('Uso uno, Clima y Hora:', 'es', 0.95, 250),
            ('Para el clima o la hora nunca empieces con Is:', 'es', 0.95, 280),
            ('abre siempre con el sujeto neutro It.', 'es', 0.95, 350),
            ('Ejemplo: It is sunny outside.', 'en-us', 0.92, 420),
            ('Ahora pasemos al uso dos, Opiniones Neutras:', 'es', 0.95, 280),
            ('Para decir Es importante o Es fácil, coloca It is al inicio para sostener la frase.', 'es', 0.95, 350),
            ('Ejemplo: It is important today.', 'en-us', 0.92, 0),
        ],
        'seg_01.mp3'
    ),
    # 3. seg_02: Welcome / Intro beat
    (
        [
            ('¡Bienvenido a tu clase!', 'es', 0.95, 320),
            ('Hoy vamos a desbloquear una base fundamental para tu fluidez: El It Fantasma.', 'es', 0.95, 380),
            ('En español solemos omitir el sujeto, pero en inglés el cerebro opera con una lógica distinta.', 'es', 0.95, 350),
            ('Te voy a enseñar el secreto exacto para que lo sientas natural y nunca más dudes al hablar.', 'es', 0.95, 0),
        ],
        'seg_02.mp3'
    ),
    # 4. seg_03: Trap explanation (Alert)
    (
        [
            ('Fíjate bien en la alerta en rojo de tu pizarra.', 'es', 0.95, 350),
            ('En inglés nunca abras una oración con Is sin su sujeto It.', 'es', 0.95, 380),
            ('Por eso, nunca decimos: Is cold today, sino:', 'es', 0.95, 300),
            ('It is cold today.', 'en-us', 0.92, 380),
            ('Tu ancla mental: Sujeto impersonal It obligatorio.', 'es', 0.95, 0),
        ],
        'seg_03.mp3'
    ),
    # 5. seg_04: Trap check question
    (
        [
            ('¡Probemos tu oído ahora mismo!', 'es', 0.95, 320),
            ('Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.', 'es', 0.95, 0),
        ],
        'seg_04.mp3'
    ),
    # 6. seg_05: First Example
    (
        [
            ('It is sunny and warm today.', 'en-us', 0.92, 0),
        ],
        'seg_05.mp3'
    ),
    # 7. seg_06: Phonetics hint and transition
    (
        [
            ('Escucha con atención cómo se unen las palabras al decir: It is sunny and warm today.', 'es', 0.95, 320),
            ('El truco de pronunciación es: it is sáni and uórm tudéi.', 'es', 0.95, 380),
            ('Si tienes alguna duda o quieres preguntarme algo antes de armar la oración, toca Preguntar en cualquier momento.', 'es', 0.96, 0),
        ],
        'seg_06.mp3'
    ),
    # 8. seg_07: Build intro
    (
        [
            ('Ahora es tu turno de construir.', 'es', 0.95, 300),
            ('Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz.', 'es', 0.95, 320),
            ('¡Adelante, tú puedes!', 'es', 0.96, 0),
        ],
        'seg_07.mp3'
    ),
    # 9. challenge_error
    (
        [
            ('Coloca siempre It al inicio antes de is cold today.', 'es', 0.95, 0),
        ],
        'challenge_error.mp3'
    ),
    # 10. challenge_success
    (
        [
            ('¡Excelente! Lo armaste en orden natural:', 'es', 0.95, 250),
            ('It is cold today.', 'en-us', 0.92, 320),
            ('Ahora vamos a certificar tu voz.', 'es', 0.95, 0),
        ],
        'challenge_success.mp3'
    ),
    # 11. voice_instruction
    (
        [
            ('Escucha con atención cómo lo pronuncio yo:', 'es', 0.95, 250),
            ('It is cold today.', 'en-us', 0.92, 350),
            ('Ahora activa tu micrófono y dilo tú para certificar tu avance.', 'es', 0.95, 0),
        ],
        'voice_instruction.mp3'
    ),
    # 12. voice_victory
    (
        [
            ('¡Excelente pronunciación!', 'es', 0.95, 250),
            ('Dijiste cada palabra en orden natural y con cadencia limpia.', 'es', 0.95, 300),
            ('Base conquistada con éxito.', 'es', 0.95, 0),
        ],
        'voice_victory.mp3'
    ),
]

print('=== STARTING GENERATION FOR BASE 02 (ALEX + ERIC · PEDAGOGIC OPTIMUM) ===')
for units, filename in segments:
    synthesize_bilingual(units, filename)
print('=== BASE 02 GENERATION COMPLETE! ===')

