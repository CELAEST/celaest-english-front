import asyncio
import os
import shutil
import subprocess
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-4%"

FRONT_DIR = "C:/Users/user/Music/celaest-english-front/public/audio/pathway/a1/base_04"
LAB_DIR = "C:/Users/user/Music/lab/public/audio_samples/base_04"

os.makedirs(FRONT_DIR, exist_ok=True)
os.makedirs(LAB_DIR, exist_ok=True)

TRAP_PARTS = [
    # 1. Spanish intro: Mentor warns about 'tener' in Spanish without butchering 'have'
    (
        "seg_03_part1_intro.mp3",
        "Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca usamos ese verbo para la edad ni para el hambre... Por eso nunca decimos:"
    ),
    # 2. Pure Native English mistake: spoken in pure English phonology
    (
        "seg_03_part2_wrong.mp3",
        "I have 25 years."
    ),
    # 3. Spanish pivot: Mentor smoothly transitions to the natural solution
    (
        "seg_03_part3_pivot.mp3",
        "Sino que en inglés siempre decimos:"
    ),
    # 4. Pure Native English correct: spoken in pure English phonology
    (
        "seg_03_part4_correct.mp3",
        "I am 25 years old."
    ),
    # 5. Spanish anchor: Mentor seals the rule with phonetic aid 'tu bi'
    (
        "seg_03_part5_anchor.mp3",
        "Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi."
    ),
]

async def synthesize_parts():
    temp_files = []
    for filename, text in TRAP_PARTS:
        target_path = os.path.join(FRONT_DIR, filename)
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(target_path)
        shutil.copy2(target_path, os.path.join(LAB_DIR, filename))
        size = os.path.getsize(target_path)
        print(f" -> [OK] {filename} ({size} bytes)")
        temp_files.append(target_path)
    return temp_files

def stitch_with_ffmpeg(part_files, output_filename):
    out_front = os.path.join(FRONT_DIR, output_filename)
    out_lab = os.path.join(LAB_DIR, output_filename)
    
    # Create concat list for ffmpeg
    list_file = os.path.join(FRONT_DIR, "concat_trap.txt")
    with open(list_file, "w", encoding="utf-8") as f:
        for p in part_files:
            # Escape path for ffmpeg concat
            escaped = p.replace("\\", "/")
            f.write(f"file '{escaped}'\n")
    
    # Run ffmpeg concat
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        out_front
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    shutil.copy2(out_front, out_lab)
    
    size = os.path.getsize(out_front)
    print(f" -> [STITCHED MASTER OK] {output_filename} ({size} bytes)")
    if os.path.exists(list_file):
        os.remove(list_file)

async def main():
    print("=== Generating SOTA Decoupled Trap for Base 04 ===")
    parts = await synthesize_parts()
    print("Stitching seamlessly into master seg_03.mp3 with ffmpeg...")
    stitch_with_ffmpeg(parts, "seg_03.mp3")
    print("=== SOTA Trap Generation Complete ===")

if __name__ == "__main__":
    asyncio.run(main())

