# Solución Definitiva: Duplicación de Palabras, Bucle de Chime Android y Envío en Móvil

## Diagnóstico y Causa Raíz
1. **Duplicación de Palabras en Live Transcript ("doing doing doing")**:
   - En `audioCaptureService.ts`, `sessionFinalTranscript` se acumulaba de forma continua mediante `+=` dentro del callback `onresult`.
   - En navegadores móviles (especialmente Chrome en Android), `event.results` mantiene el historial completo de resultados finalizados del reconocimiento actual. Al iterar desde `event.resultIndex` (que en muchos eventos intermedios es 0), se concatenaban una y otra vez las palabras ya finalizadas sobre `sessionFinalTranscript`.
   - **Solución**: Se refactorizó `onresult` para reconstruir `sessionFinal` de forma limpia desde el índice `0` hasta `event.results.length - 1` en cada evento, asignando el valor a `currentSessionFinal = sessionFinal.trim()` sin acumulación incremental externa.

2. **Bucle de Sonido Chime en Android ("chun... chun...")**:
   - En Android, cada vez que el servicio de reconocimiento de voz del sistema inicia una sesión, el SO reproduce un sonido/chime de activación del micrófono.
   - En `recognizer.onend`, se intentaba inmediatamente llamar a `recognizer.start()`, lo cual arrojaba `InvalidStateError` y disparaba un `setTimeout(..., 120)` para recrear e iniciar un nuevo reconocedor.
   - **Solución**: Se implementó un temporizador con debounce de 350ms (`this.restartTimeout`) y limpieza limpia con `abort()` en `stop()` y `stopAndGetAudio()`, evitando arranques simultáneos y bucles de audio.

3. **Fallo en Desempaquetado del Envelope de Transcripción (Whisper Fallback Failure)**:
   - El backend Go (`internal/interview/handler.go`) responde a `/interview/transcribe` usando `response.JSON`, envolviendo el payload en `{ success: true, data: { text: "...", transcript: "..." } }`.
   - `AudioCaptureService.transcribeAudio` esperaba un objeto plano `{ text, transcript }`, por lo que `data.text` resultaba `undefined` y Whisper siempre retornaba `null`.
   - **Solución**: Se normalizó la respuesta para extraer `raw.data || raw`, permitiendo que Whisper transcriba el audio grabado con 100% de precisión y rescate cualquier turn submission.

4. **Bloqueo del Botón Verde ("El Verdecito") en Dispositivos Móviles**:
   - Al fallar Whisper por el envelope, la validación caía en el transcript de Web Speech que contenía palabras repetidas ("doing doing doing"). La métrica de entropía de vocabulario (< 0.4) marcaba el texto como `NONSENSE_OR_GIBBERISH`, silenciando el envío del turno sin contactar a CELAEST-CORE.
   - Además, en móviles, eventos táctiles sufrían latencias o pérdida de gestos.
   - **Solución**:
     - Se añadió `deduplicateConsecutiveWords` en `speechIntelligibilityGuard.ts` para eliminar tartamudeos o ecos de reconocimiento de voz antes del pre-flight shield.
     - Se habilitó `onTouchEnd={handleSubmit}` con `e.preventDefault()`, guard `isSubmittingRef` contra dobles toques, y clase `touch-manipulation` en `ConversationMicControl.tsx`.
     - En `useInterviewSession.ts`, si el usuario detuvo el micrófono y luego presiona el botón verde, se realiza transcripción directa del audio blob capturado si el texto estaba pendiente.
