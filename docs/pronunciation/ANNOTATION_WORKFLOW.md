# Annotation Workflow - Programmatic Generation

**Version**: 2.0
**Last Updated**: 2025-01-07

## Overview

The syllabus uses a **two-file system** where authors edit clean Portuguese and annotations are generated automatically.

### Files

```
SYLLABUS_PHASE_1.source.md  ← EDIT THIS (clean Portuguese)
SYLLABUS_PHASE_1.md         ← GENERATED (with annotations)
```

### Benefits

✅ **Easier authoring** - Write clean Portuguese without annotation syntax
✅ **Zero annotation bugs** - 100% consistent application of all 6 rules
✅ **Preserves editorial control** - Manual transformations (\_Sô\_, \_djônibus\_) are kept
✅ **Automatic updates** - Change one rule, regenerate everywhere

---

## Quick Start

### Editing Content

**1. Edit the source file:**
```bash
vim SYLLABUS_PHASE_1.source.md
```

Write clean Portuguese - no annotations needed:
```markdown
**Step 1:**
```
Eu sou o John.
Eu sou americano.
Eu moro em Nova York.
```
```

**2. Generate annotated version:**
```bash
cd utils
python generate_annotated_syllabus.py
```

**3. Review the output:**
```markdown
**Step 1:**
```
Eu sou o[_u_] John.
Eu sou americano[_u_].
Eu moro[_u_] em[_eyn_] Nova York.
```
```

**4. Commit both files:**
```bash
git add SYLLABUS_PHASE_1.source.md SYLLABUS_PHASE_1.md
git commit -m "Add new examples to Unit X"
```

---

## What's Manual vs. Automatic

### Manual (Author Writes)

**All 5 steps:**
- ✅ Step 1 content
- ✅ Step 2 content (drop "Eu")
- ✅ Step 3 sentence combining
- ✅ Step 4 reductions (`Sô`, `Tô`, `Vô`, `viajá`, `pro`)
- ✅ Step 5 coalescence (`djônibus`, `navenida`, `Gostchi`)

**Transformations (italic words):**
- ✅ `_Sô_`, `_Tô_`, `_Vô_` (vowel reductions)
- ✅ `_viajá_`, `_falá_` (infinitive dropping)
- ✅ `_djônibus_`, `_Gostchi_` (coalescence)
- ✅ `_pro_`, `_navenida_` (contractions, sandhi)

### Automatic (Script Adds)

**Pronunciation annotations:**
- ✅ `o` → `o[_u_]` (Rule 1: Final -o)
- ✅ `e` → `e[_i_]` (Rule 2: Final -e)
- ✅ `de` → `de[_dji_]` (Rule 3: Palatalization)
- ✅ `Facebook` → `Facebook[_i_]` (Rule 4: Epenthesis)
- ✅ `com` → `com[_coun_]` (Rule 5: Nasal vowels)
- ✅ `futebol` → `futebo~~l~~[_u_]` (Rule 6: L vocalization)

---

## Authoring Workflow

### Adding a New Unit

**1. Create content in source file:**
```markdown
## Unit 9: Eu quero

**Step 1:**
```
Eu quero café.
Eu quero viajar.
```

**Step 4:**
```
Quero café.
Quero _viajá_.
```
```

**Notice**: You typed `_viajá_` manually (reduction), but no `[_u_]` annotations.

**2. Generate annotations:**
```bash
cd utils
python generate_annotated_syllabus.py
```

**3. Output in SYLLABUS_PHASE_1.md:**
```markdown
## Unit 9: Eu quero

**Step 1:**
```
Eu quero[_u_] café.
Eu quero[_u_] viajar.
```

**Step 4:**
```
Quero[_u_] café.
Quero[_u_] _viajá_.
```
```

**Notice**: Annotations added automatically, `_viajá_` preserved.

### Updating Existing Content

**1. Edit source (clean Portuguese):**
```diff
- Eu sou brasileiro.
+ Eu sou brasileiro de São Paulo.
```

**2. Regenerate:**
```bash
python utils/generate_annotated_syllabus.py
```

**3. Commit:**
```bash
git add SYLLABUS_PHASE_1.source.md SYLLABUS_PHASE_1.md
git commit -m "Add city of origin to Brazilian example"
```

---

## Advanced Usage

### Changing Annotation Style

To change notation system-wide (e.g., `com[_coun_]` → `com[_kõw_]`):

**1. Update rule in `utils/annotate_pronunciation.py`:**
```python
# Old
text = re.sub(r'\b(com)(?!\[)\b', r'com[_coun_]', text)

# New
text = re.sub(r'\b(com)(?!\[)\b', r'com[_kõw_]', text)
```

**2. Regenerate syllabus:**
```bash
cd utils
python generate_annotated_syllabus.py
```

**3. All instances updated automatically!**

### Recreating Source from Annotated

If you only have the annotated file:

```bash
cd utils
python strip_annotations.py
```

Creates: `SYLLABUS_PHASE_1.source.md` (clean Portuguese)

---

## Scripts Reference

### `strip_annotations.py`

**Purpose**: Remove annotations to create clean source

**Input**: `SYLLABUS_PHASE_1.md` (annotated)
**Output**: `SYLLABUS_PHASE_1.source.md` (clean)

**What it removes**:
- Bracket annotations: `[_u_]`, `[_dji_]`, etc.
- Strikethrough: `~~l~~` → `l`

**What it preserves**:
- Italic transformations: `_Sô_`, `_djônibus_`
- All markdown structure
- All prose text

**Usage**:
```bash
cd utils
python strip_annotations.py
```

