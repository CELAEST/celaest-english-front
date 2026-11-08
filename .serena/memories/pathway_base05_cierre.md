# Base 05 cerrada — siguiente Base 06

## Base 05: cerrada y verificada

- **Guion**: `src/features/pathway/speech/profiles/base_05.ts` (30 momentos, 23 es + 7 en),
  dos casos: negar (`He isn't busy right now.`) y preguntar (`Are you ready today?`).
- **Audio**: 30 clips en `public/audio/pathway/a1/base_05/` (3:24), true peak seguro, sin clipping.
  Ratio mínimo **0.985**; 0 pistas a revisar.
- **Manifiesto**: 213 entradas totales; base_05 +41.
- **Registro**: `base05SpeechProfile` + hints `negativo & pregunta` / `negativo y pregunta`.
  `CLOSED_BASES` = base_01…05.
- **Test**: `PathwayQAService.test.ts` espera 5 segmentos FORMULA (regla + 2 intros + 2 modelos).
- **Estado**: `tsc` 0, `vitest` **33/33**, `audit` VERDE, `check_audio` 0 errores.

## Lecciones nuevas (ya en la skill)

1. **“not” en pista española suena “no”**: el TTS español pierde la consonante final. No meter la
   palabra; decir “la palabra de negación” y dejar que la pizarra (`isn't (is not)`) y el modelo en
   inglés la muestren. Se reescribieron `formula.rule` y `formula.case1.intro`.
2. **Alucinación de cola**: `example.meeting` (“Are you ready for the meeting?”) salió con
   “… Joe, that's Dane J.” y ratio 0.706. El gate lo detectó y se regeneró con semillas (seed 44,
   1.000).
3. El gate acústico rechazó varias semillas por true peak > −1.5 dBTP antes de elegir una limpia.

## Siguiente: Base 06

- Ya no hay rama legacy de Base 06 en el motor; el registro por perfil la toma directo.
- Currículo en `curriculum/a1/module2Routines.ts` (primer bloque del módulo 2).
- Receta: ficha → `base_06.ts` → `validate --cases N` + `guion` → aprobación →
  `pathway.py build --base base_06 --cases N` → registro + `CLOSED_BASES` + tests.
