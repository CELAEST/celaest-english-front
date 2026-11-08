import { execSync } from 'node:child_process';
import fs from 'node:fs';

const codeM1 = execSync('npx esbuild src/features/pathway/curriculum/a1/module1Identity.ts --bundle --platform=node --format=esm', { encoding: 'utf8' });
fs.writeFileSync('scripts/temp_m1.mjs', codeM1);
const mod1 = await import('./temp_m1.mjs');
const specs1 = mod1.buildModule1Identity('software', 'software');
fs.unlinkSync('scripts/temp_m1.mjs');

const codeM2 = execSync('npx esbuild src/features/pathway/curriculum/a1/module2Routines.ts --bundle --platform=node --format=esm', { encoding: 'utf8' });
fs.writeFileSync('scripts/temp_m2.mjs', codeM2);
const mod2 = await import('./temp_m2.mjs');
const specs2 = mod2.buildModule2Routines('software', 'software');
fs.unlinkSync('scripts/temp_m2.mjs');

function formatBase(baseNum, spec) {
  const lesson = spec.payload;
  const lines = [];

  // Intro
  lines.push(`Bienvenido a tu clase con Liam. Hoy vas a dominar "${spec.title}". Toca "Comenzar Clase" para escuchar la explicación completa, dominar la regla y pasar a la práctica guiada.`);

  // Formulas
  lesson.formulaCases.forEach((fCase, idx) => {
    const cleanCaseLabel = fCase.label.replace(/^\d+\s*·\s*/, '');
    const sampleClause = fCase.exampleEnglish ? ` Ejemplo: "${fCase.exampleEnglish.replace(/[.]+$/, '')}".` : '';
    const text = idx === 0 
      ? `Hoy veremos ${spec.title} paso a paso en ${lesson.formulaCases.length} usos claros. Uso 1, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`
      : `Ahora pasemos al uso ${idx + 1}, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`;
    lines.push(text);
  });

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

// Generate Module 1 (Bases 2, 3, 4, 5)
const m1Lines = [];
for (let i = 1; i < specs1.length; i++) {
  m1Lines.push(...formatBase(i + 1, specs1[i]));
}

const m1Text = m1Lines.join('\n\n');
fs.writeFileSync('scripts/speechify_module1_batch.txt', m1Text, 'utf8');
console.log('Módulo 1 (Bases 2, 3, 4, 5):', m1Lines.length, 'párrafos,', m1Text.length, 'caracteres.');

// Generate Module 2 (Bases 6, 7, 8, 9, 10, 11)
const m2Lines = [];
for (let i = 0; i < specs2.length; i++) {
  m2Lines.push(...formatBase(i + 6, specs2[i]));
}
const m2Text = m2Lines.join('\n\n');
fs.writeFileSync('scripts/speechify_module2_batch.txt', m2Text, 'utf8');
console.log('Módulo 2 (Bases 6, 7, 8, 9, 10, 11):', m2Lines.length, 'párrafos,', m2Text.length, 'caracteres.');

// Combine all (Bases 2 to 11)
const allText = m1Text + '\n\n' + m2Text;
fs.writeFileSync('scripts/speechify_mega_batch.txt', allText, 'utf8');
console.log('Mega Batch (Bases 2 a 11):', m1Lines.length + m2Lines.length, 'párrafos,', allText.length, 'caracteres.');

