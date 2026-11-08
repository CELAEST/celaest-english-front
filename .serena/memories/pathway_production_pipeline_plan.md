# Plan de producción Pathway — cerrar bases sin bugs y sin re-trabajo

> Objetivo: que "base terminada" sea un hecho verificable, no una opinión.
> Restricción real: GPU de 4 GB (RTX 3050). ~60 s de generación por cada 15 s de audio.

---

## 1. Por qué se perdió tiempo (causa raíz)

No fue la voz ni el modelo. Fueron cuatro fugas estructurales:

| Fuga | Efecto |
|---|---|
| El habla tiene **3 orígenes** (manifiesto → mp3, caché de prefetch, `/tts/stream` en vivo) | cuando falta una línea, cae en silencio a otra voz y nadie se entera |
| El manifiesto es un **mapa texto→archivo escrito a mano**, con ~250 variantes legacy y claves duplicadas | el texto que emite el motor deja de coincidir con la clave y se pierde la pista |
| El texto vive en **3 lugares** (motor, hooks, scripts de generación) | regenerar audio no cambia lo que dice la app, y viceversa |
| Verificación **por oído** al final | los defectos se descubren en clase, no en el build |

Conclusión: el problema no es generar audio, es que **nada garantiza cobertura**. Mientras eso siga así, cada base costará 2–3 rondas de corrección.

---

## 2. Invariante del sistema

> **Una base está terminada si y solo si su test de cobertura pasa en verde.**

El test exige, por base:

1. **Cobertura 100%**: toda cadena que el sistema puede pronunciar tiene audio propio. Cero fallback a TTS en vivo.
2. **Un idioma por pista**: ninguna pista contiene español e inglés mezclados.
3. **Fidelidad**: cada pista transcrita con Whisper (idioma forzado) contra su texto canónico, ratio ≥ 0.95.
4. **Dinamismo**: la secuencia de cues (`trapPhase`, `formulaRevealCount`, beats) coincide con la esperada, y ningún paso avanza sin interacción.
5. **Sin huérfanos**: ninguna entrada del manifiesto apunta a un archivo inexistente, y ningún archivo queda sin referencia.

Nada se declara "listo" sin los cinco. Eso elimina las rondas de corrección tardías.

---

## 3. Fuente única de verdad: `BaseSpeechProfile`

Un archivo por base (`src/features/pathway/speech/profiles/base_01.ts`):

```ts
{
  id: "base_01",
  orderIndex: 0,
  voiceProfile: "v2_expresivo",        // referencia + parámetros fijos
  moments: [
    {
      id: "formula.case1.intro",
      beat: "FORMULA",
      language: "es",
      text: "…lo que lee el TTS (puede llevar respelling: 'tu bi')…",
      canonical: "…lo que debe oírse (base del QA, sin respelling)…",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 0 },
      pauseAfterMs: 380,
      audio: "base_01/seg_01.mp3"      // derivado, no escrito a mano
    }
  ]
}
```

De ahí se **derivan** los cuatro artefactos: los mp3, las entradas del manifiesto, los segmentos que consume el motor y el QA. El manifiesto deja de editarse a mano: se genera.

Beneficio medible: hoy el manifiesto tiene claves duplicadas y ~250 variantes legacy; generado, tiene exactamente una entrada por momento.

---

## 4. Fases

### Fase 0 — Cerrar la fuga de voz (media jornada)
- `speak()` en dev: si el texto no está en el manifiesto, `console.error` con el texto exacto y un contador global. Nada de fallback silencioso.
- Test `speech-coverage.test.ts`: recorre motor + hooks + coreografía + vistas y falla si alguna línea no tiene audio.
- **Salida**: la lista real de huecos de Base 01, sin escuchar nada.

### Fase 1 — Contrato y migración de Base 01 (1 jornada)
- Definir el tipo y el generador de manifiesto.
- Migrar Base 01 al contrato **sin cambiar comportamiento** (los tests actuales son la red: 29/29 deben seguir verdes).
- Partir las 5 locuciones mixtas en 10 pistas de un idioma.
- **Salida**: Base 01 cumple los 5 invariantes.

### Fase 2 — Pipeline reproducible (1 jornada)
Comando único `npm run pathway:build -- --base=01`:
1. valida el perfil,
2. genera solo los audios cuyo hash de texto cambió (**incremental**),
3. QA con reintento por semilla (1 pasada; reintenta solo si < 0.95),
4. compila maestros con ffmpeg,
5. escribe el manifiesto,
6. corre los tests y emite reporte.

Idempotencia: re-ejecutar sin cambios no gasta GPU. Eso es lo que evita perder tiempo en cada iteración.

### Fase 3 — Dinamismo verificable (media jornada)
- Test de secuencia de cues por base (orden, fases, conteos).
- Test de interacción: `TRAP_CHECK` no avanza sin click; `TRAP` no redirige a otro escenario.
- **Salida**: el bug de "se salta la trampa" queda cubierto por un test que falla antes de llegar a producción.

### Fase 4 — Escalado por lotes
- Orden: 01 → 02–05 (ya tienen VÍA A) → 06–32 en lotes de 5.
- Criterio de lote: los 5 invariantes verdes + 60 s de escucha humana.

---

## 5. Presupuesto de tiempo (honesto)

| Concepto | Cifra |
|---|---|
| Generación por pista (15 s de audio) | ~60 s GPU |
| Pistas por base (con splitting) | ~35–40 |
| Coste por base con gate-y-reintento (~1.2×) | **~45–55 min GPU** |
| 32 bases | **~25–30 h de GPU** (2–3 noches) |
| Trabajo de ingeniería del pipeline (Fases 0–3) | **~3 jornadas** |

El cuello es la GPU, no el código. La palanca para no perder tiempo no es generar más rápido: es **no regenerar lo que no cambió** y **no descubrir defectos tarde**.

---

## 6. Reglas de operación (para no repetir errores de esta sesión)

1. No declarar nada "verificado" con medición parcial. Un solo punto de datos no es una tendencia.
2. Nunca reportar éxito de un batch sin leer el reporte JSON completo.
3. Todo cambio de audio se mide con Whisper contra texto canónico, idioma forzado, no con auto-detección.
4. Los archivos de respaldo (`base_XX_edge_backup/`) se crean siempre antes de sobrescribir.
5. Una pista mixta es un defecto de diseño, no un detalle de pronunciación.
