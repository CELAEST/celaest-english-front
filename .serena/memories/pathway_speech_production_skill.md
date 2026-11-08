# Skill: Pathway Speech Production (flujo anti-error)

- **Ubicación**: `.agents/skills/pathway-speech-production/SKILL.md`
- **Qué es**: protocolo de extremo a extremo para producir una base de Pathway (perfil → guion
  aprobado → audio con gate → manifiesto → cableado → tests → cierre). Nace de los errores
  reales de Antigravity (`c68f979d…`, 9.543 pasos) y de Base 01/02.
- **Cuándo usarla**: cualquier trabajo de voz/audio/guion de Pathway, "base N", manifiesto,
  pizarra en vivo, o cuando el usuario diga "se oye otra voz", "se corta", "falta un caso".

## Las 12 leyes (resumen)
1. Una sola voz en todo el curso (incluye error, retry, mic, victoria); prohibido fallback.
2. Una pista = un idioma; inglés aislado, español sin frases inglesas.
3. Cada caso de la fórmula se explica 1 a 1 (intro es → modelo en, con badge y case index).
4. Guion para el oído: frases cortas, sin símbolos, sin leer la tarjeta, sin repetir la regla.
5. El guion se aprueba antes de generar audio.
6. El perfil es la única fuente; el motor y los hooks leen de ahí.
7. El manifiesto se genera, no se edita.
8. Cues por evento (`trapPhase`, `formulaRevealCount`, `activeFormulaCaseIndex`,
   `activeExampleIndex`), nunca timers ciegos.
9. Cobertura total: todo lo pronunciable tiene mp3; `CLOSED_BASES` solo con gate verde.
10. Nada se corta ni se solapa: pausas, cortes con margen, >1000 B, cero 416.
11. Cero sobreingeniería, cero emojis, cero cambios no pedidos.
12. Honestidad cruda: sin verificación no se dice "listo".

## Herramientas de la skill
```bash
# Centro de control: matriz de todas las bases, auditoría y construcción incremental
python .agents/skills/pathway-speech-production/scripts/pathway.py status
python .agents/skills/pathway-speech-production/scripts/pathway.py audit --base base_0N --cases N
python .agents/skills/pathway-speech-production/scripts/pathway.py build --base base_0N --cases N

# Calidad de guion (pedagogía, flujo, fluidez, UC-01…UC-10), sin GPU
python .agents/skills/pathway-speech-production/scripts/pathway.py guion --base base_0N --cases N

# Detalle por fase
python .agents/skills/pathway-speech-production/scripts/validate_profile.py --profile <perfil> --cases N
python .agents/skills/pathway-speech-production/scripts/gen_base.py --base base_0N --dry-run
python .agents/skills/pathway-speech-production/scripts/check_audio.py --base base_0N
```

`audit` re-mide con Whisper las pistas cuyo ratio guardado es viejo o está bajo el gate (mp3 más
nuevo que el estado), y deja el reporte pista por pista en `.pathway_reports/<base>.md`. `build`
solo genera lo que falta o falla (`--only` + `--force`) y reconstruye el manifiesto con **todos**
los momentos del perfil, no solo los regenerados.

## Gate acústico (grito/clipping) — 7 nov
- `gen_base.py` mide **true peak** (ebur128), descarta semillas con clipping o TP > techo
  (`--max-peak-db -1.5`), normaliza la elegida y guarda `true_peak_db`.
- `check_audio.py` falla si TP > −0.5 dBTP o hay muestras clipeadas; `pathway.py audit` marca `CLIP`.
- `fix_peaks.py --all` sanea pistas viejas sin regenerar.
- QA español con seseo (`z/ce/ci→s`, `v→b`) y `--qa-model medium` para desempatar.
- Groq 400: `transcribeAudio` exige ≥1024 B + sniff de contenedor (WebM/Ogg/WAV/MP4).

## Defectos que la skill ya previene
Caso faltante (Base 02 "opiniones neutras"), audio de otra base por texto duplicado, 416 por
concatenar sin remux, corte de palabra por silencedetect, bleed entre pistas, solape por
`onStepTrigger` antes del `onEnd`, "i an redi / wi ar redi / i ave 25 yiar", cues que el motor
no copia, manifiesto con claves stale, BOM en JSON de estado, y el ASR `small` dando 0.96 en
audios correctos (desempatar con `medium`).

- Transición ES→EN: prefetch del mp3 como blob + `canplaythrough` antes de `play()`; nunca
  streaming en el cambio de idioma. Ver skill §7.4.

- No meter "not" en pistas españolas (suena "no"): describir "la palabra de negación".
- Una frase EN corta puede alucinar cola ("… Joe, that's Dane J."): el ratio < 0.9 lo delata y se
  regenera con semillas.
- Clíticos: "repítela" puede oírse/escribirse "repite la"; normalizar antes de regenerar.
