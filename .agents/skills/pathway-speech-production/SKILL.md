---
name: pathway-speech-production
description: >-
  Protocolo anti-error de extremo a extremo para producir clases de CELAEST Pathway (A1 en adelante):
  auditar los casos de uso de la fórmula en el currículo, escribir el perfil de guion declarativo,
  pedir aprobación del guion, generar y validar el audio con una sola voz, reconstruir el manifiesto,
  cablear motor/hooks y cerrar la base con gates automáticos. Usar siempre que se trabaje en una base
  de Pathway, en speech/profiles, en a1AudioManifest.json, en la generación de voz (Chatterbox/TTS),
  en la pizarra en vivo (fórmula, trampa, caza la trampa, ejemplos, build, speak) o cuando el usuario
  diga "base N", "guion", "speech", "audio", "voz", "se oye otra voz", "se corta", "falta un caso".
---

# Pathway Speech Production — flujo anti-error

> **Mandato**: una base no está lista porque "suena bien". Está lista cuando **el perfil, el audio,
> el manifiesto, el motor, los hooks y los tests** están verdes y el usuario escuchó y aprobó.
> Nada se declara terminado con medición parcial ni con "debería funcionar".

Este documento captura los errores reales pagados entre octubre y noviembre de 2026 en el chat de
Antigravity (`c68f979d…`, 9.543 pasos), en el chat de planificación de la clase
(`1284bf16…`), en las memorias `.serena/memories/pathway_*` y en la producción de Base 01/02.
Si una regla está acá, es porque ya costó una regresión.

**Fuentes verificables** (bundled en `references/`):
- `references/user-requests.md` — 103 pedidos textuales del usuario en el chat de Antigravity.
- `references/voice-audio-bugs.md` — 18 bugs de audio con causa y solución.
- `references/class-10-use-cases.md` — matriz UC-01…UC-10 y decisiones de producto.

---

## 0. Cómo se invoca

Pegar en el agente:

> «Usá la skill **pathway-speech-production** para la base 0N. Empezá por F0 (auditoría del
> currículo), escribí el perfil, validalo y mostrame la ficha + el guion. **No generes audio**
> hasta que lo apruebe. Una base a la vez.»

El agente debe responder con la ficha de base, el resultado de `validate_profile.py` y la tabla del
guion. Si salta directo a generar audio o a tocar código, se está saltando la ley 5.

---

## 1. Las 12 leyes inviolables

1. **Una sola voz en todo el curso.** La misma voz para explicación, trampas, ejemplos, aciertos,
   errores, reintentos, "no te escuché" y "micrófono bloqueado". Si una frase no tiene MP3 propio,
   se prohíbe el fallback silencioso a otra voz (`preventSyntheticFallback: true`).
2. **Una pista = un idioma.** El español nunca contiene una oración en inglés. El inglés nunca
   comparte archivo con el español. Las parejas gramaticales (`am`, `is`, `are`, `not`) se pueden
   nombrar en español; las frases completas, no.
3. **Cada caso de la fórmula se explica 1 a 1.** Si la regla tiene N casos, hay N pares
   `intro (es) → modelo (en)`, cada uno con su `activeFormulaCaseIndex` y su `badgeLabel`.
   Nunca se juntan todos en un párrafo.
4. **El guion se escribe para el oído, no para el ojo.** Frases cortas, sin símbolos, sin leer la
   tarjeta, sin repetir la regla tres veces, sin muletillas de bienvenida en cada base.
5. **El guion se aprueba antes de generar audio.** Se muestra la tabla completa de pistas y las
   decisiones; se espera un "dale" explícito. Generar 40 pistas de un guion no aprobado es tiempo perdido.
6. **El perfil es la única fuente de verdad.** Textos, cues, idioma, pausas y badges viven en
   `speech/profiles/base_XX.ts`. El motor y los hooks leen de ahí; no hay literales por base.
7. **El manifiesto se genera, nunca se edita a mano.** Se reconstruye por base desde el perfil.
8. **Los cues gobiernan la pizarra, no los timers.** `trapPhase`, `formulaRevealCount`,
   `activeFormulaCaseIndex`, `activeExampleIndex`. Cero `setTimeout` ciegos.
9. **Cobertura total.** Todo lo que el sistema puede pronunciar (incluidos error, reintento,
   no escuchado, micrófono y victoria) tiene MP3. `CLOSED_BASES` no se toca sin el gate en verde.
10. **Nada se corta ni se solapa.** Pausas canónicas, cortes con margen, archivos > 1000 B, cero
    HTTP 416, cero bleed entre pistas, cero `play()` pisado.
11. **Cero sobreingeniería, cero emojis, cero cambios no pedidos.** No se refactoriza lo que el
    usuario ya certificó; no se "mejora" el diseño sin pedido; no se agregan features.
12. **Honestidad cruda.** Si no se verificó, se dice. Si un test falla en `HEAD` por deuda previa,
    se aclara. Si una pista quedó en 0.96, se muestra la transcripción antes de defenderla.

**Si se viola una ley, se detiene el trabajo y se avisa. No se sigue "a ver si sale".**

---

## 2. Mapa del sistema (dónde vive cada cosa)

| Artefacto | Ruta |
|---|---|
| Contrato de guion | `src/features/pathway/speech/types.ts` (`SpeechMoment`, `SpeechCue`, `PAUSE`) |
| Perfil por base | `src/features/pathway/speech/profiles/base_XX.ts` |
| Registro de perfiles | `src/features/pathway/speech/profiles/index.ts` (`resolveSpeechProfile`, `speechMomentText`) |
| Motor de clase | `src/features/pathway/services/PathwayLectureEngine.ts` |
| Hooks de sesión | `hooks/usePathwayStageSession.ts`, `hooks/useLiveClassChoreography.ts` |
| Manifiesto texto→mp3 | `src/features/pathway/data/a1AudioManifest.json` |
| Audio | `public/audio/pathway/a1/base_XX/<id>.mp3` |
| Test de cobertura | `services/__tests__/speechCoverage.test.ts` |
| Currículo (fuente pedagógica) | `curriculum/a1/moduleN*.ts` → `formulaCases`, `commonMistake`, `examples`, `blockChallenge`, `voicePractice` |
| Guion original del autor | `speech/sources/base_XX.json` |
| Scripts de producción | `default-workspace/gen_base0N.py` o los de esta skill |

