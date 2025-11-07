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
# Output: Eu sou brasileiro[u] de[dji] São[u] Paulo[u].
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

### Rule 1: Final unstressed -o → [u]
- `americano` → `americano[u]`
- `o` (article) → `o[u]`
- `do` (de+o) → `do[u]`

### Rule 2: Final unstressed -e → [i]
- `nome` → `nome[i]`
- `e` (and) → `e[i]`

### Rule 3: Palatalization
- `de` → `de[dji]` (ALWAYS)
- `contente` → `contente[tchi]`

### Rule 4: Epenthetic [i]
- `Facebook` → `Facebook[i]`
- `Internet` → `Internet[chi]`
- `iPad` → `iPad[ji]`

### Rule 5: Nasal vowel endings
- `em` → `em[eyn]`
- `com` → `com[oun]`
- `um/uma` → `um[ũm]`/`uma[ũma]`
- `também` → `também[eyn]`

### Rule 6: Syllable-final L → [u]
- **6a (Simple)**: `futebol` → `futebo~~l~~[u]`
- **6b (Complex)**: `alto` → `alto[auto]`

## NOT Applied (Optional - Step 5 Only)

### Coalescence
- **NOT annotated in Steps 1-4**: `de ônibus` → `de[dji] ônibus` (two separate words)
- **Step 5 only**: `de ônibus` → `djônibus` (coalescence written directly)

## Exceptions

### Stressed Words (Rules 1/2 don't apply)
- `café`, `você`, `metrô`, `avô`

### Tilde Words (Rule 6 doesn't apply)
- `são`, `irmão`, `não`, `pão`

### Proper Nouns
- Most proper nouns are not annotated
- Exception: `Brasil` → `Brasi~~l~~[u]`

## Expandable Dictionaries

### Rule 6b Words (Mid-word L)
Add high-frequency words as needed:

```python
RULE_7B_WORDS = {
    'volta': 'volta[vouta]',
    'voltar': 'voltar[voutar]',
    'último': 'último[úutimu]',
    # Add more as encountered
}
```

### Borrowed Words (Rule 4)
Add new borrowed words:

```python
BORROWED_WORDS = {
    'WhatsApp': 'WhatsApp[i]',
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
Annotated: Eu sou o[u] John.

Original:  Eu gosto de futebol.
Annotated: Eu gosto[u] de[dji] futebo~~l~~[u].
```

## How It Works

### Annotation Flow

1. **Rule 6b** (dictionary): Mid-word L transformations
2. **Rule 6a**: Word-final L → `~~l~~[u]`
3. **Rule 5**: Nasal vowels
4. **Rule 4**: Epenthetic vowels on borrowed words
5. **Rule 3**: Palatalization (de → de[dji])
6. **Rule 2**: Final -e → [i]
7. **Rule 1**: Final -o → [u]

**Note**: Coalescence (de ônibus → djônibus) is NOT applied in this script. It is an optional feature for Step 5 (phonetic orthography) only.

### Protection Mechanism

The script uses a bracket protection system to prevent nested annotations:
- Existing `[...]` content is temporarily replaced with placeholders
- Rules are applied to unprotected text only
- Protected content is restored at the end

This prevents: `com` → `com[oun]` → `com[o[u]un]` ❌
Correct result: `com` → `com[oun]` ✅

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
