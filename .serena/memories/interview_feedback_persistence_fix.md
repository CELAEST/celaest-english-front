# Lección y Arquitectura: Persistencia de Feedback en Interview Session

## Contexto y Causa Raíz
Al cerrar el modal de análisis (`InterviewAnalysisModal`), el callback `closeAnalysisModal` en `useInterviewSession.ts` ejecutaba:
1. `evaluation.setTurnFeedback(null)` (destruía el estado de React en memoria).
2. `cloudSyncRef.current?.saveProgressNow({ latestTurn: {}, showAnalysisModal: false })` (sobreescribía la BD en PostgreSQL y localStorage con un objeto vacío).

Esto provocaba que:
- El botón "Ver Feedback" en el HUD desapareciera inmediatamente (`hasFeedback={!!turnFeedback}` pasaba a `false`).
- Al recargar la página, la BD no tuviese feedback para restaurar (`p.latestTurn?.feedback` era nulo o vacío).

## Solución Quirúrgica Aplicada
1. En `useInterviewSession.ts`, `closeAnalysisModal` ahora mantiene `evaluation.turnFeedback` intacto en memoria.
2. `cloudSyncRef.current?.saveProgressNow` persiste `showAnalysisModal: false` pero conserva `latestTurn` con:
   ```typescript
   latestTurn: {
     question: questions.currentQuestion?.question ?? "",
     transcript: speech.userTranscriptRef.current || speech.userTranscript || evaluation.turnFeedback?.userSpokenText || "",
     feedback: (evaluation.turnFeedback ?? {}) as unknown as Record<string, unknown>,
   }
   ```
3. La limpieza de feedback (`setTurnFeedback(null)` y `latestTurn: {}`) se reserva exclusivamente para cuando el usuario avanza de pregunta (`skipQuestion`) o cambia de nivel CEFR (`setActiveCefrLevel`).
4. Se agregó prueba unitaria en `useInterviewSession.test.ts` para blindar la persistencia y evitar regresiones.
