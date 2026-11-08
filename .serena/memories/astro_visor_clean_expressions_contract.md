# CONTRATO DE EXPRESIONES ASTRO BOT (CELAEST VISOR CLEAN ARCHITECTURE)

1. **Posición de la Boca**:
   - `mouthY = 685` en canvas 1024x1024 (ubicada en el tercio inferior del visor para máximo equilibrio visual con respecto a los ojos en Y=455).
   - Aplicada a `renderAstroTalkingMouth`, `renderAstroHappyMouth` y a todas las variantes de modulación.

2. **Ángulo y Forma de Cejas (Zero-Angry Rule)**:
   - PROHIBIDO usar inclinaciones hacia abajo en el centro nasal (\ /).
   - Las cejas son curvas dulces y relajadas en arco ascendente (arcos suaves) mediante `quadraticCurveTo(0, browY - 6, 22, browY + 4)`.
   - Expresión atenta/escucha: arco elevado (`browY = -eyeH / 2 - 28`).

3. **Pureza Vectorial y Cero Ruido (Zero Slop / Zero HUD Clutter)**:
   - Erradicados todos los textos sobre el visor (`● LISTENING · VOICE IN`, `SONAR RADAR`, `REC`, dB meters).
   - Erradicadas retículas giratorias sobre los ojos y torres VU analógicas.
   - Variantes de Habla:
     - 1. Cápsula Vocal Orgánica (Canónica Astro)
     - 2. Onda Vocal Espectral (Sonrisa reactiva limpia)
     - 3. Apertura Segmentada (2 paletas OLED mecatrónicas)
     - 4. Fonemas Expresivos (O-A-E puros)
   - Variantes de Escucha:
     - 1. Ondas de Auriculares (Ear Waves sutiles + línea fina en mentón)
     - 2. Pulso Sonar Suave (2 anillos concéntricos sutiles con transparencia 35%)
     - 3. Ecualizador Minimalista (5 micro-barras OLED estilo Apple/Siri en mentón)
     - 4. Foco Curioso (Head-Tilt +3.5° y 4 micro-esquinas de visor)

4. **Persistencia de Expresiones Guardadas**:
   - Barra superior de 5 estados (Reposo, Hablando, Escuchando, Feliz, Pensando) disponible en todo momento con selector 1-clic en el Showcase de Labs.