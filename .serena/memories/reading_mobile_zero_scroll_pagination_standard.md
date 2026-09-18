# CELAEST Reading Mobile Strict Zero-Scroll & Pagination Standard

- **Reading Viewport Pagination**: Calibrated in `useReadingArticles.ts` via `getTargetWordsForHeight` and `paginateText`.
- **Target Words Budget**:
  - Small / compact mobile (<680px): 42 words (~5-6 lines).
  - Standard smartphones (<780px): 52 words (~6-7 lines).
  - Modern smartphones (<900px, iPhone 13/14/15/16): 58 words (~7-8 lines).
  - Pro Max / Tablets (<1050px): 75 words (~9-10 lines).
  - Desktop (1080p+): 110 words (~10-12 wide lines).
- **Strict Zero-Scroll & Hard Ceiling**:
  - `hardMaxPerPage = targetWordsPerPage`: guaranteed ceiling per page so lines never push past container height.
  - `overflow-hidden` on `Central Reader` and `ReadingArticleReader` to eliminate internal scrollbars.
  - Prudent breathing cushion (~80px-120px) maintained between reading text and `ReadingBottomBar`.
  - Paginates cleanly at sentence boundaries (`.`, `!`, `?`, `"`, `'`) before reaching bottom boundaries.
- **Justification & Tracking**:
  - `[text-align:justify] [text-align-last:left]` with `tracking-[-0.006em]` and `px-[1px] sm:px-1` button padding.
