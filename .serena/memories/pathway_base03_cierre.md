# Base 03 cerrada — siguiente Base 04

## Base 03: cerrada y verificada

- **Guion**: `src/features/pathway/speech/profiles/base_03.ts` (34 momentos, 25 es + 9 en),
  tres casos de fórmula (`am` / `is` / `are`) con badge y `activeFormulaCaseIndex` 0/1/2.
- **Audio**: 34 clips en `public/audio/pathway/a1/base_03/` (3:42 en total), mismo perfil de voz.
  Gate: mínimo **0.963** (`build.transition`); `trap.right` (“She is ready.”) salía con un
  artefacto final (“… D.”) en 0.857 y se regeneró con `gen_base.py --only trap.right --force
  --seeds 11..99` → seed 44, 1.000.
- **Manifiesto**: 132 entradas totales. Advertencia conocida: dentro de una misma base los textos
  repetidos comparten mp3 (`I am ready today.` en `formula.case1.model` y `speak.model`;
  `She is very focused right now.` en `formula.case2.model` y `example.focused`).
- **Registro**: `speech/profiles/index.ts` incluye `base03SpeechProfile` + hints de título
  (`ser o estar sin enredos`, `am · is · are`). `CLOSED_BASES` = base_01/02/03.
- **Test ajustado**: `PathwayQAService.test.ts` esperaba 6 segmentos FORMULA de la rama legacy;
  con el perfil son 7 (regla + 3 intros es + 3 modelos en). Ahora valida 7, 3 casos y 4 es.
- **Estado**: `tsc --noEmit` 0, `vitest src/features/pathway` **33/33**,
  `pathway.py audit --base base_03 --cases 3` VERDE.

## Bugs/decisiones de esta base

1. El perfil no estaba registrado: el motor seguía usando la rama legacy de Base 03 y el test
   contaba 6 segmentos. Al registrarlo, el perfil pasa a mandar.
2. `--only` en `gen_base.py` reconstruía el manifiesto solo con las pistas regeneradas (riesgo de
   borrar claves). Corregido: reconstruye con **todos** los momentos del perfil.
3. `gen_base.py` sobrescribía el reporte QA al regenerar un subconjunto. Corregido: merge por id.
4. El encoding de `profiles/index.ts` se había corrompido con doble UTF-8 (PowerShell
   `Set-Content`); reescrito en UTF-8 limpio. No usar `Get-Content | Set-Content` para editar
   archivos con tildes.

## Corrección posterior: el “grito” de la trampa (7 nov)

- **Síntoma**: en Base 02 y 03, `trapcheck.success` (“¡Exacto! **Cazaste**…”) sonaba gritado, con
  ruido. No era texto ni ASR: el MP3 **clipeaba** (true peak +0.5 dBTP, 3–8 muestras al máximo).
- **Fix**: `gen_base.py` ahora mide **true peak** (ebur128), descarta semillas con clipping o
  TP > `--max-peak-db` y normaliza la elegida a −1.5 dBTP. `trapcheck.success` se regeneró en
  ambas bases con `--max-peak-db -1.5 --qa-model medium`: 1.000 y TP −2.2 / −2.9.
- **Saneamiento**: `fix_peaks.py --all` bajó 19 pistas que rozaban 0 dBFS (base_01/02/03) sin
  regenerarlas. `check_audio.py` ahora falla con TP > −0.5 o clipping; `pathway.py audit` tiene gate
  **Picos** y las pistas clipeadas salen como `CLIP`.
- **QA español**: el ratio se calcula con normalización de seseo (`z/ce/ci → s`, `v → b`) para no
  regenerar audios correctos porque Whisper escriba “casaste” por “cazaste”.
- **Groq 400** (`invalid_media_file`) al evaluar voz: `transcribeAudio` exige ≥1024 B y detecta el
  contenedor real por cabecera (WebM/Ogg/WAV/MP4); si no lo reconoce, no llama al proveedor y usa
  el transcript en vivo.

## Siguiente: Base 04

- Currículo: `curriculum/a1/module1Identity.ts` bloque Base 04 (“La Trampa de 'Tener' Estados y
  Edad”, `orderIndex: 3`), 2 casos de fórmula (sensaciones / edad).
- Hoy el motor tiene una rama legacy `isBase04` con literales. La receta es la misma:
  ficha → `base_04.ts` → `validate_profile --cases 2` → `pathway.py guion --cases 2` →
  aprobación → `pathway.py build --base base_04 --cases 2` → registro + `CLOSED_BASES` + tests.
- Usar la skill `.agents/skills/pathway-speech-production/SKILL.md`.


## Base 04: guion listo (pendiente de audio)

- `speech/profiles/base_04.ts` escrito: **30 momentos (23 es + 7 en)**, 2 casos de fórmula
  (sensaciones físicas `I am hungry now.` / edad `He is 30 years old.`).
- Trampa: `I have 25 years.` vs `I am 25 years old.`; ejemplos `I am hungry and thirsty.` y
  `He is 30 years old.`; voz objetivo `I am hungry now.`
- `validate_profile --cases 2` PASS y `pathway.py guion --cases 2` **0 errores**.
- **No registrado** y sin audio todavía. Siguiente: aprobar guion → `pathway.py build --base base_04
  --cases 2` → registro + `CLOSED_BASES` + tests.
