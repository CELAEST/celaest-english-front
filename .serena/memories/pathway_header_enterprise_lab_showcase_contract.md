# Contrato: Pathway Header Enterprise Lab Showcase & Production Baseline

## Contexto
El usuario solicitó mantener la vista de producción de Pathway tal como estaba originalmente:
- **Header en Producción**: 2 filas balanceadas originales (`[BASE 06] [Ruta ▾] [Preguntar]` + tabs `1. La Regla | 2. Practica | 3. Habla`).
- **Práctica Centrada**: El contenido del ejercicio se mantiene centrado en la mitad vertical (`flex flex-col justify-center` y `my-auto`) sin quedar forzado contra el borde superior ni dejar vacíos inferiores.
- **Robot 3D**: Encuadre y cámara estrictamente intactos.

## Laboratorio Interactivo en Lab (`/lab`)
Para audicionar y comparar las mejores alternativas visuales enterprise sin alterar la experiencia viva, se construyó el showroom interactivo:
`src/features/lab/components/PathwayHeaderEnterpriseShowcase.tsx`:
1. **Variante A: "Tokyo Monolith"**: Tipografía pura, cero bordes, elegancia minimalista con underline acentuado.
2. **Variante B: "Executive HUD"**: Fila única de 34px con cápsula segmentada de vidrio obsidiana.
3. **Variante C: "Progress Ribbon"**: Micro-barras de completitud integradas debajo de cada paso.
4. **Simulador de Dispositivo**: Permite alternar en tiempo real entre vista móvil (390px iPhone) y vista desktop amplia, con simulación real del ejercicio centrado debajo.

## Calidad
- Todos los componentes nuevos del showroom cumplen estrictamente con `< 80 líneas`.
- 10/10 pruebas unitarias de Vitest aprobadas.
- Compilación de producción Vite limpia.
