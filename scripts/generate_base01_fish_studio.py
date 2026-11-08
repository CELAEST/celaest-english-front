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
FISH_VOICE_ID = "3b15505e8d3e4626ae48646852ca6a88" # Fish Audio Barítono Medido
TARGET_SR = 24000

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_01"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_01"
os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

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

def build_segment(units, filenames):
    parts = []
    for text, lang, pause_ms in units:
        if lang == "es":
            s = gen_fish_es(text)
        else:
            s = gen_kokoro_en(text)
        
        peak = np.max(np.abs(s))
        if peak > 0:
            s = s * (0.85 / peak)
        
        s = apply_cosine_fades(s, fade_ms=16)
        parts.append(s)
        if pause_ms > 0:
            parts.append(make_organic_pause(pause_ms))
        time.sleep(0.4)
        
    final_wave = np.concatenate(parts)
    dur = round(len(final_wave) / TARGET_SR, 2)
    
    if isinstance(filenames, str):
        filenames = [filenames]
        
    for fn in filenames:
        p1 = os.path.join(FRONT_DIR, fn)
        p2 = os.path.join(LAB_DIR, fn)
        sf.write(p1, final_wave, TARGET_SR)
        sf.write(p2, final_wave, TARGET_SR)
        
    print(f"[OK] {filenames[0]} ({dur}s) -> saved to front & lab")

# Definition of the 23 audio tracks for Base 01
tracks = [
    (
        [
            ("El reto de hoy es El Orden Mágico: Quién + Acción.", "es", 280),
            ("Sujeto obligatorio más Verbo.", "es", 320),
            ("Fíjate bien en la diferencia clave en tu pantalla.", "es", 0),
        ],
        "lesson_intro.mp3"
    ),
    (
        [
            ("El reto de esta base es El Orden Mágico: Quién + Acción.", "es", 320),
            ("En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.", "es", 380),
            ("Mira cómo se ilumina la fórmula pieza por pieza: primero quién, luego acción, luego cuándo.", "es", 380),
            ("I work every day.", "en-us", 0),
        ],
        ["seg_01.mp3", "seg_01_desktop.mp3"]
    ),
    (
        [
            ("¡Bienvenido a tu clase!", "es", 300),
            ("Hoy vamos a desbloquear una base fundamental para tu fluidez: El Orden Mágico: Quién + Acción.", "es", 380),
            ("En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta.", "es", 350),
            ("Te voy a enseñar el secreto exacto para que lo sientas natural y nunca más dudes al hablar.", "es", 0),
        ],
        ["seg_02.mp3", "seg_02_desktop.mp3"]
    ),
    (
        [
            ("Fíjate bien en la alerta en rojo de tu pizarra.", "es", 320),
            ("Siempre abre tu frase nombrando a la persona: I, You, We o They.", "es", 350),
            ("Por eso tachamos Work every day y decimos:", "es", 280),
            ("I work every day.", "en-us", 380),
            ("Tu ancla mental: En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.", "es", 0),
        ],
        "seg_03.mp3"
    ),
    (
        [
            ("Work every day.", "en-us", 0),
        ],
        "trap_wrong.mp3"
    ),
    (
        [
            ("I work every day.", "en-us", 0),
        ],
        "trap_sample.mp3"
    ),
    (
        [
            ("¡Ojo! Esa es la trampa del español: Siempre abre tu frase nombrando a la persona: I, You, We o They. Toca la otra opción.", "es", 0),
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
            ("I learn English step by step.", "en-us", 0),
        ],
        "seg_04.mp3"
    ),
    (
        [
            ("Escucha con atención cómo se unen las palabras al decir:", "es", 280),
            ("I learn English step by step.", "en-us", 380),
            ("El truco de pronunciación es ai lérn ínglish step bai step.", "es", 0),
        ],
        "seg_05.mp3"
    ),
    (
        [
            ("I work with my team every morning.", "en-us", 0),
        ],
        "seg_06.mp3"
    ),
    (
        [
            ("I work every morning.", "en-us", 0),
        ],
        "seg_06_alt.mp3"
    ),
    (
        [
            ("Si te surge cualquier duda, toca Preguntar abajo.", "es", 280),
            ("Ahora constrúyela tú: abro las fichas en tu pantalla para activar tu memoria motriz. ¡Adelante!", "es", 0),
        ],
        ["seg_07.mp3", "seg_07_desktop.mp3"]
    ),
    (
        [
            ("Ahora es tu turno de construir.", "es", 280),
            ("Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!", "es", 0),
        ],
        "build_intro.mp3"
    ),
    (
        [
            ("Empieza siempre con quién: I, luego la acción: learn, y al final English today.", "es", 0),
        ],
        "challenge_error.mp3"
    ),
    (
        [
            ("¡Excelente! Lo armaste en orden natural:", "es", 250),
            ("I learn English today.", "en-us", 320),
            ("Ahora vamos a certificar tu voz.", "es", 0),
        ],
        "challenge_success.mp3"
    ),
    (
        [
            ("Escucha con atención cómo lo pronuncio yo:", "es", 250),
            ("I learn English today.", "en-us", 350),
            ("Ahora activa tu micrófono y dilo tú para certificar tu avance.", "es", 0),
        ],
        "voice_instruction.mp3"
    ),
    (
        [
            ("I learn English today.", "en-us", 0),
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
            ("I learn English today.", "en-us", 300),
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
            ("¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito.", "es", 0),
        ],
        ["voice_victory.mp3", "voice_victory_alt.mp3"]
    ),
]

print("=== INICIANDO PRODUCCION SOTA BASE 01 (FISH AUDIO BARITONO + KOKORO NATIVO) ===")
print(f"Total audios a generar: {len(tracks)}")
for i, (units, fnames) in enumerate(tracks):
    fn_label = fnames if isinstance(fnames, str) else fnames[0]
    print(f"\n[{i+1}/{len(tracks)}] Generando {fn_label}...")
    build_segment(units, fnames)

print("\n=== BASE 01 GENERADA AL 100% CON CALIDAD FISH AUDIO + KOKORO NATIVO! ===")

