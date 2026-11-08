# CELAEST Conversational Speech Sanitizer & Course Architecture Standard

## 1. Root Cause of "Reading Literal Characters" & Robot Voice
- **Punctuation Vocalization**: TTS engines (both cloud neural Edge-TTS and local Windows SAPI fallback) verbalized literal quotes (`«`, `»`, `“`, `”`, `'`), slashes (`/`), colons (`:`), brackets (`[` `]`) and semicolons (`;`) into spoken words (e.g., *"comillas inglesas"*, *"dos puntos"*, *"barra"*).
- **Windows Encoding Desync**: When Go piped UTF-8 JSON over standard input to Python scripts on Windows, Python's `sys.stdin` defaulted to `cp1252` encoding. Accented characters and curly quotes triggered decode crashes, triggering the frontend fallback to the robotic Windows SAPI synthetic voice (`window.speechSynthesis`).

## 2. Implemented Architecture Fixes
- **Conversational Speech Sanitizer (`sanitizeSpeechForVoice`)**:
  - Filter applied to all speech synthesis requests (`SpeechSynthesisService.speak` and `prefetch`).
  - Strips 100% of decorative quotes, brackets, asterisks, and code characters.
  - Transforms em-dashes and semicolons into soft breath pauses (commas).
  - Normalizes slashes and abbreviations (`&` -> `y`, `/` -> `o`).
- **Python Stdin/Stdout UTF-8 Shield**:
  - `scripts/edge_synth.py` and `scripts/piper_synth.py` explicitly reconfigure streams to UTF-8 (`sys.stdin.reconfigure(encoding='utf-8')`).
  - Go backend sets `PYTHONIOENCODING=utf-8` on process execution.
- **Natural Mentor Scripting**:
  - Scripting transformed from stiff textbook language into an authentic, warm, encouraging 1-on-1 coaching dialogue.
