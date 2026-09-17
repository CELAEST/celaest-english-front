# Human-First Error Alerts Standard (Antibobos / Zero Technical Jargon)

## 1. Non-Negotiable UX Principle: No Tech Jargon
- Never display raw status codes (HTTP 402, 429, 504), architectural acronyms (BYOK, Endpoints, JSON parse error, Cluster, Tokens), or engineering labels to the end learner.
- All error dialogs, recovery modals, and warning banners must speak in clear, warm, direct Spanish that ANY person immediately understands.

## 2. Three Pillars of Every Human Error Alert:
1. **Qué pasó (en 1 frase sencilla)**: "Tu cuenta de DeepSeek no tiene saldo disponible ($0.00)" o "Un momento: la Inteligencia Artificial necesita unos segundos".
2. **Tranquilidad de datos**: "Tu respuesta está 100% guardada. No tienes que volver a hablar ni a escribir."
3. **Solución inmediata en 1 clic**: Botón blanco directo "Usar Groq Gratis" o "Cambiar a Groq Gratis" que no requiere tarjeta ni pagos y reanuda la práctica al instante.

## 3. Implementation Locations:
- `src/shared/constants/errorScenarios.ts`: All `ERROR_DATA` definitions rewritten in everyday Spanish.
- `src/features/settings/services/directClientAiService.ts`: `parseProviderError` emits friendly names and plain messages.
- `src/features/onboarding/components/OnboardingQuestionsStep.tsx`: Inline banner with 1-click Groq switch and immediate retry.