Regla de oro del manifiesto: **la clave es el texto sanitizado**, no el id. Si dos bases comparten
texto, comparten MP3 → una base habla con la voz/el audio de la otra. Por eso cada base usa textos
propios (aunque digan lo mismo, se reformulan).

---

## 3. Matriz de casos de uso (lo que hay que cubrir siempre)

| UC | Caso de uso | Pistas / ids que lo cubren | Gate |
|---|---|---|---|
| UC-01 | Orientación única del software (solo 1.ª vez, Base 01) | `SOFTWARE_GUIDE_ORIENTATION_TEXT` + `orientation_mobile.mp3` / `orientation_desktop.mp3` + flag `localStorage` | Se dice una sola vez; no se repite en bases 02+ |
| UC-02 | Explicación de la regla y fórmula | `formula.rule` + por caso `formula.caseN.intro` (es) y `formula.caseN.model` (en) | N casos = N pares; tabs y badges |
| UC-02b | Trampa del español | `trap.intro`, `trap.models`, `trap.intro.b`, `trap.wrong`, `trap.pivot`, `trap.right`, `trap.anchor` | `trapPhase` 0→1→2, error y forma natural en inglés |
| UC-02c | Caza la trampa (discriminación) | `trapcheck.intro`, `trapcheck.error`, `trapcheck.success` | No avanza sin click; feedback en la misma voz |
| UC-03 | Ejemplos y secreto fonético | `example.<x>` (en) + `example.phonetic` (es con `canonical`) | `activeExampleIndex` 0..N-1; el fonético con respelling |
| UC-04 | Preguntar (duda libre) | Respuesta IA en vivo (no pregrabada) | Excepción documentada: no entra al manifiesto |
| UC-05 | Activación de pizarra / BUILD | `build.transition`, `build.intro` | `targetStep: BUILD`, sin solapar con el step |
| UC-06 | Error al construir | `build.error` | Misma voz, sin regaño, pista accionable |
| UC-07 | Acierto al construir | `build.success` | Auto-avance ~2.2 s, sin doble audio |
| UC-08 | Escucha del modelo y micrófono | `speak.lead` (es), `speak.model` (en), `speak.instruction` (es) | 3 pistas encadenadas por `onEnd` |
| UC-09 | Evaluación real de voz | `voice.retry`, `voice.not_heard`, `mic.error` | Whisper real; 0 omisiones = no aprobado; escape solo tras 2 fallos |
| UC-10 | Base conquistada y puente | `voice.victory` + UI de siguiente base / práctica | Celebración + persistencia real |

**Ids de hook obligatorios** (el test falla si falta uno): `build.transition`, `build.success`,
`build.error`, `speak.lead`, `speak.model`, `speak.instruction`, `voice.victory`, `voice.retry`,
`voice.not_heard`, `trapcheck.error`, `trapcheck.success`, `mic.error`.

---

## 4. Flujo por base (8 fases, en orden, sin saltos)

### F0 · Auditar el currículo antes de escribir una línea
Leer el bloque de la base en `curriculum/a1/moduleN*.ts` y el `speech/sources/base_XX.json`.
Completar la **Ficha de base** (plantilla §12) con:

- `title`, `focus`, `orderIndex`, `targetSentence` (`voicePractice.sentenceEnglish`).
- **Número de `formulaCases`** y el ejemplo de cada caso (assert: N casos escritos = N explicados).
- `commonMistake` (wrong / correct / whySpanish) y `examples` (2, con `pronunciationHint`).
- `blockChallenge` (`targetTokens`, `distractorTokens`, `successTipSpanish`, `mistakeHintSpanish`).
- Frase objetivo de voz y su significado.

> **Regla**: si el currículo declara 2 casos y el perfil explica 1, la base está incompleta
> aunque suene perfecta. Este fue el defecto real de Base 02 ("opiniones neutras").

### F1 · Escribir el perfil
Orden canónico de momentos:
`welcome, why, why.promise, formula.rule, formula.case1.intro, formula.case1.model,
[case2…], trap.*, trapcheck.*, example.*, build.*, speak.*, voice.*, mic.error`.

Reglas de autoría en §5 y §6. Ids semánticos y estables. `pauseAfterMs` siempre.

### F2 · Validar el perfil y la calidad del guion (sin GPU)

```bash
# Contrato duro (estructura, casos, ids, colisiones)
python .agents/skills/pathway-speech-production/scripts/validate_profile.py \
  --profile src/features/pathway/speech/profiles/base_03.ts --cases 3

# Calidad (pedagogía, flujo, fluidez, casos de uso)
python .agents/skills/pathway-speech-production/scripts/pathway.py guion --base base_03 --cases 3
```
Los dos deben dar **PASS / 0 errores** antes de mostrar el guion. Las advertencias se leen: cada una
nombra la pista y el motivo. Un guion con errores de calidad no se genera (el `build` aborta).

### F3 · Mostrar el guion y esperar OK
Tabla por bloque (id, beat, idioma, texto, cue, pausa) + decisiones + qué **no** se incluye.
No se genera audio hasta el "dale".

### F4 · Generar audio con gate

> **Atajo de control total**: `python …/pathway.py build --base base_03 --cases 3` ejecuta F4–F7
> de una sola vez: audita, genera solo lo que falta/falla, re-audita y corre los tests. Los comandos
> de abajo son el detalle por fase (útiles para depurar).

```bash
python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_03 --dry-run
python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_03
```
Gate: Whisper con idioma forzado contra `canonical` o `text`, ratio ≥ 0.95, 3 semillas, incremental.
Si falta la voz de referencia: `PATHWAY_TTS_REF` o `--ref`.

