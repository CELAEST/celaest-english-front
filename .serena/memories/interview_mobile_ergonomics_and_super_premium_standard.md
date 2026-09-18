# CELAEST INTERVIEW: Mobile Invariance & Dedicated Mobile Viewport Standard

> **Mandato Supremo de Invarianza Desktop**: Cualquier optimización para pantallas móviles (`< sm`) DEBE ser 100% aislada. En pantallas de PC y monitores (`sm:` en adelante) el diseño original, la escala, la esfera y los componentes permanecen 100% intactos sin mover absolutamente nada.

---

## 📱 Regla Específica para Mobile (`< sm:`)

1. **Ocultación del Waveform Spectrum (`ConversationWaveformSpectrum`)**:
   - En móviles (`< sm:`), el visualizador de ondas se oculta exclusivamente con `hidden sm:flex`.
   - **Razón**: En celulares la pantalla se apeñuscaba; al retirarlo se liberan más de 50px verticales, permitiendo que la pregunta, la transcripción y el micrófono respiren con holgura.
   - **En PC / Desktop (`sm:flex`)**: Permanece 100% visible, centrado y con su comportamiento original intacto.

2. **Cero Regresiones en Pantallas Grandes**:
   - Prohibido modificar alturas, clamps o contenedores generales que alteren la visualización en escritorio.
   - Toda adaptación mobile debe utilizar prefijos o modificadores responsivos estrictos (`hidden sm:flex`).
