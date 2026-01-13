# System Architecture - Brazilian Portuguese Pronunciation System

**Version**: 1.1
**Last Updated**: 2025-01-07

## Overview

This document describes the architecture of the automated Brazilian Portuguese pronunciation annotation system, including the 6 obligatory pronunciation rules, pedagogical progression framework, and tooling ecosystem.

## System Components

```
portuguese-drills-expanded/
│
├── Core Documentation
│   ├── PRONUNCIATION_RULES.md        # Complete rule reference (6 obligatory rules)
│   ├── SYLLABUS_PHASE_1.md           # 8-unit curriculum with 5-step progression
│   └── SYLLABUS_COMPONENTS.md        # Pedagogical framework design
│
├── Utilities
│   ├── annotate_pronunciation.py    # Automated annotation engine (6 rules)
│   ├── update_syllabus_annotations.py # Batch syllabus re-annotator
│   └── README_ANNOTATOR.md          # Annotation tool documentation
│
├── Configuration
│   └── placement-test-questions-grammar-v1.0.json # Placement test data
│
└── Documentation (this directory)
    ├── CHANGELOG.md                 # Version history and feature log
    ├── SYSTEM_ARCHITECTURE.md       # This file
    └── PHASE_1_SELF_INTRODUCTION_TRANSFORMATION.md # Design decisions
```

## Core Architecture

### 1. Pronunciation Rule Engine

**File**: `utils/annotate_pronunciation.py`

#### Rule Processing Pipeline

```python
Input Text: "Eu sou o John. Eu gosto de futebol."
    ↓
[Rule 6b] Mid-word L transformations (dictionary-based)
    ↓
[Rule 6a] Word-final L → ~~l~~[_u_]
    "futebol" → "futebo~~l~~[_u_]"
    ↓
[Rule 5] Nasal vowel endings
    (Short words) "com" → "com[_coun_]"
    (Long words) "também" → "também[_eyn_]"
    ↓
[Rule 4] Epenthetic vowels on borrowed words
    "Facebook" → "Facebook[_i_]"
    ↓
[Rule 3] Palatalization
    "de" → "de[_dji_]"
    ↓
[Rule 2] Final unstressed -e → [_i_]
    (none in this example)
    ↓
[Rule 1] Final unstressed -o → [_u_]
    "sou" → "sou[_u_]"
    "o" → "o[_u_]"
    "gosto" → "gosto[_u_]"
    ↓
Output: "Eu sou[_u_] o[_u_] John. Eu gosto[_u_] de[_dji_] futebo~~l~~[_u_]."
```

#### Bracket Protection Mechanism

Prevents nested annotations:

```python
Step 1: Input = "com"
Step 2: Apply Rule 5 = "com[_oun_]"
Step 3: Protected content = "com[PLACEHOLDER_0]"
Step 4: Rule 1 cannot match 'o' inside placeholder
Step 5: Restore = "com[_oun_]"  ✅

WITHOUT protection:
Step 1: "com" → "com[_oun_]"
Step 2: Rule 1 matches 'o' → "com[o[_u_]un]"  ❌
```

**Implementation**:
```python
def protect_brackets(text: str) -> tuple[str, list[str]]:
    """Replace [...] with placeholders to prevent nested annotations."""
    protected = []
    def save_match(match):
        protected.append(match.group(0))
        return f"[PLACEHOLDER_{len(protected)-1}]"

    protected_text = re.sub(r'\[.*?\]', save_match, text)
    return protected_text, protected

def restore_brackets(text: str, protected: list[str]) -> str:
    """Restore protected bracket content."""
    for i, content in enumerate(protected):
        text = text.replace(f"[PLACEHOLDER_{i}]", content)
    return text
```

### 2. Rule Definitions

#### Rule 1: Final unstressed -o → [_u_]
**Frequency**: Very high (articles, pronouns, verb endings)

**Pattern**:
```python
r'\b(\w+o)(?!\[)\b'  # Match word ending in 'o', not followed by '['
```

**Examples**:
- `americano` → `americano[_u_]`
- `o` (article) → `o[_u_]`
- `do` (de+o) → `do[_u_]`

**Exceptions**:
- Stressed: `avô`, `metrô`, `café` (NOT annotated)
- Proper nouns: `Paulo`, `Mario` (NOT annotated by default)

