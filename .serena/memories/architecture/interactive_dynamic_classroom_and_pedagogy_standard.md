# CELAEST Interactive Dynamic Classroom & Neurocognitive Pedagogy (A1-A2, PC First)

## 1. Automated Stage Synchronization (Robot -> UI)
- Sincronización automática de pasos controlada por la voz del mentor:
  - `PathwayLectureEngine.ts` ahora incluye `targetStep?: PathwayStepId` en cada `LectureSegment`.
  - Cuando el mentor dice en su guion: "Ahora es tu turno... Vamos a pasar al ensamblaje para que las toques en orden", se dispara `onStepTrigger("BUILD")`.
  - `PathwayProfessorStage.tsx` recibe `onStepChange={session.setStep}` desde `PathwayStudioView.tsx`, cambiando automáticamente la pantalla del estudiante de `RULE` a `BUILD` al compás exacto de la voz del mentor.
  - Al completar correctamente el ensamblaje de fichas (`isBuildCorrect === true`), el robot celebra en tiempo real, reproduce el audio y un timer suave de 2.2s transiciona automáticamente la pantalla a `SPEAK`.
  - En `SPEAK`, el estudiante escucha el modelo nativo y el micrófono queda listo para certificar la voz.

## 2. Saludo de Primer Contacto y Explicación del Feature
- Cuando el estudiante entra por primera vez, el mentor lo saluda cordialmente y le explica la mecánica de 3 pasos: Regla Visual (sin traducir literal), Ensamblaje Kinestésico (memoria motriz) y Certificación de Voz, además de invitarlo a hacer preguntas cuando lo desee.
- En clases posteriores, va directo al grano con la trampa del español y la regla de oro, respetando el tiempo del usuario.

## 3. Preguntas Activas y Sugerencias Contextuales
- El mentor pregunta activamente: "¿Tienes alguna duda o quieres preguntarme algo antes de armar las fichas? Toca 'Preguntar' en cualquier momento."
- `LessonQuestionAnnex.tsx` ahora recibe `suggestedQuestions?: string[] | undefined` contextuales por base (ej. trampos del español, claves de la regla o ejemplos en el trabajo), además de permitir cualquier pregunta libre que la IA responde y habla en tiempo real.

## 4. Calidad y Certificación
- `npx vitest run src/features/pathway/` -> 10 tests pasados.
- `npm run audit:hardcode` -> 100% clean.
- `npx tsc --noEmit` -> 0 errores (cumpliendo `exactOptionalPropertyTypes: true`).
- `npm run build` -> Compilación exitosa en 20.5s.
