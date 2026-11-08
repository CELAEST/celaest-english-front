# Contrato de Diseño: Ejemplo del Tema Responsive (Mobile Vertical vs PC Comparativo)

## Contexto y Decisión
- **Requerimiento del Usuario**: Mantener intacto el flujo del modal `PathwayAnatomyModal` y aislar la diferenciación de diseño exclusivamente en el bloque "EJEMPLO DEL TEMA" (`AnatomyShowcaseExample.tsx`).
- **En Mobile (`< 640px` / `sm:hidden`)**: Flujo vertical limpio y compacto idéntico a la referencia visual del usuario:
  - Micro-título "EJEMPLO DEL TEMA"
  - `✗ Frase incorrecta tachada`
  - `✓ Frase nativa con Liam TTS`
  - Traducción al español
- **En PC (`>= 640px` / `hidden sm:grid sm:grid-cols-2`)**: Distribución comparativa horizontal en dos columnas con tipografía flotante y cero cajas:
  - Columna Izquierda: `✗ ERROR COMÚN` con tachado y nota de interferencia del español, separada por hairline sutil (`border-r border-white/[0.06]`).
  - Columna Derecha: `✓ ESTRUCTURA CORRECTA` con reproducción de voz nativa de Liam (`SpeechSynthesisService.speak`) y traducción en español.
- **Regla Anti-Monolito y Zero Boxes**:
  - `AnatomyShowcaseExample.tsx`: 76 líneas (estrictamente < 80 líneas).
  - Cero contenedores de tarjeta con fondo (`bg-*`) ni bordes pesados; pura tipografía flotante de alta jerarquía.
