# Informe: voz, audio y guion en `celaest-english-front` (Pathway / A1)

**Fuente**: `ag_c68f_lingua.md` — 9.889 líneas, ~400 KB (volcado de Antigravity, con trazas `thought` crudas).
**Método**: grep sobre `speech|voz|audio|mp3|corte|silencio|manifest|solapa|Walter|Speechify|Fish|Kokoro|Chatterbox|caso|fórmula|pausa|TTS|Whisper|20.000|límite` + lectura íntegra de las secciones 1670-1830, 2740-2870, 2975-3120, 4110-4410, 5316-5560, 6170-6230, 6955-7120, 7440-7560, 7860-8020, 8060-8210, 8280-8450, 8570-8760, 8880-9250, 9350-9720.
**Alcance**: el dump empieza ya en la fase de voces; no contiene el diseño inicial del producto ni el detalle de las 32 bases una por una.

---

## 1. Bugs de voz y audio

| # | Síntoma | Causa raíz | Solución | Prevención |
|---|---|---|---|---|
| 1 | "Hablaba un robot completamente diferente" al acertar/fallar la trampa | Las frases de feedback, de fichas y de micrófono **no existían como MP3 ni en el manifest**; caía a `es-MX-JorgeNeural` o a la voz del navegador (L2999-3004) | 23 bifurcaciones generadas con Walter y registradas (L3015-3038) | Auditar **todas las ramas**, no solo el camino feliz |
| 2 | Voz cortada a mitad de frase | `setTimeout(proceed, 3800)` quemado; el audio dura **7,18 s** → corte en seco (L3007-3009) | Timers eliminados; transición por **`onEnd`** (L3040-3042, L3108) | Prohibido avanzar por reloj |
| 3 | Bienvenida con voz robótica de Azure | El manifest apuntaba a `base_06/seg_01.mp3`, archivo viejo de octubre en Azure (L3247) | `orientation_mobile.mp3` (591 KB) y `_desktop` (733 KB) regenerados con Walter (L3248, L3273) | Verificar ruta y voz de origen por entrada |
| 4 | Botón de escuchar del Reto con voz secundaria | `"I work every day."` no estaba en el manifest (L3259) | `trap_sample.mp3`, `trap_wrong.mp3`, `mic_error.mp3` (L3260-3263) | Un MP3 por frase pronunciable |
| 5 | Botón "EJEMPLO" leía un párrafo español con TTS | `if (cases.length > 1)` en `professorSpeech.ts`; con un solo caso caía al fallback que asignaba el párrafo completo (L3253) | Condición corregida y ejemplo mapeado | Cubrir `length === 1` en tests |
| 6 | "¡Base completada!..." con otra voz | Frase inexistente en el manifest; Walter grabó "¡Impecable! Base conquistada..." (L4271-4275) | Código alineado a la frase real + alias a `voice_victory_alt.mp3` (L4276) | **El código no inventa texto** |
| 7 | "I work as a Air Traffic Controller..." con voz Azure | El currículo interpolaba la profesión del perfil; no hay audio para profesiones arbitrarias (L4268, L4073) | Variable desacoplada; ejemplo universal "I work with my team every morning" (L4269) | Cero variables dinámicas en frases con audio |
| 8 | Palabras comidas al final de varios slices | Cortes por `silencedetect` sin auditar la onda: la "s" de "reales" estaba en 132,327 s y el corte en 132,30 (**27 ms antes**); "cuándo" en 77,2; "avance"; 675 ms de "intentarlo"; `mic_error` 1 s antes (L4258-4264) | Recalibrado a 132,55 / 77,75 / 218,8 / 227,6 / 227,8 s (L4259-4264) | ≥200 ms de silencio tras la última sílaba |
| 9 | Se cortaba y **seguía hablando encima** | `onStepTrigger("BUILD")` antes del fin del audio; al cambiar de paso se lanzaba un segundo audio y mataba el primero (L4356-4361, L5537-5539) | Transición post-audio + **`skipAudio: true`** (L4367-4368) | Una sola fuente de audio activa |
| 10 | En "2 Trampa" el audio se repetía y se cortaba | Dos momentos distintos apuntaban **al mismo** `seg_03.mp3` (L7978-7981) | `trap_intro.mp3` dedicado; `seg_03` solo para la explicación (L7983) | **Mapeo 1:1** momento ↔ pista |
| 11 | Bleed de la frase siguiente / frase inicial mutilada | `orientation_mobile` acababa en 36,8 s e incluía "Bienvenido a tu clase" (36,5 s); `lesson_intro` arrancaba en 37,0 y perdía el inicio (L4164-4187) | Límites `[0.0–35.4]` y `[35.6–56.6]` (L4182-4190) | Verificar inicio y fin escuchando, no solo el silencio |
| 12 | La trampa "se pasaba sola"; consola con `416 Range Not Satisfiable` y `EncodingError` | `base_03/seg_03.mp3` en **0 bytes**: el servidor devolvía 416, Web Audio fallaba y el reproductor saltaba de pantalla (L9146-9153, L9189) | Re-sintetizado (144.144 bytes, ~24 s) (L9190) | Gate: **>1000 bytes, 0 vacíos, 0×416** (L9573) |
| 13 | La Base 02 hablaba con guion y audios de la Base 01 | **Off-by-one**: `orderIndex` es base 0, pero se evaluaba `isBase01 = orderIndex === 1` (L8403-8418) | `=== 0` / `=== 1` en los 3 módulos (L8425-8435) | Contrato de enrutamiento + test por base |
| 14 | Base 01 "robótica" generada por script | Oraciones troceadas en 3-4 pedazos (la IA **reseteaba el tono**), downsampling 44,1 → **24 kHz** y pausas con fundidos (L6967-6970) | Regeneración en **una toma continua a 44,1 kHz** (L6980, L7239) | Tomas continuas, nunca 24 kHz |
| 15 | `"i ave 25 yiar"`, `"to be"` literal, pronombres como letras/números romanos, `"es is"`→`/esis/`, `"i an redi"` | Contaminación bilingüe: con 90 % de español el modelo conserva fonología española (h muda → "ave"; "years" → "yiar") (L9550-9555, L8890-8894); pronombres huérfanos (L8162, L8308); colisión "es is" (L8721) | Respelling ("tu bi", "el verbo tener"), elipsis, pronombre+acción, y **VÍA A** desacoplada (L8714-8727, L9006-9018) | 6 Leyes anti-error (§4) |
| 16 | Pausas "secas", sensación de corte de radio | Silencio digital 0.0, frases kilométricas sin respiración, puntas sin decaimiento (L6180-6182) | Unidades de aliento 300-480 ms, cosine 18 ms, **piso de aire -76 dB**, 0,95x/0,92x (L6184-6193) | Fades + aire en todo ensamblaje |
| 17 | Robot congelado en cara de felicitación, sin boca | `if (isConquered)` iba antes que `explaining` en `useProfessorStageState` (L7963) | Prioridad a `explaining` si `isSpeakingAudio`/`isDictating`; celebración acotada (L7966-7970) | La expresión se deriva del estado de audio |
| 18 | Móvil sin sonido hasta tocar; 404 cacheados | Autoplay bloqueado; Chrome Android cachea 404 (L7880, L2854) | Botón "Comenzar Clase" + toque en el mentor; recarga forzada (L7880) | Probar en móvil real |