### F5 · QA de audio
```bash
python .agents/skills/pathway-speech-production/scripts/pathway.py audit --base base_03 --cases 3
```
El audit re-mide con Whisper las pistas sin ratio o bajo el gate (estado viejo o dudoso) y escribe
`.pathway_reports/base_03.md` con cada pista y cada gate. No hace falta escuchar una por una: el
reporte dice cuál falta, cuál apunta a otra base, cuál está vacía y cuál no pasa el gate.
Después: escuchar una muestra (fórmula, trampa, speak, victoria) y leer el JSON de QA completo.
Si una pista correcta quedó bajo el gate por una variante del ASR (seseo, `tu bi`), re-evaluá sin
regenerar: `gen_base.py --base base_0N --only id --qa-only --force --qa-model medium`.

### F6 · Cablear
- Registrar el perfil en `speech/profiles/index.ts` (import + array `speechProfiles` + hint de título).
- El motor ya es genérico: **verificar que copia todos los cues**, sobre todo
  `activeFormulaCaseIndex` y `badgeLabel` (si falta, las pestañas se quedan en el caso 1).
- Los hooks leen ids fijos: si un id cambió, actualizar el hook o mantener el id.
- Añadir la base a `CLOSED_BASES` del test de cobertura.

### F7 · Cerrar
```bash
npx tsc --noEmit
npx vitest run src/features/pathway
```
Debe quedar 0 errores y todos los tests verdes. Luego QA visual (móvil y desktop): fórmula revela
1→2→3 a mitad de la explicación, trampa tacha en rojo con el error y verde con la forma natural,
tabs de casos avanzan, BUILD no solapa, SPEAK encadena tres pistas.

### F8 · Siguiente base
Actualizar memoria Serena (`.serena/memories/`) con: ids nuevos, ratios, decisiones y pendientes.
No se empieza la base N+1 con la N en rojo.

---

## 5. Cómo se escribe el guion

### 5.1 Reglas duras
- **Un idioma por pista.** El conector español termina en `:` y la frase inglesa va en su propia pista.
- **Un caso por par de pistas.** `formula.caseN.intro` (es) + `formula.caseN.model` (en).
- **No leer la tarjeta.** El audio explica; no recita el texto que ya está en pantalla.
- **No repetir la regla.** Se dice una vez en `formula.rule`, una vez por caso y una vez en el ancla.
- **Sin muletillas** ("Bienvenido a la clase" en cada base) ni relleno de software.
- **Frases de 3–5 s para A1.** Una idea por pista; ~45 palabras es el techo.
- **Sin símbolos que el TTS verbalice**: `+`, `/`, `&`, `#`, comillas, paréntesis, `...`.
  Se reemplazan por puntuación real y `pauseAfterMs`.
- **Números y horas escritos como se dicen** ("las ocho", "veinticinco"), no `8:00` ni `25`.
- **"más", no "+"**: "verbo más la acción" (el modelo lee el `+` como "más" o lo ignora).
- **Listas**: en su propia pista inglesa, con comas y pausas ("I, you, we, they.").
- **Textos únicos por base**: reformular aunque el mensaje sea el mismo (colisión de manifiesto =
  audio de otra base).
- **Trampa**: primero el error en inglés, luego el pivote en español, luego la forma natural en inglés.
- **Fonética**: `text` con respelling y `canonical` con ortografía académica para el QA.

### 5.2 Respelling para pistas en español (Ley 3)
| Se quiere decir | Se escribe |
|---|---|
| to be | `tu bi` |
| I | `ai` |
| you | `iu` |
| we | `ui` |
| they | `dei` |
| are | `ar` |
| am / is / not | `am` / `is` / `not` (fonética compatible) |
| have (verbo) | `el verbo tener` (nunca "have": suena "ave") |
| ready | `ré-di` dentro de un ejemplo fonético |
| years | `yiar` solo si es cita fonética |

Los subtítulos (`subtitle`/`canonical`) mantienen la ortografía académica. El audio nunca miente
sobre lo que se ve en pantalla.

### 5.3 Anti-patrones de texto (vistos en producción)
| Anti-patrón | Por qué falla | Correcto |
|---|---|---|
| "I am ready" dentro de un párrafo español | El TTS aplica fonética española: "i an redi" | Pista `language: "en"` aparte |
| "el verbo to be" | Suena /to be/ | "el verbo tu bi" |
| "verbo + acción" | El `+` se lee o se corta | "verbo más la acción" |
| "I, you, we, they" en pista española | Se lee como letras/números romanos | Pista inglesa propia, comas |
| `8:00 AM` | Se verbaliza raro | "a las ocho de la mañana" |
| "not" en pista española | El TTS español pierde la t: suena "no" | Describir "la palabra de negación"; la pizarra/modelo muestran "not" |
| Coletilla al final de una frase EN corta ("… Joe, that's Dane J.") | Alucinación de cola del modelo | El gate de ratio la marca; regenerar con más semillas |
| `...` como pausa | El modelo alarga o ignora | Puntuación real + `pauseAfterMs` |
| Regla explicada 3 veces | Redundancia y aburrimiento | Una vez + ancla final |
| Frase de 60 palabras | Se corta o pierde entonación | Partir en 2–3 pistas |

---

## 5.4 Un guion "perfecto" se mide en 4 dimensiones

`pathway.py guion --base base_0N --cases N` corre el linter de calidad y devuelve **0 errores**
solo si el guion es bueno en las cuatro. No es una opinión: cada hallazgo trae el id y la frase.

