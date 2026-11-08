# Handoff — CELAEST Pathway A1 · Base 05 en curso

> Documento de relevo. Reconstruido desde la conversación de Antigravity
> `c68f979d-e4ea-49de-91be-227201713d6d` (9.533 pasos, 3–6 nov 2026), que murió por cuota agotada
> (`429 RESOURCE_EXHAUSTED`, reset ≈ 168 h) el 6 nov a las 10:26 a.m. (Bogotá).
> Fuente cruda: `~/.gemini/antigravity/brain/c68f979d-…/.system_generated/logs/transcript.jsonl`.

---

## 1. Dónde estamos

| Base | Título | Audio | Motor VÍA A | Coreografía (trampa) | Hook de sesión |
|------|--------|-------|-------------|----------------------|----------------|
| 01 | El Orden Mágico | 28 pistas | OK | OK | OK |
| 02 | El It Fantasma | 26 pistas | OK | OK | OK |
| 03 | Ser o Estar Sin Enredos | 35 pistas | OK | OK | OK |
| 04 | La Trampa de 'Tener' | 31 pistas | OK | OK | OK |
| **05** | **Ser o Estar en Negativo & Pregunta** | **30 pistas OK** | **OK** | **OK** | PENDIENTE |

**Único hueco funcional:** `src/features/pathway/hooks/usePathwayStageSession.ts`.
Base 05 está declarada y usada en el bloque de arranque `BUILD` (líneas 163 y 174), pero **falta en los
otros cinco bloques de voz**. Ahí, Base 05 cae al texto genérico, que es exactamente el defecto que
produce las fallas fonéticas ("i an redi", "wi ar redi", "ai ave 25 yiar").

---

## 2. Las 6 leyes inviolables (resumen operativo)

Estándar completo: `.serena/memories/pathway_speech_and_dynamism_anti_error_standard.md` (leer antes de tocar voz).

1. **Cero contaminación bilingüe.** Nunca meter una frase en inglés dentro de un párrafo en español
   para el TTS: el modelo la lee con fonética española (`have` → "ave", `ready` → "rredi", `years` → "yiar").
   Inglés siempre aislado, en su propio segmento con `language: "en"`, o separado por `...` en locución mixta.
2. **VÍA A desacoplada** en Fórmula y Trampa: intro en español → modelo nativo en inglés → pivote en español → forma natural.
3. **Adaptaciones fonéticas en español:** "el verbo To Be" se escribe **"el verbo tu bi"**, "el pronombre I" → **"el pronombre ai"**,
   y el verbo *have* se nombra como **"el verbo tener"** (nunca "el verbo have").
4. **Dinamismo por eventos, no por timers ciegos.** Nada de `setTimeout(7500)`: las transiciones de pizarra
   se disparan con `trapPhase` (0 alerta / 1 tachado rojo / 2 esmeralda) y `formulaRevealCount` (1·2·3).
5. **Cadencia:** 750 ms tras modelo nativo, 380 ms tras intro antes del modelo, 260 ms entre conceptos.
6. **Quality gate de audio:** pista > 1000 bytes, `seg_03.mp3` compilado con `ffmpeg concat`, cero HTTP 416.

---

## 3. Especificación de Base 05

- **Título:** `Ser o Estar en Negativo & Pregunta` · `focus: "Isn't, Aren't e inversión para preguntas"`
- **Frase objetivo (`voicePractice`):** `Are you ready today?` — **"¿Estás listo hoy?"**
- **Fórmula, caso 1 (negar):** He / She + isn't + busy / late → *"He isn't busy right now."*
- **Fórmula, caso 2 (preguntar):** Are + you / they + ready today? → *"Are you ready today?"*
- **Error común (trampa):** ✗ "You are ready?" → ✓ "Are you ready?"
- **Ancla:** en preguntas el verbo va primero.
- **Definición:** `src/features/pathway/curriculum/a1/module1Identity.ts` (línea 308).
- **Detección de base:** `orderIndex === 4` **o** título contiene `"negativo & pregunta"` / `"negativo y pregunta"`.

---

## 4. Lo ya construido para Base 05 (no rehacer)

- **Audio (30 pistas):** `public/audio/pathway/a1/base_05/` — incluye VÍA A de fórmula
  (`seg_01_case1_intro`, `seg_01_case1_model`, `seg_01_case2_*`) y de trampa
  (`seg_03_part1_intro` … `part5_anchor`), más `seg_0x`, `voice_*`, `trap_*`, `build_intro`, `mic_error`.