---

## 2. Requisitos del usuario sobre guion y clase

1. **Una sola voz en todo el curso, con las ramas de error incluidas**: *"la idea es que todo el curso tenga solo 1 voz, que no cambie... hay que abarcar todos los casos de uso"* (L2771-2772); *"cero voces robóticas secundarias y cero cortes de audio a mitad de frase"* (L2991).
2. **Cubrir el 100 % de casos de uso, "tanto lo bueno como lo malo"**: acierto, error, reintento, silencio, permiso de micrófono (L2771, L4437-4445, L3098-3105).
3. **Explicar cada caso de uso de la fórmula, uno por uno**: *"cuando estemos en la formula, y hallan muchos casos de uso... no la juntes todas por que no se va a entender, si hay varios usos abordalos 1 a 1"* (L1675). Se ve en "Caso 1 · Yo (Am)", "Caso 2 · Él/Ella (Is)", "Caso 3 · Plurales/Tú (Are)" (L8594-8597).
4. **Guion para el oído, no para el ojo**: *"un modelo de voz jamás debe leer fórmulas escritas para los ojos (`+`, `:`, mayúsculas rígidas, barras), sino prosa escrita para el oído humano"* (L7093-7095); `Quién + Acción` → *"primero quién, más la acción"* (L7101-7107).
5. **"Más la acción": nunca pronombres huérfanos**: *"no poner verbo + acción sino verbo más la acción... la idea es ayudar completamente al modelo"* (L6796); *"Al decir 'I work... you work... o they work', el modelo no titubea"* (L8163-8167).
6. **Español e inglés deben distinguirse**: *"no esta diferenciando lo que es en español y lo que es en inglés, por ejemplo cuando dice we are ready, lo dice como en español"* (L8750) → **VÍA A**: pista española del mentor + pista inglesa pura aislada (L8927-8934, L9006-9018).
7. **No decir la fórmula dos veces ni duplicar audio**: origen en *"cuando dice 'si te surge cualquier duda toca aquí abajo', lo dice y sigue diciéndolo después del corte"* (L4117); se resuelve con `skipAudio: true` (L4368).
8. **Terminar siempre la frase completa antes de pasar**: *"en esta parte se corta ya terminando, para pasar, no termina, necesito que todo se oiga perfectamente"* (L4114).
9. **Pausas explícitas**: 1,5-2 s entre párrafos para `silencedetect` (L4377, L4447); elipsis `...` = 300-400 ms (L8313); **380 ms** antes del modelo, **750 ms** de absorción, **260 ms** en transiciones (L9572); 450 ms antes del inglés en la calibración de Andrew (L7056).
10. **Tono**: cálido, humano, de profesor real, no locutor corporativo (*"las voces excesivamente solemnes o corporativas... intimidan al alumno principiante de A1"*, L6264); el audio oro se describe *"cálido, empático, con pausas naturales... fonética nativa americana perfecta, sin acento robótico"* (L2286).
11. **Exigencia absoluta**: *"a esta calidad, ni un solo grado abajo"* (L5328); *"necesito lo mejor de lo mejor"* (L5329).
12. **Frases cortas para A1**: *"instrucciones ultracortas (3 a 5 segundos) e interacción motriz inmediata"* (L8913).
13. **No romper el diseño premium al arreglar el audio**: *"dañaste todo el diseño premium"* (L8102) → se eliminó la fila `ABRE CON: [I][you][we][they]` (L8152-8157).
14. **Interactividad en la misma tarjeta**, retos de retención y de voz sin ir a la pizarra en móvil (L1672, L1674, L1724); cada animación en su caso de uso, sin sobrecomplicar (L765, L1207).

