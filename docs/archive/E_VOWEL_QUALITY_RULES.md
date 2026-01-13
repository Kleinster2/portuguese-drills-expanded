# E Vowel Quality Rules (Open é vs Closed ê)

**Version:** 1.0
**Last Updated:** 2025-01-07
**Purpose:** Algorithmic rules to determine E vowel quality in dictionary-style phonetic transcription

---

## Overview

Brazilian Portuguese has two qualities of E vowel:
- **Open é** (acute accent): like "eh" in "yeah"
- **Closed ê** (circumflex): like "eh" in "meh"

These rules apply to **stressed E vowels** in our phonetic transcription.

---

## Rule Priority Order

Apply these rules in order (first match wins):

### 1. **E before nasal consonants (m, n, nh) → CLOSED ê**

When E appears before m, n, or nh in the same syllable:

Examples:
- contente → con-**TÊN**-te
- tempo → **TÊM**-po
- sempre → **SÊM**-pre
- tenho → **TÊ**-nho
- dezembro → de-**ZÊM**-bro

**Pattern**: `e + [m|n|nh]` → **ê**

---

### 2. **E in closed syllables ending in consonant → CLOSED ê**

When stressed E is in a syllable closed by a consonant (except L):

Examples:
- inglês → in-**GLÊS** (closed by S)
- português → por-tu-**GUÊS** (closed by S)
- perspectiva → pers-pec-**TÊ**-va (closed by ct cluster)

**Pattern**: `stressed-e + consonant(s) + syllable-break` → **ê**

**Exception**: E before L (see Rule 4)

---

### 3. **E + U diphthong → CLOSED ê**

The "eu" diphthong uses closed E:

Examples:
- eu → **ÊU**
- meu → **MÊU**
- seu → **SÊU**

**Pattern**: `eu` → **ÊU**

---

### 4. **E before L (especially -el ending) → OPEN é**

When E appears before L, especially in -el endings:

Examples:
- Daniel → da-ni-**ÉL**
- papel → pa-**PÉL**
- hotel → o-**TÉL**
- Brasil → bra-**ZÉL** (after L vocalization to U)

**Pattern**: `e + l` → **éL** → **éU** (after L vocalization)

---

### 5. **E + I diphthong (-eiro, -eira) → OPEN é**

The "ei" diphthong uses open E:

Examples:
- brasileiro → bra-zi-**LÉI**-ro
- solteiro → sol-**TÉI**-ro
- primeira → pri-**MÉI**-ra

**Pattern**: `ei` → **ÉI**

---

### 6. **E in open stressed syllables → OPEN é (default)**

When stressed E is in an open syllable (CV pattern):

Examples:
- café → ca-**FÉ**
- José → jo-**ZÉ**
- bebê → be-**BÊ** (wait, this has circumflex already - stressed closed)

**Pattern**: `stressed-e + vowel-or-end` → **é**

**Note**: This is the default for stressed E not covered by other rules.

---

### 7. **Unstressed E → No marking (or leave as "e")**

Unstressed E vowels don't need quality marking in dictionary-style:

Examples:
- de → "jee" (no marking needed)
- elemento → "e-le-MÊN-to" (unstressed "e" unmarked)

---

## Implementation Algorithm

```python
def determine_e_quality(word, syllable_index, e_position):
    """
    Determine if E should be é (open) or ê (closed).

    Args:
        word: The Portuguese word
        syllable_index: Which syllable contains the E
        e_position: Position of E within the word

    Returns:
        'é' for open, 'ê' for closed, 'e' for unstressed
    """

    # Check if E is stressed (would need stress detection)
    if not is_stressed(word, syllable_index):
        return 'e'  # unstressed, no marking

    # Rule 1: E before nasal (m, n, nh)
    if next_char_is_nasal(word, e_position):
        return 'ê'

    # Rule 2: E in closed syllable (except before L)
    if in_closed_syllable(word, e_position) and not before_l(word, e_position):
        return 'ê'

    # Rule 3: EU diphthong
    if next_char_is(word, e_position, 'u'):
        return 'ê'

    # Rule 4: E before L
    if before_l(word, e_position):
        return 'é'

    # Rule 5: EI diphthong
    if next_char_is(word, e_position, 'i'):
        return 'é'

    # Rule 6: Default for stressed open syllables
    return 'é'
```

---

## Edge Cases and Exceptions

### Words with Written Accents
If the Portuguese word already has an accent mark:
- **é** (acute) → use **é** (open)
- **ê** (circumflex) → use **ê** (closed)
- **è** (grave - rare) → use **è** as is

Example:
- café (already has é) → ka-**FÉ**
- você (already has ê) → vo-**SÊ**

### Dialectal Variation
Some words have regional variation in E quality. Use São Paulo/standard Brazilian:
- leite → **LÉI**-te (open é, not closed ê as in some regions)

---

## Testing Examples

| Portuguese | Syllables | Rule Applied | Result |
|------------|-----------|--------------|--------|
| eu | eu | Rule 3: EU diphthong | **ÊU** |
| Daniel | Da-ni-el | Rule 4: E before L | da-nee-**ÉL** |
| brasileiro | bra-si-lei-ro | Rule 5: EI diphthong | bra-zee-**LÉI**-roo |
| inglês | in-glês | Rule 2: Closed syllable | een-**GLÊS** |
| português | por-tu-guês | Rule 2: Closed syllable | por-too-**GUÊS** |
| contente | con-ten-te | Rule 1: Before N | kon-**TÊN**-te |
| solteiro | sol-tei-ro | Rule 5: EI diphthong | sol-**TÉI**-roo |
| tempo | tem-po | Rule 1: Before M | **TÊM**-po |
| hotel | ho-tel | Rule 4: E before L | o-**TÉL** |

---

## Implementation Notes

For the formatters, we'll need to:
1. **Detect stressed syllables** - can use accent marks or Portuguese stress rules
2. **Identify syllable structure** - open (CV) vs closed (CVC)
3. **Check context** - what consonants follow the E
4. **Apply rules in order** - first match wins

This will replace the dictionary-based approach with an algorithmic approach.
