# Architecture Contract: CEFR A1/A2 Ultra-Elementary Pedagogical Calibration & Zero Domain Leakage

## 1. Problem
In CEFR A1 (and A2), with role "Professional", the AI generated clinical/medical questions like:
`"Do you wear gloves when you examine patients?"`
This was completely inappropriate for two reasons:
1. Lexical and CEFR mismatch: Words like "examine", "gloves", "patients" are far beyond A1/A2 foundational English.
2. Domain leakage: The prompt previously included hardcoded medical/hygiene examples which biased the LLM into asking healthcare questions even when the candidate's profession was a generic "Professional".

## 2. Root Cause
1. `aiInterviewQuestionGenerator.ts` had a domain rule explicitly mentioning "patients, clinical procedures, diagnosis, dental/medical emergencies, anesthesia, patient anxiety, hygiene, and treatment plans".
2. `getLevelPromptDirectives` had directives mentioning "simple patient/client interactions" and "patient or client concerns".
3. In `celaest-english-back/internal/interview/service.go`, similar medical examples were present in the directives.

## 3. Surgical Fix
1. **Clean Domain Alignment**: If the role is generic ("Professional"), questions focus strictly on universal workplace topics: daily schedule, teamwork, office/remote environment, communication, tools. Never assume clinical/medical or specialized settings unless explicitly designated.
2. **Multi-Domain Invariance**: Strict mandate to never leak medical or technical jargon into unrelated professions.
3. **MANDATORY A1/A2 Pedagogical Ceiling**:
   - **A1**: Ultra-short (6-9 words), Present Simple only (`Do you...?`, `What time do you...?`, `Where do you...?`). Everyday foundational vocabulary (`work`, `start`, `time`, `office`, `computer`, `team`, `like`, `day`, `help`, `speak`). Forbidden: specialized jargon, rare verbs (`examine`), medical terms (`gloves`, `patients`).
   - **A2**: Short and direct (8-12 words). Simple present and simple past only (`What tasks do you do in the morning?`, `Did you work yesterday?`). Everyday workplace routine and tools.
4. **Preserved Architecture**: Zero regressions to the state management, round transitions, or cloud sync pipelines.

## 4. Verification
- `celaest-english-back`: All unit and DB tests passed 100%. Fresh binary built. Commit `7768ba4`.
- `celaest-english-front`: TypeScript check 0 errors (`npx tsc --noEmit`). 17 Vitest test suites (154 tests) passed 100%. Commit `9a460ce`.
