import os
import sys
import time
import io
import urllib.request
import json
import soundfile as sf
import numpy as np

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

API_KEY = "sk-fish-MVhLDg05iZezNYrENt9TXtqjrIPHjiQdMW5nkh94aRY"
FISH_VOICE_ID = "3b15505e8d3e4626ae48646852ca6a88" # Fish Audio Barítono Medido

LAB_FISH_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_01_fish"
os.makedirs(LAB_FISH_DIR, exist_ok=True)

# The 22 pedagogical tracks of Base 01 with natural humanized text
TRACKS = [
    # 1. Introducción General
    (
        "¡Bienvenido a tu clase! Hoy vas a dominar el orden mágico: primero quién, más la acción... Toca Comenzar Clase para escuchar la explicación paso a paso, dominar la regla y pasar a tu práctica guiada.",
        "lesson_intro.mp3",
        "1. Bienvenida a la Clase"
    ),
    # 2. Regla Central
    (
        "El reto de esta base es el orden mágico: primero quién, más la acción... En inglés el verbo nunca va solo: siempre debes nombrar primero a la persona que realiza la acción... Mira cómo se ilumina la fórmula, pieza por pieza: primero quién... luego la acción... y luego el momento:... I work every day.",
        "seg_01.mp3",
        "2. Regla Central: Quién más la acción"
    ),
    # 3. Orientación y Mentalidad
    (
        "¡Bienvenido a tu clase! Hoy vamos a desbloquear una base fundamental para tu fluidez:... el orden mágico: primero quién, más la acción... En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta... Te voy a enseñar el secreto exacto para que lo sientas completamente natural, y nunca más dudes al hablar.",
        "seg_02.mp3",
        "3. Orientación y Mentalidad de Fluidez"
    ),
    # 4. Alerta de la Trampa
    (
        "Fíjate bien en la alerta en rojo de tu pizarra... Siempre abre tu frase nombrando a la persona: ya sea I, you, we, o they... Por eso tachamos work every day, y decimos:... I work every day... Tu ancla mental para no dudar jamás: en inglés el verbo nunca va solo... siempre nombra primero quién realiza la acción.",
        "seg_03.mp3",
        "4. Alerta de la Trampa del Español"
    ),
    # 5. Discriminación de Oído: Error
    (
        "Work every day.",
        "trap_wrong.mp3",
        "5. Discriminación: Error 'Work every day'"
    ),
    # 6. Discriminación de Oído: Modelo
    (
        "I work every day.",
        "trap_sample.mp3",
        "6. Discriminación: Modelo 'I work every day'"
    ),
    # 7. Feedback de Error en Trampa
    (
        "¡Mucho ojo! Esa es justo la trampa del español... Recuerda siempre abrir tu frase nombrando a la persona: ya sea I, you, we, o they... Toca la otra opción en tu pantalla.",
        "trap_error.mp3",
        "7. Feedback: Trampa Cazada"
    ),
    # 8. Feedback de Éxito en Trampa
    (
        "¡Exacto! Cazaste la trampa a la perfección... Escucha ahora con atención cómo suena en ejemplos reales.",
        "trap_success.mp3",
        "8. Feedback: Acierto en Trampa"
    ),
    # 9. Ejemplo 1
    (
        "I learn English step by step.",
        "seg_04.mp3",
        "9. Ejemplo 1: 'I learn English step by step'"
    ),
    # 10. Truco Fonético de Unión
    (
        "Escucha con atención cómo se unen las palabras al decir:... I learn English step by step... El secreto de pronunciación es sentir la unión:... ai lérn ínglish, step bai step.",
        "seg_05.mp3",
        "10. Truco Fonético y Unión de Palabras"
    ),
    # 11. Ejemplo 2
    (
        "I work with my team every morning.",
        "seg_06.mp3",
        "11. Ejemplo 2: 'I work with my team...'"
    ),
    # 12. Ejemplo 3
    (
        "I work every morning.",
        "seg_06_alt.mp3",
        "12. Ejemplo 3: 'I work every morning'"
    ),
    # 13. Pase al Ensamblaje Motriz
    (
        "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!",
        "seg_07.mp3",
        "13. Pase al Ensamblaje Motriz"
    ),
    # 14. Fase 2 (BUILD): Apertura de Fichas
    (
        "Ahora es tu turno de construir... Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz... ¡Adelante, tú puedes!",
        "build_intro.mp3",
        "14. Build: Apertura de Fichas"
    ),
    # 15. Fase 2: Corrección de Fichas
    (
        "Empieza siempre con quién:... I... luego la acción:... learn... y al final:... English today.",
        "challenge_error.mp3",
        "15. Build: Corrección de Fichas"
    ),
    # 16. Fase 2: Éxito de Fichas
    (
        "¡Excelente trabajo! Lo armaste en orden natural:... I learn English today... Ahora vamos a certificar tu propia voz.",
        "challenge_success.mp3",
        "16. Build: Éxito de Ensamblaje"
    ),
    # 17. Fase 3 (SPEAK): Instrucción de Micrófono
    (
        "Escucha con atención cómo lo pronuncio yo:... I learn English today... Ahora activa tu micrófono y dilo tú para certificar tu avance.",
        "voice_instruction.mp3",
        "17. Speak: Instrucción de Micrófono"
    ),
    # 18. Fase 3: Modelo para Micrófono
    (
        "I learn English today.",
        "voice_sample.mp3",
        "18. Speak: Modelo para Micrófono"
    ),
    # 19. Fase 3: Reintento Pedagógico
    (
        "¡Casi lo tienes! Escucha el modelo una vez más con atención, y dilo con calma para certificar tu avance.",
        "voice_retry.mp3",
        "19. Speak: Reintento Pedagógico"
    ),
    # 20. Fase 3: No Escuchado
    (
        "No logré escucharte con claridad... Repite conmigo:... I learn English today... Toca el micrófono para intentarlo.",
        "voice_not_heard.mp3",
        "20. Speak: No Escuchado"
    ),
    # 21. Fase 3: Permiso de Micrófono
    (
        "No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.",
        "mic_error.mp3",
        "21. Speak: Alerta de Permiso de Micrófono"
    ),
    # 22. Fase 3: Victoria y Certificación de la Base
    (
        "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con una cadencia impecable... Base conquistada con éxito.",
        "voice_victory.mp3",
        "22. Speak: Victoria y Certificación de Base"
    ),
]

