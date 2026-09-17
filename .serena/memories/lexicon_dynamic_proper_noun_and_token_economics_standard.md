# LEXICON DYNAMIC PROPER NOUN & TOKEN ECONOMICS STANDARD

## 1. Context & Architecture (Anti-Hardcode Mandate)
- **Principio de Cero Nombres/Lugares Quemados**: Queda estrictamente prohibido crear listas, enums o whitelists de nombres propios, apellidos o topónimos (`whitfield`, `linton`, `aisha`, etc.). La categorización debe ser 100% dinámica inferida de APIs lingüísticas (Datamuse defs/tags) y contexto sintáctico.
- **Detección Dinámica (`detectProperNounFromDatamuse`)**:
  - Inspecciona `item.Tags` buscando `"prop"`.
  - Escanea `item.Defs` buscando señales universales: `"placename"`, `"a city"`, `"a town"`, `"a village"`, `"a continent"`, `"given name"`, `"female name"`, `"male name"`, `"surname"`, `"habitational surname"`.
  - Verifica si en la oración original el token inicia con mayúscula no-oracional (`IsCapitalizedInContext`).
- **Definiciones Descriptivas Limpias**:
  - Nombres geográficos/topónimos: `"Proper noun referring to a placename or geographic location."` (elimina truncamientos con dos puntos `"A placename:"`).
  - Nombres de pila: `"Proper noun referring to a person's given name."`
  - Apellidos: `"Proper noun referring to a family name or surname."`
- **Traducción de Identidad y Preservación de Mayúsculas**:
  - `translationSource`: `"proper_noun_identity"` con preservación de capitalización (`Whitfield`, `Linton`, `Patel`).
  - `cleanSpanishTranslation`: Si `pos == "proper noun"`, preserva mayúscula inicial (`cases.Title`).
  - `isValidTranslation`: Acepta coincidencia idéntica case-insensitive exclusivamente si `pos == "proper noun"`.
- **Prioridad de Oración Contextual Real**:
  - `fallbackResult.ExampleSentence`: Utiliza la oración de la lectura donde apareció la palabra en lugar de generar plantillas sintéticas genéricas de sustantivo común (`"A clear %s is essential..."`).

## 2. Token Economics & Zero-Leak Multi-Tier Cache
- **Jerarquía de Resolución**:
  - Capa 0: Story Pre-caching (`batchPrefetchStoryLexicon` al abrir la lectura).
  - Capa 1: RAM In-Memory Cache (`sync.Map`, 0ms, 0 tokens).
  - Capa 2: Seed Curation Dictionary (10,560 palabras en PostgreSQL y memoria).
  - Capa 3: Google GTX / Datamuse lexical API (0 tokens LLM).
  - Capa 4 (Último Recurso): `translateViaCoreLLMContextual` hacia `celaest-core`.
- **Presupuesto y Capping de Tokens en `core_llm_contextual`**:
  - System Prompt: 33 tokens.
  - User Message: ~40-50 tokens.
  - `MaxTokens: 60` (limite estricto que previene alucinaciones o truncamientos).
  - Total tokens por llamada LLM: ~80-90 tokens.
  - Costo financiero en Groq ($0.05/1M in, $0.08/1M out): **$0.0000043 USD** (< medio centavo por 1,000 palabras).
  - Cloudflare Workers AI: **$0.00 USD** (10,000 requests diarios gratuitos).
- **Garantía Anti-Fugas (Zero-Leak)**:
  - Cualquier resultado obtenido vía LLM se persiste de inmediato en PostgreSQL (`reading_vocabulary_cache`) y en RAM (`sync.Map`).
  - Segundas consultas de la misma palabra en cualquier lectura resuelven en 0ms y consumen exactamente 0 tokens.
  - Salvaguarda en `celaest-core/pkg/ai/orchestrator.go`: Nunca almacenar en caché de Redis o memoria respuestas con `Content == ""` ni errores.
