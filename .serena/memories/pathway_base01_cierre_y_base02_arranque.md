# Estado Pathway — cierre Base 01 y Base 02

## Base 01: cerrada y verificada

- **Audio**: 30 clips en `public/audio/pathway/a1/base_01/` (`<id>.mp3`), voz `v2_expresivo`
  (Chatterbox, ref `_voces/ref_larga.wav`, exaggeration 0.7, cfg_weight 0.3, temperature 0.8, seed 11).
- **Guion**: `src/features/pathway/speech/profiles/base_01.ts` (30 momentos, 23 es + 7 en).
- **Tipos**: `src/features/pathway/speech/types.ts` (`SpeechMoment`, `SpeechCue` con
  `formulaRevealCount`, `activeFormulaCaseIndex`, `activeExampleIndex`, `trapPhase`; `PAUSE` 750/380/260).
- **Manifiesto**: `a1AudioManifest.json` reconstruido desde el perfil (una entrada por momento).
  Se borraron 737 mapeos muertos que apuntaban a archivos equivocados.
- **Motor**: `PathwayLectureEngine.ts` emite los segmentos de Base 01 desde el perfil
  (`isBase01`, beats FORMULA/TRAP/TRAP_CHECK/EXAMPLES; BUILD va con `targetStep`, no con beat).
- **Hook**: `usePathwayStageSession.ts` y `useLiveClassChoreography.ts` leen del perfil
  con `orderIndex === 0`, dejando el texto viejo como respaldo para las demás bases.
  SPEAK encadena 3 pistas (lead es → modelo en → instrucción es).
  El micrófono reproduce `speak.model` antes de abrirse (tope 4 s).
- **Observabilidad**: `pathway/audio/pathwayAudioLog.ts` registra HIT/MISS/PLAY_ERROR en
  localStorage (anillo 500) y `window.__pathwayAudio` (missing/stats/jsonl/download).
  `speak()` lo alimenta: una línea sin mp3 ya no cae en silencio a la otra voz.
- **Red**: `speechCoverage.test.ts` (3 invariantes: cobertura del motor, diálogos de Base 01,
  manifiesto sin huérfanos) con `CLOSED_BASES` para cierre progresivo.
- **Estado**: `tsc --noEmit` 0, `vitest src/features/pathway` 32/32.

### Bugs corregidos en esta etapa
1. La trampa de Base 01 apuntaba a `seg_02` (bienvenida) y el trap check a audio de `base_05`.
2. `activeExampleIndex` no se enviaba: la pizarra resaltaba siempre la tarjeta 0.
3. `subtitleSpanish` usaba el texto con respelling ("ai, iu, wi, o dei"); ahora usa `canonical`.
4. `BUILD` no es un `LiveClassBeatId` válido: se marca con `targetStep`.
5. Guarda de SPEAK marcaba "ya habló" antes de comprobar si el audio estaba libre → silencio sin error.
6. Redundancia: la regla se decía 3 veces al inicio; detector de n-gramas en 0.

### Pendiente menor
`"¡Perfecto! Pusiste primero 'I' (Quién) y luego 'learn' (Acción)."` viene de
`module1Identity.ts:56` (`successTipSpanish`) y **es contenido pedagógico, no adorno**.
Decisión sugerida: conservarlo, o quitar solo el `✓` verde, no el texto.

## Base 02: cerrada y verificada

- **Guion**: `src/features/pathway/speech/profiles/base_02.ts` (32 momentos, 24 es + 8 en),
  fiel a `speech/sources/base_02.json` con las mismas reglas de edición de Base 01.
- **Dos casos de fórmula** (la regla tiene dos usos y los dos se explican):
  `formula.case1.*` clima/hora (`It is cold today.`) y `formula.case2.*` opiniones neutras
  (`It is important today.`), con `activeFormulaCaseIndex` 0/1 y badges
  "FÓRMULA · CASO 1 DE 2" / "CASO 2 DE 2" para que las pestañas de la pizarra avancen.
- **Audio**: 32 clips en `public/audio/pathway/a1/base_02/` (`<id>.mp3`), misma voz y parámetros
  que Base 01. Gate Whisper small: mínimo 0.964 (las dos intros de caso). Ojo: `small` oye
  "lices" por "dices" y "en estado" por "el estado"; **Whisper medium transcribe ambos correctos**,
  así que no se regeneró. `trapcheck.success` sí se reescribió
  ("…Ahora escucha cómo suenan los ejemplos reales") porque "suena en ejemplos" se ligaba
  a "suenan" y el ASR nunca pasaba de 0.94.
- **Manifiesto**: `a1AudioManifest.json` reconstruido desde el perfil (+42 entradas, 87 totales).
  Sigue indexado por texto sanitizado: los textos repetidos comparten mp3
  (`It is cold today.` en `formula.case1.model`, `trap.right` y `speak.model`).
- **Registro**: `speech/profiles/index.ts` (`speechProfiles`, `resolveSpeechProfile` con respaldo
  por título, `speechMomentText`). Motor y hooks ya no ramifican por `orderIndex`: leen el perfil
  y solo caen al literal viejo si la base no está registrada (03-05 siguen como estaban).
- **`SpeechMoment`** ahora acepta `badgeLabel` (badge propio de la pista) y el motor copia
  `cue.activeFormulaCaseIndex` al segmento: sin eso, la pizarra se quedaba en el caso 1.
- **Ids de Base 02**: `trap.models`, `example.sunny`, `example.important`; el resto de diálogos
  conserva los ids de Base 01 para que los hooks los encuentren.
- **Test**: `speechCoverage.test.ts` con 4 invariantes, incluidas "cada momento de los perfiles
  registrados tiene audio propio" y "los perfiles cubren los ids que leen los hooks".
  `CLOSED_BASES = ["base_01", "base_02"]`.
- **Estado**: `tsc --noEmit` 0, `vitest src/features/pathway` 33/33.

## Base 03: perfil escrito, audio pendiente de OK

- `speech/profiles/base_03.ts` (34 momentos, 25 es + 9 en), **aún no registrado** para que no
  suene sin mp3.
- Tres casos de fórmula con badge "FÓRMULA · CASO 1/2/3 DE 3":
  `I am ready today.` / `She is very focused right now.` / `We are ready to start.`
- Trampa: `She are ready.` vs `She is ready.`; ejemplos: `I am ready to start my lesson.` y
  `She is very focused right now.`; voz objetivo: `I am ready today.`
- Regla de idioma: "are" va respelling `ar` en la pista española (TTS es leería "a-re"),
  con `subtitle` mostrando 'are'.
- Siguiente al aprobar: `gen_base03.py` (copia de `gen_base02.py`), alta en el registro,
  `CLOSED_BASES` con base_03 y anotar los ids nuevos en los hooks si hiciera falta.

## Herramientas listas
`faster-whisper` (QA local, small para el gate y medium para desempatar), `chatterbox-tts`
(clonación), `edge_tts`, `ffmpeg`.
Scripts de trabajo en `default-workspace`: `gen_base01.py` / `gen_base02.py`
(generación + manifiesto con gate, reanudables) y `regen_base02.py` (pistas puntuales, 9 semillas).
