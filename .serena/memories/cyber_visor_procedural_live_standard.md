# Contrato: Cyber Visor Live Procedural OLED Engine & High-End Tutor Standard

## Contexto & Resolución
Se reemplazó el avatar simulado con puntos 2D en CSS por el auténtico motor procedural `CyberVisorLiveScreen`, que ejecuta el motor `CyberVisorFaceEngine` a 60 FPS sin cargar el modelo 3D pesado.
El usuario solicitó explícitamente:
- NO usar el robot 3D Three.js pesado aquí.
- Que el tutor sea un Cyber Visor de alta tecnología, aerodinámico, de cristal obsidian y de acabado de lujo.
- Eliminar ejemplos breves o bocetos simples y crear una matriz de visores futuristas con substancia.

## Componentes y Arquitectura Implementada:
1. `CyberVisorLiveScreen.tsx`:
   - Componente React ultraligero (< 80 líneas).
   - Renderiza un canvas procedural 2D a 60 FPS con `CyberVisorFaceEngine`.
   - Gaze Tracking: los ojos cibernéticos OLED siguen la posición del puntero/toque táctil en tiempo real (`setPointerGaze`).
   - Interactividad 1-clic: al pulsar el visor, cambia de emoción con animación suave (idle -> happy wink -> speaking).
   - Bisel aerodinámico de cristal obsidian con corte curvado, brillo especular diagonal y aura cian/violeta emisiva.
2. `ModelDynamicSplitScreen.tsx`:
   - Integra `CyberVisorLiveScreen` en el centro del escenario superior, con tipografía 100% limpia en `BASE 06` y `Preguntar`.
3. `ModelVisorJarvis.tsx`:
   - Visor táctico con retícula cibernética Jarvis, barras de espectro de audio y telemetría `NEURAL SYNC 99.8%`.
4. `ModelVisorHorizon.tsx`:
   - Visor Quantum Horizon estilo Porsche Lightblade con apertura láser y aura amatista.
5. `ModelVisorMatrix.tsx`:
   - Visor Dot Matrix Phosphor LED verde esmeralda estilo Teenage Engineering.

## Quality Gate (100% Green):
- TypeScript: `tsc --noEmit` completado con 0 errores.
- Vitest: 10/10 tests pasados en `src/features/pathway`.
- Vite Build: Empaquetado de producción exitoso en 22.53s.
- Todos los componentes React estrictamente < 80 líneas (Regla Suprema CELAEST).
