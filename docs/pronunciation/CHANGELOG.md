# Changelog - Brazilian Portuguese Pronunciation System

## Version 1.1 - 2025-01-07

### Major Features Added

#### 1. Italic Formatting for Visual Clarity
**Commits**: a655a3f, 096bacf

Implemented comprehensive italic formatting to distinguish between standard Portuguese orthography and pronunciation-related content.

**Two-tier visual system**:
- **Regular font**: Standard Portuguese orthography
- **Italic font**: ALL pronunciation content (annotations + phonetic transformations)

**Examples**:
```
Step 1: Eu sou o[_u_] John.
Step 4: _Sô_ o[_u_] John.
Step 5: _Sô_ John.
```

**Rationale**: Creates clear visual hierarchy across all 5 pedagogical steps, making it immediately obvious which text represents standard Portuguese vs. pronunciation guidance.

**Files affected**:
- PRONUNCIATION_RULES.md (400+ annotations updated)
- SYLLABUS_PHASE_1.md (600+ annotations updated)
- utils/README_ANNOTATOR.md
- utils/annotate_pronunciation.py

#### 2. Short vs Long Word Distinction for Nasal Vowels
**Commit**: b0fe6b7

Enhanced Rule 5 (nasal vowel endings) with different notation strategies based on word length.

**Implementation**:
- **Short words (1 syllable)**: Show full syllable with consonant for clarity
  - bem → bem[_beyn_]
  - com → com[_coun_]
  - sem → sem[_seyn_]
  - tem → tem[_teyn_]
  - bom → bom[_boun_]
  - som → som[_soun_]

- **Long words (2+ syllables)**: Show ending only
  - também → também[_eyn_]
  - alguém → alguém[_eyn_]

- **Special case - em (preposition)**: No initial consonant, just ending
  - em → em[_eyn_]

**Rationale**: High-frequency short words benefit from showing the full syllable pronunciation, while long words remain cleaner with ending-only notation.

**Files affected**:
- PRONUNCIATION_RULES.md (Rule 5 section)
- utils/annotate_pronunciation.py (apply_rule_5 function)
- SYLLABUS_PHASE_1.md (all nasal vowel instances)

#### 3. Comprehensive Unit Glossaries
**Commit**: bbee0b3

Added vocabulary reference sections to all 8 Phase 1 units (60+ total entries).

**Features**:
- Standard Portuguese orthography (no pronunciation marks)
- Selective English translations (skip obvious cognates)
- Gender marking for all nouns/adjectives: (m)/(f)
- Organized by semantic categories
- Shows verb infinitive + conjugated form taught

**Categories per glossary**:
- Verbs (infinitive + first person singular)
- Nouns (by semantic field: animals, family, places, etc.)
- Adjectives (descriptive, nationalities, etc.)
- Articles, Prepositions & Conjunctions
- Numbers, Time Expressions, Pronouns

**Example**:
```markdown
### Glossary - Unit 8: Eu tenho

#### Verbs
- ter - to have
  - (eu) tenho - I have

#### Animals (Nouns)
- cachorro (m) - dog
- gata (f) - cat

#### Numbers
- dois (m) / duas (f) - two
```

**Translation policy**:
- ✅ TRANSLATE: Non-cognates (cachorro-dog), function words (de-from/of), verbs (sou-I am), state adjectives (casado-married)
- ❌ SKIP: Perfect cognates (analista, música, restaurante), proper nouns (Miami, Brasil)

**Files affected**:
- SYLLABUS_PHASE_1.md (+143 lines)

### Technical Improvements

#### Automated Annotation Script Enhancements
**File**: utils/annotate_pronunciation.py

**Improvements**:
1. Updated Rule 5 with separate regex patterns for short/long words
2. Changed ALL output to use italic markdown notation [_content_]
3. Maintained bracket protection mechanism to prevent nested annotations

**Key functions updated**:
- `apply_rule_5()`: Nasal vowel endings with short/long distinction
- All 6 rule application functions: Output [_notation_] instead of [notation]

#### Batch Syllabus Updater
**File**: utils/update_syllabus_annotations.py (NEW)

Created utility script for re-applying pronunciation annotations to syllabus files.

**Features**:
- Finds Portuguese code blocks in markdown files
- Re-applies all 6 pronunciation rules
- Uses `skip_if_annotated=False` to force re-annotation
- Handles line-by-line processing

**Usage**:
```bash
cd utils
python update_syllabus_annotations.py
```

### Documentation Updates

#### PRONUNCIATION_RULES.md v1.1
**Updates**:
- Added short/long word distinction to Rule 5
- Updated ALL examples with italic notation (400+ instances)
- Added visual principle documentation
- Clarified OPTIONAL vs OBLIGATORY rule categories
- Enhanced examples with more high-frequency words

