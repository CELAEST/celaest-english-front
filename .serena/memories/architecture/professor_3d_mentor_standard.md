# CELAEST 3D Professor Mentor: Visor Dinámico & Motor de Clase Dictada (Certified)

## 1. Visor Digital Reactivo (Three.js Runtime Attachment)
- **Zero Blender Touch**: The visor is generated 100% programmatically in Three.js and attached as a child of `headBone` (`mixamorig:Head`).
- **Anatomy & Alignment**: Curves smoothly around the face at $Y = 0.26\text{m}$, $Z = 0.12\text{m}$ (radius: $0.235\text{m}$, arc: $94^\circ$).
- **Multi-State Expressions (CanvasTexture 512x256 px)**:
  - `idle`: Glowing pill eyes with organic blink cycles every 3.8s.
  - `explaining`: Live pulsating audio soundwave in CELAEST violet `#A27FF3`.
  - `listening`: Concentric acoustic radar circles in cyan `#38BDF8`.
  - `celebrating`: Smiling curved happy eyes (`^ ^`) in emerald `#4ADE80`.
- **Zero Body Deformation**: Preserves 100% of the original GLB skeletal bind pose. Moves exclusively with the head.

## 2. Motor de Clase Dictada en Español (Bilingual Lecture Engine)
- **PathwayLectureEngine**: Formulates human-like conversational 4-stage lectures in Latin American Spanish:
  1. Warm opening & empathy for L1 Spanish speakers.
  2. The Golden Rule breakdown & mental model explanation.
  3. High-fidelity native English pronunciation example.
  4. Motivational interactive call-to-action to build the blocks.
- **Dual-Language Neural Speech Synthesis**:
  - Spanish sections: Prioritizes `es-MX-DaliaNeural`, `es-ES-ElviraNeural`, or device neural Spanish voices.
  - English sections: Switches seamlessly to `en-US-AriaNeural` with native accents.
  - Integrated head nodding cadences ($3.8\text{Hz}$) while lecturing.

## 3. UI Controls
- `▶ DICTAR CLASE` button with active pulse animation and pause/resume capability.
- Real-time sentence display in the obsidian mentor card synchronized with speech.
