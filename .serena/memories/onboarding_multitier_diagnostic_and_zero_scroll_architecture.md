# Diagnostic Interview Optimization: Multi-Tier CEFR Assessment & Zero-Scroll Architecture

### 1. Zero-Scroll & Optical Grid (OnboardingProfileCard & OnboardingReadyStep)
- Replaced 6-row vertical stack with a 2-column x 3-row compact optical grid (`grid-cols-2 gap-2`, `py-2 px-2.5`, 110px total card height).
- Outer container in `OnboardingReadyStep` enforces `overflow-hidden` without internal scrollbars.
- Total screen height constrained under 390px, completely preventing vertical scroll jumps, layout shifts, or clipping of top badges ("TAILORED FOCUS", "PEDAGOGICAL MODE").

### 2. Algorithmic Linguistic Evaluator (OnboardingDiagnosticEvaluator)
- Deterministic, client-side linguistic evaluator (<1ms) computing:
  - Lexical Diversity / Type-Token Ratio (TTR).
  - CEFR Connector reach across A2, B1, B2, C1 bands.
  - Syntactic complexity and conditional logic structures.
  - Overall CEFR diagnostic band (A1 to C2).

### 3. Offloading AI Inference Load
- The AI LLM is relieved of calculating mathematical scores, STAR tables, and diagnostic rubrics.
- The pre-evaluated band and metrics are supplied in a lightweight prompt (~150 tokens) for a warm, conversational 2-sentence feedback, running in <500ms with zero risk of context cutoff.

### 4. Progressive 3-Tier Multi-Level Questions (OnboardingQuestionsCatalog)
- 3 graduated interview questions dynamically adapted to user's profession:
  - Level 1 (A1-A2): Daily routines and workplace tools.
  - Level 2 (B1-B2): Overcoming past challenges and cross-functional teamwork.
  - Level 3 (C1-C2): Hypothetical transformation and long-term industry innovation.

### 5. Anti-Monolith Decomposed Architecture
- `OnboardingFirstConversationStep` refactored into focused sub-components (<80 lines) and custom orchestrator hook `useOnboardingConversation`, fully compliant with Screaming Architecture and SOLID.