#### utils/README_ANNOTATOR.md v1.1
**Updates**:
- Updated all code examples with italic notation
- Added short/long word distinction documentation
- Clarified that coalescence is NOT applied (Step 5 only)

#### SYLLABUS_PHASE_1.md
**Updates**:
- Updated ALL pronunciation annotations to italic format (600+ instances)
- Applied italics to ALL phonetic transformations in Steps 4-5
- Added 8 comprehensive glossaries (one per unit)
- Fixed L vocalization notation (espanho~~l~~[_u_])

### Visual Formatting Principles

#### Markdown Italic Implementation
**Format**: `[_content_]` renders as [*content*] in markdown viewers

**Application scope**:
- **Steps 1-3**: Bracket annotations only
  - `o[_u_]`, `de[_dji_]`, `nome[_i_]`, `com[_coun_]`

- **Step 4**: Annotations + rule-based reductions
  - `_Sô_`, `_Tô_`, `_Vô_`, `_pro_`, `_viajá_`, `_falá_`

- **Step 5**: Annotations + ALL phonetic transformations
  - `_dji_`, `_djônibus_`, `_Gostchi_`, `_navenida_`, `_Tenhu_`, `_pocu_`, `_futebou_`

**Principle**: If it doesn't exist as standard Portuguese orthography, it's italicized.

### Git Commit History

1. **b0fe6b7** - "Update nasal vowel notation: show consonants in short words for clarity"
   - Implemented short/long word distinction for Rule 5
   - Updated script, documentation, and syllabus

2. **a655a3f** - "Add italic formatting to pronunciation annotations for visual clarity"
   - Changed all bracket notation from [u] to [_u_]
   - Applied to all documentation and syllabus files

3. **096bacf** - "Extend italic formatting to ALL phonetic transformations (Steps 4-5)"
   - Applied italics to phonetic spellings (Sô, Tô, dji, djônibus, etc.)
   - Created complete visual hierarchy system

4. **bbee0b3** - "Add comprehensive glossaries to all 8 Phase 1 units"
   - Added 60+ vocabulary entries across 8 units
   - Implemented selective translation policy

### Files Modified Summary

**Core data files**:
- SYLLABUS_PHASE_1.md (600+ annotation updates, 8 new glossaries)

**Documentation**:
- PRONUNCIATION_RULES.md (400+ annotation updates, new visual principles)
- utils/README_ANNOTATOR.md (example updates)

**Scripts**:
- utils/annotate_pronunciation.py (Rule 5 enhancement, italic output)
- utils/update_syllabus_annotations.py (NEW - batch processor)

**New documentation**:
- docs/CHANGELOG.md (this file)

### Breaking Changes

None. All changes are additive or cosmetic (notation improvements).

### Migration Notes

If you have custom Portuguese text using old notation style:

**Old notation**:
```
Eu sou o John.
Eu gosto de futebol.
com[oun] bem[bem]
```

**New notation**:
```
Eu sou o[_u_] John.
Eu gosto[_u_] de[_dji_] futebo~~l~~[_u_].
com[_coun_] bem[_beyn_]
```

**Migration command** (from project root):
```bash
cd utils
python update_syllabus_annotations.py
```

### Future Enhancements

Potential improvements for version 1.2:
- [ ] Command-line flags for selective rule application
- [ ] Batch processing for multiple files
- [ ] Export statistics (coverage, rule frequency)
- [ ] Integration with placement test validation
- [ ] Audio generation for annotated text
- [ ] Interactive glossary with pronunciation playback

### Statistics

**Pronunciation annotations**:
- PRONUNCIATION_RULES.md: 400+ annotations
- SYLLABUS_PHASE_1.md: 600+ annotations
- Total italic transformations: 1000+ instances

**Glossary entries**:
- Unit 1 (Eu sou): 22 entries
- Unit 2 (Eu moro): 5 entries
- Unit 3 (Eu trabalho): 3 entries
- Unit 4 (Eu falo): 7 entries
- Unit 5 (Eu gosto): 5 entries
- Unit 6 (Eu estou): 6 entries
- Unit 7 (Eu vou): 7 entries
- Unit 8 (Eu tenho): 8 entries
- **Total**: 63 vocabulary entries

### Contributors

- System design and implementation
- Pronunciation rule formalization
- Automated annotation tooling
- Documentation and pedagogical framework

---

**Version**: 1.1
**Date**: 2025-01-07
**Status**: Production ready
**License**: Part of the Portuguese Language Drills project
