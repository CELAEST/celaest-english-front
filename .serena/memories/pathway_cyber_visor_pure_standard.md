# Contrato: Pathway Cyber Visor Pure Architecture (Zero-Boxes Standard)

## Contexto & Directriz del Usuario
El usuario seleccionó el concepto del Visor Cibernético de Liam (`ModelDynamicSplitScreen`), pero solicitó:
1. **Mantener ese modelo intacto** (sin modificar el que capturó).
2. **Generar más variaciones en el Lab**, pero con **`BASE 06` y `Preguntar` 100% limpios y SIN CAJAS ni bordes pesados** (tipografía pura).

## Soluciones Desplegadas en el Lab (`/lab`)
- **Opción 1: Visor Puro (Sin Cajas)**: Mantiene el visor central de Liam `( ● ● )`, pero `BASE 06 ▾` y `💬 Preguntar` pasan a ser tipografía pura mono/sans flotante sin píldoras ni bordes grises. Pestañas de pasos con underline limpio.
- **Opción 2: Visor Compacto (95px)**: Reduce la altura vertical de 140px a 95px colocando `BASE 06` a la izquierda, el mini visor activo en el centro, y `Preguntar` a la derecha en una sola fila compacta, dejando 85% del viewport libre.
- **Opción 3: Visor Halo & Título**: Halo radial translúcido superior que combina el visor `( ● ● )` con el tema de la base (`Acciones Cotidianas`) sin cajas.
- **Opción 4: Visor Original (Tu Captura)**: Preservado 100% idéntico a la captura del usuario.

## Calidad
- Todos los componentes React estrictamente `< 80 líneas`.
- 10/10 pruebas unitarias aprobadas en Vitest.
- Build de producción Vite completado al 100% sin errores.
