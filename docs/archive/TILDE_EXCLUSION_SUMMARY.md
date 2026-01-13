# Tilde Word Exclusion - Feature Summary

## Rationale

Words with tildes (ã, õ) already show nasalization explicitly in the orthography, so they don't need pronunciation annotations.

**Why?**
- `irmão` - the tilde already shows it's nasal
- `violões` - the tilde + `ões` already shows nasalization
- `manhã` - the tilde clearly marks the nasal vowel

Adding `[_is_]` or other annotations to these words would be:
1. **Redundant** - the tilde already does the job
2. **Cluttered** - makes text harder to read
3. **Pedagogically confusing** - students might wonder why we're marking what's already marked

## Implementation

### Before (v1.3)
```python
def has_tilde(word: str) -> bool:
    """Check if word has tilde (exception to Rule 6)."""
    return any(c in word for c in 'ãõáéíóúâêôà') or word.lower() in TILDE_WORDS
```

**Problem**: Checked for ALL accented vowels (á, é, í, ó, ú), not just nasal tildes

### After (v1.4)
```python
def has_tilde(word: str) -> bool:
    """Check if word has nasal tilde (ã, õ) - don't annotate these words."""
    return any(c in word for c in 'ãõ')
```

**Solution**: Only check for nasal tildes (ã, õ)

## Changes Applied

### Rule 1 (Final -o → [_u_])
```python
# Before
if is_stressed_final(word):
    return word

# After
if is_stressed_final(word) or has_tilde(word):
    return word
```

### Rule 2 (Final -e → [_i_], -es → [_is_])
```python
# Before
if is_stressed_final(word):
    return word

# After
if is_stressed_final(word):
    return word
if has_tilde(word):
    return word
```

### Rule 5 (-am → [_ãwn_])
**Already had tilde check** ✓

## Test Results

### Simple Tests

**Test 1**: Basic family vocabulary
```
Before:  Eu tenho dois irmãos e três irmãs.
After:   Eu tenho[_u_] dois irmãos e[_i_] três irmãs.
```
✓ `irmãos` - no annotation
✓ `irmãs` - no annotation

**Test 2**: Common words
```
Before:  O pão está bom.
After:   O[_u_] pão está bom[_boun_].
```
✓ `pão` - no annotation

**Test 3**: Nationality
```
Before:  Os alemães falam alemão.
After:   Os[_us_] alemães falam[_ãwn_] alemão.
```
✓ `alemães` - no annotation
✓ `alemão` - no annotation

**Test 4**: Breakfast
```
Before:  Tenho pães e café pela manhã.
After:   Tenho[_u_] pães e[_i_] café pela manhã.
```
✓ `pães` - no annotation
✓ `manhã` - no annotation

### Comprehensive Test (New Vocabulary Paragraph)

**Before v1.4** (with tilde annotations):
- Annotated length: 1,924 characters
- Annotations added: 590 characters (44.2%)
- Total annotations: 98

**After v1.4** (without tilde annotations):
- Annotated length: 1,894 characters
- Annotations added: 560 characters (42.0%)
- Total annotations: 93

**Improvement**:
- **5 fewer annotations** (cleaner output!)
- **30 fewer characters** (2.2% reduction)
- **Same information** (tildes already show nasalization)

**Words now correctly excluded**:
- `violões` - was `violões[_is_]`, now just `violões` ✓
- `canções` - was `canções[_is_]`, now just `canções` ✓
- `regiões` - was `regiões[_is_]`, now just `regiões` ✓
- `questões` - was `questões[_is_]`, now just `questões` ✓
- `reuniões` - was `reuniões[_is_]`, now just `reuniões` ✓

## Common Tilde Words

### Singular
- **People**: irmão, irmã, cristão, cidadão, órfão
- **Food**: pão, maçã, melão, limão
- **Body parts**: mão, coração
- **Other**: não, são, chão, verão

### Plural
- **-ões**: violões, canções, regiões, questões, reuniões, aviões, caminhões
- **-ães**: pães, alemães, cães, capitães, pães
- **-ãos**: irmãos, mãos, cristãos, cidadãos, órfãos
- **-ãs**: irmãs, maçãs, rãs

### Other forms
- **-ã**: manhã, lã, maçã, irmã
- **-ão**: (many words ending in -ão as shown above)

## Pedagogical Impact

### Student Perspective

**Before**: "Why is `violões[_is_]` annotated? Doesn't the tilde already show it's nasal?"

**After**: `violões` - clean, uncluttered, the tilde speaks for itself

### Learning Curve

1. **See the tilde** (ã, õ) → Know it's nasal
2. **Don't see the tilde** → Look for annotation `[_ãwn_]`, `[_eyn_]`, etc.

This creates a clear, consistent pattern:
- **Explicit orthography** (tilde) = no annotation needed
- **Hidden pronunciation** (no tilde) = annotation needed

## Summary

✅ **Cleaner output** - 5% fewer annotations on complex text
✅ **Pedagogically sound** - don't annotate what's already explicit
✅ **Automatic detection** - works for all tilde words, not just hardcoded list
✅ **Consistent** - applied across all rules (1, 2, 5)
✅ **Well-tested** - passes all test cases (simple + comprehensive)

**Version**: 1.3 → 1.4
**Date**: 2025-01-07
**Impact**: Production-ready improvement! 🎉