- **Scripts de generación:** `scripts/generate_fase1_base05_via_a.py`, `regenerate_base05_legacy_tracks.py`,
  `update_a1_manifest_base05.py` (base: `generate_fase1_base04_via_a.py`).
- **Manifest:** `src/features/pathway/data/a1AudioManifest.json` (+575 líneas, 60 referencias a `base_05`).
- **Motor:** `PathwayLectureEngine.ts` tiene bloque Base 05 con segmentos VÍA A (línea 277).
- **Coreografía:** `useLiveClassChoreography.ts` tiene Base 05 en `trapErrorSpeech` (línea 199) y
  `trapSuccessSpeech` (línea 233).
- **Hook:** `usePathwayStageSession.ts` — solo `BUILD` (líneas 163, 174).

---

## 5. Estado del hueco de voz — **RESUELTO** (6 nov, 12:19)

Los cinco bloques fueron completados y verificados (`tsc --noEmit` = 0, `vitest src/features/pathway`
= 29/29). Cobertura final de `isBase05` en `usePathwayStageSession.ts`: **5 declaraciones + 5 ramas**
(líneas 163, 202, 220, 259, 273, 296, 350, 378, 406, 421).

También se corrigió una **regresión de Base 03** detectada por el quality gate (ver §9).

La tabla siguiente queda como registro histórico de lo que faltaba:

| # | Bloque | Línea aprox. | Falta |
|---|--------|--------------|-------|
| 1 | `SPEAK` → `instruction` | 187–223 | declarar `isBase05` + rama `? "…:... Are you ready today?... Ahora activa tu micrófono…"` |
| 2 | `successText` (chips OK) | 238–275 | `isBase05` + rama de éxito |
| 3 | `errorHint` (chips mal) | 276–286 | `isBase05` + pista de inversión |
| 4 | `victorySpeech` / `retrySpeech` | 359–390 | extender las cadenas `isBase01 \|\| … \|\| isBase04` con `isBase05` |
| 5 | `notHeardSpeech` | 395–406 | `isBase05` + rama "repite conmigo" |

**No refactorizar** a registro central: Bases 01–04 están certificadas por el usuario y el patrón
repetido es deliberado. Si más adelante se automatiza la creación de bases (6+), ahí sí conviene
extraer un `BASE_SPEECH_PROFILES` — pero como cambio aparte y con las 4 bases ya verificadas.

---

## 6. Defectos ya pagados (no repetirlos)

- **`416 Requested Range Not Satisfiable`** en `base_03/seg_03.mp3`: venía de concatenar segmentos sin
  remuxear. `seg_03.mp3` debe recompilarse con `ffmpeg concat` y quedar > 1000 bytes.
- **"we are ready" sonaba "wi ar redi"** y **"I have 25 years" → "ai ave 25 yiar"**: contaminación bilingüe (Ley 1).
- **"el verbo to be" → "tu bi"**: solo se corrige escribiéndolo fonético en español (Ley 3).
- **Base 02 hablaba con el audio de Base 01**: cache de audio; invalidar manifest/hash al cambiar de base.
- **Animación de fórmula se disparaba al final**: debe revelar a la mitad y por pasos (`formulaRevealCount`).
- **Trampa redirigía al escenario equivocado**: el `trapPhase` debe gobernar la navegación, no un timer.
- **`preventSyntheticFallback: true`** está activo a propósito: si el neural falla, **no** debe caer a voz del navegador.
  Los errores de consola tipo *"Neural playback failed… Skipping browser TTS"* son intencionales, no bugs.

---

## 7. Verificación antes de dar por cerrada la base

```bash
cd C:/Users/user/Music/celaest-english-front
pnpm run typecheck        # tsc --noEmit
pnpm run lint             # eslint --max-warnings 0
pnpm run dev              # revisar en mobile (puerto propio, ver package.json)
```

Checklist funcional de Base 05:
1. `RULE` → fórmula revela 1·2·3 a mitad de la explicación, no al final.
2. `TRAP` → tacha "You are ready?" en rojo exacto cuando suena el error, esmeralda con "Are you ready?".
3. `BUILD` → activación dice "para que las toques en tu pantalla" (ya implementado).
4. `SPEAK` → locución dice **"Are you ready today?"** en inglés limpio, sin acento español.
5. Micrófono → victoria / reintento / no escuchado usan la rama Base 05.
6. Cero 416 en consola; cero caída a voz sintética.

---

## 8. Contexto de producto (por si cambia el alcance)