| Dimensión | Qué se exige | Ejemplos de hallazgo |
|---|---|---|
| **Pedagogía** | N casos anunciados uno por uno (`Primer uso…`), regla que anuncia varios usos, trampa con pivote y ancla, 2 ejemplos, fonética con *linking*, `speak.model` = `targetSentence`, cero párrafos repetidos (similitud ≥ 82 %) | `formula.rule no anuncia que hay varios casos`; `caso 2 sin intro`; `speak.model no coincide con targetSentence` |
| **Flujo del sistema** | orden FORMULA→TRAP→TRAP_CHECK→EXAMPLES→BUILD→SPEAK; pausa 380 antes del modelo de la misma idea, 750/380 tras inglés, 260 en transiciones; cues que no retroceden; inglés siempre precedido de español | `pausa 260 antes del modelo inglés (esperado 380)`; `activeExampleIndex retrocede`; `el inglés no viene precedido de un conector` |
| **Fluidez** | oraciones ≤ 28 palabras (error > 40), pista ≤ 45 (error > 90), sin `+ / & # * ( ) " …` ni emojis, sin MAYÚSCULAS, sin dígitos en español, puntuación final, `speak.lead` ≤ 12 palabras | `símbolo '+'`; `oración de 34 palabras`; `no termina en puntuación`; `palabra en MAYÚSCULAS` |
| **Casos de uso** | UC-02…UC-10 con sus ids; UC-01 (motor) y UC-04 (IA en vivo) se reportan como N/A | `UC-09 Voz: faltan voice.retry` |

### Blueprint por caso de uso (qué debe decir y qué no)

| UC | El guion debe… | El guion NO debe… |
|---|---|---|
| **UC-01** Orientación (solo 1.ª vez, motor) | Presentar Guía, 3 pasos y Preguntar; marcar el flag de "ya explicado" | Repetir la orientación en cada base |
| **UC-02** Fórmula | Abrir con "El reto de hoy es…"; un par `intro es → modelo en` por caso, con su número; cerrar el caso con el modelo | Juntar dos casos en un párrafo; leer la fórmula token por token |
| **UC-02b** Trampa | Alerta de L1, error en inglés, pivote en español, forma natural en inglés, ancla mental | Explicar la regla sin mostrar el error; mezclar el error dentro del español |
| **UC-02c** Caza la trampa | Invitación corta; feedback de error y de acierto en la misma voz | Avanzar sin click; regañar |
| **UC-03** Ejemplos | 2 ejemplos nativos; secreto fonético con `canonical` y linking | Leer la tarjeta; dejar el ejemplo sin audio |
| **UC-04** Preguntar | Respuesta IA en vivo | Pregrabar respuestas que la IA debe improvisar |
| **UC-05** BUILD | Transición + instrucción de fichas; disparar el step después del `onEnd` | Solapar el audio con el cambio de paso |
| **UC-06/07** Error/Acierto | Pista accionable ("empieza por…"), felicitación breve | Regaño; doble audio; dejar el paso sin avanzar |
| **UC-08** Speak | Lead corto → modelo en inglés → instrucción de micrófono | Abrir el micrófono antes del modelo |
| **UC-09** Voz | Reintento amable, "no te escuché", error de micrófono; 2 intentos antes del escape | Aprobar por defecto; fallback a otra voz |
| **UC-10** Victoria | Celebración + puente a la siguiente base | Cerrar sin persistir el progreso |

Regla de oro: **si un UC no tiene su pista, el guion está incompleto aunque el audio exista**. El
linter lo dice por nombre, no hay que adivinar.

---

## 6. Cómo se le ayuda al modelo (TTS)

1. **Aislar el idioma** es la ayuda más grande: una pista 100 % inglesa suena nativa; una pista mixta
   suena con acento español.
2. **Pausas explícitas**: `pauseAfterMs` 750 (tras modelo nativo), 380 (antes del modelo), 260
   (transición). En el texto, coma corta, punto respira, dos puntos anuncian.
3. **Palabras difíciles con tilde**: `sáni`, `uórm`, `tudéi`, `ré-di`, `léson`. La tilde guía el estrés.
4. **Frases cortas** y sin subordinadas: el modelo mantiene el tono y no "se traba".
5. **Sin signos**: el sanitizador convierte `:` en coma y elimina comillas/paréntesis; si el texto
   depende de ellos, reescribirlo.
6. **Repetir la frase objetivo** con la misma grafía en `speak.model` y en `formula.caseN.model`
   (comparten MP3; es correcto si es la misma frase).
7. **No forzar el modelo a leer UI** ("toca Comenzar Clase"): el botón ya está en pantalla.

---

## 7. QA de audio (gates reales)

| Gate | Criterio | Herramienta |
|---|---|---|
| Cobertura | Cada momento tiene clave y archivo | `check_audio.py` |
| Idioma | `language` correcto y sin frases inglesas en ES | `validate_profile.py` |
| Fidelidad | Whisper idioma forzado, ratio ≥ 0.95 | `gen_base.py` |
| Integridad | > 1000 B, duración coherente, sin 416 | `check_audio.py` |
| Picos | true peak ≤ −1.0 dBTP, 0 muestras clipeadas | `gen_base.py` (gate) + `check_audio.py` + `fix_peaks.py` |
| Grito | LRA normal en locuciones (no “una palabra gritada”) | `check_audio.py` + escucha de la trampa |
| Transición | El MP3 EN está completo en buffer antes de sonar; sin reinicio audible | `prefetchStatic` + `canplaythrough` (runtime) |
| Bordes | Sin silencio inicial/final raro, sin bleed | `check_audio.py` (warn) |
| Manifiesto | Sin claves stale ni huérfanos | `check_audio.py` |
| Escucha | 4 pistas críticas escuchadas por humano | oído |

**Caveat del ASR**: Whisper `small` confunde palabras parecidas en español ("dices" → "lices",
"el estado" → "en estado") y baja el ratio a 0.96. Antes de regenerar, pasar **Whisper `medium`**:
si medium transcribe bien, el audio está bien. Regenerar solo si medium confirma el error o si se
escucha mal.

### 7.1 Casos adversos de voz (QA manual de UC-09)

