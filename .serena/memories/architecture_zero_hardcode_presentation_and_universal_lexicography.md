# ARCHITECTURAL STANDARD: ZERO-HARDCODE PRESENTATION & UNIVERSAL LEXICOGRAPHY

## 1. Non-Negotiable Separation of Concerns (Frontend vs Backend)
- **Frontend es PURAMENTE PRESENTACIONAL**:
  - Queda terminantemente PROHIBIDO que el frontend contenga lógica de validación lexicográfica, sets o whitelists de cognados (`legitimateCognates = new Set([...])`).
  - Si el frontend realiza juicios léxicos mediante listas cerradas, provoca "Split-Brain": el backend aprueba una traducción válida (como `sonar`, `modular`, o nombres propios como `Whitfield`), pero el frontend la descarta y la sobreescribe con advertencias erróneas (`"Traducción disponible en breve"`).
  - El frontend confía ciegamente en el contrato del backend: si `wordData.spanishTranslation` viene poblado, se renderiza directamente. Solo si es verdaderamente una cadena vacía (`""`), muestra el estado de traducción pendiente.

## 2. Erradicación Absoluta de Listas Quemadas en el Ecosistema
- **Principio del Espacio Infinito (Supremo)**:
  - Nombres propios, topónimos, cognados y préstamos técnicos son infinitos en el lenguaje natural.
  - Ningún archivo `.tsx`, `.go` ni consulta SQL debe contener cláusulas de tipo `NOT IN ('hotel', 'radio', 'idea', ...)` o mapas cerrados `legitimateIdenticals := map[string]bool{...}`.
  - El motor debe operar mediante **reglas fonotácticas universales y desambiguación sintáctica**:
    1. **Nombres Propios (`proper noun`)**: Preservan traducción de identidad por definición (`Whitfield`, `Linton`, `Patel`, `Aisha`). Nunca se purgan ni se invalidan.
    2. **Cognados y Préstamos Universales**: Identificados por sufijos romances/latinos (`-al`, `-ar`, `-or`, `-ible`, `-able`, `-on`, `-is`, `-um`, `-us`, `-ic`, `-ist`, `-em`, `-et`, `-ex`, `-ix`, `-id`, `-ia`, `-io`, `-ware`, `-net`) y términos técnicos internacionales (`sonar`, `radar`, `laser`, `pixel`, etc.).
    3. **Peligro de Falsos Cognados**: Solo se descarta si una palabra común germánica/inglesa (ej. `house`, `gain`, `run`) devuelve la misma palabra sin traducir y no coincide con ninguna regla fonotáctica ni es nombre propio.

## 3. Desambiguación Gramatical Contextual (Datamuse POS Selection)
- Para términos polisémicos (ej. `revert` que puede ser sustantivo arcaico o verbo):
  - `fetchDatamuseLexical` inspecciona la oración de contexto (`req.Context`).
  - Si detecta patrones verbales (`they revert`, `to revert`, `we revert`, `will revert`, modales), selecciona automáticamente la definición verbal de Datamuse (`"v\tTo return to a former state or reverse"`) en lugar de tomar ciegamente el índice 0 que contiene la acepción obsoleta de sustantivo (`"One who, or that which, reverts."`).
  - Se descartan definiciones circulares no pedagógicas (`"One who, or that which..."`) cuando existen acepciones descriptivas más ricas.

## 4. Calidad Blackbox y Verificación E2E con Playwright
- Toda certificación de lectura debe realizarse contra el DOM interactivo del navegador real usando Playwright sobre historias inesperadas generadas por el IA-Mesh.
- Cero tolerancia a `mockResolvedValue` en pruebas de integración.