def generate_fish_audio(text, filename, label, index, total, max_retries=3):
    dest_path = os.path.join(LAB_FISH_DIR, filename)
    print(f"[{index}/{total}] Fish Audio: {label} -> {filename}...")
    
    url = "https://api.fish.audio/v1/tts"
    payload = {"text": text, "reference_id": FISH_VOICE_ID, "format": "mp3"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"))
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("model", "s2.1-pro-free")
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            with open(dest_path, "wb") as f:
                f.write(data)
            print(f"  ✓ OK ({len(data)} bytes)")
            time.sleep(0.5)
            return data
        except Exception as e:
            print(f"  [Intento {attempt+1}] Error: {e}")
            time.sleep(2)
    print(f"  ✗ Falló tras {max_retries} intentos: {filename}")
    return None

def main():
    print(f"--- Generando 22 tracks con Fish Audio S2.1 Pro (Barítono Medido) ---")
    total = len(TRACKS)
    audio_segments = []
    
    for i, (text, filename, label) in enumerate(TRACKS, 1):
        raw_bytes = generate_fish_audio(text, filename, label, i, total)
        if raw_bytes:
            # Also decode audio for continuous masterclass concatenation
            try:
                data, sr = sf.read(io.BytesIO(raw_bytes))
                if len(data.shape) > 1:
                    data = data.mean(axis=1)
                audio_segments.append((data, sr))
            except Exception as e:
                print(f"  No se pudo decodificar para concatenación: {e}")

    # Build continuous masterclass for Fish Audio
    if audio_segments:
        print("\nConcatenando Masterclass Completa Continua de Fish Audio...")
        target_sr = audio_segments[0][1]
        pause_samples = int(0.7 * target_sr) # 700ms pause between pedagogical sections
        pause = np.zeros(pause_samples, dtype=np.float32)
        
        full_audio = []
        for i, (seg, sr) in enumerate(audio_segments):
            if sr != target_sr:
                num = int(len(seg) * target_sr / sr)
                from scipy import signal
                seg = signal.resample(seg, num)
            full_audio.append(seg.astype(np.float32))
            if i < len(audio_segments) - 1:
                full_audio.append(pause)
                
        concatenated = np.concatenate(full_audio)
        out_master = "C:/Users/user/Music/lab/public/audio_samples/base_01_fish_masterclass.mp3"
        sf.write(out_master, concatenated, target_sr)
        print(f"✓ Masterclass Continua Fish Audio guardada en: {out_master} ({len(concatenated)/target_sr:.1f}s)")

if __name__ == "__main__":
    main()
