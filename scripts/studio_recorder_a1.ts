import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { buildProceduralSeedNodes } from "../src/features/pathway/services/aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../src/features/pathway/services/PathwayLectureEngine";
import { PathwayNode } from "../src/domain/entities/LearningPathway";

// Parse API key from arguments: node studio_recorder_a1.ts --key=sk_... or sk_...
let apiKey = process.env.ELEVENLABS_API_KEY || "";
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--key=")) {
    apiKey = arg.replace("--key=", "").trim();
  } else if (arg.startsWith("sk_")) {
    apiKey = arg.trim();
  }
}

if (!apiKey) {
  apiKey = "sk_77cc857dd6acc38174aedd37ea239e3ec438ba22ac831d9f";
}

const PUBLIC_AUDIO_DIR = path.resolve("public", "audio", "pathway", "a1");
const BACKEND_CACHE_DIR = path.resolve("..", "celaest-english-back", "data", "tts_cache");
const MANIFEST_PATH = path.resolve("src", "features", "pathway", "data", "a1AudioManifest.json");

fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
fs.mkdirSync(BACKEND_CACHE_DIR, { recursive: true });

let manifest: Record<string, string> = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {}
}

function synthesizeElevenLabs(text: string, key: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: text.trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true,
      },
    });

    const req = https.request(
      {
        hostname: "api.elevenlabs.io",
        path: "/v1/text-to-speech/TX3LPaxmHKxFdv7VOQHJ?output_format=mp3_44100_128",
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const body = Buffer.concat(chunks);
          if (res.statusCode === 200) {
            resolve(body);
          } else {
            let errorMsg = body.toString("utf-8");
            try {
              const parsed = JSON.parse(errorMsg);
              if (parsed?.detail?.code === "quota_exceeded" || res.statusCode === 401) {
                return reject(new Error("QUOTA_EXCEEDED"));
              }
              errorMsg = parsed?.detail?.message || errorMsg;
            } catch {}
            reject(new Error(`ElevenLabs error (${res.statusCode}): ${errorMsg}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runStudio() {
  console.log("====================================================================");
  console.log(" 🎙️  CELAEST A1 STUDIO RECORDER — LIAM NATIVE AUDIO BAKING TOOL");
  console.log("====================================================================");
  console.log(`🔑 Using ElevenLabs Key: ${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`);

  PathwayLectureEngine.markSoftwareIntroSeen();
  const seeds = buildProceduralSeedNodes("Professional", "A1", "Professional Communication & Fluency");
  console.log(`📚 Total bases to process: ${seeds.length} bases.\n`);

  let recordedBases = 0;
  let alreadyOwnedBases = 0;
  let quotaHit = false;

  for (let bIndex = 0; bIndex < seeds.length; bIndex++) {
    if (quotaHit) break;

    const baseNumber = String(bIndex + 1).padStart(2, "0");
    const baseDir = path.join(PUBLIC_AUDIO_DIR, `base_${baseNumber}`);
    fs.mkdirSync(baseDir, { recursive: true });

    const s = seeds[bIndex]!;
    const dummyNode: PathwayNode = {
      id: `a1-node-${bIndex + 1}`,
      pathwayId: "pathway-a1",
      orderIndex: bIndex,
      nodeType: "CORE_UNIT",
      status: "ACTIVE",
      title: s.title,
      competencyFocus: s.competencyFocus,
      blueprint: s.blueprint,
      lessonPayload: s.lessonPayload,
      masteryScore: 0,
      attemptsCount: 0,
      retentionStage: 0,
    };

    const script = PathwayLectureEngine.buildLectureScript(dummyNode);
    const lesson = s.lessonPayload;

    // Define all audio segments for this specific base
    const baseItems: Array<{ id: string; text: string }> = [];

    script.segments.forEach((seg, sIdx) => {
      baseItems.push({
        id: `seg_${String(sIdx + 1).padStart(2, "0")}`,
        text: seg.text,
      });
    });

    if (lesson) {
      if (lesson.blockChallenge.mistakeHintSpanish) {
        baseItems.push({
          id: "challenge_error",
          text: lesson.blockChallenge.mistakeHintSpanish,
        });
      }
      const targetSentence = lesson.blockChallenge.targetTokens.join(" ");
      baseItems.push({
        id: "challenge_success",
        text: `¡Excelente! Lo armaste en orden natural: ${targetSentence}. Ahora vamos a certificar tu voz.`,
      });

      const voiceSentence = lesson.voicePractice.sentenceEnglish;
      baseItems.push({
        id: "voice_instruction",
        text: `Escucha con atención cómo lo pronuncio yo: ${voiceSentence}. Ahora activa tu micrófono y dilo tú para certificar tu avance.`,
      });
    }

    // Check if base is already fully recorded
    const isBaseComplete = baseItems.every((item) => {
      const filePath = path.join(baseDir, `${item.id}.mp3`);
      return fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;
    });

    if (isBaseComplete) {
      alreadyOwnedBases++;
      console.log(`[Base ${baseNumber}/32] ✅ YA EN DISCO (100% de audios descargados y propiedad del proyecto)`);
      continue;
    }

    console.log(`\n[Base ${baseNumber}/32] 🎙️ Grabando Base: "${s.title}" (${baseItems.length} audios)...`);

    for (const item of baseItems) {
      const filePath = path.join(baseDir, `${item.id}.mp3`);
      const relativePublicPath = `/audio/pathway/a1/base_${baseNumber}/${item.id}.mp3`;

      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
        manifest[item.text.trim()] = relativePublicPath;
        continue;
      }

      try {
        const audioBuffer = await synthesizeElevenLabs(item.text, apiKey);
        fs.writeFileSync(filePath, audioBuffer);
        manifest[item.text.trim()] = relativePublicPath;
        console.log(`   -> Guardado archivo: base_${baseNumber}/${item.id}.mp3 (${audioBuffer.length} bytes)`);
      } catch (err: any) {
        if (err.message === "QUOTA_EXCEEDED") {
          quotaHit = true;
          console.log("\n╔══════════════════════════════════════════════════════════════════════════╗");
          console.log("║  ⚠️  ALERTA CRÍTICA: CRÉDITOS DE ELEVENLABS AGOTADOS                   ║");
          console.log(`║  Se guardaron con éxito en disco hasta la Base ${baseNumber}.                     ║`);
          console.log("║  Para continuar grabando las bases restantes:                            ║");
          console.log("║  Pásame una nueva API Key de ElevenLabs para continuar.                  ║");
          console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");
          break;
        } else {
          console.error(`   ❌ Error grabando audio (${item.id}):`, err.message);
        }
      }
    }

    if (!quotaHit) {
      recordedBases++;
      console.log(`   🎉 Base ${baseNumber} grabada y guardada al 100% en disco.`);
    }

    // Save manifest incrementally
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  }

  console.log("\n====================================================================");
  console.log("📊 RESUMEN DEL ESTUDIO DE GRABACIÓN:");
  console.log(`   Bases completadas previamente: ${alreadyOwnedBases}`);
  console.log(`   Bases grabadas en esta sesión: ${recordedBases}`);
  console.log(`   Total de audios en manifest:   ${Object.keys(manifest).length}`);
  console.log("====================================================================");
}

runStudio().catch(console.error);

