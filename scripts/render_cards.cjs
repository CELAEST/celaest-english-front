const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#241247" stop-opacity="1"/>
      <stop offset="55%" stop-color="#0e0722" stop-opacity="1"/>
      <stop offset="100%" stop-color="#030208" stop-opacity="1"/>
    </radialGradient>
    
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8b4fe" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#a855f7" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#4c1d95" stop-opacity="0.2"/>
    </linearGradient>

    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1b1233" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#0a0515" stop-opacity="0.99"/>
    </linearGradient>

    <linearGradient id="cardBackBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#140d28" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#06030c" stop-opacity="0.98"/>
    </linearGradient>

    <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#8b5cf6" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGlow)"/>

  <!-- Synaptic Memory Nodes & Lines -->
  <g opacity="0.6">
    <circle cx="160" cy="240" r="3" fill="#c084fc"/>
    <circle cx="220" cy="180" r="2" fill="#818cf8"/>
    <circle cx="620" cy="260" r="3" fill="#e9d5ff"/>
    <circle cx="680" cy="380" r="2.5" fill="#a855f7"/>
    <circle cx="180" cy="560" r="3" fill="#a855f7"/>
    <circle cx="640" cy="580" r="2" fill="#818cf8"/>
    <path d="M160,240 Q220,180 320,200" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="4,6" fill="none"/>
    <path d="M520,200 Q620,260 680,380" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,6" fill="none"/>
  </g>

  <!-- BACK CARD 2 (Rotated left) -->
  <g transform="translate(400, 410) rotate(-12) translate(-400, -410)">
    <rect x="230" y="210" width="340" height="440" rx="28" fill="url(#cardBackBg)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
  </g>

  <!-- BACK CARD 1 (Rotated right) -->
  <g transform="translate(400, 410) rotate(8) translate(-400, -410)">
    <rect x="230" y="200" width="340" height="440" rx="28" fill="url(#cardBackBg)" stroke="#c084fc" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="275" cy="245" r="10" fill="#7c3aed" opacity="0.3"/>
    <rect x="300" y="240" width="130" height="10" rx="5" fill="#ffffff" opacity="0.15"/>
    <rect x="270" y="310" width="260" height="8" rx="4" fill="#ffffff" opacity="0.08"/>
    <rect x="270" y="334" width="200" height="8" rx="4" fill="#ffffff" opacity="0.08"/>
  </g>

  <!-- MAIN FRONT MEMORY FLASHCARD -->
  <g filter="url(#dropGlow)">
    <rect x="210" y="170" width="380" height="480" rx="32" fill="url(#cardBg)" stroke="url(#cardBorder)" stroke-width="2"/>
    
    <!-- Top Pill Badge -->
    <rect x="245" y="208" width="130" height="24" rx="12" fill="#7c3aed" fill-opacity="0.25" stroke="#a855f7" stroke-opacity="0.4" stroke-width="1"/>
    <text x="260" y="224" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#e9d5ff" letter-spacing="1.5">MEMORY DECK</text>
    
    <!-- Audio Waveform Icon -->
    <circle cx="535" cy="220" r="16" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
    <path d="M528,218 L533,218 L537,214 L537,226 L533,222 L528,222 Z" fill="#c084fc"/>
    <path d="M540,217 C542,219 542,221 540,223" stroke="#c084fc" stroke-width="1.5" fill="none" stroke-linecap="round"/>

    <!-- Central Flashcard Structure -->
    <text x="245" y="305" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#a78bfa" letter-spacing="2">ACTIVE RECALL // CARD #01</text>
    <text x="245" y="358" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="700" fill="#ffffff" letter-spacing="-1">Lexicon Card</text>
    <text x="245" y="396" font-family="monospace" font-size="15" font-weight="500" fill="#94a3b8">[ ˈmɛm.ə.ri · dɛk ]</text>
    
    <line x1="245" y1="430" x2="555" y2="430" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>

    <!-- Flashcard Flip Trigger -->
    <text x="245" y="465" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#cbd5e1">Spaced Repetition Flashcard</text>
    <text x="245" y="488" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="300" fill="#64748b">Fijación léxica · Memoria a largo plazo</text>

    <!-- Bottom Spaced Intervals (Leitner System) -->
    <g transform="translate(245, 545)">
      <rect x="0" y="0" width="65" height="42" rx="12" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-opacity="0.3" stroke-width="1"/>
      <text x="32" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#fca5a5" text-anchor="middle">Again</text>
      <text x="32" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="500" fill="#f87171" text-anchor="middle">10m</text>

      <rect x="76" y="0" width="65" height="42" rx="12" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1"/>
      <text x="108" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#fde68a" text-anchor="middle">Hard</text>
      <text x="108" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="500" fill="#fbbf24" text-anchor="middle">1d</text>

      <rect x="152" y="0" width="65" height="42" rx="12" fill="#3b82f6" fill-opacity="0.12" stroke="#3b82f6" stroke-opacity="0.3" stroke-width="1"/>
      <text x="184" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#bfdbfe" text-anchor="middle">Good</text>
      <text x="184" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="500" fill="#60a5fa" text-anchor="middle">3d</text>

      <rect x="228" y="0" width="82" height="42" rx="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.4" stroke-width="1"/>
      <text x="269" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#a7f3d0" text-anchor="middle">Master</text>
      <text x="269" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="500" fill="#34d399" text-anchor="middle">7d</text>
    </g>
  </g>
</svg>
`;

sharp(Buffer.from(svg))
  .jpeg({ quality: 95 })
  .toFile('c:/Users/user/Music/celaest-english-front/public/assets/memory_3d_cards_stack.jpg')
  .then(() => {
    console.log('Successfully generated memory_3d_cards_stack.jpg!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
