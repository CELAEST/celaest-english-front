# Lección y Arquitectura: Posición de Cards de Errores en Modal de Análisis

## Decisión de Diseño
Las cards del carrusel de errores (`InterviewAnalysisErrorCarousel` - "Análisis de mejora") se posicionaron al final (de último) en el modal de análisis (`InterviewAnalysisModal.tsx`).

## Orden Definitivo de Componentes:
1. `InterviewAnalysisScorecard` (Puntaje global y desglose de métricas)
2. `InterviewAnalysisStrategyGrid` (Key Insights & Strategy Recommendation)
3. `InterviewAnalysisTranscriptCard` & `InterviewAnalysisImprovedAnswerCard` (Transcripción de audio y respuesta modelo en audio/texto)
4. `InterviewAnalysisErrorCarousel` (Carrusel de errores gramaticales/vocabulario con opción de guardar en memoria)
