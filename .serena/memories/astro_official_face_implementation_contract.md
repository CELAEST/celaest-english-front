# IMPLEMENTACIÓN OFICIAL DEL VISOR ASTRO BOT EN LINGUA

1. **Eliminación Total del Blanco Alrededor de los Ojos**:
   - Erradicadas las cejas y arcos 2D en `CyberVisorFaceEngine.ts`.
   - Modificado `tuckChibiFaceUnderVisor` en `professorSceneSetup.ts` para retraer toda la zona de frente/cejas del modelo GLB original hasta `topRimY = 1.565 - 0.35 * x^2`, eliminando los vértices de piel/cejas blancas que se asomaban a través del visor.
   - Configurado el material del visor a acabado OLED satinado anti-reflejos (`roughness: 0.92, metalness: 0.0`), eliminando cualquier brillo blanco especular indeseado sobre los ojos.

2. **Implementación de las Variantes Ganadoras como Estándar Oficial**:
   - **Hablando (Variante 1)**: `vocal_capsule` (Cápsula Vocal Orgánica). Ubicada en posición baja `Y = 685` en canvas 1024x1024, con cadencia fonética en tiempo real.
   - **Escuchando (Variante 1)**: `ear_radar` (Ondas de Auriculares). Dos ondas acústicas translúcidas en los auriculares del casco + onda reactiva fina en el mentón (`Y = 685`).

3. **Integración Universal en el Avatar 3D**:
   - Integrado en `professorRigController.ts`: toda instancia del profesor en la aplicación (Pathway, Workspace, Labs) corre con el motor `CyberVisorFaceEngine` y sincroniza automáticamente las emociones según el estado (`explaining` -> habla 1, `listening` -> escucha 1, `celebrating` -> feliz, `idle` -> reposo).