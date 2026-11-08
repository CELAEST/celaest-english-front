# Zero-Scroll Classroom Layout Standard (CELAEST Flex-Chain)

## Context & Problem
In the 1-on-1 3D Live Classroom (`PathwayStudioView`), desktop and small-laptop screens (height <= 768px) and mobile viewports previously suffered from vertical overflow, producing ugly browser scrollbars on the classroom panel and misaligned robot stages.

## Architectural Solution & Contract
1. **Container Constraint (Flex-Height Chain)**:
   - Root is `h-full max-h-full w-full overflow-hidden flex flex-col lg:flex-row`.
   - Outer padding is responsive: `px-3 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-4 pb-3 sm:pb-4 gap-3 lg:gap-6 xl:gap-8`.
2. **Hidden Native Scrollbars & Centered Dynamic Cards**:
   - The interactive content wrapper uses:
     `overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 sm:py-2 flex flex-col justify-center`.
   - Never display a native white/grey Chromium or Firefox scrollbar track.
3. **Responsive Spacing & Typography**:
   - `PathwayVisualRuleStep`: Responsive `gap-2 sm:gap-3 lg:gap-3.5`, fluid title `text-xl sm:text-2xl lg:text-[26px] xl:text-[28px]`, compact spoken rows (`py-1`, `space-y-1 sm:space-y-1.5`).
   - `PathwayBlockBuilderStep`: Responsive `gap-2.5 sm:gap-3.5 lg:gap-4`, compact magnetic line `min-h-[46px] pb-2`, tokens `min-h-[34px] px-3.5 py-1 text-xs sm:text-sm`.
   - `PathwayVoiceUnlockStep`: Responsive `gap-2.5 sm:gap-3.5 lg:gap-4`, font `text-xl sm:text-2xl lg:text-[28px] xl:text-[32px]`.
4. **Mobile & Tablet Stage Proportions**:
   - `PathwayProfessorStage`: `h-[36vh] sm:h-[42vh] lg:h-full`.
   - In mobile viewports (`flex-col`), the robot occupies the top 36-42vh, while the classroom occupies `flex-1 min-h-0`, achieving 100% viewport fit with zero clipping and zero global scroll.
5. **Strict Constraint Check**:
   - Every single component strictly complies with `< 80 lines` (Cero monolitos).
