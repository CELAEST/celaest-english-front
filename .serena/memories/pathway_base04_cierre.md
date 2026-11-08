# Base 04 cerrada — siguiente Base 05

## Base 04: cerrada y verificada

- **Guion**: `src/features/pathway/speech/profiles/base_04.ts` (30 momentos, 23 es + 7 en),
  dos casos de fórmula: sensaciones (`I am hungry now.`) y edad (`He is 30 years old.`).
- **Audio**: 30 clips en `public/audio/pathway/a1/base_04/` (3:18), true peak seguro
  (gate −1.5 dBTP), sin clipping. Gate final 30/30.
- **Manifiesto**: 172 entradas totales; base_04 +40.
- **Registro**: `base04SpeechProfile` en `speech/profiles/index.ts` + hints
  (`trampa de tener`, `estados y edad`). `CLOSED_BASES` = base_01…04.
- **Test**: `PathwayQAService.test.ts` ahora espera 5 segmentos FORMULA para Base 04
  (regla + 2 intros es + 2 modelos en) en vez de los 4 de la rama legacy.
- **Estado**: `tsc --noEmit` 0, `vitest` **33/33**, `audit --base base_04 --cases 2` VERDE,
  `check_audio` 0 errores.

## Bugs/herramientas de esta base

1. **Falso negativo del QA por respelling**: Whisper oía “tu bi” como “tu vi”, “tuí”, “tuy” o
   “to be”, y “con tener” como “contener”. La normalización fonética ES ya cubre esas variantes;
   con eso `trap.anchor` y `trapcheck.success` pasaron de 0.93/0.92 a **1.000 sin regenerar**.
   Para eso se agregó `gen_base.py --qa-only --force`, que re-evalúa mp3 existentes.
2. **Estado no persistido en `--qa-only`**: el ratio se actualizaba en memoria pero no en
   `.pathway_state`. Ahora se escribe siempre al final del loop.
3. **Manifiesto apuntando al vacío**: al generar un subconjunto se mapeaban todos los momentos.
   Ahora solo se mapean los mp3 que existen.
4. **`base` sin definir** en la carga del estado legacy (se usaba `base` en vez de `args.base`);
   corregido.

## Siguiente: Base 05

- Currículo: “Ser o Estar en Negativo & Pregunta” (`orderIndex: 4`), 2 casos:
  negación (`He isn't busy right now.`) y pregunta (`Are you ready today?`).
- Trampa: `You are ready?` → `Are you ready?`; voz objetivo `Are you ready today?`.
- Hoy Base 05 vive en la rama legacy `isBase05` del motor y ya tiene audio viejo en
  `public/audio/pathway/a1/base_05/`. La receta es la misma: perfil → validar → guion →
  `pathway.py build --base base_05 --cases 2` → registro + cierre + tests.


## Cambio de idioma fluido (7 nov)

- **Síntoma**: al pasar ES→EN, el audio “intenta, dice un poquito, se detiene y sigue”.
- **Causa**: el mp3 inglés se reproducía en streaming (`audio.src` remoto) y `play()` arrancaba
  antes de tener buffer; en red móvil se quedaba sin datos a mitad de la primera palabra.
- **Fix**: `SpeechSynthesisService.prefetchStatic()` baja el mp3 completo como blob;
  `prefetch()` lo dispara para el segmento siguiente y `speak()` espera `canplaythrough`
  (`readyState >= 3`) antes de `play()`. Documentado en la skill §7.4 (fila 29 del catálogo).
