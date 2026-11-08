import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { buildProceduralSeedNodes } from "../src/features/pathway/services/aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../src/features/pathway/services/PathwayLectureEngine";
import { sanitizeSpeechForVoice } from "../src/features/conversation/services/speechSynthesisService";

// Key Pool: accumulator of keys provided by the user
const keyPool = [
  "sk_971ba3ccaed20ffcf66b3bfdfaf96e2270d8e81f0cd080e9",
];

// CLI arguments can push or override keys
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--key=")) {
    keyPool.unshift(arg.replace("--key=", "").trim());
  } else if (arg.startsWith("sk_")) {
    keyPool.unshift(arg.trim());
  }
}

let activeKeyIndex = 0;
function getActiveKey(): string {
  return keyPool[activeKeyIndex] || "";
}

const PUBLIC_AUDIO_DIR = path.resolve("public", "audio", "pathway", "a1");
const MANIFEST_PATH = path.resolve("src", "features", "pathway", "data", "a1AudioManifest.json");

fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });

let manifest: Record<string, string> = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {}
}

function synthesizeElevenLabs(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const key = getActiveKey();
    if (!key) {
      return reject(new Error("QUOTA_EXCEEDED"));
    }

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
                // Try rolling over to the next key if available
                if (activeKeyIndex + 1 < keyPool.length) {
                  activeKeyIndex++;
                  console.log(`\n🔄 Rollover to next ElevenLabs key: ${getActiveKey().slice(0, 10)}...`);
                  return synthesizeElevenLabs(text).then(resolve).catch(reject);
                }
                return reject(new Error("QUOTA_EXCEEDED"));
              }
              errorMsg = parsed?.detail?.message || errorMsg;
            } catch {}
            reject(new Error(`ElevenLabs (${res.statusCode}): ${errorMsg}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// Known files that were verified synthesized by ElevenLabs Liam earlier in base 01
const GENUINE_ELEVEN_BASE01 = new Set([
  "seg_01.mp3",
  "seg_02.mp3",
  "seg_03.mp3",
  "seg_04.mp3",
  "seg_05.mp3",
  "seg_06.mp3",
]);

async function runMasterBaking() {
  console.log("====================================================================");
  console.log(" 🎙️  CELAEST A1 NATIVE BAKING ENGINE — 100% PURE LIAM (ELEVENLABS)");
  console.log("====================================================================");
  console.log(`🔑 Active Key: ${getActiveKey().slice(0, 10)}... (Pool of ${keyPool.length} key(s))`);
  console.log("🤖 Model: eleven_multilingual_v2 (Voice: Liam TX3LPaxmHKxFdv7VOQHJ)\n");

  PathwayLectureEngine.markSoftwareIntroSeen();
  const seeds = buildProceduralSeedNodes("Professional", "A1", "Professional Communication & Fluency");

  let quotaExhausted = false;
  let fullyCompletedBases = 0;

  for (let bIndex = 0; bIndex < seeds.length; bIndex++) {
    if (quotaExhausted) break;

    const baseNumber = String(bIndex + 1).padStart(2, "0");
    const baseDir = path.join(PUBLIC_AUDIO_DIR, `base_${baseNumber}`);
    fs.mkdirSync(baseDir, { recursive: true });

    const s = seeds[bIndex]!;
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

    console.log(`\n▶ [BASE ${baseNumber}/32] "${s.title}" — Verificando ${items.length} audios...`);

    let baseError = false;

    for (const item of items) {
      const fileName = `${item.id}.mp3`;
      const filePath = path.join(baseDir, fileName);
      const publicUrl = `/audio/pathway/a1/base_${baseNumber}/${fileName}`;

      // In base 01, retain genuine ElevenLabs segments to conserve tokens
      const isBase01Genuine = bIndex === 0 && GENUINE_ELEVEN_BASE01.has(fileName);
      if (isBase01Genuine && fs.existsSync(filePath) && fs.statSync(filePath).size > 20000) {
        manifest[item.text.trim()] = publicUrl;
        manifest[sanitizeSpeechForVoice(item.text)] = publicUrl;
        console.log(`   ✓ [Liam Ya en Disco] ${fileName}`);
        continue;
      }

      console.log(`   🎙️ Grabando con Liam: ${fileName} ("${item.text.slice(0, 38)}...")`);
      try {
        const audioBuffer = await synthesizeElevenLabs(item.text);
        fs.writeFileSync(filePath, audioBuffer);
        manifest[item.text.trim()] = publicUrl;
        manifest[sanitizeSpeechForVoice(item.text)] = publicUrl;
        console.log(`      -> Guardado MP3 puro de Liam: ${fileName} (${audioBuffer.length} bytes)`);
      } catch (err: any) {
        if (err.message === "QUOTA_EXCEEDED") {
          quotaExhausted = true;
          baseError = true;
          console.log("\n╔══════════════════════════════════════════════════════════════════════════╗");
          console.log("║  ⚠️  ALERTA CRÍTICA: CUOTA DE ELEVENLABS AGOTADA EN ESTA KEY           ║");
          console.log(`║  Se completaron y guardaron al 100% con Liam hasta la Base ${baseNumber}.           ║`);
          console.log("║  Pásame la siguiente API Key para continuar con las restantes.          ║");
          console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");
          break;
        } else {
          console.error(`      ❌ Error grabando ${fileName}:`, err.message);
          baseError = true;
        }
      }
    }

    // Persist manifest after every base
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");

    if (!baseError) {
      fullyCompletedBases++;
      console.log(`   🌟 [BASE ${baseNumber}/32] CONQUISTADA AL 100% CON LIAM`);
    }
  }

  console.log("\n====================================================================");
  console.log("📊 RESUMEN FINAL DEL HORNEADO:");
  console.log(`   Bases completadas 100% con Liam puro: ${fullyCompletedBases}`);
  console.log(`   Total entradas en a1AudioManifest:     ${Object.keys(manifest).length}`);
  console.log("====================================================================");
}

runMasterBaking().catch(console.error);

