import fs from 'node:fs';

const completeText = fs.readFileSync('scripts/speechify_A1_COMPLETE_BASES_02_TO_32.txt', 'utf8');
const paragraphs = completeText.split('\n\n');

console.log('Total paragraphs:', paragraphs.length);

// Let's create the 3 modular parts just in case Speechify has a character limit:
// Part 1: Bases 02 to 11 (Modules 1 & 2)
// Part 2: Bases 12 to 23 (Modules 3 & 4)
// Part 3: Bases 24 to 32 (Modules 5 & 6)

// Find paragraph boundaries by module intros
const b12Idx = paragraphs.findIndex(p => p.includes('Artículos Indefinidos: A vs An'));
const b24Idx = paragraphs.findIndex(p => p.includes('La Brújula de Preguntas: What, Where, When'));

const part1 = paragraphs.slice(0, b12Idx).join('\n\n');
const part2 = paragraphs.slice(b12Idx, b24Idx).join('\n\n');
const part3 = paragraphs.slice(b24Idx).join('\n\n');

fs.writeFileSync('scripts/speechify_A1_PARTE_1_BASES_02_A_11.txt', part1, 'utf8');
fs.writeFileSync('scripts/speechify_A1_PARTE_2_BASES_12_A_23.txt', part2, 'utf8');
fs.writeFileSync('scripts/speechify_A1_PARTE_3_BASES_24_A_32.txt', part3, 'utf8');

console.log('Part 1 (Bases 02-11):', part1.length, 'chars -> scripts/speechify_A1_PARTE_1_BASES_02_A_11.txt');
console.log('Part 2 (Bases 12-23):', part2.length, 'chars -> scripts/speechify_A1_PARTE_2_BASES_12_A_23.txt');
console.log('Part 3 (Bases 24-32):', part3.length, 'chars -> scripts/speechify_A1_PARTE_3_BASES_24_A_32.txt');

