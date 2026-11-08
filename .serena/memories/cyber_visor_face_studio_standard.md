# CELAEST Lingua: Cyber Visor Emissive Face & Identity Matrix Standard

## Arquitectura del Estudio de Rostros en Lingua Lab (/lab)

1. **CyberVisorFaceEngine (Generador de Rostro Procedural a 60 FPS)**:
   - Reside en [CyberVisorFaceEngine.ts](file:///c:/Users/user/Music/celaest-english-front/src/design-system/components/Professor3D/CyberVisorFaceEngine.ts).
   - Genera una textura procedimental dinámica (`THREE.CanvasTexture`) proyectada directamente sobre `visorMesh.material.emissiveMap`.
   - Soporta 5 arquetipos de diseño cibernético:
     1. `astro_chibi`: Cápsulas gemelas OLED con pestañas, parpadeo orgánico y boca en ecualizador acústico reactivo a voz.
     2. `oled_matrix`: Retícula de micro-LEDs de fósforo cuántico de alta densidad (estilo Apple Vision Pro / Tesla Optimus).
     3. `jarvis_hud`: Retículas tácticas circulares con rotación orbital, azimut y telemetría de combate.
     4. `quantum_nodes`: Nodos lumínicos y filamentos de sinapsis que oscilan armónicamente.
     5. `linear_horizon`: Cuchilla lumínica horizontal Porsche con apertura óptica doble ultra-minimalista.

2. **Integración con ProfessorRigController**:
   - Conexión reactiva vía `controller.setFaceEngine(engine)`.
   - El tracking de puntero `setPointer(normX, normY)` alimenta la mirada de los ojos digitales en tiempo real (`engine.setPointerGaze`).
   - Sincronización de estados emocionales (`idle`, `speaking`, `happy`, `thinking`, `listening`).

3. **Showcase Interactivo en Lingua Lab**:
   - Montado en la cúspide de [LabView.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/lab/components/LabView.tsx) como la sección prioritaria `00.VISOR_FACE_STUDIO`.
   - Control dinámico de presets de cámara (`face-focus`, `bust-guide`, `tutor-stage`), paletas cromáticas (Cyan, Violet, Mint, Solar, Moonlight, Ruby) y controles de brillo y scanlines OLED.