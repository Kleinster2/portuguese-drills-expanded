/**
 * Worksheet Generator Meta-Prompt
 *
 * Combined with a drill's systemPrompt and student info to generate
 * a complete, self-contained, printable HTML worksheet.
 */

const WORKSHEET_CSS = `
    @page { margin: 0.5in; }
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      padding: 20px;
      color: #1a1a6e;
    }
    h1 { font-size: 20px; margin: 0 0 6px 0; font-weight: bold; }
    h2 { font-size: 16px; margin: 20px 0 12px 0; font-weight: bold; }
    h3 { font-size: 14px; margin: 16px 0 8px 0; font-weight: bold; font-style: italic; }
    .subtitle { font-size: 12px; font-style: italic; margin-bottom: 18px; color: #444; }
    .grammar-box {
      border: 1.5px solid #1a1a6e;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 13px;
      line-height: 1.6;
    }
    .grammar-box b { color: #1a1a6e; }
    .usage-box {
      border: 1.5px solid #b45309;
      background: #fffbeb;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 13px;
      line-height: 1.6;
    }
    .usage-box b { color: #92400e; }
    .item { margin-bottom: 14px; }
    .prompt { margin-bottom: 4px; }
    .line {
      border-bottom: 1px solid #1a1a6e;
      height: 22px;
      margin-bottom: 4px;
    }
    .example { font-style: italic; font-size: 13px; color: #555; margin-bottom: 14px; }
    .page-break { page-break-before: always; }
    .footer-note {
      text-align: right;
      font-style: italic;
      font-size: 11px;
      margin-top: 30px;
    }
    .section-note {
      font-size: 12px;
      font-style: italic;
      color: #666;
      margin-bottom: 12px;
    }
    .answer-key {
      page-break-before: always;
      margin-top: 30px;
    }
    .answer-key h2 {
      background: #1a1a6e;
      color: white;
      padding: 5px 10px;
    }
    .answers {
      columns: 3;
      column-gap: 20px;
      font-size: 12px;
      line-height: 1.5;
    }
    .answer-item {
      margin-bottom: 4px;
      break-inside: avoid;
    }
    .answer-item .tag {
      font-size: 10px;
      color: #666;
      font-style: italic;
    }
    .open-answers {
      font-size: 12px;
      line-height: 1.5;
    }
    .open-answers .answer-item {
      margin-bottom: 6px;
    }
    .teacher-notes {
      font-size: 13px;
      line-height: 1.6;
    }
    .teacher-notes h1 {
      font-size: 18px;
      color: #4338ca;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 8px;
    }
    .teacher-notes h2 {
      font-size: 15px;
      color: #4338ca;
    }
    .teacher-notes .callout {
      background: #e0e7ff;
      border-left: 3px solid #4338ca;
      padding: 8px 12px;
      margin: 10px 0;
    }
    @media print {
      body { padding: 0.4in; }
      .no-print { display: none !important; }
    }
`;

/**
 * Build the complete system prompt for worksheet generation.
 *
 * @param {string} drillSystemPrompt - The drill's systemPrompt from JSON
 * @param {string} studentName - Student's name
 * @param {string} studentNotes - Optional notes about the student
 * @returns {string} Complete system prompt for Claude
 */
export function buildWorksheetPrompt(drillSystemPrompt, studentName, studentNotes) {
  const notesSection = studentNotes
    ? `- Student notes: ${studentNotes}`
    : '- Student notes: (none provided — generate a general-purpose worksheet)';

  return `You are a worksheet generator. Output ONLY a complete HTML document (<!DOCTYPE html> through </html>). No markdown fences, no commentary.

Use this CSS in <style>:
${WORKSHEET_CSS}

STRUCTURE:

1. HEADER: <h1> with topic title in Portuguese. <div class="subtitle"> with dialect (Português Brasileiro/Europeu), student name "${studentName}", and "Date: _______________"

2. REFERENCE BOXES: <div class="grammar-box"> for formation rules. <div class="usage-box"> for usage notes/gradients. Include tables if helpful. Must be enough for the student to complete the worksheet.

3. EXERCISES: Generate 30-40 exercises in 4-6 sections (A through D/E/F). Each section:
- <h2> heading (e.g., "A. Title")
- <div class="section-note"> with instructions in Portuguese
- <div class="example"> with worked example
- <div class="item"><div class="prompt">N. text</div></div> for fill-in-blank
- Add <div class="line"></div> for rewrite/translation items
- <div class="page-break"></div> every 2 sections
- Progress from structured (fill-in) to productive (translation, free response)
- Number continuously (1-40). Use HTML entities for accents (&aacute; &ecirc; &otilde; etc.)
- Match dialect: BP = Brazilian refs/vocab/currency, EP = Portuguese ones

4. ANSWER KEY: <div class="answer-key"> on new page. <h2>Answer Key</h2>. Per section: <h3> + <div class="answers"> (3-col for short) or <div class="open-answers">. Use <span class="tag"> for explanations.

5. TEACHER NOTES: <div class="page-break"></div> then <div class="teacher-notes">. Brief: student profile, key pedagogical points, teaching tips. Use <div class="callout"> for key insights.

DRILL SPEC (extract grammar rules, verb lists, exercise types, cultural context from this):
---
${drillSystemPrompt}
---

STUDENT: ${studentName}
${notesSection}

Output ONLY the HTML. Self-contained, no external dependencies. Answer key must be complete and accurate.`;
}
