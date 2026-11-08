# CELAEST Pathway Masterclass: Bilingual Delineation, Live Dynamism & Industrial Batch Pipeline Plan

## 1. Los 3 Déficits Clave del Modelo Multilingüe (Azure/Edge en-US-AndrewMultilingualNeural)
1. **Déficit 1: "Code-Switching Bleed" (Arrastre Fonético Español sobre Inglés)**
   - *Mecanismo*: El clasificador de idioma (LID) del modelo analiza ventanas acústicas completas. Si el 90% del texto es narración en español, el modelo aplica la fonética hispana a palabras inglesas contiguas ('we are ready' -> /we a-re rea-di/, 'to be' -> /to be/).
   - *Solución Definitiva (Contrato de Oro)*:
     - **Respelling Fonético en Español**: Palabras aisladas en el script de narración se escriben fonéticamente ('el verbo tu bi', 'ai, iu, ui, dei'). Subtítulos en pantalla mantienen ortografía académica pura ('el verbo to be').
     - **Cues Lingüísticos y Puntuación Trigger**: Citas directas con mayúscula, comillas, dos puntos y punto interno (: "We are ready.") o frases de activación ('diciendo en inglés: "We are ready."').
     - **Aislamiento de Clips Nativos**: Los modelos nativos se declaran como segmentos de audio independientes (language: "en") o tracks aislados, forzando al modelo al 100% de su acústica nativa estadounidense (/wiː ɑːr ˈrɛdi/).

2. **Déficit 2: "Desincronización de Timers Estáticos" (Falsa Falta de Dinamismo)**
   - *Causa*: En LiveBoardFormulaScene.tsx existían timers fijos a 14500ms y 17200ms pensados solo para mono-casos largos (Base 01). En multi-casos (Base 03) donde cada rama dura ~6-7s, los timers nunca disparaban y las fichas 2 y 3 nunca se iluminaban.
   - *Solución*: Dinamismo adaptable por tipo de regla:
     - Multi-caso (cases.length > 1): Sujeto a 0ms, Verbo a 2400ms, Estado/Complemento a 4600ms.
     - Mono-caso (cases.length === 1): Sujeto a 0ms, Verbo a 14500ms, Momento a 17200ms.
     - Eventos guiados por los segmentos del PathwayLectureEngine.

3. **Déficit 3: "Dilema de Escala" (Base por Base vs Motor Procedural por Lotes)**
   - *Conclusión Estratégica*: Hacer una por una a mano tomaría semanas y es insostenible. Hacer las 32 a ciegas sin reglas produce mala fonética.
   - *La Solución Ganadora*: **Motor Procedural por Lotes (Batch Pipeline)** organizado en sprints de 5 bases (Lote 1: 01-05, Lote 2: 06-10, etc.). El motor lee los payloads tipados de LearningPathway.ts, aplica las 7 Reglas de Oro fonéticas y genera tracks limpios en segundos.
