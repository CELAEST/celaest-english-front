# Solución a Fuga de Requests, Modal Fantasma NaN y Preguntas Quemadas

## 1. Fuga de Requests (Completions + Progress Loop)
- **Causa Raíz:** En `useInterviewQuestionManager`, el hook corría un efecto de reposición en segundo plano cuando `remaining <= 2`. Al estar en la pregunta 4 de 5, `remaining = 2`, lo que disparaba la generación de IA (`completions`), luego `saveProgressNow` (`progress`), el backend respondía la fila canónica, el hook de sync actualizaba `sessionQuestions` y volvía a disparar el efecto porque `remaining <= 2` seguía siendo verdadero (un bucle infinito).
- **Solución:**
  1. Se eliminó la reposición continua por adelantado. Las rondas son de 5 preguntas fijas.
  2. Solo se pide un nuevo lote cuando la ronda se completa al 100% (`remaining <= 0`) o la sesión no tiene preguntas.
  3. El guardado en la base de datos no re-dispara la generación.

## 2. Modal Fantasma con NaN al Recargar
- **Causa Raíz:** La fila en la BD tenía `show_analysis_modal: true` con `latest_turn: { feedback: {} }`. Al recargar, React levantaba el modal con un objeto sin puntajes numéricos, mostrando `NaN / 100`, `NaN%` y transcripción `""`. Además, cerrar el modal no actualizaba inmediatamente la BD.
- **Solución:**
  1. Guardia estricta: `showAnalysisModal` y el componente `InterviewAnalysisModal` solo pueden renderizarse si `typeof feedback.overallScore === 'number' && feedback.overallScore > 0`. Si el feedback está vacío, el modal jamás se abre.
  2. Al cerrar el modal o avanzar de pregunta, se limpia `turnFeedback: null` y se guarda de inmediato `showAnalysisModal: false` en Supabase con `closeAnalysisModal`.

## 3. Cero Preguntas Quemadas y Eliminación de Salto Visual
- Se eliminaron las 150 líneas del banco estático `fallbackProceduralQuestions` en `celaest-english-back`. Cuando la IA falla o se agotan las cuotas, el backend responde 503 `AI_KEYS_EXHAUSTED` para que el frontend abra su modal de recuperación limpio.
- Se eliminó el texto estático `"Tell me about your recent project and your role in it."` del visor.
- El endpoint `/health` ahora incluye ping real a PostgreSQL (`database: connected` / `unreachable`).
