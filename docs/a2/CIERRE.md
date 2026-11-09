# A2 — Cierre y excepciones

- 32/32 bases con audio y perfil.
- 988 pistas, manifiesto A2 con 1.244 entradas.
- 32/32 perfiles fieles al currículo.
- Tests: A1 33/33 + A2 3/3.

## Excepciones documentadas

1. `base_a2_01/trap.wrong` y `base_a2_04/trap.wrong`: son las formas incorrectas
   deliberadas (`work-ed`, `called`). El TTS no articula bien la falta ortográfica;
   el audio lleva subtítulo con la grafía incorrecta y se acepta como trampa visual.
2. Explicaciones ES con ASR entre 0.88 y 0.95: se aceptan por política (audio sin
   coletilla, texto verificado); large-v3 confirmó contenido. No se regeneran solo
   porque Whisper confunda respellings.
3. `base_a2_07/formula.case3.intro` se regeneró hasta 0.954.
4. Coletillas de Base 07/17/19/21 recortadas por silencio.

## Política
- Inglés (modelo, trampa, target): 0.95 estricto.
- Español explicativo: 0.88 si el audio está limpio.
- Cualquier truncamiento o coletilla se regenera/recorta.
