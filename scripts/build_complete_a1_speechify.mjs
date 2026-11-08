import { execSync } from 'node:child_process';
import fs from 'node:fs';

const modules = [
  { name: 'Módulo 1: Identidad y To Be', file: 'src/features/pathway/curriculum/a1/module1Identity.ts', fn: 'buildModule1Identity' },
  { name: 'Módulo 2: Hábitos y Rutinas', file: 'src/features/pathway/curriculum/a1/module2Routines.ts', fn: 'buildModule2Routines' },
  { name: 'Módulo 3: Objetos y Posesión', file: 'src/features/pathway/curriculum/a1/module3ObjectsPossession.ts', fn: 'buildModule3ObjectsPossession' },
  { name: 'Módulo 4: Espacio, Tiempo y Cantidad', file: 'src/features/pathway/curriculum/a1/module4SpaceTimeQuantity.ts', fn: 'buildModule4SpaceTimeQuantity' },
  { name: 'Módulo 5: Comunicación y Modalidad', file: 'src/features/pathway/curriculum/a1/module5Communication.ts', fn: 'buildModule5Communication' },
  { name: 'Módulo 6: Fluidez y Puente a A2', file: 'src/features/pathway/curriculum/a1/module6FluencyAndBridge.ts', fn: 'buildModule6FluencyAndBridge' },
];

