import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { buildProceduralSeedNodes } from "../src/features/pathway/services/aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../src/features/pathway/services/PathwayLectureEngine";
import { sanitizeSpeechForVoice } from "../src/features/conversation/services/speechSynthesisService";

const PUBLIC_AUDIO_DIR = path.resolve("public", "audio", "pathway", "a1", "base_01");
const MANIFEST_PATH = path.resolve("src", "features", "pathway", "data", "a1AudioManifest.json");

fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });

let manifest: Record<string, string> = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {}
}

function fetchBackendTTS(text: string, voice = "liam"): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text.trim());
    const encodedVoice = encodeURIComponent(voice);
    const url = `http://127.0.0.1:8080/api/v1/tts/stream?text=${encodedText}&voice=${encodedVoice}&rate=%2B0%25&volume=%2B100%25`;

    http.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Backend TTS returned status ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

async function run() {
  PathwayLectureEngine.markSoftwareIntroSeen();
  const seeds = buildProceduralSeedNodes("Professional", "A1", "Professional Communication & Fluency");

  // Bake first 3 bases completely so the user has full continuous experience
  for (let bIndex = 0; bIndex < Math.min(3, seeds.length); bIndex++) {
    const s = seeds[bIndex]!;
    const baseNumber = String(bIndex + 1).padStart(2, "0");
    const baseDir = path.resolve("public", "audio", "pathway", "a1", `base_${baseNumber}`);
    fs.mkdirSync(baseDir, { recursive: true });

    const dummyNode: any = {
      id: `a1-node-${bIndex + 1}`,
      pathwayId: "pathway-a1",
      orderIndex: bIndex,
      nodeType: "CORE_UNIT",
      status: "ACTIVE",
      title: s.title,
      competencyFocus: s.competencyFocus,
      blueprint: s.blueprint,
      lessonPayload: s.lessonPayload,
    };

    const script = PathwayLectureEngine.buildLectureScript(dummyNode);
    const lesson = s.lessonPayload!;

    const items: Array<{ id: string; text: string }> = [
      {
        id: "lesson_intro",
        text: `El reto de hoy es ${s.title}. ${s.blueprint.objectiveSpanish}. Fíjate bien en la diferencia clave en tu pizarra.`,
      },
    ];

    script.segments.forEach((seg, sIdx) => {
      items.push({
        id: `seg_${String(sIdx + 1).padStart(2, "0")}`,
        text: seg.text,
      });
    });

    if (lesson.blockChallenge?.mistakeHintSpanish) {
      items.push({
        id: "challenge_error",
        text: lesson.blockChallenge.mistakeHintSpanish,
      });
    }

    const targetSentence = lesson.blockChallenge.targetTokens.join(" ");
    items.push({
      id: "challenge_success",
      text: `¡Excelente! Lo armaste en orden natural: ${targetSentence}. Ahora vamos a certificar tu voz.`,
    });

    const voiceSentence = lesson.voicePractice.sentenceEnglish;
    items.push({
      id: "voice_instruction",
      text: `Escucha con atención cómo lo pronuncio yo: ${voiceSentence}. Ahora activa tu micrófono y dilo tú para certificar tu avance.`,
    });

    items.push({
      id: "voice_victory",
      text: "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.",
    });

    console.log(`\nChecking ${items.length} audio items for Base ${baseNumber} ("${s.title}")...`);

    for (const item of items) {
      const filePath = path.join(baseDir, `${item.id}.mp3`);
      const publicUrl = `/audio/pathway/a1/base_${baseNumber}/${item.id}.mp3`;

      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
        manifest[item.text.trim()] = publicUrl;
        manifest[sanitizeSpeechForVoice(item.text)] = publicUrl;
        continue;
      }

      console.log(`🎙️ Baking base_${baseNumber}/${item.id}.mp3: "${item.text.slice(0, 45)}..."`);
      try {
        const buf = await fetchBackendTTS(item.text, "liam");
        fs.writeFileSync(filePath, buf);
        manifest[item.text.trim()] = publicUrl;
        manifest[sanitizeSpeechForVoice(item.text)] = publicUrl;
        console.log(`   -> Guardado: ${item.id}.mp3 (${buf.length} bytes)`);
      } catch (err: any) {
        console.error(`   ❌ Error en ${item.id}:`, err.message);
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("🎉 Manifest updated! Base 01 is 100% complete and baked into local assets.");
}

run().catch(console.error);
