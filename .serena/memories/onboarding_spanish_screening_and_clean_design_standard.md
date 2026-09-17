# Onboarding Diagnostic: Spanish Screening & Clean Design Standard

### 1. Eradication of Pill Badges in Conversation Header
- The pill badge container (`bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2.5 py-1 rounded-full`) in `OnboardingConversationHeader.tsx` was completely removed.
- Replaced with pure CELAEST floating typography (`text-[10px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#A78BFA]`), strictly complying with the zero-pill, zero-box visual mandate.

### 2. Button Collision Resolution in ReadyStep
- Constrained button container to `max-w-md` and button width to `inline-flex px-8 sm:px-10` in `OnboardingReadyStep.tsx`.
- Prevents the CTA button from stretching into the right-side orbital background graphic (`orb_questions_bg.png`) or colliding with the baked-in text ("Remembers every conversation").

### 3. Linguistic Shield & Spanish Screening in Diagnostic Calibration
- Problem identified: Answering in Spanish previously triggered a word count of >=10, incorrectly assigning "A2 — Elementary" to users who never spoke English.
- Solution implemented:
  - Integrated `SPANISH_MARKERS` and English core functional tokens screening into `OnboardingDiagnosticEvaluator.ts`.
  - If Spanish diacritics or high density of Spanish markers are detected, the system immediately flags `isSpanishDetected: true`.
  - Overrides heuristic word counting and forces calibration to **`A1 — Beginner`** (`compositeScore: 25`, `speakingConfidence: "Low"`, `conversationStyle: "Spanish Input · Foundational English Needed"`).
  - The AI dossier informs the mentor that answers were in Spanish, prompting an empathetic, welcoming response explaining that Lingua builds English foundations from zero.
  - In `useOnboardingConversation.ts`, turn-by-turn Spanish detection gently prompts the user to try simple English words for subsequent turns.