#### Rule 2: Final unstressed -e → [_i_]
**Frequency**: High (nouns, verb endings)

**Pattern**:
```python
r'\b(\w+e)(?!\[)\b'
```

**Examples**:
- `nome` → `nome[_i_]`
- `e` (and) → `e[_i_]`
- `de` (from) → `de[_i_]` (then becomes `de[_dji_]` via Rule 3)

**Exceptions**:
- Stressed: `você`, `café`, `José`
- Palatalized: `de`, `te` (handled by Rule 3)

#### Rule 3: Palatalization
**Frequency**: Very high (`de` is most common preposition)

**Pattern**:
```python
r'\bde\b(?!\[)'     # de → de[_dji_]
r'\b(\w+)te\b(?!\[)' # -te → -te[_tchi_]
```

**Examples**:
- `de` → `de[_dji_]` (ALWAYS, in all contexts)
- `contente` → `contente[_tchi_]`

**Why "de" is always palatalized**:
- Universal in Brazilian Portuguese
- Applies regardless of following phoneme
- One of the 6 OBLIGATORY rules

#### Rule 4: Epenthetic [_i_]
**Frequency**: Medium (borrowed words ending in consonant clusters)

**Pattern**: Dictionary-based (expandable)

**Examples**:
- `Facebook` → `Facebook[_i_]`
- `Internet` → `Internet[_chi_]`
- `iPad` → `iPad[_ji_]`

**Dictionary structure**:
```python
BORROWED_WORDS = {
    'Facebook': 'Facebook[_i_]',
    'Internet': 'Internet[_chi_]',  # Also shows palatalization
    'iPad': 'iPad[_ji_]',            # Also shows palatalization of 'd'
    'WhatsApp': 'WhatsApp[_i_]',
}
```

#### Rule 5: Nasal vowel endings
**Frequency**: Very high (prepositions, verb endings)

**Two sub-strategies**:

**5a: Short words (show full syllable)**
```python
bem → bem[_beyn_]
sem → sem[_seyn_]
tem → tem[_teyn_]
com → com[_coun_]
bom → bom[_boun_]
som → som[_soun_]
```

**5b: Long words (show ending only)**
```python
também → também[_eyn_]
alguém → alguém[_eyn_]
ninguém → ninguém[_eyn_]
```

**Special case - em**:
```python
em → em[_eyn_]  # No initial consonant, just ending
```

**Other nasal patterns**:
```python
-om → [_oun_]  # som[_soun_], bom[_boun_]
-im → [_ing_]  # sim[_sing_], assim[_sing_]
-um → [_ũm_]   # um[_ũm_]
```

#### Rule 6: Syllable-final L → [_u_]
**Frequency**: Medium-high (common verbs, adjectives)

**Two implementations**:

**6a: Word-final L (regex-based)**
```python
r'\b(\w+)(l)\b(?!\[)'  # futebol → futebo~~l~~[_u_]
```
- Shows strikethrough ~~l~~ + [_u_] annotation
- Examples: `Brasil` → `Brasi~~l~~[_u_]`, `possível` → `possíve~~l~~[_u_]`

**6b: Mid-word L (dictionary-based)**
```python
RULE_6B_WORDS = {
    'alto': 'alto[_auto_]',
    'volta': 'volta[_vouta_]',
    'voltar': 'voltar[_voutar_]',
    'último': 'último[_úutimu_]',
}
```
- Requires syllabification knowledge
- Expandable dictionary for high-frequency words

**Exception**: Words with tilde don't undergo L vocalization
- `não`, `são`, `irmão`, `pão` (NOT annotated)

### 3. Pedagogical Progression Framework

**File**: `SYLLABUS_PHASE_1.md`

#### 5-Step Progressive Disclosure System

Each unit teaches ONE main verb using a 5-step progression from standard orthography to full colloquial speech.

```
Step 1: Standard Portuguese Orthography
    ↓ (Add pronunciation annotations)
Step 2: Pronunciation Markers (6 obligatory rules)
    ↓ (Add visual awareness - italics introduced)
Step 3: Pronunciation Markers (repeated for reinforcement)
    ↓ (Add rule-based reductions)
Step 4: Dropping/Elision (sou → Sô, estou → Tô)
    ↓ (Add ALL phonetic processes)
Step 5: Full Colloquial Speech (coalescence, sandhi, reductions)
```

