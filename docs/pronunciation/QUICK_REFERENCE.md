# Quick Reference Guide - Brazilian Portuguese Pronunciation

**Version**: 1.1 | **Last Updated**: 2025-01-07

## 6 Obligatory Pronunciation Rules

### Rule 1: Final unstressed -o → [_u_]
```
americano    → americano[_u_]
o (article)  → o[_u_]
gosto        → gosto[_u_]
```
**Exception**: Stressed words (avô, metrô)

### Rule 2: Final unstressed -e → [_i_]
```
nome   → nome[_i_]
e      → e[_i_]
grande → grande[_i_]
```
**Exception**: Stressed words (você, café)

### Rule 3: Palatalization
```
de       → de[_dji_]  (ALWAYS)
contente → contente[_tchi_]
```

### Rule 4: Epenthetic [_i_]
```
Facebook → Facebook[_i_]
Internet → Internet[_chi_]
iPad     → iPad[_ji_]
```

### Rule 5: Nasal vowel endings

#### Short words (show full syllable)
```
bem → bem[_beyn_]
sem → sem[_seyn_]
tem → tem[_teyn_]
com → com[_coun_]
bom → bom[_boun_]
som → som[_soun_]
```

#### Long words (show ending only)
```
também → também[_eyn_]
alguém → alguém[_eyn_]
```

#### Other patterns
```
-om → [_oun_]  (som, bom)
-im → [_ing_]  (sim, assim)
-um → [_ũm_]   (um)
-am → [_ãu_]   (falam)
```

### Rule 6: Syllable-final L → [_u_]

#### Word-final L
```
Brasil   → Brasi~~l~~[_u_]
futebol  → futebo~~l~~[_u_]
possível → possíve~~l~~[_u_]
```

#### Mid-word L (high-frequency words)
```
alto   → alto[_auto_]
volta  → volta[_vouta_]
voltar → voltar[_voutar_]
```
**Exception**: Words with tilde (não, são, irmão)

---

## Visual Formatting System

### Regular Font
Standard Portuguese orthography
```
Eu sou americano.
```

### Italic Annotations: `[_notation_]`
Pronunciation guidance (Steps 2-5)
```
Eu sou[_u_] americano[_u_].
```

### Italic Transformations: `_word_`
Phonetic spellings (Steps 4-5)
```
_Sô_ americano[_u_].
```

**Principle**: If it doesn't exist as standard Portuguese, it's italicized.

---

## 5-Step Pedagogical Progression

### Example: "I am John. I am American, from Miami."

**Step 1: Standard Portuguese Orthography**
```
Eu sou o John. Sou americano, de Miami.
```

**Step 2: Pronunciation Markers**
```
Eu sou[_u_] o[_u_] John. Sou[_u_] americano[_u_], de[_dji_] Miami.
```

**Step 3: Pronunciation Markers (repeated)**
```
Eu sou[_u_] o[_u_] John. Sou[_u_] americano[_u_], de[_dji_] Miami.
```

**Step 4: Dropping/Elision (rule-based)**
```
_Sô_ o[_u_] John. _Sô_ americano[_u_], de[_dji_] Miami.
```

**Step 5: Full Colloquial Speech**
```
_Sô_ John. _Sô_ americano[_u_], _dji_ Miami.
```

---

## Common Reductions (Step 4+)

### Verb Reductions
```
sou    → _Sô_
estou  → _Tô_
vou    → _Vô_
```

### Infinitive Dropping
```
falar   → _falá_
viajar  → _viajá_
estudar → _estudá_
```

### Preposition Reduction
```
para o → _pro_[_u_]
```

---

## Coalescence (Step 5 only)

### Common Patterns
```
de ônibus      → _djônibus_
de estudar     → _djistudá_
Gosto de       → _Gostchi_
na avenida     → _navenida_
Tenho um       → _Tenhu_[_ũm_]
pouco          → _pocu_
futebol        → _futebou_
```

---

## Glossary Translation Policy

### ✅ DO TRANSLATE

**Non-cognates**:
```
cachorro (m) - dog
irmão (m)    - brother
irmã (f)     - sister
```

**Function words**:
```
de  - from, of
com - with
e   - and
```

**Verbs**:
```
sou   - I am
tenho - I have
moro  - I live
```

**State adjectives**:
```
casado (m) / casada (f)     - married
solteiro (m) / solteira (f) - single
```

### ❌ DON'T TRANSLATE

**Perfect cognates**:
```
analista
música
restaurante
hotel
```

**Proper nouns**:
```
Miami
Brasil
Nova York
```

