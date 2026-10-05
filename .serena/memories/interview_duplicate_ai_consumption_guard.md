# Lección y Arquitectura: Blindaje Anti-Consumo Duplicado de IA en Entrevistas

## Diagnóstico y Causa Raíz
1. Al cerrar el modal de análisis, el texto de la respuesta previa (`userTranscript`) se mantenía en la caja de texto en lugar de limpiarse. Esto dejaba el botón verde de "OK / Checkmark" activo e invitaba a reenviar la respuesta ya evaluada.
2. Si el usuario hacía clic en el botón de envío o presionaba Enter sobre esa misma respuesta ya evaluada, `submitCurrentTurn` no realizaba verificación de idempotencia y ejecutaba una nueva llamada a `/chat/completions` en la IA (Groq/OpenAI), gastando tokens innecesariamente en re-analizar la misma pregunta y respuesta.

## Solución Aplicada
1. **Blindaje de Idempotencia en `submitCurrentTurn` ([useInterviewTurnEvaluation.ts](file:///c:/Users/user/Music/celaest-english-front/src/features/conversation/hooks/useInterviewTurnEvaluation.ts#L238-L251))**:
   - Se compara la respuesta enviada (`validation.cleanTranscript`) contra `turnFeedback.userSpokenText` o `turnFeedback.reconciledTranscript`.
   - Si la respuesta es idéntica a la que ya fue evaluada:
     - Se suprime inmediatamente la llamada a la IA.
     - Se abre directamente el modal existente con `setShowAnalysisModal(true)`.
     - Cero consumo de tokens en el endpoint `/chat/completions`.

2. **Limpieza del Área de Prompt al Cerrar Modal ([useInterviewSession.ts](file:///c:/Users/user/Music/celaest-english-front/src/features/conversation/hooks/useInterviewSession.ts#L309-L322))**:
   - En `closeAnalysisModal`, se limpia `speech.setUserTranscript("")` y se persiste `userTranscript: ""` en la BD/localStorage.
   - El feedback (`turnFeedback`) y `latestTurn` se conservan 100% intactos para que el botón "Ver Feedback" siga disponible.
   - El área de texto queda limpia y lista para que el usuario hable de nuevo o avance a la siguiente pregunta sin botones de envío falsamente activos.

3. **Garantía por Pruebas Unitarias ([useInterviewSession.test.ts](file:///c:/Users/user/Music/celaest-english-front/src/features/conversation/hooks/useInterviewSession.test.ts))**:
   - Prueba añadida que verifica que al enviar la misma respuesta dos veces, `CoreAiEvaluatorService.evaluate` se ejecuta exactamente 1 sola vez.