| Caso | Resultado esperado |
|---|---|
| Nativo exacto | aprueba (≥ 80 global, ≥ 80 completitud, 0 omisiones) |
| Frase a medias | no aprueba; ofrece reintento |
| "I espeak" (s-cluster) | detecta la vocal intrusiva y corrige |
| Habla en español | no aprueba |
| Silencio total | "No logré escucharte con claridad…" sin colgarse ni quedar en `listening` |
| Acento leve | aprueba (no castigar de más) |

El escape "modo silencioso" solo se habilita si falla el permiso/soporte de micrófono o tras **2
intentos fallidos**. Nunca visible desde el primer intento.

### 7.2 Grito, clipping y distorsión (el ruido de `trapcheck.success`)

**Síntoma real**: en Base 02 y Base 03, una parte de la trampa (“¡Exacto! **Cazaste**…”) suena
gritada, con un ruido raro. No es un problema de texto ni de transcripción: es **clipping**.

**Causa**: Chatterbox con `exaggeration=0.7` en una línea exclamativa corta genera picos que
superan 0 dBFS. El MP3 clipea entre muestras (true peak +0.5 dBTP, 3–8 muestras al máximo) y el
oído lo percibe como grito/distorsión. El pico de muestra puede mentir: hay que medir **true peak**
(ebur128), no solo el máximo del PCM.

**Solución implementada (no volver a pagarla)**:
1. `gen_base.py` mide true peak y clipping de cada candidato:
   - descarta semillas con `clip > 0` o `true peak > --max-peak-db`;
   - normaliza la elegida por ganancia iterativa hasta `-1.5 dBTP` (sin cambiar el timbre);
   - el reporte guarda `true_peak_db`.
2. `check_audio.py` **falla** si `true peak > -0.5 dBTP` o hay muestras clipeadas; avisa si el LRA
   de una locución es anormalmente amplio.
3. `fix_peaks.py` sanea pistas viejas: baja solo el pico necesario, sin regenerar ni tocar el
   manifiesto.
4. Si un modelo insiste en gritar una línea exclamativa, regenerar con más semillas y, como último
   recurso, `--exaggeration 0.55` para esa pista.
5. Las líneas de riesgo son las exclamativas: `trapcheck.success`, `trapcheck.error`,
   `voice.victory`, `build.success`.

```bash
# saneamiento de picos de una base o de todas
python .agents/skills/pathway-speech-production/scripts/fix_peaks.py --base base_02 --dry-run
python .agents/skills/pathway-speech-production/scripts/fix_peaks.py --all
```

> **Regla**: una pista con clipping no está “lista” aunque el ASR diga 1.000. El gate es audio,
> no solo texto.

### 7.3 El 400 de Groq al evaluar la voz

**Síntoma**: `POST /audio/transcriptions` → 400 `could not process file - is it a valid media file?`
al detener el micrófono en `pathwayVoiceEvaluator`.

**Causa**: se enviaba a Whisper un blob sin contenedor reconocible (PCM crudo o webm vacío) o con
extensión mentirosa; el mínimo de 200 B dejaba pasar cabeceras sin audio.

**Solución implementada**:
- `AudioCaptureService.transcribeAudio` exige **≥1024 B**, detecta el contenedor por los primeros
  bytes (EBML/WebM, `OggS`, `RIFF`, `ftyp`) y usa esa extensión; si no reconoce, no llama al
  proveedor y cae al transcript en vivo.
- `pathwayVoiceEvaluator` usa el mismo mínimo antes de elegir `audioBlob`/`pendingTailBlob`.
- Si el blob no es válido, el flujo muestra “No logré escucharte” en vez de un 400 en consola.

### 7.4 Cambio de idioma fluido (ES → EN)

**Síntoma**: al pasar del conector en español al modelo en inglés, el audio “intenta, dice un
poquito, se detiene y ahí sí lo dice”. Se siente cortado aunque el texto y el MP3 estén bien.

**Causa**: no es el guion ni un falso arranque del TTS. El MP3 inglés se reproducía **en streaming**
desde su URL y `audio.play()` arrancaba antes de tener buffer completo; en red móvil el elemento se
queda sin datos a mitad de la primera palabra, pausa y reanuda. El corte aparece justo en el cambio
de idioma porque es el primer clip que no estaba precargado.

**Solución implementada (runtime)**:
- `SpeechSynthesisService.prefetchStatic()` descarga el MP3 del manifiesto **completo** como blob.
- `prefetch()` lo dispara para el **siguiente** segmento mientras suena el actual (el motor ya
  llamaba `prefetch` en `playLecture`, pero solo servía para TTS en vivo).
- `speak()` usa el blob si está listo y espera `canplaythrough` (`readyState >= 3`) antes de
  `play()`. Nunca arranca a media carga.

**Reglas para no repetirlo**:
1. En un cambio de idioma **nunca** se reproduce desde URL remota: blob completo o buffer de Web Audio.
2. Se precarga el segmento siguiente, no solo el actual.
3. `play()` solo con `readyState >= 3`; si no, se espera (máx. 600 ms) y luego se reproduce.
4. Los 380 ms antes del modelo son **pausa cognitiva intencional**. Si se siente “cortado”, el
   problema es buffer/`play` interrumpido, no la pausa: no la recortes para disimular.
5. En pruebas, simular red lenta (3G) y reproducir `*intro → *model`; no debe reiniciar ni repetir
   la primera sílaba. Revisar en consola `play interrupted` o `HTMLAudioElement play blocked`.
6. Un `silencio inicial > 350 ms` en el MP3 también retrasa el switch: `check_audio.py` lo advierte.

---

## 8. Manifiesto y cobertura

- Se reconstruye por base: se borran las entradas cuyo path contiene `/base_XX/` y se agregan las del
  perfil (clave sanitizada + texto crudo).
- Un momento repetido dentro de la base comparte MP3 (aceptable, se advierte). Entre bases distintas
  es **error**: la segunda base reproduciría el audio de la primera.