---

## 3. Errores de proceso y cómo se detectaron

| Error | Evidencia | Lección |
|---|---|---|
| **Trabajar a ciegas con relojes** | *"eran `setTimeout(2400)`... Eso no es dinamismo guiado por la voz; es un reloj ciego de JavaScript"* (L8897-8898) | Lo detecta el usuario ("no está funcionando el dinamismo", L8750) |
| **Asumir que la frase existe** | `playAudio("...")` con textos nunca grabados (L3004, L4268, L4273) | El síntoma (voz distinta) solo aparece en ese botón; se corrigió auditando las 28 ramas (L3269) |
| **Diagnosticar sin abrir el archivo** | Traza `thought` L4124-4142: hipótesis erradas ("¿el usuario cambió su profesión a 'team'?") antes de mirar el MP3 | Al abrirlo, `seg_06.mp3` **sí** decía la frase |
| **No verificar producción vs local** | `module1Identity.ts` sin commit ("no subas nada hasta que lo probemos") → Vercel con texto viejo (L4131-4135) | El usuario oía algo distinto de lo que el agente probaba |
| **Cortar por silencio sin revisar la onda** | 27 ms cortaban la "s" final (L4258) | Detectado *"al auditar la onda con decibeles reales"*: el `silencedetect` propone, el oído confirma |
| **Declarar "100 % / blindado" antes de que el usuario oyera** | L3055, L3088, L3117-3120 vs. el reporte de cortes tres turnos después (L4114-4117) | No cerrar con gates verdes: cerrar cuando el usuario escucha |
| **Arreglar audio rompiendo la UI** | Fila de botones añadida a la pizarra (L8102, L8146) | Todo fix de audio pasa también por revisión visual |
| **Explicar el bug con "es caché"** | *"no sé si es caché... me habla con lo de la base 1"* (L8104) → era off-by-one (L8403) | Reproducir en local antes de atribuir a caché |
| **No auditar todas las ramas de voz** | El usuario tuvo que pedirlo (L2771) | Origen de la matriz de casos y del auditor de 28 rutas |
| **Ignorar el móvil** | Autoplay, encuadre de cabeza, 404 cacheados (L7880, L8600) | Gate: probar en celular antes de decir "listo" |
| **No persistir los errores** | Pedido explícito: *"todos esos errores ve metiéndolos en la memoria"* (L8103, L9159) | Nacen los contratos Serena (§4) |

---

## 4. Reglas, gates, scripts

**Reglas de audio**
- **Una sola voz** por base y rama; TTS de respaldo prohibido (quedó deshabilitado: *"synthetic fallback is disabled. Skipping browser TTS"*, L9151-9153).
- **Zero blind timers**: todo por `onEnd` o metadatos (`trapPhase: 0,1,2`, L9571).
- **Mapeo 1:1** audio↔momento pedagógico (L8320-8322); alias solo como red de seguridad (L4276).
- ≥200 ms de silencio tras la última sílaba (L4259); fades cosine 12-18 ms (L6191, L7058); aire a -76 dB (L6192); `-4 %` español / `-6 %` inglés (L7052-7054); tomas continuas a 44,1 kHz (L6980).

