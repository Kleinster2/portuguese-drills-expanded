# Brazilian Portuguese Pronunciation Annotator

**Version:** 1.1
**Last Updated:** 2025-01-07

## Overview

Automated tool to apply 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4), adding compact bracket notation to show obligatory pronunciation changes.

## Usage

### Command Line

```bash
# Run test examples
python utils/annotate_pronunciation.py

# Use in your own script
from utils.annotate_pronunciation import annotate_pronunciation

text = "Eu sou brasileiro de São Paulo."
annotated = annotate_pronunciation(text)
print(annotated)
# Output: Eu sou brasileiro[_u_] de[_dji_] São[_u_] Paulo[_u_].
```

### API

```python
annotate_pronunciation(text: str, skip_if_annotated: bool = True) -> str
```

**Parameters:**
- `text`: Portuguese text to annotate
- `skip_if_annotated`: If True, skip text that already has annotations (default: True)

**Returns:**
- Annotated text with pronunciation markers

## Rules Applied

### Rule 1: Final unstressed -o → [_u_]
- `americano` → `americano[_u_]`
- `o` (article) → `o[_u_]`
- `do` (de+o) → `do[_u_]`

### Rule 2: Final unstressed -e → [_i_]
- `nome` → `nome[_i_]`
- `e` (and) → `e[_i_]`

### Rule 3: Palatalization
- `de` → `de[_dji_]` (ALWAYS)
- `contente` → `contente[_tchi_]`

### Rule 4: Epenthetic [_i_]
- `Facebook` → `Facebook[_i_]`
- `Internet` → `Internet[_chi_]`
- `iPad` → `iPad[_ji_]`

### Rule 5: Nasal vowel endings
- `em` → `em[_eyn_]`
- `com` → `com[_oun_]`
- `um/uma` → `um[_ũm_]`/`uma[_ũma_]`
- `também` → `também[_eyn_]`

### Rule 6: Syllable-final L → [_u_]
- **6a (Simple)**: `futebol` → `futebo~~l~~[_u_]`
- **6b (Complex)**: `alto` → `alto[_auto_]`

## NOT Applied (Optional - Step 5 Only)

### Coalescence
- **NOT annotated in Steps 1-4**: `de ônibus` → `de[_dji_] ônibus` (two separate words)
- **Step 5 only**: `de ônibus` → `djônibus` (coalescence written directly)

## Exceptions

### Stressed Words (Rules 1/2 don't apply)
- `café`, `você`, `metrô`, `avô`

### Tilde Words (Rule 6 doesn't apply)
- `são`, `irmão`, `não`, `pão`

### Proper Nouns
- Most proper nouns are not annotated
- Exception: `Brasil` → `Brasi~~l~~[_u_]`

## Expandable Dictionaries

### Rule 6b Words (Mid-word L)
Add high-frequency words as needed:

```python
RULE_7B_WORDS = {
    'volta': 'volta[_vouta_]',
    'voltar': 'voltar[_voutar_]',
    'último': 'último[_úutimu_]',
    # Add more as encountered
}
```

### Borrowed Words (Rule 4)
Add new borrowed words:

```python
BORROWED_WORDS = {
    'WhatsApp': 'WhatsApp[_i_]',
    # Add more as needed
}
```

## Testing

The script includes built-in test cases. Run:

```bash
python utils/annotate_pronunciation.py
```

Expected output:
```
Original:  Eu sou o John.
Annotated: Eu sou o[_u_] John.

Original:  Eu gosto de futebol.
Annotated: Eu gosto[_u_] de[_dji_] futebo~~l~~[_u_].
```

## How It Works

### Annotation Flow

1. **Rule 6b** (dictionary): Mid-word L transformations
2. **Rule 6a**: Word-final L → `~~l~~[_u_]`
3. **Rule 5**: Nasal vowels
4. **Rule 4**: Epenthetic vowels on borrowed words
5. **Rule 3**: Palatalization (de → de[_dji_])
6. **Rule 2**: Final -e → [_i_]
7. **Rule 1**: Final -o → [_u_]

**Note**: Coalescence (de ônibus → djônibus) is NOT applied in this script. It is an optional feature for Step 5 (phonetic orthography) only.

### Protection Mechanism

The script uses a bracket protection system to prevent nested annotations:
- Existing `[...]` content is temporarily replaced with placeholders
- Rules are applied to unprotected text only
- Protected content is restored at the end

This prevents: `com` → `com[_oun_]` → `com[o[_u_]un]` ❌
Correct result: `com` → `com[_oun_]` ✅

## Limitations

- **Syllabification**: Rule 6b requires manual dictionary for mid-word L
- **Context-free**: Cannot handle pronunciation variations based on meaning
- **Dialectal**: Optimized for Brazilian Portuguese (BP)
- **No coalescence**: Coalescence is intentionally NOT applied (optional feature for Step 5 only)

## Future Enhancements

- [ ] Add command-line flags for selective rule application
- [ ] Batch processing for files
- [ ] Export statistics (coverage, rule frequency)
- [ ] Integration with syllabus validation

## Related Documentation

- **[PRONUNCIATION_RULES.md](../PRONUNCIATION_RULES.md)** - Complete rule reference
- **[SYLLABUS_COMPONENTS.md](../SYLLABUS_COMPONENTS.md)** - Pedagogical context

## License

Part of the Portuguese Language Drills project.
