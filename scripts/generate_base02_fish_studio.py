import os
import time
import io
import urllib.request
import json
import soundfile as sf
import numpy as np
from scipy import signal
from kokoro_onnx import Kokoro

API_KEY = "sk-fish-MVhLDg05iZezNYrENt9TXtqjrIPHjiQdMW5nkh94aRY"
FISH_VOICE_ID = "3b15505e8d3e4626ae48646852ca6a88" # Fish Audio Barítono Medido (Elegida por el usuario)
TARGET_SR = 24000

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_02"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_02"
os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

# Load Kokoro for native English
print("Loading Kokoro for English model sentences...")
kokoro = Kokoro(
    "C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/kokoro-v1.0.onnx",
    "C:/Users/user/Music/celaest-english-back/scripts/models/kokoro/voices-v1.0.bin"
)
v_liam = kokoro.get_voice_style("am_liam")

def resample_if_needed(audio, src_sr, target_sr=TARGET_SR):
    if src_sr == target_sr:
        return audio
    num_samples = int(len(audio) * target_sr / src_sr)
    return signal.resample(audio, num_samples)

def gen_fish_es(text, max_retries=3):
    url = "https://api.fish.audio/v1/tts"
    payload = {"text": text, "reference_id": FISH_VOICE_ID, "format": "mp3"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"))
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("model", "s2.1-pro-free")
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req) as resp:
                raw_bytes = resp.read()
            data, sr = sf.read(io.BytesIO(raw_bytes))
            if len(data.shape) > 1:
                data = data.mean(axis=1)
            data = resample_if_needed(data, sr, TARGET_SR)
            return data
        except Exception as e:
            print(f"  [Attempt {attempt+1}] Error from Fish Audio: {e}")
            time.sleep(2)
    raise RuntimeError(f"Failed to generate Spanish text after {max_retries} attempts: {text[:40]}...")

def gen_kokoro_en(text, spd=0.92):
    samples, sr = kokoro.create(text, voice=v_liam, speed=spd, lang="en-us")
    return resample_if_needed(samples, sr, TARGET_SR)

def apply_cosine_fades(audio, fade_ms=16):
    fade_len = int(TARGET_SR * (fade_ms / 1000.0))
    if len(audio) < fade_len * 2:
        return audio
    t = np.linspace(0, np.pi/2, fade_len)
    fade_in = np.sin(t)
    fade_out = np.cos(t)
    audio = audio.copy()
    audio[:fade_len] *= fade_in
    audio[-fade_len:] *= fade_out
    return audio

