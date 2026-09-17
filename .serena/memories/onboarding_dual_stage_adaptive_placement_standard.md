# Onboarding Dual-Stage Adaptive Placement & Clean Borderless Architecture

### 1. Zero-Borders & Floating Specs Architecture (OnboardingProfileCard & ReadyStep)
- Completely eradicated nested cards ("cards sobre cards") and colored border containers (`border-[#8B5CF6]`, `border-white/[0.04]` on inner boxes).
- Replaced nested boxes with a floating specifications grid using pure typography:
  - Micro-monospace uppercase labels (`text-[9.5px] font-mono uppercase tracking-wider text-white/40`)
  - Crisp high-contrast values (`text-xs sm:text-[13px] font-light text-white/90`)
  - Subdued hair-line divider (`border-y border-white/[0.06]`)
- Screen height remains strictly locked under 390px, completely satisfying the Zero Global Scroll layout standard.

### 2. Rapid Multiple-Choice Placement Quiz (OnboardingPlacementQuizStep & Service)
- Inserted a 4-question universal placement quiz between `dna-analysis` and `first-conversation`:
  - Q1 (A1): Present simple subject-verb agreement and workplace routine.
  - Q2 (A2): Simple past narrative in workplace problem identification.
  - Q3 (B1): First conditional and professional coordination.
  - Q4 (B2): Complex concession prepositions (`despite` vs `although`).
- Takes ~30-40 seconds, eliminating text-typing friction for beginners and establishing an immediate receptive CEFR benchmark.

### 3. Level-Attuned Conversational Scaffolding (Adaptive Chat)
- The conversational diagnostic (`onboardingQuestionsCatalog.ts`) dynamically adapts to the user's placement score:
  - A1/A2 (Beginner/Elementary): Friendly, warm, accessible questions with simple sentence structure to prevent cognitive overload or embarrassment.
  - B1 (Intermediate): Operational problem solving and collaboration questions.
  - B2/C1 (Advanced): Strategic vision, complex conflict resolution, and industry evolution questions.

### 4. Dual-Signal Holistic AI Dossier (OnboardingDiagnosticEvaluator)
- Combines receptive quiz accuracy (35%) and productive conversational metrics (65% TTR, connectors, sentence complexity).
- Compiles a complete diagnostic dossier for the AI mentor:
  - The AI does not compute arithmetic metrics or parse scoring rubrics.
  - Generates warm, 2-sentence empathetic feedback in <500ms using ~150 tokens.
