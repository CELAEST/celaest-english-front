# CELAEST Master Lecture & Interactive 3D Mentor Q&A Architecture (Pathway)

## 1. 6-Stage Pedagogical Master Lecture (PathwayLectureEngine.ts)
Formulates an executive, neuroscience-backed lecture in Latin American Spanish:
1. BIENVENIDA & PROPOSITO: Warm greeting and direct objective statement.
2. LA TRAMPA DEL ESPANOL: Empathy and deconstruction of Spanish L1 transfer traps (e.g. omitting subjects, false cognates).
3. LA REGLA DE ORO: Intuitive mental rule from blueprint, avoiding dense grammar jargon.
4. MODELO NATIVO: Flagship native English voice synthesis (en-US-AriaNeural).
5. SECRETO FONETICO: Phonetic linking / rhythm secret to sound natural.
6. ACTIVACION CINETICA: Motivational call to action to assemble the blocks on the left board.

## 2. In-Place Annexed Q&A Architecture (Zero-Modal Standard)
- **Zero Full-Screen Modals**: Eradicated `LessonQuestionModal`. Q&A is now annexed in-place directly inside `ProfessorLessonBoard` via `LessonQuestionAnnex.tsx`.
- **Fluid Inline Workflow**:
  - Student clicks `Preguntar` in `LessonBoardActions`.
  - The card smoothly expands an inline input with micro-chips (`¿Por qué no omitir sujeto?`, `Diferencia con español`, `Ejemplo en el trabajo`).
  - While submitting: robot visor displays acoustic listening radar (`animState = "listening"`).
  - When answered: tray closes automatically, professor voice explains the answer, and `LessonTypedText` writes out the response in real-time.

## 3. Obsidian Glass & Studio Atmosphere Standard
- **Clean Card Background**: Replaced navy `#080c14` with unified obsidian glassmorphism (`bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)]`).
- **Atmospheric Studio Aura**: Replaced footer purple blur blob with an organic, subtle radial studio glow (`radial-gradient(ellipse 70% 60% at 50% 40%, rgba(162,127,243,0.07) 0%, rgba(56,189,248,0.03) 40%, transparent 72%)`) centered behind the 3D mentor.

## 4. Anti-Monolith Compliance
- All components (`LessonQuestionAnnex.tsx`, `LessonBoardActions.tsx`, `ProfessorLessonBoard.tsx`, `PathwayProfessorStage.tsx`) strictly comply with < 80 lines or clean decoupling.
- Zero TypeScript errors (certified via `npm run build`).
