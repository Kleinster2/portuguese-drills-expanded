# Worksheet Layout

CSS and print layout rules for student-facing printed materials. Apply when creating or editing any HTML worksheet or handout.

## Rules

1. **Answer keys in 2 columns.** Use `column-count: 2; column-gap: 24px` on a wrapper div. Each answer section (A, B, C...) gets `break-inside: avoid` so it stays together.

2. **No box splitting.** Every grammar-box, usage-box, vocab box, two-column layout, and exercise item must have `break-inside: avoid`.

3. **Page breaks between major sections.** Use `<div class="page-break"></div>` with `page-break-before: always` between logical sections. Each section starts at the top of a page.

4. **Answer key on its own page.** The answer-key div gets `page-break-before: always`.

5. **Print margins.** Use `@page { margin: 0.5in; }` and reset body padding to 0 in `@media print`.

6. **Chrome print headers/footers.** Cannot be suppressed via CSS. Tell the user to uncheck "Headers and footers" in Chrome's print dialog.
