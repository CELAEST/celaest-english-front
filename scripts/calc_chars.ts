import { buildProceduralSeedNodes } from "../src/features/pathway/services/aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../src/features/pathway/services/PathwayLectureEngine";

PathwayLectureEngine.markSoftwareIntroSeen();
const seeds = buildProceduralSeedNodes("Professional", "A1", "Professional Communication & Fluency");

let grandTotal = 0;
for (let i = 0; i < 5; i++) {
  const s = seeds[i]!;
  const dummyNode: any = {
    id: `a1-node-${i + 1}`,
    pathwayId: "pathway-a1",
    orderIndex: i,
    nodeType: "CORE_UNIT",
    status: "ACTIVE",
    title: s.title,
    competencyFocus: s.competencyFocus,
    blueprint: s.blueprint,
    lessonPayload: s.lessonPayload,
  };
  const script = PathwayLectureEngine.buildLectureScript(dummyNode);
  let totalChars = 0;
  script.segments.forEach((seg) => (totalChars += seg.text.length));
  const lesson = s.lessonPayload!;
  totalChars += (lesson.blockChallenge?.mistakeHintSpanish || "").length;
  totalChars += (
    "¡Excelente! Lo armaste en orden natural: " +
    lesson.blockChallenge.targetTokens.join(" ") +
    ". Ahora vamos a certificar tu voz."
  ).length;
  totalChars += (
    "Escucha con atención cómo lo pronuncio yo: " +
    lesson.voicePractice.sentenceEnglish +
    ". Ahora activa tu micrófono y dilo tú para certificar tu avance."
  ).length;
  totalChars += (
    "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto."
  ).length;
  totalChars += (
    'Bienvenido a tu clase con Liam. Hoy vas a dominar "' +
    s.title +
    '". Toca "Comenzar Clase" para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.'
  ).length;
  grandTotal += totalChars;
  console.log(`Base ${i + 1} ("${s.title}") total characters: ${totalChars}`);
}
console.log(`Grand total for 5 bases: ${grandTotal} characters.`);