**Transparent derivatives**:
```
brasileiro (from Brasil)
americano (from América)
```

---

## Script Usage

### Annotate Single Sentence
```python
from utils.annotate_pronunciation import annotate_pronunciation

text = "Eu sou brasileiro de São Paulo."
annotated = annotate_pronunciation(text)
print(annotated)
# Output: Eu sou[_u_] brasileiro[_u_] de[_dji_] São[_u_] Paulo[_u_].
```

### Batch Update Syllabus
```bash
cd utils
python update_syllabus_annotations.py
```

### Run Tests
```bash
cd utils
python annotate_pronunciation.py
```

---

## File Structure

```
portuguese-drills-expanded/
├── PRONUNCIATION_RULES.md          # Complete rule documentation
├── SYLLABUS_PHASE_1.md             # 8 units with 5-step progression
├── utils/
│   ├── annotate_pronunciation.py   # Annotation engine
│   ├── update_syllabus_annotations.py  # Batch processor
│   └── README_ANNOTATOR.md         # Script documentation
└── docs/
    ├── CHANGELOG.md                # Version history
    ├── SYSTEM_ARCHITECTURE.md      # Technical architecture
    └── QUICK_REFERENCE.md          # This file
```

---

## Common Patterns Cheat Sheet

### Articles
```
o  → o[_u_]
a  → (no change)
os → os[_us_]
as → (no change)
```

### Contractions
```
do  (de + o)  → do[_u_]
da  (de + a)  → (no change)
no  (em + o)  → no[_u_]
na  (em + a)  → (no change)
```

### High-Frequency Words
```
muito  → muito[_u_]
pouco  → pouco[_u_]
tudo   → tudo[_u_]
nada   → (no change)
sempre → sempre[_i_]
nunca  → (no change)
```

### Verbs (eu form)
```
sou      → sou[_u_]
tenho    → tenho[_u_]
moro     → moro[_u_]
trabalho → trabalho[_u_]
falo     → falo[_u_]
gosto    → gosto[_u_]
estou    → estou[_u_]
vou      → vou[_u_]
```

---

## Troubleshooting

### Issue: Nested annotations
**Example**: `com[o[_u_]un]`
**Solution**: Bracket protection mechanism prevents this automatically

### Issue: Stressed words getting annotated
**Example**: `café` → `café[_i_]` ❌
**Solution**: Add to exception list or manually verify

### Issue: Proper nouns getting annotated
**Example**: `Paulo` → `Paulo[_u_]` (may or may not be desired)
**Solution**: Proper nouns are generally NOT annotated except high-frequency ones like `Brasil`

### Issue: L vocalization not working
**Check**:
1. Is the word in RULE_6B_WORDS dictionary? (for mid-word L)
2. Does the word have a tilde? (exception: são, não, irmão)
3. Is the L truly syllable-final?

---

## Quick Command Reference

```bash
# Annotate syllabus
cd utils && python update_syllabus_annotations.py

# Run tests
cd utils && python annotate_pronunciation.py

# Check git status
cd .. && git status

# Commit changes
git add . && git commit -m "Your message"

# Push to remote
git push
```

---

## Keyboard Shortcuts for Markdown Italics

**In markdown editors**:
- Select text → `Ctrl/Cmd + I` → Wraps in `_text_`
- Type: `_text_` → Renders as: *text*

**For annotations**:
- Type: `[_u_]` → Renders as: [*u*]
- Type: `_Sô_` → Renders as: *Sô*

---

## Version Information

**Current Version**: 1.1
**Last Major Update**: 2025-01-07

**What's New in 1.1**:
- ✅ Italic formatting for all pronunciation content
- ✅ Short/long word distinction for nasal vowels
- ✅ Comprehensive glossaries for all 8 units
- ✅ Enhanced documentation

**What's in 1.0**:
- ✅ 6 obligatory pronunciation rules
- ✅ 5-step pedagogical progression
- ✅ 8 Phase 1 units (self-introduction)
- ✅ Automated annotation script

---

## Support

**Documentation**:
- Full rules: `PRONUNCIATION_RULES.md`
- Curriculum: `SYLLABUS_PHASE_1.md`
- Architecture: `docs/SYSTEM_ARCHITECTURE.md`
- Changes: `docs/CHANGELOG.md`

**Questions**: Review the comprehensive documentation files above

**Issues**: Check git history for implementation details

---

**Quick Reference Version**: 1.1
**Optimized for**: Daily usage, script reference, rule lookup
**Audience**: Developers, linguists, educators