def make_organic_pause(ms):
    n = int(TARGET_SR * (ms / 1000.0))
    amb = np.random.normal(0, 0.00003, n).astype(np.float32)
    if n > 200:
        edge = min(120, n // 3)
        t = np.linspace(0, np.pi/2, edge)
        amb[:edge] *= np.sin(t)
        amb[-edge:] *= np.cos(t)
    return amb

def build_segment(units, filename):
    parts = []
    for text, lang, pause_ms in units:
        if lang == "es":
            s = gen_fish_es(text)
        else:
            s = gen_kokoro_en(text)
        
        # Peak normalize each unit to 0.85
        peak = np.max(np.abs(s))
        if peak > 0:
            s = s * (0.85 / peak)
        
        s = apply_cosine_fades(s, fade_ms=16)
        parts.append(s)
        if pause_ms > 0:
            parts.append(make_organic_pause(pause_ms))
        time.sleep(0.4) # Fair use throttle
        
    final_wave = np.concatenate(parts)
    
    # Save to front and lab
    p1 = os.path.join(FRONT_DIR, filename)
    p2 = os.path.join(LAB_DIR, filename)
    sf.write(p1, final_wave, TARGET_SR)
    sf.write(p2, final_wave, TARGET_SR)
    dur = round(len(final_wave) / TARGET_SR, 2)
    print(f"[OK] {filename} ({dur}s) -> saved to front & lab")

# Definition of the 20 audio tracks for Base 02
tracks = [
    (
        [
            ("Bienvenido a tu clase.", "es", 300),
            ("Hoy vas a dominar El It Fantasma: Frases sin Persona Humana.", "es", 380),
            ("Toca Comenzar Clase para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.", "es", 0),
        ],
        "lesson_intro.mp3"
    ),
    (
        [
            ("Hoy veremos El It Fantasma: Frases sin Persona Humana paso a paso en dos usos claros.", "es", 380),
            ("Uso uno, Clima y Hora:", "es", 250),
            ("Para el clima o la hora nunca empieces con Is: abre siempre con el sujeto neutro It.", "es", 350),
            ("It is sunny outside.", "en-us", 420),
            ("Ahora pasemos al uso dos, Opiniones Neutras:", "es", 280),
            ("Para decir Es importante o Es fácil, coloca It is al inicio para sostener la frase.", "es", 350),
            ("It is important today.", "en-us", 0),
        ],
        "seg_01.mp3"
    ),
    (
        [
            ("¡Bienvenido a tu clase!", "es", 320),
            ("Hoy vamos a desbloquear una base fundamental para tu fluidez: El It Fantasma.", "es", 380),
            ("En español solemos omitir el sujeto, pero en inglés el cerebro opera con una lógica distinta.", "es", 350),
            ("Te voy a enseñar el secreto exacto para que lo sientas natural y nunca más dudes al hablar.", "es", 0),
        ],
        "seg_02.mp3"
    ),
    (
        [
            ("Fíjate bien en la alerta en rojo de tu pizarra.", "es", 350),
            ("En inglés nunca abras una oración con Is sin su sujeto It.", "es", 380),
            ("Por eso tachamos Is cold today y decimos:", "es", 300),
            ("It is cold today.", "en-us", 380),
            ("Tu ancla mental: Sujeto impersonal It obligatorio.", "es", 0),
        ],
        "seg_03.mp3"
    ),
    (
        [
            ("¡Probemos tu oído ahora mismo!", "es", 320),
            ("Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.", "es", 0),
        ],
        "seg_04.mp3"
    ),
    (
        [
            ("Is cold today.", "en-us", 0),
        ],
        "trap_wrong.mp3"
    ),
    (
        [
            ("It is cold today.", "en-us", 0),
        ],
        "trap_sample.mp3"
    ),
    (
        [
            ("¡Ojo! Esa es la trampa del español: En inglés nunca abras una oración con Is sin su sujeto It. Toca la otra opción.", "es", 0),
        ],
        "trap_error.mp3"
    ),
    (
        [
            ("¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.", "es", 0),
        ],
        "trap_success.mp3"
    ),
    (
        [
            ("It is sunny and warm today.", "en-us", 0),
        ],
        "seg_05.mp3"
    ),
    (
        [
            ("Escucha con atención cómo se unen las palabras al decir:", "es", 300),
            ("It is sunny and warm today.", "en-us", 380),
            ("El truco de pronunciación es it is sáni and uórm tudéi.", "es", 380),
            ("Si tienes alguna duda o quieres preguntarme algo antes de armar la oración, toca Preguntar en cualquier momento.", "es", 0),
        ],
        "seg_06.mp3"
    ),
    (
        [
            ("Ahora es tu turno de construir.", "es", 300),
            ("Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz.", "es", 320),
            ("¡Adelante, tú puedes!", "es", 0),
        ],
        "seg_07.mp3"
    ),
    (
        [
            ("Coloca siempre It al inicio antes de is cold today.", "es", 0),
        ],
        "challenge_error.mp3"
    ),
    (
        [
            ("¡Excelente! Lo armaste en orden natural:", "es", 250),
            ("It is cold today.", "en-us", 320),
            ("Ahora vamos a certificar tu voz.", "es", 0),
        ],
        "challenge_success.mp3"
    ),
    (
        [
            ("Escucha con atención cómo lo pronuncio yo:", "es", 250),
            ("It is cold today.", "en-us", 350),
            ("Ahora activa tu micrófono y dilo tú para certificar tu avance.", "es", 0),
        ],
        "voice_instruction.mp3"
    ),
    (
        [
            ("It is cold today.", "en-us", 0),
        ],
        "voice_sample.mp3"
    ),
    (
        [
            ("Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.", "es", 0),
        ],
        "voice_retry.mp3"
    ),
    (
        [
            ("No te escuché con claridad. Di conmigo:", "es", 250),
            ("It is cold today.", "en-us", 300),
            ("Toca el micrófono para intentarlo.", "es", 0),
        ],
        "voice_not_heard.mp3"
    ),
    (
        [
            ("No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.", "es", 0),
        ],
        "mic_error.mp3"
    ),
    (
        [
            ("¡Excelente pronunciación!", "es", 250),
            ("Dijiste cada palabra en orden natural y con cadencia limpia.", "es", 300),
            ("Base conquistada con éxito.", "es", 0),
        ],
        "voice_victory.mp3"
    ),
]

print("=== INICIANDO PRODUCCION SOTA BASE 02 (FISH AUDIO + NATIVO US) ===")
print(f"Total audios a generar: {len(tracks)}")
for i, (units, fname) in enumerate(tracks):
    print(f"\n[{i+1}/{len(tracks)}] Generando {fname}...")
    build_segment(units, fname)

print("\n=== BASE 02 GENERADA AL 100% CON CALIDAD FISH AUDIO + KOKORO NATIVO! ===")
