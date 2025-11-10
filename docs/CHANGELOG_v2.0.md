# Changelog v2.0 - Rule 1b Removal & Lesson Cleanup

**Date:** 2025-01-10
**Version:** 2.0

## Summary

Simplified the pronunciation rule system from 7 to 6 rules by removing Rule 1b (-or → /oh/), and cleaned up Unit 1 lesson to only show three-step format where pronunciation changes actually occur.

---

## Major Changes

### 1. Removed Rule 1b (-or → /oh/)

**Rationale:** Words ending in -or don't end in -o, they end in -r. Rule 1 pattern `\b\w+o\b` only matches words ending in -o, so Rule 1b was unnecessary complexity.

**Before (v1.9):**
- professor → professor/oh/ → professoh (Rule 1b)
- doutor → doutor/oh/ → doutoh (Rule 1b)

**After (v2.0):**
- professor → professor (no annotation - ends in -r, not -o)
- doutor → doutor (no annotation)

**Files Modified:**
- `utils/annotate_pronunciation.py` (v1.9 → v2.0)
  - Removed `apply_rule_1b()` function
  - Updated docstring: 7 rules → 6 rules

- `js/pronunciation-annotator.js` (v1.6 → v2.0)
  - Removed `applyRule1b()` function
  - Updated docstring: 7 rules → 6 rules

- `index.html`
  - Removed `-or → oh` pattern from `formatSubstitutionMode()`

### 2. Cleaned Up Unit 1 Lesson Format

**Rationale:** Three-step format (Original → Annotated → Substituted) is only useful when there are actual pronunciation changes. Showing identical text three times is confusing and redundant.

**Removed Redundant Three-Step Examples:**

**Pattern 1.1:**
- ❌ Removed: "Eu sou a Sofia" (no changes)

**Pattern 1.2:**
- ❌ Removed: "Eu sou analista" (no changes)
- ❌ Removed: "Eu sou professor" (no changes after Rule 1b removal)
- ❌ Removed: "Eu sou professora" (no changes)

**Pattern 1.3:**
- ❌ Removed: "Eu sou americana" (no changes)
- ❌ Removed: "Eu sou brasileira" (no changes)

**Pattern 1.5:**
- ❌ Removed: "Eu sou da França" (no changes)

**Pattern 1.6:**
- ❌ Removed: "Eu sou casada" (no changes)
- ❌ Removed: "Eu sou alta" (no changes)

**Replaced With:**
- Simple vocabulary lists in blue note boxes
- Clear labeling: "Feminine examples (no changes)"
- Much cleaner presentation

**Result:**
- Removed 112 lines of redundant HTML
- Three-step format now ONLY used for examples with actual changes
- 9 examples removed → replaced with 5 vocabulary boxes

### 3. Fixed Documentation Errors

**Error 1: Daniel → Danieu (not Danielu)**
- Daniel ends in **L**, not O
- Correct: Daniel/u/ → Danieu (L vocalization)
- Fixed in all documentation

**Error 2: professor annotations**
- Incorrectly showed: professor/u/ → professu
- Correct: professor → professor (no rule applies)
- Fixed in all documentation

---

## Documentation Updates

### Updated Files:

1. **`docs/UNIT_1_SUBSTITUTION_REFERENCE.md`**
   - Fixed Daniel → Danieu
   - Fixed professor → professor (no annotation)
   - Updated gender pattern table
   - Added note about lesson format vs. reference format

2. **`docs/SUBSTITUTION_MODE.md`**
   - Changed examples from professor to Daniel/brasileiro
   - Updated version history to v2.0
   - Removed Rule 1b from transformation table

3. **`docs/NOTATION_STYLE_GUIDE.md`**
   - Removed -or → oh examples
   - Kept as reference for other patterns

4. **`docs/PYTHON_JAVASCRIPT_CONSISTENCY_REPORT.md`**
   - Updated to reflect v2.0 consistency
   - Changed professor examples
   - Documented Rule 1b removal
   - Status: ✅ FULLY CONSISTENT

---

## Lesson Content Changes

### `lessons/unit-1.html`

**Before:**
- 17 three-step examples
- Many showing identical text 3 times
- Confusing for learners

**After:**
- 8 three-step examples (only masculine forms with -o endings, and names with L)
- 5 vocabulary boxes for examples without changes
- Much cleaner and more focused

**Three-Step Examples Kept:**
1. Eu sou o Daniel → u Danieu (o → u, L → u)
2. Eu sou americano → americanu (o → u)
3. Eu sou brasileiro → brasileiru (o → u)
4. Eu sou de Miami → dji Miami (de → dji)
5. Eu sou de São Paulo → dji São Paulu (de → dji, o → u)
6. Eu sou do Brasil → du Brasiu (o → u, L → u)
7. Eu sou casado → casadu (o → u)
8. Eu sou alto → altu (o → u)

**Vocabulary Boxes Added:**
1. Pattern 1.1: "Eu sou a Sofia" (feminine, no changes)
2. Pattern 1.2: analista, professor, professora (no changes)
3. Pattern 1.3: americana, brasileira (feminine, no changes)
4. Pattern 1.5: "Eu sou da França" (feminine, no changes)
5. Pattern 1.6: casada, alta (feminine, no changes)

---

## Impact Assessment

### User Benefits:
- ✅ Simpler rule system (6 rules instead of 7)
- ✅ Clearer lesson format (no redundant repetition)
- ✅ More focused learning (three-step only shows changes)
- ✅ Consistent cross-platform (Python v2.0 = JavaScript v2.0)

### Breaking Changes:
- Words ending in -or no longer get annotated
- Lessons now show vocabulary lists instead of three-step for unchanged examples

### Migration:
- All code updated to v2.0
- All documentation updated
- All lessons updated
- Deployed to production

---

## Git Commits

1. **513fd4f** - Remove Rule 1b (final -or pronunciation) - Simplify to 6 rules
2. **4e13e99** - Fix documentation errors - professor triggers NO rules
3. **3f569a4** - Remove redundant three-step examples for professions
4. **6831c10** - Remove all feminine examples with no pronunciation changes
5. **[current]** - Add changelog and documentation note

---

## Version Numbers

- **Python:** v1.9 → v2.0
- **JavaScript:** v1.6 → v2.0
- **Lessons:** Updated all Unit 1 patterns
- **Documentation:** All files updated to v2.0

---

## Testing Status

✅ Python v2.0: All tests pass
✅ JavaScript v2.0: All tests pass
✅ Cross-platform: Fully consistent
✅ Deployed: Production (Cloudflare Pages)

---

## Summary Stats

- **Code removed:** ~200 lines (functions + patterns)
- **HTML removed:** ~112 lines (redundant examples)
- **Documentation updated:** 4 major files
- **Examples simplified:** 9 three-step → 5 vocabulary boxes
- **Rules reduced:** 7 → 6
- **Clarity improved:** Significantly

---

## Deployment

**Latest URL:** https://49068fb4.portuguese-drills-expanded.pages.dev

All changes deployed and live.