function formatBase(baseNum, spec) {
  const lesson = spec.payload;
  const lines = [];

  // Intro
  lines.push(`Bienvenido a tu clase con Liam. Hoy vas a dominar "${spec.title}". Toca "Comenzar Clase" para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.`);

  // Formulas
  if (!lesson.formulaCases || lesson.formulaCases.length <= 1) {
    const singleCase = lesson.formulaCases?.[0];
    const formulaLabels = singleCase?.segments
      ? singleCase.segments.map((s) => s.label.replace(/^\d+\.\s*/, '').toLowerCase()).join(', luego ')
      : 'primero la persona, luego la acción';
    lines.push(`El reto de esta base es ${spec.title}. ${lesson.ruleTaglineSpanish} Mira cómo se ilumina la fórmula pieza por pieza aquí debajo en tu tarjeta: ${formulaLabels}.`);
  } else {
    lesson.formulaCases.forEach((fCase, idx) => {
      const cleanCaseLabel = fCase.label.replace(/^\d+\s*·\s*/, '');
      const sampleClause = fCase.exampleEnglish ? ` Ejemplo: "${fCase.exampleEnglish.replace(/[.]+$/, '')}".` : '';
      const text = idx === 0 
        ? `Hoy veremos ${spec.title} paso a paso en ${lesson.formulaCases.length} usos claros. Uso 1, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`
        : `Ahora pasemos al uso ${idx + 1}, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`;
      lines.push(text);
    });
  }

  // Trampa
  const trapWhy = lesson.commonMistake.whySpanish;
  const cleanWrong = lesson.commonMistake.wrong.replace(/[.!?«»"']/g, '').trim();
  const cleanCorrect = lesson.commonMistake.correct.replace(/[.!?«»"']/g, '').trim();
  const anchorRule = spec.focus;
  lines.push(`Fíjate bien en la alerta en rojo aquí debajo en tu tarjeta. ${trapWhy} Por eso tachamos "${cleanWrong}" y decimos "${cleanCorrect}". Tu ancla mental: ${anchorRule}.`);

  // Reto trampa
  lines.push('¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.');
  lines.push(lesson.commonMistake.wrong);
  lines.push(lesson.commonMistake.correct);
  lines.push(`¡Ojo! Esa es la trampa del español: ${trapWhy} Toca la otra opción.`);
  lines.push('¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.');

  // Ejemplos
  lines.push(lesson.examples[0].english);
  const cleanSample = lesson.examples[0].english.replace(/[.!?«»"']/g, '').trim();
  lines.push(`Escucha con atención cómo se unen las palabras al decir "${cleanSample}". El truco de pronunciación es ${lesson.examples[0].pronunciationHint}.`);
  lines.push(lesson.examples[1].english);

  // Activación a fichas
  lines.push('Si te surge cualquier duda, toca "Preguntar" abajo. Ahora constrúyela tú: abro las fichas aquí debajo en tu tarjeta para activar tu memoria motriz. ¡Adelante!');

  // Fichas
  lines.push(lesson.blockChallenge.mistakeHintSpanish);
  const cleanTargetTokens = lesson.blockChallenge.targetTokens.join(' ').replace('?', '');
  lines.push(`¡Excelente! Lo armaste en orden natural: ${cleanTargetTokens}. Ahora vamos a certificar tu voz.`);

  // Habla
  const voiceSent = lesson.voicePractice.sentenceEnglish;
  lines.push(`Escucha con atención cómo lo pronuncio yo: ${voiceSent} Ahora activa tu micrófono y dilo tú para certificar tu avance.`);
  lines.push(voiceSent);
  lines.push('Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.');
  lines.push(`No te escuché con claridad. Di conmigo: ${voiceSent} Toca el micrófono para intentarlo.`);
  lines.push('No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.');
  lines.push('¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito.');
  lines.push(`¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.`);

  return lines;
}

let allBasesLines = [];
let baseEntries = []; // Array of { bNum, title, text }
let baseCounter = 1;

for (const m of modules) {
  const code = execSync(`npx esbuild ${m.file} --bundle --platform=node --format=esm`, { encoding: 'utf8' });
  const tmpFile = `scripts/temp_${m.fn}.mjs`;
  fs.writeFileSync(tmpFile, code);
  const mod = await import(`./temp_${m.fn}.mjs`);
  const specs = mod[m.fn]('software', 'software');
  fs.unlinkSync(tmpFile);

  console.log(`\n=== ${m.name} (${specs.length} bases) ===`);
  for (let i = 0; i < specs.length; i++) {
    const bNum = baseCounter++;
    // Skip Base 1 because it is already recorded and verified
    if (bNum === 1) continue;
    const lines = formatBase(bNum, specs[i]);
    const baseText = lines.join('\n\n');
    allBasesLines.push(...lines);
    baseEntries.push({ bNum, title: specs[i].title, text: baseText });
    console.log(`  -> Base ${String(bNum).padStart(2, '0')}: "${specs[i].title}" (${lines.length} tomas, ${baseText.length} chars)`);
  }
}

const completeA1Text = allBasesLines.join('\n\n');
fs.writeFileSync('scripts/speechify_A1_COMPLETE_BASES_02_TO_32.txt', completeA1Text, 'utf8');

// Partition into chunks strictly <= 18,000 characters for Speechify's 20,000 limit
const maxCharsPerChunk = 18000;
const chunks = [];
let currentChunkBases = [];
let currentChunkChars = 0;

for (const b of baseEntries) {
  if (currentChunkChars + b.text.length > maxCharsPerChunk && currentChunkBases.length > 0) {
    chunks.push(currentChunkBases);
    currentChunkBases = [b];
    currentChunkChars = b.text.length;
  } else {
    currentChunkBases.push(b);
    currentChunkChars += b.text.length + 2;
  }
}
if (currentChunkBases.length > 0) {
  chunks.push(currentChunkBases);
}

chunks.forEach((chunk, idx) => {
  const startBase = String(chunk[0].bNum).padStart(2, '0');
  const endBase = String(chunk[chunk.length - 1].bNum).padStart(2, '0');
  const chunkText = chunk.map(b => b.text).join('\n\n');
  const filename = `scripts/speechify_BLOQUE_${idx + 1}_BASES_${startBase}_A_${endBase}.txt`;
  fs.writeFileSync(filename, chunkText, 'utf8');
  console.log(`\n[BLOQUE ${idx + 1} DE ${chunks.length}] Bases ${startBase} a ${endBase} -> ${chunkText.length} caracteres (Guardado en ${filename})`);
});

console.log('\n======================================================');
console.log(`TOTAL BASES PROCESADAS: 31 bases (de la Base 02 a la 32)`);
console.log(`TOTAL PÁRRAFOS / TOMAS: ${allBasesLines.length} tomas`);
console.log(`TOTAL CARACTERES: ${completeA1Text.length} caracteres`);
console.log(`Guardado en: scripts/speechify_A1_COMPLETE_BASES_02_TO_32.txt`);
console.log('======================================================');