- El test `speechCoverage.test.ts` tiene 4 invariantes: motor con audio, perfiles registrados con
  audio, ids de hooks presentes y manifiesto sin archivos inexistentes.
- `CLOSED_BASES` se actualiza **después** de que la base tiene audio y está cableada. Si no, el test
  no protege nada.

---

## 9. Catálogo de errores pagados (síntoma → causa → prevención)

| # | Síntoma | Causa raíz | Prevención |
|---|---|---|---|
| 1 | "Habla otra voz" en un feedback | La frase no tiene MP3; fallback a Jorge/SAPI | Cobertura + `preventSyntheticFallback` + `check_audio.py` |
| 2 | "Base 02 habla con el audio de Base 01" | Texto compartido / path mal apuntado / off-by-one | Textos únicos + manifiesto generado + verificar `/base_XX/` |
| 3 | La trampa "se pasa sola" | MP3 de 0 B → 416/EncodingError | Gate > 1000 B y `ffmpeg concat` con remux |
| 4 | Se come el final de una palabra | Corte por silencio sin margen | Márgenes de 150–250 ms + escucha + `check_audio` |
| 5 | Bleed: una pista invade la siguiente | Corte en el silencio equivocado | 1.5–2 s entre párrafos y corte con margen |
| 6 | Dos audios encimados al cambiar de paso | `onStepTrigger` antes del `onEnd` | Disparar después del audio + `skipAudio: true` |
| 7 | "i an redi", "wi ar redi", "i ave 25 yiar" | Contaminación bilingüe | Ley 2 + respelling |
| 8 | "I, you, we, they" suena a letras | Lista inglesa en pista española | Pista `en` propia |
| 9 | Faltaba "opiniones neutras" (Base 02) | Se explicó 1 de 2 casos | F0 + `--cases N` + tab por caso |
| 10 | Las pestañas no cambian de caso | El motor no copiaba `activeFormulaCaseIndex` | Copiar cues + test de segmentos |
| 11 | La fórmula se ilumina toda al final | Timer ciego / un solo `revealCount` | Cue por segmento (1→3) y mid-reveal |
| 12 | Trampa redirige a otro escenario | Navegación por timer en vez de `trapPhase` | Cue-driven; test de secuencia |
| 13 | Regla dicha 3 veces | Texto redundante | Una regla + detector de n-gramas |
| 14 | Silencio sin error | `speak()` marca "ya habló" antes de saber si hay audio | Log MISS/PLAY_ERROR + guardas |
| 15 | Manifiesto con claves muertas | Se editaba a mano | Reconstrucción por base |
| 16 | Audio regenerado idéntico / stale | Hash sin `canonical` o sin invalidar | Hash texto+canonical; borrar clave al cambiar |
| 17 | `json.load` falla con BOM | PowerShell guardó UTF-8 con BOM | `encoding="utf-8-sig"` en scripts |
| 18 | Test "verde" pero base muda | `CLOSED_BASES` vacío | Cerrar base = agregarla al test |
| 19 | Ratio 0.964 y audio correcto | Whisper small confunde | Revisar con medium antes de regenerar |
| 20 | Solapamiento al entrar a BUILD | Hook reproduce y motor ya reprodujo | `skipAudio` + audio post-onEnd |
| 21 | Pizarra congelada en cara feliz | Estado `isConquered` antes de explicar | Estado por beat, no por flag |
| 22 | Móvil sin autoplay | AudioContext no desbloqueado en el gesto | `MobileAudioUnlocker.unlock()` en el click |
| 23 | "Se subió a prod" y no está | No se verificó build/deploy | Verificar URL real, no localhost |
| 24 | Reporte "100 %" falso | Se leyó el resumen, no el JSON | Leer el reporte completo + escucha |
| 25 | Una palabra de la trampa suena **gritada** | Pico > 0 dBFS + clipping intermuestras en línea exclamativa | Gate de true peak, `fix_peaks.py`, regenerar con semillas / `--exaggeration 0.55` |
| 26 | Groq 400 `invalid_media_file` al evaluar voz | Blob <1024 B, sin contenedor o con extensión mentirosa | Sniff de cabecera + mínimo 1024 B + fallback al transcript en vivo |
| 27 | Whisper marca 0.88-0.94 en audio correcto | Seseo (`cazaste`→`casaste`), respelling (`tu bi`→`tu vi`/`to be`) o clíticos (`repítela`→`repite la`) | Normalización fonética ES + `--qa-model medium` + `--qa-only` para re-evaluar sin regenerar |
| 28 | El manifiesto apunta a mp3 que aún no existen | Se mapeaban todos los momentos al generar un subconjunto | Mapear solo los mp3 presentes (el `build` completo los repone) |
| 29 | Al cambiar ES→EN “dice un poquito, se detiene y sigue” | El MP3 inglés se reproducía en streaming y `play()` arrancaba sin buffer | Precargar el mp3 como blob + esperar `canplaythrough`; no tocar la pausa de 380 ms |
| 30 | "not" suena "no" en una pista española | El TTS español pierde la consonante final | No meter la palabra; decir "la palabra de negación" y dejar que la pizarra/modelo la muestren |
| 31 | Una frase EN corta termina con palabras que no existen | Alucinación de cola del modelo | Ratio < 0.9 la detecta; regenerar con más semillas y volver a medir |

---

## 10. Anti-deriva: cuándo detenerse y preguntar

**STOP & ASK obligatorio** si:
- El currículo tiene más casos de los que el perfil puede explicar con los datos disponibles.
- Hay que inventar una frase en inglés que no está en el currículo (ejemplo, trampa, target).
- El usuario pide un cambio de alcance (nueva feature, rediseño) en medio de una base.
- Un audio no pasa el gate y no se sabe si es el texto, el modelo o el corte.
- Hay que tocar bases ya certificadas (01-05) para "unificar".

