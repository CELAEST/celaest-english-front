# Contrato: Pathway Mobile Innovation Laboratory (4 Nuevos Paradigmas)

## Contexto & Visión del Usuario
El usuario planteó una pregunta clave de innovación en UX/UI móvil:
*"¿Podemos subir el contenido y poner una parte del robot y al lado esas funciones en móvil, o ya sería mucho? ¿O mejor hacerla de otra forma?"*

## Respuesta de Diseño & 4 Paradigmas Implementados en `/lab`
1. **Modelo 1: "Mini-Mentor Holográfico (48px)" (La Idea del Usuario)**
   - **Evaluación**: NO es demasiado si se controla la escala.
   - **Solución**: Un micro-portal circular (44px) con el visor ciberpunk de Liam activo en vivo a la izquierda, y a su lado alineados en una sola fila compacta: `BASE 06 · Acciones Cotidianas` y el botón `[ 💬 Preguntar ]`.
   - **Impacto**: Mantiene la presencia viva del robot en móvil sin quitarle espacio vertical a las fichas de construcción.
2. **Modelo 2: "Cápsula Flotante Inferior (Thumb Zone)"**
   - **Solución**: Arriba queda 100% limpio (solo un susurro tipográfico). Abajo flota una cápsula de vidrio obsidiana con el acceso a Liam, la base y los 3 pasos al alcance inmediato del pulgar.
3. **Modelo 3: "Banner Embebido en Ejercicio"**
   - **Solución**: Elimina la barra superior flotante y embebe la identidad y el acceso al robot directamente en el encabezado del ejercicio.
4. **Modelo 4: "Split 30% Robot / 70% Pizarra"**
   - **Solución**: El tercio superior es un escenario 3D compacto de Liam con los controles como overlay flotante, y los dos tercios inferiores para la práctica.

## Calidad
- Todos los componentes React estrictamente `< 80 líneas`.
- 10/10 pruebas unitarias aprobadas en Vitest.
- Build de producción Vite completado al 100% sin errores.
