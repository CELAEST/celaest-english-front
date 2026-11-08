import { execSync } from 'node:child_process';
import fs from 'node:fs';

const code = execSync('npx esbuild src/features/pathway/curriculum/a1/module1Identity.ts --bundle --platform=node --format=esm', { encoding: 'utf8' });
fs.writeFileSync('scripts/temp_bundle.mjs', code);

const mod = await import('./temp_bundle.mjs');
const specs = mod.buildModule1Identity('software', 'software');
fs.unlinkSync('scripts/temp_bundle.mjs');

for (let b = 1; b < specs.length; b++) {
  const spec = specs[b];
  const lesson = spec.payload;
  console.log('\n================================================================');
  console.log(`BASE ${b + 1}: ${spec.title}`);
  console.log('================================================================');

  const items = [];

  // Formula cases
  lesson.formulaCases.forEach((fCase, idx) => {
    const cleanCaseLabel = fCase.label.replace(/^\d+\s*·\s*/, '');
    const sampleClause = fCase.exampleEnglish ? ` Ejemplo: "${fCase.exampleEnglish.replace(/[.]+$/, '')}".` : '';
    const text = idx === 0 
      ? `Hoy veremos ${spec.title} paso a paso en ${lesson.formulaCases.length} usos claros. Uso 1, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`
      : `Ahora pasemos al uso ${idx + 1}, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`;
    items.push({ id: `fase_0${idx + 1}_formula`, text });
  });

  // Trampa
  const trapWhy = lesson.commonMistake.whySpanish;
  const cleanWrong = lesson.commonMistake.wrong.replace(/[.!?«»"']/g, '').trim();
  const cleanCorrect = lesson.commonMistake.correct.replace(/[.!?«»"']/g, '').trim();
  const anchorRule = spec.focus;
  items.push({
    id: 'trampa_explicacion',
    text: `Fíjate bien en la alerta en rojo aquí debajo en tu tarjeta. ${trapWhy} Por eso tachamos "${cleanWrong}" y decimos "${cleanCorrect}". Tu ancla mental: ${anchorRule}.`
  });

  // Reto trampa
  items.push({
    id: 'reto_pregunta',
    text: '¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.'
  });
  items.push({ id: 'reto_opcion_incorrecta', text: lesson.commonMistake.wrong });
  items.push({ id: 'reto_opcion_correcta', text: lesson.commonMistake.correct });
  items.push({
    id: 'reto_feedback_error',
    text: `¡Ojo! Esa es la trampa del español: ${trapWhy} Toca la otra opción.`
  });
  items.push({
    id: 'reto_feedback_exito',
    text: '¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.'
  });

  // Ejemplos
  items.push({ id: 'ejemplo_01', text: lesson.examples[0].english });
  const cleanSample = lesson.examples[0].english.replace(/[.!?«»"']/g, '').trim();
  items.push({
    id: 'ejemplo_fonetica',
    text: `Escucha con atención cómo se unen las palabras al decir "${cleanSample}". El truco de pronunciación es ${lesson.examples[0].pronunciationHint}.`
  });
  items.push({ id: 'ejemplo_02', text: lesson.examples[1].english });

  // Activación a fichas
  items.push({
    id: 'activacion_fichas',
    text: 'Si te surge cualquier duda, toca "Preguntar" abajo. Ahora constrúyela tú: abro las fichas aquí debajo en tu tarjeta para activar tu memoria motriz. ¡Adelante!'
  });

  // Fichas
  items.push({ id: 'fichas_error', text: lesson.blockChallenge.mistakeHintSpanish });
  const cleanTargetTokens = lesson.blockChallenge.targetTokens.join(' ').replace('?', '');
  items.push({
    id: 'fichas_exito',
    text: `¡Excelente! Lo armaste en orden natural: ${cleanTargetTokens}. Ahora vamos a certificar tu voz.`
  });

  // Habla
  const voiceSent = lesson.voicePractice.sentenceEnglish;
  items.push({
    id: 'voz_instruccion',
    text: `Escucha con atención cómo lo pronuncio yo: ${voiceSent} Ahora activa tu micrófono y dilo tú para certificar tu avance.`
  });
  items.push({ id: 'voz_sample', text: voiceSent });
  items.push({
    id: 'voz_retry',
    text: 'Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.'
  });
  items.push({
    id: 'voz_not_heard',
    text: `No te escuché con claridad. Di conmigo: ${voiceSent} Toca el micrófono para intentarlo.`
  });
  items.push({
    id: 'mic_error',
    text: 'No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.'
  });
  items.push({
    id: 'voz_victoria',
    text: '¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito.'
  });
  items.push({
    id: 'voz_victoria_alt',
    text: `¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.`
  });

  items.forEach((it, i) => {
    console.log(`${i + 1}. [${it.id}] -> ${it.text}`);
  });
}