**Example progression** (Unit 1: Eu sou):

```markdown
**Step 1: Standard Portuguese Orthography**
Eu sou o John. Sou americano, de Miami.

**Step 2: Pronunciation Markers**
Eu sou[_u_] o[_u_] John. Sou[_u_] americano[_u_], de[_dji_] Miami.

**Step 3: Pronunciation Markers (repeated)**
Eu sou[_u_] o[_u_] John. Sou[_u_] americano[_u_], de[_dji_] Miami.

**Step 4: Dropping/Elision**
_Sô_ o[_u_] John. _Sô_ americano[_u_], de[_dji_] Miami.

**Step 5: Full Colloquial Speech**
_Sô_ John. _Sô_ americano[_u_], _dji_ Miami.
```

#### Visual Formatting Hierarchy

**Regular font**: Standard Portuguese orthography
- Used in: Step 1 only, Glossaries

**Italic annotations**: `[_content_]`
- Used in: Steps 2-5 for bracket annotations
- Examples: `o[_u_]`, `de[_dji_]`, `nome[_i_]`

**Italic transformations**: `_word_`
- Used in: Steps 4-5 for phonetic spellings
- Examples: `_Sô_`, `_Tô_`, `_djônibus_`, `_Gostchi_`

**Principle**: If it doesn't exist as standard Portuguese orthography, it's italicized.

### 4. Unit Structure

Each of the 8 units follows this template:

```markdown
## Unit N: [Main Verb Phrase]

### Grammar Focus
- [Primary grammar point]
- [Secondary grammar point]

### Vocabulary Introduced
- [New words in context]

### Example Sentences

**Step 1: Standard Portuguese Orthography**
[Clean sentences]

**Step 2: Pronunciation Markers**
[Annotated sentences]

**Step 3: Pronunciation Markers (repeated)**
[Same as Step 2]

**Step 4: Dropping/Elision (rule-based)**
[With reductions: Sô, Tô, Vô, pro, viajá, etc.]

**Step 5: Full Colloquial Speech (all phonetic processes)**
[Full phonetic orthography: coalescence, sandhi, extreme reductions]

### Glossary - Unit N: [Main Verb Phrase]

#### Verbs
- [infinitive] - [English]
  - ([pronoun]) [conjugation] - [English]

#### [Category]
- [word] ([gender]) - [English if non-cognate]
```

### 5. Glossary System

**File**: `SYLLABUS_PHASE_1.md` (8 glossaries, one per unit)

#### Design Principles

1. **Standard orthography only** - No pronunciation annotations in glossaries
2. **Selective translation** - Skip obvious cognates and proper nouns
3. **Gender marking** - All nouns/adjectives marked (m)/(f)
4. **Verb forms** - Show infinitive + conjugated form taught
5. **Categorical organization** - Group by semantic field

#### Translation Policy

**✅ TRANSLATE**:
- Non-cognates: `cachorro` (dog), `irmão` (brother)
- Function words: `de` (from/of), `com` (with), `e` (and)
- Verbs: `sou` (I am), `tenho` (I have), `moro` (I live)
- State adjectives: `casado` (married), `solteiro` (single)

**❌ SKIP TRANSLATION**:
- Perfect cognates: `analista`, `música`, `restaurante`, `hotel`
- Proper nouns: `Miami`, `Brasil`, `Nova York`
- Transparent derivatives: `brasileiro` (from Brasil), `americano` (from América)

#### Category Hierarchy

```
Verbs (infinitive + first person singular)
  ↓
Nouns (organized by semantic field)
  - Animals
  - Family members
  - Places
  - Objects
  ↓
Adjectives (organized by type)
  - Nationalities
  - Descriptive
  - State adjectives
  ↓
Function Words
  - Articles
  - Prepositions
  - Conjunctions
  ↓
Other
  - Numbers
  - Time expressions
  - Pronouns
```

### 6. Batch Processing Tools

**File**: `utils/update_syllabus_annotations.py`

#### Architecture

