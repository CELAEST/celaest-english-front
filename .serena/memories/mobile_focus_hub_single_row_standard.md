# Contrato: Mobile Focus Hub (Single-Row Header) & Zero-Deadspace Standard

## Contexto & Regla
En mobile portrait (< lg), los headers de navegación nunca deben ocupar más de una sola fila de altura fija (~34px - 36px) ni fragmentarse en dos pisos verticales que resten espacio al contenido de aprendizaje o empujen las prácticas hacia abajo.

## Arquitectura Implementada (Option 1 - The Focus Hub)
1. **Fila Única Integrada (36px)**:
   - **Izquierda**: Breadcrumb compacto `[ BASE 0{n} ▾ ]` con acceso directo al currículo.
   - **Centro**: Segmented Control unificado de 3 cápsulas `[ 1. Regla | 2. Práctica | 3. Habla ]` con píldora blanca activa y fondo de cápsula ultra translúcido.
   - **Derecha (Mobile)**: Botón de acceso rápido al tutor 3D `[ 💬 ]` (28px).
2. **Cero Espacio Muerto Superior**:
   - Se eliminó el centrado vertical rígido `justify-center` y `my-auto` en mobile dentro de `PathwayStudioView` y las etapas `PathwayBlockBuilderStep`, `PathwayVisualRuleStep`, `PathwayVoiceUnlockStep`.
   - Se ancló a `justify-start lg:justify-center` y `my-0 lg:my-auto pt-1 sm:pt-2 lg:pt-0`, eliminando el vacío negro de ~250px y posicionando los bloques y oraciones en el punto ergonómico superior natural.
3. **Preservación Invariable del Robot 3D**:
   - La posición de cámara del robot en `professorSceneSetup.ts` se mantiene estrictamente en sus valores originales sin alteraciones no solicitadas.
4. **Cumplimiento de Calidad**:
   - Todos los componentes React estrictamente `< 80 líneas` (Regla Suprema).
   - 10/10 tests unitarios Vitest aprobados.
   - Build de producción Vite completado al 100% sin errores.
