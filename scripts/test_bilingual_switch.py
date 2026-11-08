import asyncio
import os
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

OUT_DIR = "c:/Users/user/Music/lab/public/audio_samples/bilingual_switch_tests"
os.makedirs(OUT_DIR, exist_ok=True)

# Let's test various ways to force Andrew Multilingual to switch to 100% native American English
# on "we are ready" and other English phrases inside a Spanish sentence.

CANDIDATES = [
    # 1. Plain text with quotes
    ("test_quotes.mp3", 'Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos: "We are ready."'),
    
    # 2. English capitalization + exclamation/period
    ("test_period_break.mp3", 'Y la tercera pareja es para ti y para los grupos... Con tú, nosotros o ellos siempre decimos... We are ready.'),
    
    # 3. SSML with xml:lang="en-US"
    # Note: edge_tts accepts SSML if formatted properly, or Communicate takes plain text
    # Let's see if edge-tts Communicate handles raw text vs SSML string
    
    # 4. Phonetic respelling in Spanish for "we are ready"
    # "we" in Spanish phonetics -> "ui"
    # "are" in Spanish phonetics -> "ar"
    # "ready" in Spanish phonetics -> "rédi"
    ("test_phonetic_respell.mp3", "Y la tercera pareja es para ti y para los grupos... con tú, nosotros o ellos siempre decimos... ui ar rédi."),
    
    # 5. English introductory cue that triggers English mode
    ("test_english_cue.mp3", 'Y la tercera pareja es para ti y para los grupos... In English we say: We are ready.'),
    
    # 6. Spliced / isolated English utterance
    ("test_isolated_english.mp3", "We are ready.")
]

async def main():
    print(f"Testing bilingual language switching in {OUT_DIR}...")
    for filename, text in CANDIDATES:
        path = os.path.join(OUT_DIR, filename)
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await comm.save(path)
            print(f" -> [OK] {filename} ({os.path.getsize(path)} bytes)")
        except Exception as e:
            print(f" -> [FAIL] {filename}: {e}")
        await asyncio.sleep(0.5)
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())