- Repo: `C:/Users/user/Music/celaest-english-front` (rama `main`, remoto `CELAEST/celaest-english-front`).
- App: Vite + React + TS. Feature `src/features/pathway/`.
- El usuario quiere un **flujo anti-error replicable** para producir bases 06+ rápido y sin regresiones,
  en vez de descubrir los defectos base por base. Ese flujo es: audio VÍA A → manifest → segmentos en
  `PathwayLectureEngine` → coreografía de eventos → ramas de voz en `usePathwayStageSession` → verificación mobile.
- Preferencias explícitas del usuario: **cero sobreingeniería**, **cero emojis**, **una sola voz** en todo el curso,
  y **dinamismo suave** (nada de encender todo de golpe).

---

## 9. Sesión de relevo del 6 nov (12:19) — qué se cambió

### 9.1 Base 05: ramas de voz completadas
`src/features/pathway/hooks/usePathwayStageSession.ts` — se añadió `isBase05` a los 5 bloques que
faltaban, con la frase objetivo `Are you ready today?` y las pausas `...` del patrón validado:

| Bloque | Texto Base 05 |
|--------|---------------|
| `SPEAK` instruction | "Escucha con atención cómo lo pronuncio yo:... Are you ready today?... Ahora activa tu micrófono…" |
| `successText` (chips OK) | "¡Excelente trabajo! Invertiste el orden como un nativo:... Are you ready today?... Ahora vamos a certificar tu propia voz." |
| `errorHint` (chips mal) | "Recuerda la inversión:... en las preguntas el verbo tu bi va primero…" (Ley 3: "tu bi", nunca "to be") |
| `victorySpeech` / `retrySpeech` | cadenas `isBase01 || … || isBase05` |
| `notHeardSpeech` | "No logré escucharte con claridad... Repite conmigo:... Are you ready today?..." |

### 9.2 Regresión de Base 03 corregida (hallazgo del gate)
El test `PathwayQAService.test.ts` estaba en **rojo antes de este relevo**: Base 03 producía
**3 segmentos de fórmula, todos en español**, sin los 3 modelos nativos en inglés.
Causa: Base 03 caía en la rama genérica multi-caso de `PathwayLectureEngine.ts`, que incrusta la frase
inglesa **dentro** del texto español (`Ejemplo: "We are ready to start."`) → exactamente el defecto
de contaminación bilingüe que el usuario reportó como *"we are ready lo dice como en español"*.

Fix aplicado en `PathwayLectureEngine.ts`: rama `isBase03` con desacople VÍA A (intro `es` +
`MODELO NATIVO` en `en` por cada uno de los 3 usos), sin tocar la rama genérica que Base 09 sí necesita.
Resultado: Base 03 = 6 segmentos (3 es + 3 en, 3 casos), test en verde.

### 9.3 Quality gate blindado para Base 05
Se añadieron aserciones permanentes en `PathwayQAService.test.ts`:
- Base 05 = 4 segmentos de fórmula (2 `es` + 2 `en`), 2 casos distintos.
- Contiene `Are you ready today?` como modelo nativo.
- **Cero contaminación bilingüe**: ningún segmento `es` de Base 05 puede contener
  `are you ready today` ni `isn't busy`.

### 9.4 Integridad de audio (Ley 6)
Manifest `a1AudioManifest.json`: **26 entradas de Base 05, 26/26 existen, 0 bajo 1000 bytes**.
En disco 30 archivos; los 4 no referenciados (`seg_01.mp3`, `seg_07.mp3`, `seg_03_part4_correct.mp3`,
`voice_sample.mp3`) son masters/auxiliares y el patrón coincide con Base 04 (6 sin referencia).
Sin acción requerida.

### 9.5 Verificación ejecutada
```
tsc --noEmit                        -> exit 0
vitest run src/features/pathway     -> 8 archivos, 29 tests, 29 passed
```
Nota honesta: `eslint --max-warnings 0` **ya fallaba en `HEAD`** con 3 errores
`react-hooks/set-state-in-effect` + 2 warnings en `usePathwayStageSession.ts`. Tras el cambio sigue
exactamente igual (mismos 3+2, solo corridos de línea) → **cero regresión**, pero el script
`pnpm run lint` del repo continúa en rojo por deuda previa, no por Base 05.

### 9.6 Lo siguiente (no hecho aún)
- Verificación **visual en mobile** de Base 05: fórmula revelando 1→3 a mitad de la explicación,
  trampa con tachado por `trapPhase`, y locución `Are you ready today?` sin acento español.
- Revisar si `seg_01.mp3` / `seg_07.mp3` deben entrar al manifest (hoy no se usan en playback continuo).
- Pendiente de negocio: decidir si se extrae `BASE_SPEECH_PROFILES` antes de producir bases 06+.
