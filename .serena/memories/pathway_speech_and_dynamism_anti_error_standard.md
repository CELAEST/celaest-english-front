# Master Protocol: Anti-Error Standard for Speech & Real-Time Dynamism (CELAEST Pathway)

> **Mandato Permanente**: Ningún agente de IA (Antigravity, Claude, Gemini) generará clases de Pathway sin cumplir este estándar anti-errores al 100%. Las fallas fonéticas ("i ave 25 yiar") y los desfasajes visuales están terminantemente prohibidos.

---

## 🏛️ Las 6 Leyes Inviolables de la Generación de Clases

### 1. Ley 1: Cero Contaminación Bilingüe (Zero Bilingual Bleed / Zero Mashing)
* **El Defecto**: Si se incluye una frase en inglés dentro de un párrafo en español para el motor TTS (`en-US-AndrewMultilingualNeural`), el modelo procesa todo bajo la fonética española.
  * `have` tiene $h$ muda en español $\rightarrow$ suena **"ave"** ("i ave 25 yiar").
  * `years` no existe en español $\rightarrow$ suena **"yiar"**.
  * `ready` se lee con $r$ fuerte española $\rightarrow$ **"rredi"**.
* **La Solución**: **NUNCA** incrustar oraciones en inglés dentro de texto en español. Toda frase en inglés (`"I have 25 years."`, `"I am 25 years old."`, `"I am ready."`) DEBE estar aislada en su propio segmento con `language: "en"`.

### 2. Ley 2: Arquitectura Desacoplada VÍA A en FÓRMULA y TRAMPA
Tanto la **Fórmula** como la **Trampa** deben usar la estructura desacoplada VÍA A:
* **Fórmula**:
  1. Caso 1 Intro (es): Explicación cálida del mentor.
  2. Caso 1 Modelo (en): Frase en inglés americano puro (`/aɪ æm ˈhʌŋɡri naʊ/`).
  3. Caso 2 Intro (es): Explicación del segundo caso.
  4. Caso 2 Modelo (en): Frase en inglés americano puro (`/hiː ɪz ˈθɜːrti jɪərz oʊld/`).
* **Trampa**:
  1. Alerta Intro (es): Advertencia de interferencia de L1 (*"En español decimos tengo 25 años con el verbo tener, pero en inglés nunca usamos ese verbo..."*).
  2. Error Común (en): Modelo nativo del error (`"I have 25 years."`).
  3. Transición/Pivote (es): *"Sino que en inglés siempre decimos:"*.
  4. Forma Natural (en): Modelo nativo correcto (`"I am 25 years old."`).
  5. Ancla Mental (es): Regla cognitiva final (*"Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi."*).

### 3. Ley 3: Adaptaciones Fonéticas en Español para Términos Gramaticales
Cuando el mentor habla en español y menciona un concepto lingüístico, se aplican reglas fonéticas para evitar fallas:
* `"el verbo To Be"` $\rightarrow$ Escribir `"el verbo tu bi"` (evita que suene /to be/).
* `"el pronombre I"` $\rightarrow$ Escribir `"el pronombre ai"`.
* Para verbos en inglés, referirse a ellos por su concepto en español: usar `"el verbo tener"` en lugar de `"el verbo have"` (que Andrew pronunciaría como `"ave"` por la h muda en español).

### 4. Ley 4: Dinamismo Visual Sincronizado por Eventos (Zero Blind Timers)
* **Prohibido**: `setTimeout` ciegos (`7500ms`, `11500ms`) en componentes de pizarra (`LiveBoardTrapScene.tsx`, `LiveBoardFormulaScene.tsx`).
* **Estándar**: Las transiciones visuales se activan por metadatos de segmento:
  * `trapPhase: 0` $\rightarrow$ Alerta roja mostrada.
  * `trapPhase: 1` $\rightarrow$ Tachado en rojo automático en el milisegundo exacto en que suena el audio del error.
  * `trapPhase: 2` $\rightarrow$ Luz esmeralda y checkmark automático en el milisegundo exacto en que suena la forma natural.
  * `formulaRevealCount: 1 | 2 | 3` $\rightarrow$ Revelado progresivo de Sujeto $\rightarrow$ Verbo $\rightarrow$ Complemento.

### 5. Ley 5: Cadencia de Respiración Cognitiva
* **750 ms**: Pausa de absorción tras un modelo nativo en inglés (`language === "en"`), permitiendo al alumno procesar la pronunciación e inspeccionar visualmente los bloques iluminados.
* **380 ms**: Pausa de respiración natural tras una introducción antes de que entre el modelo nativo (`formulaRevealCount === 1` o `trapPhase === 0`).
* **260 ms**: Transición estándar entre conceptos narrativos.

### 6. Ley 6: Quality Gate de Audio Automatizado
* Toda pista de audio generada debe superar la verificación de tamaño (`> 1000` bytes) antes de ser guardada.
* Los masters consolidados (`seg_03.mp3`) se compilan con `ffmpeg concat` a partir de los segmentos desacoplados limpios, garantizando que tanto la reproducción segmentada como la continua suenen impecables.
* Cero errores HTTP 416 (Requested Range Not Satisfiable).