```python
Input: SYLLABUS_PHASE_1.md
    ↓
[Regex Pattern] Find all code blocks starting with Portuguese text
    Pattern: r'```\n((?:Eu |Sou |Moro|Trabalho|Falo|Gosto|Vou |Tenho|Estou|Tô |Sô ).*?)```'
    ↓
[For each code block]
    ↓
    [Split into lines]
    ↓
    [For each line]
        ↓
        [Call annotate_pronunciation(line, skip_if_annotated=False)]
        ↓
        [Collect annotated line]
    ↓
    [Reassemble code block]
    ↓
    [Replace in original content]
    ↓
Output: Updated SYLLABUS_PHASE_1.md
```

**Usage**:
```bash
cd utils
python update_syllabus_annotations.py
```

**Key parameter**: `skip_if_annotated=False`
- Forces re-annotation even if annotations exist
- Allows updating notation style (e.g., [u] → [_u_])

## Data Flow

### Annotation Workflow

```
1. User writes Portuguese text
    ↓
2. Run annotate_pronunciation(text)
    ↓
3. Rule 6b (dictionary) → Mid-word L
    ↓
4. Rule 6a (regex) → Final L
    ↓
5. Rule 5 (regex) → Nasal vowels
    ↓
6. Rule 4 (dictionary) → Epenthetic vowels
    ↓
7. Rule 3 (regex) → Palatalization
    ↓
8. Rule 2 (regex) → Final -e
    ↓
9. Rule 1 (regex) → Final -o
    ↓
10. Output annotated text
```

### Syllabus Generation Workflow

```
1. Design curriculum (8 units, 5 steps each)
    ↓
2. Write Step 1 (standard orthography)
    ↓
3. Run batch annotator to generate Steps 2-3
    ↓
4. Manually create Steps 4-5 (phonetic transformations)
    ↓
5. Add glossaries (standard orthography)
    ↓
6. Review and validate
    ↓
7. Commit to repository
```

## Technology Stack

**Language**: Python 3.x

**Core libraries**:
- `re` - Regular expression engine for pattern matching
- `sys` - System configuration (Unicode handling on Windows)

**File formats**:
- Markdown (.md) - Documentation and syllabus
- Python (.py) - Annotation scripts
- JSON (.json) - Placement test data

**Version control**: Git + GitHub

**Deployment**: Static site (Cloudflare Pages)

## Design Decisions

### Why 6 Obligatory Rules?

These rules apply to ALL Brazilian Portuguese speakers in ALL registers:

1. **Rule 1 (Final -o)**: Universal vowel reduction
2. **Rule 2 (Final -e)**: Universal vowel raising
3. **Rule 3 (Palatalization)**: Categorical process for /de/, /te/, /di/, /ti/
4. **Rule 4 (Epenthesis)**: Phonotactic repair for borrowed words
5. **Rule 5 (Nasal vowels)**: Nasalization is phonemic in Portuguese
6. **Rule 6 (L vocalization)**: Completed sound change in Brazilian Portuguese

### Why NOT Include Coalescence as Obligatory?

Coalescence (`de ônibus` → `djônibus`) is:
- Optional (speakers can preserve word boundaries)
- Variable (depends on speech rate, formality)
- Stylistic (more common in rapid/casual speech)

Therefore: Coalescence appears ONLY in Step 5 (full colloquial speech).

### Why Italic Formatting?

Creates visual hierarchy:
- **Students immediately see**: "This is how it's written vs. this is how it's pronounced"
- **Reduces cognitive load**: No confusion between grammar and pronunciation
- **Scalable**: Works across all 5 pedagogical steps

### Why Short/Long Distinction for Nasal Vowels?

High-frequency short words benefit from full syllable annotation:
- `com[_coun_]` is clearer than `com[_oun_]` (shows the /k/ sound)
- `bem[_beyn_]` is clearer than `bem[_eyn_]` (shows the /b/ sound)

Long words remain clean:
- `também[_eyn_]` (not `também[_beyn_]`) - ending is predictable

### Why Selective Translation in Glossaries?

Pedagogical efficiency:
- **Cognates don't need translation**: Students recognize `música`, `restaurante`
- **Non-cognates DO need translation**: `cachorro` (not "catcher"!), `irmão` (not "irmao"!)
- **Focus on challenging vocabulary**: Where students actually need help

## Extension Points

### Adding New Rules

To add a new pronunciation rule:

