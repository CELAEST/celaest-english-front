# CELAEST CORE MANDATE: Anti-Re-render, In-Flight Concurrency & Engineering Pillars

> **REGLA PERMANENTE DE INGENIERÍA**: Toda implementación en CELAEST Frontend y Backend debe regirse estrictamente por este protocolo para erradicar re-renders innecesarios, condiciones de carrera en red y cascadas de `useEffect`.

---

## 🛡️ 1. In-Flight Request Deduplication (Defensa de Red y Concurrencia)
- **Problema Detectado**: En montajes de React (especialmente React StrictMode en desarrollo o re-renders por carga asíncrona de `/user/profile`), múltiples llamados a servicios de IA (`generateBatchTasks`, `generateSessionQuestions`) se disparaban en paralelo antes de que el primero completara, triplicando el consumo de red y tokens.
- **Protocolo Obligatorio**:
  - Todo servicio generador de IA (`AiWritingTaskGenerator`, `AiInterviewQuestionGenerator`, etc.) DEBE mantener un mapa de promesas en vuelo:
    `private static inFlightBatchPromises = new Map<string, Promise<T>>();`
  - Si ya existe una promesa en curso para la misma clave `(role:level)`, retornar INMEDIATAMENTE esa misma promesa sin disparar un nuevo fetch HTTP.
  - Al resolver o fallar, limpiar la clave en el bloque `finally`.

---

## ⚡ 2. Disciplina de `useEffect` y Anti-Re-renders (Zero Cascading Updates)
- **Prohibición Total de Cascadas de Efectos**: NUNCA encadenar `useEffect` donde el Efecto A actualiza el Estado 1, lo cual dispara el Efecto B que invoca un callback que actualiza el Estado 2.
- **Ref Fetch Guard**: En efectos que disparan pre-fetch o llamadas a APIs, utilizar SIEMPRE un `ref` de clave (`fetchedKeyRef = useRef("")`) para evitar ejecuciones duplicadas en StrictMode o por re-renders del padre.
- **Estabilización de Callbacks (`useCallback` + `useRef`)**:
  - Callbacks pasados como props (`onBackToWorkspace`, `handleSelectLevel`) DEBEN tener referencias estables con `useCallback`.
  - Si un callback necesita leer una prop cambiante (como `roleName`), desacoplarla leyendo a través de un `ref` (`roleNameRef.current`) para no invalidar el callback en cada render.
- **Memoización de Componentes**: Todas las vistas principales y tarjetas atómicas complejas DEBEN exportarse envueltas en `React.memo`.

---

## 🏛️ 3. Los Cuatro Pilares Obligatorios

### A. Accesibilidad (A11y)
- Anillos de foco visibles de alto contraste (`focus-visible:ring-1 focus-visible:ring-white/30`).
- Atributos semánticos y de estado para lectores de pantalla (`aria-live="polite"`, `role="status"`, etiquetas legibles en botones interactivos).
- Navegabilidad 100% por teclado sin trampas de foco.

### B. Performance
- Rotaciones instantáneas en 0 ms desde lotes en memoria / localStorage.
- Guardado de borradores con debounce (`saveDraft` a 500ms, nunca por pulsación de tecla).
- Bundles optimizados y code-splitting por tab.

### C. Seguridad
- Sanitización estricta con `SanitizerService` (`DOMPurify`) antes de renderizar texto de usuario o IA.
- SQL parametrizado (`$1`, `$2`) y aislamiento multi-usuario `WHERE user_id = $1`.
- Cifrado en reposo para credenciales locales y DNA (`ISecureVault` con AES-GCM 256-bit).

### D. Escalabilidad y Arquitectura Limpia
- Screaming Architecture (`features/`, `domain/`, `application/`, `infrastructure/`).
- Zero enums o taxonomías cerradas: generación dinámica en base al rol del usuario, asegurando invariancia multi-dominio (cero jerga de software para no desarrolladores).
