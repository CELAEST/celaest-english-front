# Interview Feedback Error Carousel Visibility Fix

## Problem
The InterviewAnalysisErrorCarousel was at the bottom of the modal, invisible without scrolling.

## Solution
Moved it to second position (after Scorecard). Reduced top margins for tighter integration.

## Layout Order: Scorecard -> ErrorCarousel -> StrategyGrid -> TranscriptCard + ModelAnswer

## Files: InterviewAnalysisModal.tsx, InterviewAnalysisErrorCarousel.tsx