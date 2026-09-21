# Neural TTS Volume Boost & Viewer Skeleton Synchronization Architecture

## 1. Mobile & Production Neural TTS Volume Standards
- **Source Amplitude (+100% SSML)**: Microsoft Edge Neural TTS outputs at -24 LUFS by default. Altavoces de teléfonos celulares requieren `volume="+100%"` tanto en `edge_tts.Communicate(..., volume=volume)` como en SSML `<prosody volume='%s'>`.
- **Zero Volume Attenuation Bug**: El priming silencioso de `MobileAudioUnlocker.unlock()` debe mantener `audio.volume = 1.0` y nunca reducir a `0.01`, ya que el audio compartido retiene la propiedad y en iOS Safari `audio.volume` es de sólo lectura.
- **Web Audio Booster & Dynamics Limiter**: En `MobileAudioUnlocker.playNeuralBuffer`, el audio decodificado se procesa a través de un `GainNode` con ganancia `1.8x` seguido de un `DynamicsCompressorNode` (`threshold: -12dB`, `ratio: 4:1`, `attack: 3ms`, `release: 250ms`), entregando sonido potente, nítido y sin clipping digital.

## 2. Dynamic Viewer & Skeleton Synchronization Pattern
- **Synchronous Tab Mount Registration**: En `WorkspaceDashboardView.tsx`, `handleSelectNav` debe invocar `setMountedTabs((prev) => (prev.has(route) ? prev : new Set(prev).add(route)))` sincrónicamente con `setActiveTab(route)` para que React monte `<Suspense fallback={<FeatureSkeleton />}>` en el frame exacto del clic del usuario, sin dejar el `<main>` vacío.
- **Zero Bleed-Through Shielding**: El canvas `<main>` debe alternar a `bg-[#000001]` cuando `activeTab !== "workspace"`, y el contenedor de video del Workspace (`home.mp4`) debe ocultarse inmediatamente (`activeTab === "workspace" ? "opacity-100 block" : "opacity-0 pointer-events-none hidden"`).
- **Seamless Skeleton-to-Component Handshake**: Las vistas montadas dentro de `<Suspense>` deben iniciar con `initial={{ opacity: 1, y: 0 }}` para evitar el "dip" de transparencia que revelaba elementos de fondo.
