---
name: pronunciation-lesson
description: Create or review a pronunciation lesson — phoneme, rule, examples, phonetic annotation, audio. Applies PEDAGOGY principles 14, 16, and 20.
argument-hint: "[phoneme or rule, variant (BP/EP)]"
---

# Pronunciation Lesson

Create a pronunciation lesson for a specific sound or rule.

**Prerequisites:**
- `/pedagogy` loaded
- Read `PRONUNCIATION_RULES.md` (the 6 rules) and `docs/pronunciation/QUICK_REFERENCE.md`
- Review `project_phonetic-tool-strategy` — the algorithmic tool (`utils/phonetic_direct.py`) is the long-term standard, with LLM tool (`utils/llm_pronunciation.py`) as reference until algorithmic bugs are fixed

## 1. Scope

Confirm:
- **Phoneme or rule** (e.g., "T palatalization before i/e", "open é vs closed ê")
- **Variant** (BP / EP — they diverge significantly, especially final L, final vowels, palatalization)
- **Where it plugs in** — which lesson or worksheet introduces the relevant vocabulary (Principle 14: at point of use, not orphaned)

## 2. Choose examples

Per PEDAGOGY Principle 16 — seed from upcoming vocabulary, not throwaways:
- T palatalization (BP): contente, quente (not noite, arte)
- D palatalization (BP): dinheiro, cidade
- Open é: café, pé → AY sound (kah-FAY, PAY)
- Closed ê: você, português → EH sound (voh-SEH, por-too-GEHS)
- Final -o: obrigado → OH (not "oo")
- Final L (BP): Brasil → W (brah-ZEW), (EP) keeps L

Every example gets its English translation (PEDAGOGY Principle 20).

## 3. Phonetic annotation

```bash
python utils/phonetic_direct.py "example text"
```

Cross-check output against `utils/llm_pronunciation.py`. The algorithmic tool has known bugs (e.g., Brasil → brah-ZEE-oo instead of brah-ZEW) — if the output is wrong, fix the rule in `phonetic_direct.py`, don't paper over it.

Conventions:
- Open é = AY / closed ê = EH
- Stressed syllables UPPERCASE
- Hyphen between syllables
- Nasal markers: `(nasal)` format

## 4. Build the lesson

5-step progressive format (see `docs/pronunciation/SYSTEM_ARCHITECTURE.md`):
1. Introduce the sound + speaker button (Principle 14 — audible at point of use)
2. Contrast with the nearest confusable sound
3. Practice in isolation
4. Practice in words
5. Practice in sentences

Every Portuguese token on the page gets its English translation (Principle 20).

## 5. Integrate

- Add to the syllabus if new
- Cross-link from the worksheet/lesson that introduces the vocabulary
- Update `docs/pronunciation/CHANGELOG.md`
