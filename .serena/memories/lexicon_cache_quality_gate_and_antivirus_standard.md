# LEXICON CACHE QUALITY GATE & ZERO-POISONING STANDARD (V3.0)

## 1. Context & Problem Solved
Previously, lookup operations for English words in the Reading engine suffered from major corruption vectors:
1. **MyMemory Translation Memory Poisoning**: MyMemory API (formerly Layer 4) scraped untrusted, public translation memory segments, polluting the database with out-of-context translations (e.g. `rollout` -> `"rodar en tierra"`, `consultations` -> `"consultas del artículo IV"`, `far` -> `"selecciona la anterioridad en la cual los clientes pueden reservar"`, `engineer` -> `"del proyecto"`, `forged` -> `"falsificado"`).
2. **Untranslated Fallbacks Cached as Translations**: `translateToSpanishWithSource` fell back to `return clean, "identity_fallback"` and persisted to PostgreSQL.
3. **Mutilated Lemmas**: Naive slicing truncated words like `structured` -> `structur`, `minimizing` -> `minimiz`.
4. **Subject-Verb Disagreement in Generated Examples**: Singular article `"A clear %s..."` was attached to plural nouns (`"A clear consultations..."`).
5. **Lack of Context Awareness**: Words were sent to translators isolated from the sentence where they appeared, causing extreme polysemic errors.

## 2. Mandatory Architectural Standards & Quality Gate Rules

### 1. Zero-Toleration for MyMemory API:
- MyMemory API is permanently BANISHED from the backend. No translation memory search engines are permitted in the lookup pipeline.

### 2. Multi-Tier Token-Frugal Translation Cascade:
- **Tier 0 (0ms, 0 tokens)**: RAM Cache & Verified PostgreSQL cache.
- **Tier 1 (0ms, 0 tokens)**: Canonical Oxford/Cambridge Offline Map (exact word, then decomposed compound).
- **Tier 1.5 (0ms, 0 tokens)**: Normalized Lemma in Offline Local Spanish Map.
- **Tier 2 (40ms, 0 tokens)**: Ultra-fast Google GTX API, guarded strictly by `isPlausibleSpanishTranslation`.
- **Tier 3 (100ms, 0 tokens)**: LibreTranslate API, guarded strictly by `isPlausibleSpanishTranslation`.
- **Tier 4 (250ms, max 15 tokens) LAST RESORT**: Context-aware Micro-LLM via `celaest-core` (`/api/v1/ai/chat/simple`), sending `word` + exact `contextSentence`. Result is permanently cached in PostgreSQL so it NEVER costs tokens again.

### 3. Anti-Noise & Ratio Quality Filter (`isPlausibleSpanishTranslation`):
- **Length Ratio Check**: If the original English word is 1 word (e.g. `far`, `agreement`), the Spanish translation CANNOT have more than 3 words. Rejects sentence-length leaks like `"selecciona la anterioridad en la cual..."`.
- **Broken Fragment Check**: Rejects translations starting with conjunctions/prepositions (`"y "`, `"del "`, `"de "`, `"en "`, `"para "`, `"con "`, `"por "`).
- **Noise Substring Filter**: Instant rejection of strings containing `"artículo iv"`, `"selecciona"`, `"anterioridad"`, `"reservar"`, `"derechos reservados"`, `"haga clic"`, `"rodar en tierra"`.

### 4. Dynamic Latin Cognates & Identicals Rule:
- Legitimate identical cognates include:
  - Whitelist: `hotel`, `radio`, `idea`, `motor`, `actor`, `doctor`, `chocolate`, `banana`, `animal`, `base`, `conclusion`, `opinion`, `regular`, `simple`, `total`, `version`, `crisis`, `vision`, `color`, `digital`, `modular`, `familiar`, `particular`, `linear`, `solar`, `secular`, `singular`, `crucial`, `legal`, `moral`, `normal`, `visible`, `flexible`, `inevitable`, `senior`, `junior`, `master`, `status`, `campus`, `virus`.
  - Morphological rule: Any English word ending in `-al` or `-ar` with length >= 5 is recognized as a valid identical cognate (e.g. `capital`, `natural`, `personal`, `general`, `original`, `final`, `formal`, `manual`, `visual`, `cultural`, `social`).

### 5. Grammatically Correct Dynamic Example Sentences:
- **Plural Noun Detection**: For nouns ending in `-s` (not `-ss`, `-us`, `-is`), `generateNaturalExampleSentence` uses:
  `"Clear %s are essential for long-term operational success."` (never singular `"A clear %s..."`).
- **Verbs**:
  - `-ing`: `"They are currently %s the strategic priorities of the department."`
  - `-ed`: `"The team %s the operational objectives earlier this quarter."`
  - Base: `"They often %s when working on demanding projects."`

### 6. Database Antivirus & Startup Purge (`PurgeDefectiveCacheEntries`):
- Automatically cleans contaminated rows upon startup:
  `DELETE FROM reading_vocabulary_cache WHERE spanish_translation LIKE '%selecciona%' OR spanish_translation LIKE '%artículo IV%' OR spanish_translation LIKE '%y mantenimiento%' OR spanish_translation = 'rodar en tierra' OR spanish_translation = 'del proyecto' OR spanish_translation = 'quiebra' OR (LENGTH(word) < 8 AND LENGTH(spanish_translation) > 35);`

### 7. Frontend Display Translation Shield:
- `ReadingWordModal.tsx` renders `getDisplayTranslation(wordData.spanishTranslation, wordData.word)`.
- If unpopulated or identical to English without being a recognized cognate, renders `"Traducción disponible en breve"`.
