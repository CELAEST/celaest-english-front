# CELAEST Mandate: Calibración Pedagógica Nivel A1 (Beginner Leniency & Zero Frustration)

> **MANDATO DE PEDAGOGÍA UNIVERSAL**:
> El nivel A1 (Breakthrough / Acceso) representa a estudiantes sin fluidez previa. Prohibido formular preguntas de entrevista conductuales o tareas de escritura de nivel A2/B1 a un usuario A1.

---

## 🏛️ 1. Principio de Calibración A1 vs A2
- **Nivel A1**:
  - **Entrevista / Conversación**:
    - Preguntas ultra-cortas (máximo 8-12 palabras) usando estrictamente **Present Simple** con *to be*, *do/does*, *like*, *work*, *use*, *have*.
    - Prohibido hacer preguntas en pasado simple, presente perfecto o con escenarios hipotéticos.
    - Respuestas esperadas: 1-2 oraciones simples (3 a 10 palabras, ej. 'I am a doctor', 'I work here', 'Yes, I do').
    - Guardián Lingüístico (`speechIntelligibilityGuard`): Acepta respuestas estructuradas desde **3 palabras** (`minRequiredWords: 3`, `minDistinctWords: 2`) con verbos básicos ('am', 'is', 'are', 'work', 'live', 'use', 'like') sin bloquear con `INSUFFICIENT_WORDS`.
    - Evaluador de IA (`CoreAiEvaluatorService`): Regla 10 flexibilizada para A1. Respuestas de 3-10 palabras en inglés elemental reciben puntajes alentadores (80-95%) y feedback motivador, sin exigir metodología STAR. La modal de análisis NUNCA se suprime para respuestas de 3-5 palabras en A1.
  - **Writing**:
    - Tareas breves de mensaje o correo elemental (8 a 25 palabras, 5 minutos de tiempo límite).
    - Temas accesibles: presentación personal (nombre, rol, lugar de trabajo), herramienta cotidiana de trabajo o saludo al equipo.
    - Starter phrases en Present Simple: "Hello! My name is...", "I am a [role] and I work at...", "Every day, I use...".
    - BYOK y Evaluador de backend (`ai_evaluator.go`): Orientados a premiar la gramática básica correcta con 90-98%, sin penalizar la brevedad ni exigir vocabulario complejo.
- **Nivel A2**:
  - Asume la línea base previa (rutinas de trabajo, confirmaciones y actualizaciones breves de 20-45 palabras, presente y pasado simple directo).

---

## 🧪 2. Calidad y Certificación
- Tests en frontend: `dynamicQuestionService.test.ts`, `speechIntelligibilityGuard.test.ts`, `dynamicWritingTaskService.test.ts`, `WritingPracticeView.test.tsx` (100% pasando).
- Backend: `ai_evaluator.go` con prompt especializado y tests en `internal/writing/...` 100% aprobados.
- Commits sincronizados en `main`: Backend `16d4db3`, Frontend `98a2c83`.
