# Inverted Pipeline Design

**Version:** 2.0
**Date:** 2025-01-07
**Status:** Design Document

---

## Overview

The new pipeline generates dictionary-style phonetics **directly** from Portuguese text, with all rules applied during generation (not as post-processing).

---

## Architecture Comparison

### OLD Pipeline (4 steps)
```
Portuguese → Annotate → Substitute → Dictionary → E Quality → Output
"brasileiro" → "brasileiro/u/" → "brasileiru" → "brah-zee-LEI-roo" → "brah-zee-LÉI-roo"
```

### NEW Pipeline (1 step)
```
Portuguese → Direct Conversion → Output
"brasileiro" → "brah-zee-LÉI-roo"
```

---

## Rule Transformation

All pronunciation rules now output **dictionary-style phonetics** directly:

### Rule 1: Final -o → oo

**Old:** `brasileiro` → `brasileiro/u/` → `brasileiru`
**New:** `brasileiro` → `brah-zee-LAY-roo` (oo at end)

Examples:
- `gato` → `GAH-too`
- `o` (article) → `oo`
- `casado` → `kah-ZAH-doo`

### Rule 2: Final -e → ee

**Old:** `de` → `de/i/` → `di`
**New:** `de` → (palatalized to) `jee`

Examples:
- `e` (and) → `ee`
- `nome` → `NOH-mee`
- `contente` → `kohn-TÊN-chee` (te → chee)

### Rule 3: Palatalization

**Old:** `de` → `de/dji/` → `dji`
**New:** `de` → `jee` (d+ee palatalized)

Examples:
- `de Miami` → `jee mee-AH-mee`
- `contente` → `kohn-TÊN-chee` (t+ee → chee)

### Rule 4: Epenthetic i → ee

**Old:** `York` → `York/i/` → `Yorki`
**New:** `York` → `YORK-ee`

Examples:
- `Facebook` → `FACE-book-ee`
- `Internet` → `een-ter-NEHT-chee` (t+ee → chee)

### Rule 5: Nasal Vowels

**Old:** `com` → `com/coun/` → `coun`
**New:** `com` → `KOHN (nasal)`

Examples:
- `bem` → `BAYN (nasal)`
- `um` → `OOM (nasal)`
- `também` → `tahm-BAYN (nasal)`

### Rule 6: L Vocalization → oo

**Old:** `Brasil` → `Brasil/u/` → `Brasilu`
**New:** `Brasil` → `brah-ZEE-loo`

Examples:
- `Daniel` → `dah-nee-ÉL` or `dah-nee-ÉH-oo` (after vocalization)
- `hotel` → `oh-TEH-oo`
- `papel` → `pah-PÉH-oo`

### E Vowel Quality (Integrated)

Applied **during** phonetic generation, not after:

**Old:** Generate `EH-oo`, then apply quality → `ÊH-oo`
**New:** Generate `ÊH-oo` directly

Rules:
1. E before nasal → **Ê**: `tempo` → `TÊM-poo`
2. E in closed syllable → **Ê**: `inglês` → `een-GLÊS`
3. EU diphthong → **Ê**: `eu` → `ÊH-oo`
4. E before L → **É**: `Daniel` → `dah-nee-ÉL`
5. EI diphthong → **É**: `brasileiro` → `brah-zee-LÉI-roo`

---

## New Function Architecture

### Main Function

```python
def portuguese_to_phonetic(word: str) -> str:
    """
    Direct conversion from Portuguese to dictionary-style phonetic.

    All rules applied during generation:
    - Vowel transformations (o→oo, e→ee)
    - Palatalization (de→jee, te→chee)
    - L vocalization (l→oo)
    - Nasal vowels
    - E quality (é/ê)

    Args:
        word: Portuguese word

    Returns:
        Dictionary-style phonetic transcription
    """
    # Analyze word structure
    # Apply all rules during generation
    # Return complete phonetic
```

### Processing Flow

```python
def convert_word(word):
    # 1. Identify syllables
    syllables = syllabify(word)

    # 2. For each syllable, apply rules:
    for syl in syllables:
        # Check E quality context
        if has_e_vowel(syl):
            quality = determine_e_quality(word, syl_position)
            # Generate with proper é or ê

        # Apply consonant rules
        if ends_with_te(syl):
            # Generate "chee" not "te"

        if has_nasal(syl):
            # Generate "(nasal)" marker

        # Apply vowel rules
        if ends_with_o(syl):
            # Generate "oo" not "o"

    # 3. Combine syllables with hyphens
    # 4. Apply stress markers (CAPITALS)

    return phonetic
```

---

## Implementation Strategy

### Phase 1: Create New Function
- `portuguese_to_phonetic_direct(word)` - new direct converter
- Keeps old pipeline intact initially
- Test against known words

### Phase 2: Build Rule Generators
Each rule becomes a generator function:

```python
def apply_final_o_rule(syllable, is_final):
    """Generate 'oo' for final unstressed -o"""
    if is_final and syllable.ends_with('o'):
        return syllable.replace_vowel('oo')
    return syllable

def apply_palatalization(syllable):
    """Generate 'jee' for de, 'chee' for te"""
    if syllable == 'de':
        return 'jee'
    if syllable.ends_with('te'):
        return syllable.replace_final('chee')
    return syllable
```

### Phase 3: Replace Old Pipeline
- Update `format_dictionary_style()` to use new function
- Remove old annotation/substitution steps
- Keep dictionary for irregular words

---

## Benefits

1. **Simpler**: One step instead of four
2. **Clearer**: Rules output final format directly
3. **Faster**: No intermediate transformations
4. **Maintainable**: Rules are self-contained
5. **Consistent**: E quality integrated, not patched on

---

## Migration Path

### Keep for Irregular Words
```python
IRREGULAR_WORDS = {
    'eu': 'ÊH-oo',
    'sou': 'SOH',
    'é': 'EH',  # verb "to be"
    # ... other irregulars
}
```

### Regular Words Use Rules
```python
def portuguese_to_phonetic(word):
    # Check irregular dictionary first
    if word.lower() in IRREGULAR_WORDS:
        return IRREGULAR_WORDS[word.lower()]

    # Apply rule-based generation
    return generate_phonetic(word)
```

---

## Example Conversions

| Portuguese | Old Pipeline | New Pipeline | Rules Applied |
|------------|-------------|--------------|---------------|
| brasileiro | brasileiro/u/ → brasileiru → brah-zee-LEI-roo → LÉI-roo | brah-zee-LÉI-roo | Final -o→oo, EI→ÉI |
| de | de/dji/ → dji → jee | jee | d+e→jee (palatalization) |
| inglês | inglês → inguês → een-GLES → GLÊS | een-GLÊS | E in closed→Ê |
| contente | contente/tchi/ → contentchi → kohn-TEN-chee → TÊN-chee | kohn-TÊN-chee | te→chee, E+N→Ê |
| Daniel | Daniel/u/ → Danieu → dah-nee-EH-oo → ÉH-oo | dah-nee-ÉH-oo | L→oo, E before L→É |

---

## Next Steps

1. ✅ Design inverted architecture
2. ⏳ Implement `portuguese_to_phonetic_direct()` in Python
3. ⏳ Test against existing word_mappings
4. ⏳ Implement in JavaScript
5. ⏳ Update documentation
6. ⏳ Remove old pipeline code

---

## Open Questions

1. **Syllabification**: How to split words into syllables algorithmically?
2. **Stress detection**: How to identify stressed syllables?
3. **Irregular handling**: Keep dictionary or handle with rules?
4. **Performance**: Is direct generation faster than current pipeline?