**Output example**:
```
📖 Reading ../SYLLABUS_PHASE_1.md...
🧹 Stripping annotations...
💾 Writing ../SYLLABUS_PHASE_1.source.md...

✅ Success!
   Original: 61,443 characters
   Clean:    57,416 characters
   Removed:  4,027 characters (6.6% annotations)
```

### `generate_annotated_syllabus.py`

**Purpose**: Add annotations to create public syllabus

**Input**: `SYLLABUS_PHASE_1.source.md` (clean)
**Output**: `SYLLABUS_PHASE_1.md` (annotated)

**What it adds**:
- All 6 pronunciation rule annotations
- Applied via `annotate_pronunciation()` function

**What it preserves**:
- Italic transformations: `_Sô_`, `_Tô_`, etc.
- All manual editorial choices

**Usage**:
```bash
cd utils
python generate_annotated_syllabus.py
```

**Output example**:
```
📖 Reading clean source: ../SYLLABUS_PHASE_1.source.md...
🔍 Finding Portuguese code blocks...
   Found 36 code blocks to annotate
✨ Applying pronunciation annotations...
💾 Writing annotated output: ../SYLLABUS_PHASE_1.md...

✅ Success!
   Source:     57,416 characters
   Annotated:  65,645 characters
   Added:      8,229 characters (14.3% annotations)
   Processed:  36 code blocks
```

---

## Troubleshooting

### Issue: Annotation missing on a word

**Check**: Is it in an exception list?

**File**: `utils/annotate_pronunciation.py`

**Exception lists**:
- `STRESSED_FINAL`: café, você, metrô, avô
- `TILDE_WORDS`: são, irmão, não, pão
- `PROPER_NOUNS`: Miami, John, Sarah, Carlos, Brasil

**Solution**: Remove from exception list or add special case rule.

### Issue: Proper noun getting annotated

**Check**: Is it in `PROPER_NOUNS` list?

**Add to list**:
```python
PROPER_NOUNS = {
    'Miami', 'John', 'Sarah', 'Carlos', 'Brasil', 'Brooklyn',
    'YourNewProperNoun',  # Add here
}
```

### Issue: Wrong annotation applied

**Check**: Rule order in `annotate_pronunciation()` function

**Order matters**:
1. Rule 6b (mid-word L) - dictionary
2. Rule 6a (final L) - regex
3. Rule 5 (nasal vowels)
4. Rule 4 (epenthesis)
5. Rule 3 (palatalization)
6. Rule 2 (final -e)
7. Rule 1 (final -o)

Later rules can override earlier ones.

---

## Git Workflow

### Standard Edit

```bash
# 1. Edit source
vim SYLLABUS_PHASE_1.source.md

# 2. Generate
python utils/generate_annotated_syllabus.py

# 3. Review
git diff SYLLABUS_PHASE_1.md

# 4. Commit both
git add SYLLABUS_PHASE_1.source.md SYLLABUS_PHASE_1.md
git commit -m "Update Unit 3 examples"
git push
```

### Rule Change

```bash
# 1. Update rule
vim utils/annotate_pronunciation.py

# 2. Regenerate
python utils/generate_annotated_syllabus.py

# 3. Review changes
git diff SYLLABUS_PHASE_1.md

# 4. Commit all three
git add utils/annotate_pronunciation.py SYLLABUS_PHASE_1.md
git commit -m "Update nasal vowel notation style"
git push
```

---

## Best Practices

### ✅ DO

- Edit only the `.source.md` file
- Regenerate after every edit
- Commit both files together
- Review generated output before committing
- Use clean Portuguese (easier to read/edit)

### ❌ DON'T

- Don't manually edit `SYLLABUS_PHASE_1.md` (it will be overwritten)
- Don't add annotations to `.source.md` (script adds them)
- Don't commit only one file (keep them in sync)
- Don't skip regeneration (source and output can diverge)

---

## Migration from Manual System

If you have existing manual annotations:

**1. Create source file:**
```bash
cd utils
python strip_annotations.py
```

**2. Verify source looks clean:**
```bash
head -50 SYLLABUS_PHASE_1.source.md
```

**3. Regenerate:**
```bash
python generate_annotated_syllabus.py
```

**4. Compare with original:**
```bash
diff SYLLABUS_PHASE_1.md.backup SYLLABUS_PHASE_1.md
```

**Expected differences**:
- Proper nouns: May have fewer annotations (correct)
- Consistency: More uniform annotation application
- Size: May be slightly larger (more thorough)

**5. Commit new system:**
```bash
git add SYLLABUS_PHASE_1.source.md SYLLABUS_PHASE_1.md utils/*.py
git commit -m "Migrate to programmatic annotation system"
```

---

## Related Documentation

- **[annotate_pronunciation.py](../utils/annotate_pronunciation.py)** - Core annotation engine
- **[PRONUNCIATION_RULES.md](../PRONUNCIATION_RULES.md)** - Complete rule reference
- **[README_ANNOTATOR.md](../utils/README_ANNOTATOR.md)** - Script API documentation
- **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** - Technical architecture

---

## Version History

**v2.0** (2025-01-07)
- Introduced programmatic annotation system
- Created two-file workflow (.source.md → .md)
- Automated all 6 pronunciation rules

**v1.1** (2025-01-07)
- Manual annotation with italic formatting
- Short/long nasal vowel distinction

**v1.0** (2024-12-XX)
- Initial manual annotation system

---

**Workflow Version**: 2.0
**Status**: Production ready
**Maintainer**: Portuguese Language Drills project
