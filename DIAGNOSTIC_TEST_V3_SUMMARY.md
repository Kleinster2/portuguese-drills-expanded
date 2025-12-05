# Diagnostic Placement Test V3.0 - System Documentation

**Date:** December 3, 2025
**Status:** Deployed (v3.0 Engine + v10.9 Question Bank)

## 1. Core Philosophy: Efficacy-Focused
The system has shifted from a "Production-Only" mandate to an **"Efficacy-First"** approach.
*   **Goal:** Measure proficiency with maximum accuracy and minimum friction.
*   **Strategy:** Use Production questions for active skills (conjugation, syntax) and Comprehension questions for abstract rules (metalinguistic awareness) where production would incorrectly test rote vocabulary.

## 2. The Diagnostic Engine (v3.0)
The adaptive logic in `js/placementTest.js` has been completely refactored from a simple "Three-Strikes" model to a **Topic-Based Diagnostic Model**.

### Key Logic
1.  **Granular Topic Tracking:** The engine tracks performance per `unitName` (e.g., "Preterite Tense", "Ser vs Estar") rather than just a global score.
2.  **Soft Failure (Topic Skipping):**
    *   If a student misses **2 questions** in a specific Topic, that Topic is marked as "Failed".
    *   The engine **skips** all remaining questions for that specific Topic.
    *   Crucially, the test **continues** to the next Topic within the same Phase.
    *   *Benefit:* A student weak in Verbs but strong in Prepositions gets a chance to prove their Preposition skills.
3.  **Phase Promotion:**
    *   To unlock the next Phase (e.g., A1 -> A2), a student must pass **70%** of the Topics in the current Phase.
    *   If they fail >30% of Topics, the test stops, and they are placed at the current Phase.
4.  **Mercy Rule (Ceiling):**
    *   If a student answers **15 questions correctly in a row**, they auto-pass the current Phase and advance immediately.
5.  **Reporting:**
    *   The final output (hash) contains a detailed "Skills Matrix" of every passed/failed topic, allowing for precise study plan generation.

## 3. Question Bank (v10.9-no-hints)
The active question bank is `config/placement-test-questions-v10.9-no-hints.json`.

### Characteristics
*   **Total Questions:** 136
*   **Hints:** Removed (to prevent spoon-feeding).
*   **Scenarios:** Contextual scenarios added to Production questions to justify the utterance.
*   **Safety Rules:**
    *   Nouns used for gender testing must end in `-o/-a/-os/-as` to avoid ambiguity.
    *   Specific fix: `teatro` -> `banco` (Q130).
*   **Cognitive Friction Check:**
    *   Updated Q2 ("I am Brazilian" -> "I am American") to ensure American students don't have to "lie" about their nationality, which creates unnecessary friction.

### New Topics Added (Gap Analysis)
We identified and filled gaps to align with CEFR standards:
1.  **Existential "Ter" (There is/are):** Unit 90 (Phase 1) - Tests "Tem" for existence.
2.  **Present Progressive (Gerund):** Unit 91 (Phase 2) - Tests "-ando" forms.
3.  **Comparisons of Equality:** Unit 92 (Phase 3) - Tests "Tão... quanto".
4.  **Preposition "Para" (Purpose):** Added to Unit 44 (Phase 2).
5.  **Gender Concepts (Ambiguity):** Unit 95 (Phase 2) - **Comprehension Questions** testing the rule that `-e` and `-l` endings are gender-ambiguous, without relying on vocabulary.

## 4. Guidelines & Standards
Updated `config/placement-test-guidelines.md` to v3.1.
*   **Production:** 90% of test. Use for skills.
*   **Comprehension:** Use for Rules/Concepts.
*   **Context:** Use `scenario` field, not `en` field, for context.
*   **Vocabulary:** Do not test obscure vocabulary. Use high-frequency proxies.
*   **No Cognitive Friction:** Questions should allow students to speak their truth where possible (e.g., "I am American") or use 3rd person to avoid role-play dissonance.

## 5. File Structure
*   **Engine:** `js/placementTest.js`
*   **Data:** `config/placement-test-questions-v10.9-no-hints.json`
*   **Docs:** `config/placement-test-guidelines.md`
