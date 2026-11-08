import fs from 'fs';

const fullText = fs.readFileSync('scripts/speechify_A1_COMPLETE_BASES_02_TO_32.txt', 'utf8');
const blocks = fullText.split(/(?=\n=== BASE \d+ ===)/);

const parts = [];
let currentPart = '';

for (const block of blocks) {
  if (currentPart.length + block.length > 18000 && currentPart.length > 0) {
    parts.push(currentPart.trim());
    currentPart = block;
  } else {
    currentPart += block;
  }
}
if (currentPart.trim()) {
  parts.push(currentPart.trim());
}

console.log(`Total generated chunks: ${parts.length}`);
parts.forEach((p, idx) => {
  const filename = `scripts/speechify_PARTE_${idx + 1}_DE_${parts.length}_MAX20K.txt`;
  fs.writeFileSync(filename, p, 'utf8');
  console.log(`- Parte ${idx + 1}/${parts.length}: ${p.length} caracteres -> ${filename}`);
});

