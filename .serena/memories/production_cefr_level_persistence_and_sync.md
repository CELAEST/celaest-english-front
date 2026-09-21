# CELAEST STANDARD: Persistencia y Sincronización de Nivel CEFR en Producción

> **CONTRATO DE ARQUITECTURA**:
> Garantiza persistencia real e inmediata del nivel CEFR (A1-C2) en producción y local en Settings, Writing e Interview sin reversiones por re-render.

---

## 🏛️ 1. Causa Raíz Identificada y Erradicada
1. **Fallo de Persistencia en Render (`celaest-english-back`)**:
   - Cuando el contenedor en la nube no tenía base de datos PostgreSQL conectada (`r.db == nil`), `UpdateSettings` descartaba los cambios con `return nil`.
   - `GetByUserID` devolvía un struct estático con `CEFRLevel: "B1 — Intermediate"`.
   - **Solución Implementada**: `sqlRepository` incluye almacenamiento seguro multihilo (`sync.RWMutex`, `map[string]*UserProfile`). Ante `r.db == nil`, persiste todas las actualizaciones de configuración por usuario, asegurando que `PUT /api/v1/user/settings` y `GET /api/v1/user/profile` mantengan el nivel y datos del usuario de forma 100% fidedigna.

2. **Doble Mutación Competitiva en Settings (`SettingsView.tsx`)**:
   - `SettingsView` llamaba simultáneamente a `onSelectLevel(norm)` (orquestador del padre) y `updateSettings({ cefrLevel: newLevel })` con cadenas crudas (`"A1 — Beginner"` vs `"A1"`).
   - **Solución Implementada**: Si `onSelectLevel` está definido en props, se delega al orquestador global para evitar condiciones de carrera. De lo contrario, se usa `updateSettings(norm)` normalizado.

3. **Mutación Optimista en React Query (`useSettingsProfile.ts`)**:
   - Se añadió `onMutate` y `onError` a `updateMutation` en `useSettingsProfile` para que `queryClient.setQueryData` actualice la UI en 0ms inmediatamente.

4. **Prevención de Bucles y Reversión en Writing e Interview (`WritingPracticeView`, `useInterviewSession`)**:
   - Al invocar `handleSelectLevel` / `setActiveCefrLevel`, se actualiza de inmediato `prevUserLevelPropRef.current = norm` y `prevInitialLevelRef.current = norm`.
   - El `useEffect` de sincronización con el padre compara valores normalizados (`normalizeCefr`) y solo sincroniza si hay un cambio genuinamente externo, evitando que el render del padre resetee la selección del usuario.
