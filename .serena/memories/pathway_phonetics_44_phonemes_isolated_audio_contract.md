# Contrato de Fonética Completa: 44 Fonemas Oficiales del Inglés con Audio Aislado

## Decisiones y Estándares
1. **Totalidad del Alfabeto Fonético (44 Fonemas)**:
   - Cobertura exhaustiva de los 44 fonemas del International Phonetic Alphabet (IPA) estándar para inglés:
     - 7 Vocales Cortas & Schwa (/ə/, /ɪ/, /e/, /æ/, /ʌ/, /ʊ/, /ɒ/)
     - 5 Vocales Largas (/iː/, /uː/, /ɑː/, /ɔː/, /ɜː/)
     - 8 Diptongos (/eɪ/, /aɪ/, /ɔɪ/, /aʊ/, /oʊ/, /ɪə/, /eə/, /ʊə/)
     - 11 Fricativas & Africadas (/θ/, /ð/, /v/, /f/, /s/, /z/, /ʃ/, /ʒ/, /h/, /tʃ/, /dʒ/)
     - 13 Oclusivas, Nasales & Aproximantes (/p/, /b/, /t/, /d/, /k/, /ɡ/, /m/, /n/, /ŋ/, /l/, /ɹ/, /w/, /j/)

2. **Doble Experiencia de Audio con Voces Humanas Reales**:
   - **Corrección de Repetición Doble en Consonantes (Cat. 4 y 5)**: Las grabaciones lingüísticas originales de Wikimedia articulaban cada consonante dos veces ("[s]... [s]", "[p]... [p]"). Se recortaron quirúrgicamente con ffmpeg en el primer silencio con fade-out suave para garantizar una única articulación limpia, humana y natural de ~0.4s-1.0s.
   - **Diptongos Activos (Cat. 3)**: Los 8 diptongos cuentan con audio vorbis .ogg de alta fidelidad humana (`diph-ei`, `diph-ai`, `diph-oi`, `diph-au`, `diph-ou`, `diph-ia`, `diph-ea`, `diph-ua`).
   - **Palabras de Ejemplo (75 audios locales)**: Todas las palabras de muestra y palabras de contraste se generaron y empaquetaron localmente en `public/audio/phonetics/words/*.ogg` con 24kHz de resolución humana, eliminando cualquier archivo HTML corrupto o error 429.
   - **Cero Dependencia de Sintetizadores Robóticos de SO (SAPI5)**: Todos los 44 fonemas y sus palabras reproducen directamente archivos .ogg locales a través de `PhoneticAudioService.ts`.

3. **Explicación Intuitiva "Cómo se Pronuncia"**:
   - Cada sonido cuenta con `howItSounds`: la referencia exacta en español sin tecnicismos ("Como una 'i' sostenida y sonriente: iiiii", "Como el zumbido continuo de una abeja: zzzz").
   - `mouthTip`: posición exacta de labios, lengua y dientes.
   - `spanishTrap`: advertencia para hispanohablantes si el sonido altera el significado o delata acento.

4. **Zero-Boxes & Anti-Monolito**:
   - `PhoneticSoundRow.tsx`: 76 líneas (< 80 líneas).
   - `PhoneticsGuideView.tsx`: 78 líneas (< 80 líneas).
   - Cero contenedores tipo tarjeta con fondo o borde; pura tipografía flotante de alta jerarquía.
   - Test suite automatizado `englishPhonetics.test.ts` verifica la existencia física en disco de los 44 fonemas y todas las palabras de ejemplo.