**Prohibido**:
- Declarar "listo" sin `tsc` + `vitest` + `check_audio` + escucha.
- Atribuir a "caché" lo que es un off-by-one o un manifiesto mal apuntado.
- Parchear el síntoma (agregar un `if` de texto) sin corregir la causa (perfil/manifiesto).
- Cambiar diseño o refactorizar para "aprovechar el viaje".

---

## 11. Herramientas de esta skill

### El centro de control: `pathway.py`

Un solo comando audita **todas** las bases y dice exactamente qué pista falta o falla. No se
prueba una por una a oído: el panel y el reporte nombran cada problema.

```bash
# Matriz global: casos, pistas, audio, ratio mínimo, registro y cierre
python .agents/skills/pathway-speech-production/scripts/pathway.py status

# Auditoría de una base: perfil + guion + casos + audio + manifiesto + registro + cierre
# (re-mide con Whisper las pistas sin ratio o bajo el gate; deja reporte en .pathway_reports/)
python .agents/skills/pathway-speech-production/scripts/pathway.py audit --base base_03 --cases 3

# Solo calidad de guion (rápido, sin GPU): pedagogía, flujo, fluidez y UC
python .agents/skills/pathway-speech-production/scripts/pathway.py guion --base base_03 --cases 3

# Construcción: audita, genera SOLO lo que falta o falla, re-audita y corre los tests
python .agents/skills/pathway-speech-production/scripts/pathway.py build --base base_03 --cases 3

# Ver el plan sin gastar GPU
python .agents/skills/pathway-speech-production/scripts/pathway.py build --base base_03 --cases 3 --plan
```

`audit` y `build` devuelven **exit 1** si algo no está verde, así que sirven en CI o en un hook.

| Script | Responsabilidad |
|---|---|
| `pathway.py` | Panel + auditoría + calidad de guion + construcción incremental + reporte |
| `guion_lint.py` | Pedagogía, flujo, fluidez y cobertura UC (4 dimensiones) |
| `validate_profile.py` | Contrato del guion (casos, cues, hooks, colisiones) |
| `gen_base.py` | Audio con gate 0.95, semillas, incremental, manifiesto |
| `check_audio.py` | Integridad de mp3/manifiesto/duraciones/bordes + true peak |
| `curriculum_audit.py` | Fidelidad al payload: título, casos, ejemplos, trampa y voz objetivo |
| `fix_peaks.py` | Sanea picos/clipping de pistas ya generadas sin regenerar |

Notas de control:
- Si el mp3 es más nuevo que el estado, el ratio guardado se considera viejo y `audit` lo
  **vuelve a medir** con Whisper. Nunca se acusa una pista que ya se regeneró.
- `build` solo regenera lo que está `SIN_MANIFIESTO`, `SIN_ARCHIVO`, `ARCHIVO_VACIO`, `OTRA_BASE`
  o `GATE`; el resto se reutiliza por hash. Eso es lo que permite "una base perfecta" sin gastar
  una hora de GPU por cambio.
- El reporte `.pathway_reports/<base>.md` lista gate por gate y pista por pista, con la acción
  concreta ("generar X", "registrar la base", "agregar a CLOSED_BASES").

### Scripts auxiliares

```bash
# Validar solo el perfil (sin GPU)
python .agents/skills/pathway-speech-production/scripts/validate_profile.py \
  --profile src/features/pathway/speech/profiles/base_03.ts --cases 3

# Validar todos y detectar colisiones de texto entre bases
python .agents/skills/pathway-speech-production/scripts/validate_profile.py --all

# Ver qué se generaría (sin GPU)
python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_03 --dry-run

# Verificar audio/manifiesto de una base
python .agents/skills/pathway-speech-production/scripts/check_audio.py --base base_03

# Cierre técnico
npx tsc --noEmit && npx vitest run src/features/pathway
```

`gen_base.py` requiere `PATHWAY_TTS_REF` (wav de la voz clonada) o `--ref`. Escribe
`.pathway_state_<base>.json` (incremental) y `.pathway_qa_<base>.json` (reporte).

---

## 12. Plantillas

### Ficha de base (F0)
```
BASE: base_0N — <título>            orderIndex: N-1
focus: <focus del currículo>
targetSentence: <voicePractice.sentenceEnglish>
Casos de fórmula: <N>  →  <ejemplo de cada caso>
Trampa: ✗ <wrong>  →  ✓ <correct>   (why: <whySpanish>)
Ejemplos: 1) <en> / <hint>   2) <en> / <hint>
Build: target <tokens> · distractores <tokens>
Pistas previstas: <n> (es <n>, en <n>)
```

### Reporte de cierre
```
BASE: base_0N — <título>
Perfil: <n> momentos (es <n> / en <n>), validado PASS
Audio: <n>/<n> con mp3 · ratio mínimo <x> · duración <m:ss>
Manifiesto: +<n> entradas, <total> totales, 0 stale, 0 huérfanos
Cableado: registry ✅ · motor cues ✅ · hooks ids ✅ · CLOSED_BASES ✅
Tests: tsc 0 · vitest <n>/<n>
Escucha: fórmula ✅ · trampa ✅ · speak ✅ · victoria ✅
Pendiente / riesgo: <…>
```

---

## 13. Definición de terminado (una base)

- [ ] `pathway.py audit --base base_0N --cases N` devuelve **exit 0** y el reporte
      `.pathway_reports/base_0N.md` está en **VERDE** (todas las pistas OK).
- [ ] Ficha de base completa y **N casos del currículo = N casos explicados**.
- [ ] `pathway.py guion --base base_0N --cases N` en **0 errores** (pedagogía, flujo, fluidez y
      los 10 UC cubiertos o marcados N/A).