**7 Ayudas de Oro** (contrato `pathway_model_oral_assistance_and_sota_scripting_standard`, L8304-8326): 1) más la acción; 2) elipsis `...` 300-400 ms; 3) cero símbolos matemáticos; 4) ancla en español antes del inglés; 5) mapeo 1:1; 6) coreografía visual sincronizada; 7) Obsidian Glass puro. Se suma el respelling de anglicismos (`to be`→"tu bi", `don't`→"dóunt", `does`→"dás", `have`→"tener") (L8739, L9114, L8846).

**6 Leyes anti-error** (`pathway_speech_and_dynamism_anti_error_standard`, L9562-9573): 1) cero mezcla bilingüe en un texto (inglés en segmento `language: "en"`); 2) VÍA A también en la trampa (intro es → error en → transición es → forma natural en → ancla es); 3) adaptación fonética (nunca "el verbo have"); 4) dinamismo por eventos; 5) cadencia 750/380/260 ms; 6) quality gate de audio.

**Scripts y verificaciones**
- `scripts/verify_base01_manifest.mjs`: **28 entradas / 23 MP3** validados en disco (L3048, L4008, L4283), nacido de las "28 ramas de voz posibles" (L3269).
- `scripts/slice_base01_studio.mjs`: corta el master en 23 tomas con límites verificados (L3991), tras probar candidatos en `test_slices.mjs` (L3747).
- `scripts/slice_a1_mega_download.mjs`: detecta silencios y distribuye en `base_02..base_32` (L5380-5385).
- `npm run audit:hardcode` → 0 violaciones (L2075, L8357); `npx tsc --noEmit` → 0 errores; `vitest run src/features/pathway/` → **29/29** (L3049-3051, L9591).
- `HTTP 200 OK` por audio en producción + peso real (44-420 KB) (L3117, L2847); gate `>1000 bytes / 0 vacíos / 0×416` (L9573).
- `batch_synthesize_pathway_bases.py`: lee el blueprint, aplica las 7 reglas, llama a Edge-TTS Andrew `-4%`, guarda y actualiza el manifest; 5 bases (~50 audios) en 90 s (L9109-9118).
- Manifest con **501 variantes normalizadas** tras la Base 03 (L8610).
- Contratos Serena: `pathway_single_walter_voice_and_zero_cutoff_standard`, `pathway_multicase_formula_pedagogy_and_zero_emoji_standard`, `pathway_node_order_index_and_multibase_routing_contract`, `pathway_model_oral_assistance_and_sota_scripting_standard`, `pathway_speech_and_dynamism_anti_error_standard`.

---

## 5. Los "10 casos de uso"

**No están enumerados en el dump.** Solo se mencionan y se enlazan a un archivo externo no incluido: *"Te dejé la auditoría cruda completa y la matriz de los 10 casos de uso en `a1_class_audit_and_unified_mobile_flow.md`"* (L1721). Cualquier lista de 10 sería inventada.

Lo más cercano que **sí** aparece:
- **Checklist de 8 bloques por base** (L4437-4445): intro · fórmulas (2-3 usos) · trampa del español · reto caza-la-trampa (pregunta + opción mala + buena + feedback error + feedback acierto) · ejemplos (ej.1 + secreto fonético + ej.2) · transición a fichas · build (error + acierto) · reto oral (instrucción + muestra + reintento + no escuchado + micro bloqueado + victoria).
- **Suite de 22 casos** con audio real de dos voces (L7494-7519), en Fase 1 La Regla (13), Fase 2 Build (3), Fase 3 Speak (6). De ahí salen 10 casos de voz/error identificables: #5 trampa común, #7 feedback error, #8 feedback éxito, #10 truco fonético, #15 build error, #16 build éxito, #19 reintento "¡Casi!", #20 no escuchado, #21 permiso de mic, #22 victoria.

---

## 6. Contexto de producción

A1 = **32 bases** en 6 módulos (L5347-5352). Guion Bases 02-32: **687 tomas / 76.648 caracteres** (L5354, L6571). Límite de Speechify Studio: **20.000 caracteres por proyecto** → 5 bloques de 16.638 / 17.300 / 15.384 / 17.404 / 10.600 (L5649-5657, L5849-5853). Cadena de voces: Walter `simba-3.2` (oro, 48 kHz) → Fish Audio S2.1 Pro → Liam Kokoro (inglés local) → **Andrew Multilingual `-4%`** (decisión final: gratis, sin cuotas, L7044, L7275) → VÍA A desacoplada (L9006). Descarte de locales: RTX 3050 de **4 GB VRAM**; Fish Speech/F5-TTS piden 8-16 GB (L5497).

## 7. Lo que el archivo NO contiene

La matriz de 10 casos de uso (solo el enlace); el detalle de las bases 05-32 (se anuncia el lote, no el resultado); evidencia de aprobación del usuario al estándar final VÍA A (el dump termina con la Base 05 en generación, L9747); métricas objetivas de audio (MOS, LUFS): todas las evaluaciones son perceptuales ("10/10", "suena robótico").
