# Contrato de Arquitectura: Alfabeto Fonético y Guía Unificada en Modal

## Decisiones Clave
1. **Administración del Header: Selector Minimalista de Tipografía Flotante (Zero-Boxes & Menos es Más)**:
   - Se eliminaron completamente las cajas y botones pesados tipo píldora que saturaban la cabecera del modal (`GuideHeaderTitle.tsx`).
   - El selector se redujo a su máxima pureza estética: **tipografía flotante con subrayado activo violeta (`#A78BFA`)** y un punto separador tenue (`·`):
     ```
     Estructura   ·   Alfabeto Fonético
     ──────────
     ```
   - **Opción activa**: Texto blanco nítido (`text-white font-medium`) con indicador lineal inferior (`h-[2px] bg-[#A78BFA] rounded-full`).
   - **Opción inactiva**: Texto suave (`text-white/40`) con hover sutil (`hover:text-white/80`).
   - **Accesibilidad WAI-ARIA**: `role="tablist"`, `role="tab"`, `aria-selected`, navegación por teclado con flechas izquierda/derecha (`ArrowLeft`/`ArrowRight`).
   - El icono del modal se mantiene en `BookOpen` (consistencia visual fija), mientras que el subtítulo se adapta contextualmente.

2. **Alfabeto Fonético Completo (44 Fonemas con Voces Humanas de Estudio)**:
   - Dividido en 5 pilares completos oficiales:
     1. Vocales Cortas & Schwa (7 fonemas: /ə/, /ɪ/, /e/, /æ/, /ʌ/, /ʊ/, /ɒ/).
     2. Vocales Largas (5 fonemas: /iː/, /uː/, /ɑː/, /ɔː/, /ɜː/).
     3. Diptongos Vitales (8 fonemas humanos: /eɪ/, /aɪ/, /ɔɪ/, /aʊ/, /oʊ/, /ɪə/, /eə/, /ʊə/).
     4. Fricativas & Trampas (11 fonemas humanos de una sola articulación limpia).
     5. Oclusivas & Nasales (13 fonemas humanos de una sola articulación limpia).
   - Grabaciones humanas nativas auténticas con cero sonido a robot.

3. **Ejemplo del Tema Siempre al Final ("de última")**:
   - `AnatomyPillarSection` renderiza cualquier slot especial (como la Fórmula Universal del Bloque 14) como `children` ANTES de `AnatomyShowcaseExample`.
   - Asegura que el ejemplo contrastivo siempre sea la culminación final antes del footer de navegación.

4. **Zero-Boxes y Anti-Monolito**:
   - `GuideHeaderTitle.tsx`: 74 líneas (< 80 líneas).
   - `PathwayAnatomyModal.tsx`: 77 líneas (< 80 líneas).
   - Tipografía flotante, cero contenedores pesados ni cajas innecesarias.