1. **Define the rule** in `PRONUNCIATION_RULES.md`
2. **Implement the function** in `annotate_pronunciation.py`:
```python
def apply_rule_N(text: str) -> str:
    """Rule N: Description."""
    text = re.sub(r'pattern', r'replacement[_notation_]', text)
    return text
```
3. **Add to pipeline** in `annotate_pronunciation()` function
4. **Update tests** in `if __name__ == '__main__'` section
5. **Update README** with examples

### Expanding Dictionaries

**Rule 4 (Borrowed words)**:
```python
BORROWED_WORDS = {
    'Facebook': 'Facebook[_i_]',
    'WhatsApp': 'WhatsApp[_i_]',  # Add new borrowed word
}
```

**Rule 6b (Mid-word L)**:
```python
RULE_6B_WORDS = {
    'alto': 'alto[_auto_]',
    'calma': 'calma[_cauma_]',  # Add new L-vocalization word
}
```

### Adding New Units

To add a new unit to the syllabus:

1. **Choose main verb** (e.g., "Eu quero", "Eu preciso")
2. **Identify grammar focus** (e.g., verb conjugation, object pronouns)
3. **Write Step 1** (standard orthography sentences)
4. **Run batch annotator** to generate Steps 2-3
5. **Create Steps 4-5** manually (phonetic transformations)
6. **Build glossary** (new vocabulary only)
7. **Update table of contents**

## Testing Strategy

### Unit Tests (built into scripts)

**File**: `utils/annotate_pronunciation.py`

```python
if __name__ == '__main__':
    test_sentences = [
        "Eu sou o John.",
        "Eu gosto de futebol.",
        "Eu moro em Nova York com meu irmão.",
    ]

    for sentence in test_sentences:
        annotated = annotate_pronunciation(sentence)
        print(f"Original:  {sentence}")
        print(f"Annotated: {annotated}\n")
```

**Run tests**:
```bash
cd utils
python annotate_pronunciation.py
```

### Integration Tests

**Manual validation**:
1. Run batch annotator on syllabus
2. Review output for:
   - Correct rule application
   - No nested annotations
   - Consistent formatting
   - Proper exceptions (stressed words, proper nouns)

### Regression Tests

**Git-based validation**:
```bash
# After making changes, verify no unexpected modifications
git diff SYLLABUS_PHASE_1.md
git diff PRONUNCIATION_RULES.md
```

## Performance Considerations

### Regex Optimization

**Negative lookahead** prevents re-annotation:
```python
r'\b(\w+o)(?!\[)\b'  # Don't match if followed by '['
```

This avoids:
```python
"sou" → "sou[_u_]" → "sou[u[_u_]]"  ❌
```

### Dictionary vs. Regex Trade-offs

**Use regex when**:
- Pattern is regular and predictable
- High coverage with simple pattern
- Examples: Final -o, final -e, palatalization

**Use dictionary when**:
- Pattern requires syllabification knowledge
- Irregular or lexical exceptions
- Examples: Mid-word L, borrowed words

## Security Considerations

None. This is a static text processing system with no:
- User input sanitization needed
- Database access
- Network requests
- Authentication/authorization

## Maintenance

### Regular Updates

**Quarterly**:
- Review borrowed words (add new tech terms)
- Update Rule 6b dictionary (high-frequency L-words)
- Validate glossary translations

**Annually**:
- Review pedagogical effectiveness
- Update examples with current cultural references
- Expand unit coverage

### Version Control

**Semantic versioning**: MAJOR.MINOR
- **MAJOR**: Breaking changes to rule definitions or notation style
- **MINOR**: New features, rule enhancements, additional units

**Current version**: 1.1

**Version history**:
- 1.0 - Initial system with 6 rules, 8 units
- 1.1 - Italic formatting, short/long nasal distinction, glossaries

## Related Documentation

- **[PRONUNCIATION_RULES.md](../PRONUNCIATION_RULES.md)** - Complete rule reference
- **[SYLLABUS_PHASE_1.md](../SYLLABUS_PHASE_1.md)** - Full curriculum
- **[utils/README_ANNOTATOR.md](../utils/README_ANNOTATOR.md)** - Script usage guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[PHASE_1_SELF_INTRODUCTION_TRANSFORMATION.md](PHASE_1_SELF_INTRODUCTION_TRANSFORMATION.md)** - Design rationale

---

**Architecture Version**: 1.1
**Document Status**: Current
**Last Review**: 2025-01-07
