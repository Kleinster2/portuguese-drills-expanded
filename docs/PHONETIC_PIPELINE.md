# Phonetic Transformation Pipeline

**Version:** 1.0
**Last Updated:** 2025-01-07

---

## Overview

This document describes the complete pipeline for converting Portuguese text to dictionary-style phonetic transcription.

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT: Portuguese Text                       │
│                   "Eu sou brasileiro."                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: annotate_pronunciation(text)                           │
│  ─────────────────────────────────────────                      │
│  Applies 6 pronunciation rules:                                 │
│    - Rule 1: Final -o → /u/                                     │
│    - Rule 2: Final -e → /i/                                     │
│    - Rule 3: Palatalization (de → /dji/, -te → /tchi/)          │
│    - Rule 4: Epenthetic /i/ (York → Yorki)                      │
│    - Rule 5: Nasal vowels (-em, -om, -um)                       │
│    - Rule 6: L vocalization (Brasil → /u/)                      │
│                                                                  │
│  Output: "Eu sou brasileiro/u/."                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: format_substitution(annotated)                         │
│  ─────────────────────────────────────────                      │
│  Applies phonetic substitutions:                                │
│    - Removes original letters, keeps phonetic                   │
│    - brasileiro/u/ → brasileiru                                 │
│    - sou/u/ → su                                                │
│    - de/dji/ → dji                                              │
│                                                                  │
│  Output: "Eu su brasileiru."                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Dictionary-Style Mapping                               │
│  ─────────────────────────────────────                          │
│  For each word:                                                 │
│    1. Look up in word_mappings dictionary                       │
│    2. If found: use dictionary value                            │
│    3. If not found: apply basic transformations                 │
│                                                                  │
│  Examples:                                                       │
│    eu        → ÊH-oo       (from dictionary)                    │
│    su        → SOH         (from dictionary)                    │
│    brasileiru → brah-zee-LEI-roo  (from dictionary)             │
│                                                                  │
│  Output: "ÊH-oo SOH brah-zee-LEI-roo."                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: apply_e_quality_to_phonetic(phonetic, original)        │
│  ────────────────────────────────────────────────────           │
│  Applies algorithmic é/ê rules based on original word:          │
│                                                                  │
│  For "brasileiro" (original contains "ei"):                     │
│    - Rule 5: EI diphthong → É (open)                            │
│    - LEI → LÉI                                                  │
│                                                                  │
│  For "eu" (original contains "eu"):                             │
│    - Rule 3: EU diphthong → Ê (closed)                          │
│    - EH → ÊH (already applied in dictionary)                    │
│                                                                  │
│  Output: "ÊH-oo SOH brah-zee-LÉI-roo."                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              OUTPUT: Dictionary-Style Phonetic                  │
│                "ÊH-oo SOH brah-zee-LÉH-roo."                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## The 6 Pronunciation Rules (Step 1)

