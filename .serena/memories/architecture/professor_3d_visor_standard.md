# 3D Professor Robot Full Astronaut Helmet Visor Standard

## 1. Spatial Coordinates & Mesh Fitting Contract
- **GLB Model**: `/public/Meshy_AI_necesitop_crear_un_pe_All_Animations.glb` (Chibi Astronaut Robot, 1.70m, 36,079 vertices).
- **Helmet Aperture Envelope**:
  - Full opening spans $X \in [-0.31m, +0.31m]$ (Width = 0.62m).
  - Vertical opening spans $Y_{mesh} \in [1.07m, 1.53m]$ (Height = 0.46m).
  - Aperture Center relative to `mixamorig:Head`: $Y = 0.213m$.
  - Face apex at center: $Z_{local} = +0.3895m$.
- **Ellipsoidal Dome Curvature**:
  - Radii: $R_x = 0.68m$, $R_y = 0.72m$, $R_z = 0.68m$.
  - Sliced arc angles: $\text{arcX} = 0.94$ rad ($53.8^\circ$), $\text{arcY} = 0.66$ rad ($37.8^\circ$).
  - Front apex: $Z = 0.408m \implies Z_{offset} = -0.272m$.
  - Clearance profile: $+9mm$ to $+25mm$ strictly positive across cheeks, chin, and forehead.

## 2. Organic Squircle Aperture & Double-Layer Optics
- **Organic Squircle Mask**: Clipped via `CanvasRenderingContext2D` squircle path (corner radius $r = 80px$) so sharp rectangular sphere corners are 100% transparent (`alphaTest: 0.05`).
- **Inner Emissive Screen**: `MeshStandardMaterial` with `emissiveIntensity: 2.2`, dual-zone UI (eyes at $Y = 38\%$, mouth/waves at $Y = 72\%$).
- **Outer Obsidian Glass Dome**: `MeshPhysicalMaterial` with $R = 0.685m$, `alphaMap: visorCanvas.texture`, specular gloss sheen and studio ambient reflections.
- **Protective Perimeter Rim**: 16px obsidian silicone gasket bezel (`#080c14`) and luminous violet trim (`rgba(162, 127, 243, 0.4)`) seamlessly sealing the glass into the helmet opening.

## 3. Dynamic Emissive Canvas Lifecycle
- `ProfessorVisorCanvas`: 512x384 px throttled to ~35 FPS ($dt > 0.028$s).
- **States**:
  - `idle`: Luminous anime eyes at eye-level ($Y = 38\%$) with soft gradient and organic blinks, plus gentle digital mouth line ($Y = 72\%$).
  - `explaining`: Live audio frequency spectrum bars pulsing at mouth level while eyes stay open and attentive.
  - `listening`: Electric cyan eyes with concentric acoustic sonar radar rings.
  - `celebrating`: Emerald green happy arcs (^ ^) with joyful smile curve.

## 4. Pose Integrity Guarantee
- Zero bone overrides on spine, neck, shoulders, arms, or hips. All 57 body bones maintain their original GLB rest pose.
- Only `mixamorig:Head` receives gaze tracking offsets (with inverted pitch fix: cursor down = look down, cursor up = look up).