- [ ] Perfil `validate_profile.py` en PASS (con `--cases` correcto).
- [ ] Guion mostrado y aprobado por el usuario.
- [ ] Audio: 100 % de momentos con MP3 propio, > 1000 B, ratio ≥ 0.95, **true peak ≤ −1.0 dBTP y 0 clipping**.
- [ ] `check_audio.py` sin errores (warnings revisados y explicados).
- [ ] Escucha humana de fórmula, trampa, speak y victoria.
- [ ] Manifiesto reconstruido, sin claves stale ni huérfanos.
- [ ] Registro + motor + hooks con los ids correctos y todos los cues copiados.
- [ ] `CLOSED_BASES` incluye la base.
- [ ] `tsc --noEmit` 0 y `vitest src/features/pathway` 100 % verde.
- [ ] QA visual móvil + desktop (tabs, revelado, trapPhase, build sin solape).
- [ ] Memoria Serena actualizada con ratios, decisiones y pendientes.

---

## 14. Fábrica por lotes (A1 completo)

El audio no se paraleliza: hay **una GPU** y cada base tarda 40–60 min. Lo que sí se paraleliza
es la escritura de perfiles. El flujo para escalar sin perder calidad:

```bash
# 1. Mapa de las 32 bases: perfil, audio, registro y cierre
python .agents/skills/pathway-speech-production/scripts/pathway.py plan

# 2. Perfiles en paralelo (subagentes): cada uno escribe 2-3 bases, valida y corrige.
#    Regla: los agentes NO generan audio ni tocan index.ts/CLOSED_BASES.

# 3. Revisión central
python .agents/skills/pathway-speech-production/scripts/validate_profile.py --all
python .agents/skills/pathway-speech-production/scripts/curriculum_audit.py --all --existing
python .agents/skills/pathway-speech-production/scripts/pathway.py guion --base base_06 --cases N

# 4. Una sola cola de audio por lote (5-6 bases), de noche
python .agents/skills/pathway-speech-production/scripts/pathway.py batch --from 06 --to 11
```

`batch` construye en serie, **se detiene en la primera base roja** (no sigue a ciegas), registra
cada base al cerrarla (`close`) y corre `tsc` + `vitest` al final. `close` es idempotente: agrega el
import, el array y `CLOSED_BASES`.

**Reglas de la fábrica**:
1. Un lote = un módulo (06–11, 12–17, …) o 5–6 bases.
2. Los perfiles del lote se escriben y validan **antes** de encender la GPU.
3. El usuario aprueba el lote una vez (tabla de títulos/casos/momentos), no base por base.
4. Una sola generación a la vez; nunca dos procesos de Chatterbox.
5. Si una base falla el gate, el lote se detiene y se revisa `.pathway_reports/<base>.md`.
6. Al final del lote: `tsc`, `vitest`, `plan` y memoria del lote.
7. Los agentes varían las frases de boilerplate por base (welcome, build, speak, voz) porque el
   manifiesto es global; `validate_profile --all` detecta cualquier colisión.

**Rendimiento real**: ~40–60 min de GPU por base → 5–6 bases por noche. Las 27 restantes son
~5 noches, no una tarde. Prometer otra cosa es vender humo.

---

## 15. Generar en GPU gratis (Colab / Kaggle)

Cuando la GPU local es el cuello y no hay presupuesto, el mismo `gen_base.py` corre en una T4
gratuita. La calidad es idéntica: mismo modelo, referencia y parámetros.

```bash
# 1. En la PC: armar el bundle (scripts + perfiles + manifiesto + voz de referencia)
python .agents/skills/pathway-speech-production/cloud/prepare_bundle.py

# 2. En Colab/Kaggle: subir el ZIP y correr
#    !pip -q install chatterbox-tts faster-whisper
#    !unzip -q pathway_cloud_bundle.zip
#    !cd pathway_cloud && python cloud/run_cloud.py --from 06 --to 08 --qa-model small

# 3. En la PC: importar el ZIP de salida
python .agents/skills/pathway-speech-production/cloud/import_cloud_audio.py --zip salida.zip

# O todo automático con la API de Kaggle (setup una vez con kaggle.json)
python .agents/skills/pathway-speech-production/cloud/kaggle_batch.py --from 12 --to 17
```

El notebook listo es `cloud/pathway_colab.ipynb`. El importador copia los MP3, reconstruye el
manifiesto (`gen_base --manifest-only`), re-mide el QA, registra/cierra cada base y corre los tests.

**Reglas**:
- Una sesión por vez; 2–3 bases por sesión en T4 gratis.
- El modelo se descarga una vez (~2 GB); cachear `HF_HOME` en Drive.
- Si la sesión se corta, relanzar con el mismo rango: `gen_base` reutiliza por hash los mp3 que
  ya estén en la carpeta de salida.
- No se puede automatizar el clic de “Run” dentro de tu cuenta de Google; el resto sí.

### Kaggle: trampas comprobadas
- **Siempre** reconstruir el bundle antes de subir (`prepare_bundle.py`); un bundle viejo produce
  "no existe profiles/base_XX.ts".
- Esperar `kaggle datasets status ... == ready` antes de `kernels push`; si no, el kernel monta la
  versión anterior del dataset.
- Kaggle **descomprime** el ZIP: buscar `cloud/run_cloud.py` con glob en `/kaggle/input`, no asumir
  `/kaggle/input/<slug>/pathway_cloud`.
- El kernel debe desinstalar `torchvision` (Kaggle trae una versión incompatible con su torch y
  rompe el import de Chatterbox con `ModuleNotFoundError: LlamaModel`).
- `run_cloud.py` deja `pathway_cloud_out.zip`; usar `--no-import` y correr el importador local
  cuando la GPU/PC no esté escribiendo el manifiesto.

---

## 16. Producción a escala: reglas de tiempo

- Medir por **pistas generadas / QA verde / bases cerradas**, no solo por bases cerradas.
- Repartir rangos únicos entre GPUs; nunca duplicar el mismo rango.
- Un watcher debe tener timeout y condición de salida; jamás `while(true)` sin límite.
- QA por excepción: small → large-v3 → recorte/regeneración solo de la pista.
- Cerrar en lote cuando el módulo esté verde; no cerrar de a una.
- Kaggle: usar la cuota en trabajo único (otro rango o regeneración), no en respaldos.