### Rule 1: Final Unstressed -o → /u/
- **brasileiro** → brasileiro**/u/**
- **gato** → gato**/u/**
- **o** (article) → o**/u/**

### Rule 2: Final Unstressed -e → /i/
- **de** → de**/i/** (then palatalized to de/dji/)
- **nome** → nome**/i/**
- **e** (and) → e**/i/**

### Rule 3: Palatalization
- **de** → de**/dji/** (ALWAYS)
- **-te** (final) → -te**/tchi/**
- **-di-** (internal) → -di**/dji/**

### Rule 4: Epenthetic /i/
- **York** → York**/i/**
- **Internet** → Internet**/chi/** (t+i palatalization)

### Rule 5: Nasal Vowels
- **bem** → bem**/eyn/**
- **com** → com**/coun/**
- **um** → um**/ũm/**

### Rule 6: L Vocalization
- **Brasil** → Brasi**l/u/**
- **Daniel** → Danie**l/u/**
- **hotel** → hote**l/u/**

---

## E Vowel Quality Rules (Step 4)

Applied algorithmically based on original Portuguese word structure:

### Priority Order:

1. **E before nasal (m, n, nh) → Ê (closed)**
   - contente → kon-**TÊN**-te
   - tempo → **TÊM**-po

2. **E in closed syllable → Ê (closed)**
   - inglês → een-**GLÊS**
   - português → por-too-**GÊS**

3. **EU diphthong → Ê (closed)**
   - eu → **ÊH**-oo
   - meu → **MÊU**

4. **E before L → É (open)**
   - Daniel → dah-nee-**ÉH**-oo (after L→u)
   - papel → pap-**ÉL**

5. **EI diphthong → É (open)**
   - brasileiro → brah-zee-**LÉI**-roo
   - solteiro → sohl-**TÉI**-roo

6. **Default (open syllable) → É (open)**

---

## Complete Example Walkthrough

### Input: "Eu falo inglês e português."

#### Step 1: Annotation
```
Eu falo inglês e/i/ português.
```
(Most words have no changes; "e" gets Rule 2)

#### Step 2: Substitution
```
Eu falo inglês i português.
```

#### Step 3: Dictionary Mapping
```
ÊH-oo FAH-loo een-GLES ee por-too-GES.
```

Lookups:
- `eu` → `ÊH-oo`
- `falo` → `FAH-loo`
- `inglês` → `een-GLES` (base form)
- `i` → `ee`
- `português` → `por-too-GES` (base form)

#### Step 4: E Quality
```
ÊH-oo FAH-loo een-GLÊS ee por-too-GÊS.
```

Applied:
- `inglês` (ends -ês) → Rule 2 → GLES → **GLÊS**
- `português` (ends -ês) → Rule 2 → GES → **GÊS**

---

## Key Design Decisions

### Why Track Original Words?
The E quality rules need the original Portuguese spelling to determine context:
- "brasileiro" contains "ei" → use É
- "inglês" ends in "ês" → use Ê

### Why Use Dictionary + Algorithm?
- **Dictionary**: Fast lookup for common words, handles irregularities
- **Algorithm**: Scales to unknown words, maintains consistency

### Why Apply É/Ê Last?
- Earlier steps don't have concept of vowel quality
- Original word structure determines quality
- Applying at end prevents transformations from breaking rules

---

## File Locations

### Python Implementation
- **Main functions**: `utils/annotate_pronunciation.py`
  - `annotate_pronunciation()` - Step 1
  - `format_substitution()` - Step 2
  - `format_dictionary_style()` - Steps 3-4 (main entry point)
  - `apply_e_quality_to_phonetic()` - Step 4

### JavaScript Implementation
- **Main functions**: `js/pronunciation-annotator.js`
  - `annotatePronunciation()` - Step 1
  - (format_substitution is inlined in formatDictionaryStyle)
  - `formatDictionaryStyle()` - Steps 2-4 (main entry point)
  - `applyEQualityToPhonetic()` - Step 4

### Documentation
- **Pronunciation rules**: `PRONUNCIATION_RULES.md`
- **E vowel quality**: `docs/E_VOWEL_QUALITY_RULES.md`
- **Substitution reference**: `docs/UNIT_1_SUBSTITUTION_REFERENCE.md`

---

## Usage

### Python
```python
from utils.annotate_pronunciation import format_dictionary_style

phonetic = format_dictionary_style("Eu sou brasileiro.")
# Returns: "ÊH-oo SOH brah-zee-LÉH-roo."
```

### JavaScript
```javascript
const phonetic = formatDictionaryStyle("Eu sou brasileiro.");
// Returns: "ÊH-oo SOH brah-zee-LÉH-roo."
```

---

## Future Enhancements

Potential improvements:
1. **Stress detection** - Automatically identify stressed syllables
2. **Syllabification** - Proper syllable boundary detection
3. **O vowel quality** - Distinguish open ó vs closed ô
4. **Regional variants** - Support for different Brazilian accents
5. **Performance** - Cache frequently-used transformations
