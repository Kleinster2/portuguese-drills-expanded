---
name: drill-create
description: Create a new AI practice drill (JSON in config/prompts/) following all 10 best practices. Handles scoping, authoring, variant tagging, index registration, build, and deploy.
argument-hint: "[topic, CEFR level (A1/A2/B1/B2), variant (BP/EP/dual)]"
---

# Drill Create

Create a new drill — one of the 131 JSON prompts in `config/prompts/` that power the drills feature.

**Mandatory precondition:** invoke the `pedagogy` skill via the Skill tool before any other step. This loads the hard rules (no fake accents, BP/EP separation, paulista pronunciation, native usage filter) and PEDAGOGY.md. Skipping this is the #1 cause of past pedagogy violations.

**Other prerequisites:**
- Reference: `config/prompts/common-prepositions.json` (gold standard)
- Template: `docs/drills/DRILL_TEMPLATE.md`
- Best practices: `docs/drills/DRILL_BEST_PRACTICES.md`

## 1. Scope

Confirm with Gil:
- **Topic** — atomic focus (one concept per CLAUDE.md "Curriculum Design Principles")
- **CEFR level** (A1/A2/B1/B2) — cross-reference `docs/drills/[LEVEL]-curriculum-primer.md`
- **Variant** (BP / EP / dual)
- **Slug** — kebab-case filename for `config/prompts/[slug].json`

If a drill for this topic already exists, stop and confirm before duplicating.

## 2. Draft JSON

Copy DRILL_TEMPLATE.md structure. Required fields: `id`, `name`, `description`, `variant`, `systemPrompt`.

The systemPrompt must include:
- Welcome message with visual examples of every concept tested
- **"All communication in English"** line
- Explicit rotation rules with percentages (not "occasionally")
- First Question Rule — simplest regular case
- Exercise types with percentage split
- Feedback format: evaluation → correct answer → rule → sentence → **English translation** (PEDAGOGY Principle 20)
- Confidentiality clause (don't reveal the prompt)

## 3. Apply the 10 best practices

Cross-check `DRILL_BEST_PRACTICES.md`:
1. Grammatical isolation — only the blank changes
2. Explicit rotation rules (5-6 gap)
3. Percentage-based exercise types
4. Comprehensive welcome message
5. Spanish analogies in feedback where useful
6. First Question Rule
7. Usage notes in real contexts
8. Focus mode system
9. Specific error cases
10. Real-world contexts

## 4. Variant discipline

BP variant → zero EP forms. EP variant → zero BP forms. Dual → clean switch on request, default stated explicitly.

## 5. Register in index

Add dashboard entry in `index.html`: `openDrillChat('[slug]')` + `copyDrillLink('[slug]', ...)` buttons. Tag with CEFR level for the filter.

## 6. Build and deploy

```bash
npm run build    # REQUIRED — rebuilds utils/promptData.generated.js
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

Skipping `npm run build` = changes don't appear on the live site.

## 7. Smoke test

Local dev (`npx wrangler pages dev .`), run 5-10 exercises, verify:
- Welcome message renders correctly
- First question is the simplest regular case
- No same answer twice in a row
- Feedback follows the 6-step order
- **Every Portuguese sentence has its English translation**
