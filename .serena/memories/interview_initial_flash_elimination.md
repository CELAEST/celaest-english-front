# Lección Arquitectónica: Eliminación de Re-render y Flash Inicial de Preguntas en Interview

## Problema Resuelto:
Al entrar a Interview (`/interview` o pestaña Interview del dashboard), se producía un flash visible y un inicio prematuro de audio TTS de una pregunta o frase inicial ('Preparing your next speaking challenge...' o una pregunta previa desactualizada) antes de ser sustituida bruscamente por la pregunta activa real de la nube/sesión ('la que es').

## Causas Raíz Identificadas:
1. **Omitir el nivel CEFR en `loadPersistedInterview`:** `useInterviewSession` leía `loadPersistedInterview(currentUserId)` sin pasar el nivel activo (`initialLevel`), cargando una clave global obsoleta o de otro nivel en vez de la clave atómica por nivel (`celaest:user:<uid>:level:<LVL>:interview-progress:v2`).
2. **Auto-speak desfasado sin gate de hidratación:** El efecto de síntesis de voz (`SpeechSynthesisService.speak`) se disparaba inmediatamente en `mount`, hablando la pregunta inicial antes de que `useInterviewCloudSync` confirmara el snapshot autoritativo de la BD.
3. **Re-render redundante en `applyProgress`:** Al llegar la respuesta de la nube, `applyProgress` llamaba a `setSessionQuestions` y `setCurrentQuestionIndex` sin comparar igualdad con el estado previo, recreando referencias y forzando un re-render con animación (`animate-[fadeSlideUp]`). Además, no persistía dicho snapshot en `localStorage`.
4. **Falta de skeleton en frío:** Cuando no había preguntas en memoria local, el hook inyectaba un objeto dummy con el texto 'Preparing your next speaking challenge for <Role>...', que se renderizaba como un `<h2>` antes de la llegada de la IA.

## Solución Quirúrgica Aplicada:
1. `useInterviewSession.ts`:
   - Normalización de nivel (`normInitialLevel = normalizeCefrLevel(initialLevel)`).
   - `loadPersistedInterview(currentUserId, normInitialLevel)` carga de forma síncrona el estado exacto del nivel.
   - Auto-speak condicionado estrictamente a `hasCloudHydrated`, evitando doble reproducción o audio prematuro.
   - Retorno de `hasCloudHydrated`, `sessionQuestions` e `isGeneratingQuestions`.
2. `useInterviewCloudSync.ts`:
   - Verificación de igualdad antes de actualizar `sessionQuestions`, `currentQuestionIndex`, `askedQuestions`, `speechRate`, etc., retornando `prev` para que React descarte el re-render.
   - Persistencia síncrona del snapshot autoritativo en `localStorage` con `savePersistedInterview`.
3. `InterviewPracticeView.tsx`:
   - Si `sessionQuestions.length === 0` o durante hidratación en frío sin preguntas listas, renderiza `<InterviewSkeleton />`.
   - Limpieza de `currentQuestionText` (sin inyectar texto placeholder en la pregunta).
4. `ConversationPromptArea.tsx`:
   - Protección con líneas de skeleton pulsante en vez de texto plano si la pregunta llegase a contener prefijos 'Preparing'/'Generating'.
