# CELAEST Standard: Responsive Memory Header Centering & Distribution

## Directiva de Adaptación Mobile en Headers de Módulo (`MemoryHeader.tsx` y `MemoryFilterTabs.tsx`)
1. **Centrado Simétrico en Mobile**:
   - En pantallas móviles (`< sm`), el encabezado debe estar centrado (`items-center text-center mx-auto`) para armonizar con la baraja de flashcards y los controles que ocupan el eje central de la pantalla.
   - En resoluciones de escritorio (`sm:` en adelante), se preserva la alineación asimétrica a la izquierda (`sm:items-start sm:text-left sm:mx-0`) junto al VideoOrb posicionado a la derecha.
2. **Distribución y Tipografía**:
   - Tag de categoría centrado con tracking generoso (`tracking-[0.24em] text-[#9D7BF5]`).
   - Título responsivo (`text-xl xs:text-2xl sm:text-2xl lg:text-3xl`).
   - Subtítulo acotado y centrado (`max-w-[300px] xs:max-w-[360px] sm:max-w-none text-xs sm:text-sm`).
   - Pestañas de categoría centradas (`mx-auto sm:mx-0`) manteniendo la distribución equitativa de los 3 dominios (Speaking, Reading, Writing).
