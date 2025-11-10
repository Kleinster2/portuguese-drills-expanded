# Substitution Mode

## Overview

The pronunciation annotator now supports **Substitution Mode** in both Python and JavaScript versions. This mode shows the phonetic realization by replacing original text with how it's actually pronounced.

## Two Modes

### 1. Annotation Mode (Default)
Shows phonetic guides using forward slash notation:
```
Input:  Eu sou professor.
Output: Eu sou professor/oh/.
```

### 2. Substitution Mode
Replaces original text with phonetic realization:
```
Input:  Eu sou professor.
Output: Eu sou professoh.
```

## Usage

### Python

```python
from annotate_pronunciation import annotate_pronunciation, format_substitution

# Step 1: Annotate the text
text = "Eu sou professor."
annotated = annotate_pronunciation(text)
# Result: "Eu sou professor/oh/."

# Step 2: Format with substitution
phonetic = format_substitution(annotated)
# Result: "Eu sou professoh."
```

### JavaScript (Web-based tool)

The web-based Pronunciation Annotator (index.html) includes a "Substitution Mode" checkbox:
- Unchecked: Shows annotations in brackets `[oh]`
- Checked: Shows phonetic substitutions `professoh`

## Key Transformations

| Rule | Pattern | Example | Substitution |
|------|---------|---------|--------------|
| Final -o | o → u | sou → sou/u/ | su |
| Final -or | or → oh | professor → professor/oh/ | professoh |
| Final -e | e → i | de → de/i/ | di |
| Palatalization | de → dji | de → de/dji/ | dji |
| Final -te | te → tchi | contente → contente/tchi/ | contentchi |
| Nasal com | com → coun | com → com/coun/ | coun |
| Nasal um/uma | um → ũm | um → um/ũm/ | ũm |
| Nasal -em | também → eyn | também → também/eyn/ | tambeyn |

## Examples

### Example 1: Simple sentence
```
Original:    Eu trabalho no Brasil.
Annotated:   Eu trabalho/u/ no/u/ Brasil/u/.
Substituted: Eu trabalhu nu Brasilu.
```

### Example 2: Palatalization
```
Original:    De manhã eu falo português.
Annotated:   De manhã eu falo/u/ português.
Substituted: De manhã eu falu português.
```

### Example 3: Nasal vowels
```
Original:    Eu tenho um cachorro.
Annotated:   Eu tenho/u/ um/ũm/ cachorro/u/.
Substituted: Eu tenhu ũm cachorru.
```

### Example 4: Combined transformations
```
Original:    Eu sou professor de português com a Sofia.
Annotated:   Eu sou professor/oh/ de/dji/ português com/coun/ a Sofia.
Substituted: Eu sou professoh dji português coun a Sofia.
```

## Demonstration

Run the demo script to see both modes side by side:

```bash
python utils/demo_substitution.py
```

Output shows:
- Original text
- Annotated version (with /notation/)
- Substituted version (phonetic realization)

## Use Cases

### Annotation Mode
- **Learning materials**: Show pronunciation guides alongside original text
- **Reference**: Quick lookup for pronunciation patterns
- **Documentation**: Explain pronunciation rules

### Substitution Mode
- **Phonetic guides**: Show actual pronunciation
- **Practice material**: Help learners see phonetic spelling
- **Comparison**: Compare orthography vs. pronunciation
- **Content generation**: Create phonetic versions of lessons

## Version History

- **v1.7** (2025-01-10): Added `format_substitution()` function to Python script
- **v1.6** (2025-01-09): Updated to forward slash notation `/notation/`
- **v1.5** (earlier): Added Rule 1b for -or → /oh/

## Files

- **Python**: `utils/annotate_pronunciation.py` (v1.7)
- **JavaScript**: `js/pronunciation-annotator.js` (v1.6)
- **Web tool**: `index.html` (Pronunciation Annotator section)
- **Demo**: `utils/demo_substitution.py`

## Notes

Both Python and JavaScript implementations use identical logic to ensure consistent output across platforms.
