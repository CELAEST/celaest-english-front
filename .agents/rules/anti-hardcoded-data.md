# NON-NEGOTIABLE ARCHITECTURAL RULE: ZERO HARDCODED DATA & UNIVERSAL PEDAGOGY

> **Status**: MANDATORY & PERMANENT  
> **Applies to**: All AI Agents, Engineers, and Automated Pipelines working on CELAEST Lingua (Frontend & Backend).

---

## 1. Absolute Prohibition of Hardcoded Content Banks & Closed Whitelists

1. **No Static Question Pools**:
   - NEVER create monolithic arrays of pre-written questions (`TECH_POOL`, `PM_POOL`, `HEALTHCARE_POOL`, etc.).
   - All interview questions must be generated procedurally from parameterized pedagogical templates or via real-time LLM generation (`AiInterviewQuestionGenerator`).

2. **No Static Writing Task Banks**:
   - NEVER embed static arrays of writing prompts (`WRITING_TASKS_POOL`, etc.).
   - Writing tasks must be generated via `AiWritingTaskGenerator` with dynamic procedural seeds and local caching by `role::level`.

3. **No Closed-Lexicon Whitelists for Linguistic Shields**:
   - NEVER build "allowed English word" sets (e.g. `COMMON_ENGLISH_LEXICON` containing 600 or 2,000 words).
   - English language validity must be evaluated using:
     - **Closed-Class Functional Grammar** (~80 structural words: pronouns, prepositions, auxiliaries, conjunctions).
     - **Universal Phonotactics** (presence of vowels, absence of $\ge 5$ consecutive consonant bursts).
     - **Spatial Entropy** (repetition, QWERTY row mashes, character variance).
     - **Spanish Screening** (diacritics like `ñ`, `á`, `é`, and common Spanish grammatical markers).

4. **No Role-Biased Fallbacks or Model Answers**:
   - NEVER hardcode default roles like `"Product Manager"` or `"Software & Technology"`.
   - Fallbacks must remain neutral: `"Professional"`, `"Learner"`, or dynamically inferred from calibrated profiles.
   - Model answers must be synthesized dynamically from the prompt's `starHint` and professional domain, never hardcoded tech debt speeches.

---

## 2. Mandatory Verification Gate

Before committing any feature or submitting code diffs:
1. Grep for any new static dictionaries or arrays exceeding 10 items containing domain-specific text.
2. Verify that users with non-tech professions (e.g., *Odontóloga*, *Abogado*, *Chef*, *Veterinario*) receive 100% domain-relevant content.
3. Run test suites:
   - `npm test` (0 failures)
   - `npx tsc --noEmit` (0 errors)
   - `go test ./...` (0 failures in backend)
