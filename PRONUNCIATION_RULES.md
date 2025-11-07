# Brazilian Portuguese Pronunciation Rules

**Version:** 1.1
**Last Updated:** 2025-01-07
**Status:** Complete Reference

---

## Overview

This document defines ALL obligatory pronunciation rules for Brazilian Portuguese used in our syllabus annotation system. These rules apply to **all registers** (formal and informal speech) and are **never optional**.

---

## Rule 1: Final Unstressed -o → [u]

**Rule**: Every word ending in unstressed -o is pronounced [u].

**Applies to**: ALL word types
- Adjectives: americano[u], brasileiro[u], casado[u], solteiro[u]
- Nouns: cachorro[u], gato[u], trabalho[u], escritório[u], São Paulo[u]
- Verbs: moro[u], falo[u], gosto[u], tenho[u], trabalho[u]
- Adverbs: como[u] (as), pouco[u] (a little)
- **Articles**: o[u] (the)
- **Contractions**: do[u] (de+o), no[u] (em+o), ao[u] (a+o)

**Stressed -o stays [o]**:
- metrô = [metro] (stressed, circumflex)
- avô = [avo] (stressed)

**Plural -os → [us]**:
- os[us] (article "the" plural)
- livros[us], amigos[us], gatos[us]
- dos[us] (de+os), nos[us] (em+os), aos[us] (a+os)

**Notation**: `word[u]` or `word[us]`

---

## Rule 2: Final Unstressed -e → [i]

**Rule**: Every word ending in unstressed -e is pronounced [i].

**Applies to**: ALL word types
- Nouns: nome[i], fome[i], ponte[i], parte[i]
- Adjectives: forte[i], grande[i], verde[i]
- Adverbs: onde[i] (where)
- **Conjunction**: e[i] (and) - ALWAYS
- **Preposition**: de[i] → but becomes de[dji] due to palatalization (see Rule 3)

**Stressed -e stays [e]**:
- café = [kafe] (stressed, accent)
- você = [vose] (stressed final syllable)

**Plural -es → [is]**:
- nomes[is], fortes[is], verdes[is]

**Notation**: `word[i]` or `word[is]`

---

## Rule 3: Palatalization of d/t before [i]

**Rule**: /d/ and /t/ become [dʒ] (dji) and [tʃ] (tchi) before [i] sounds.

### **3a: de → de[dji] (ALWAYS)**

"de" ends in -e → becomes [di] by Rule 2 → d+i palatalization applies

**Result**: de[dji] in ALL contexts, regardless of following word

Examples:
- de[dji] Miami (before /m/)
- de[dji] São Paulo (before /s/)
- de[dji] futebol (before /f/)
- de[dji] café (before /k/)

**Notation**: `de[dji]` - ALWAYS, no exceptions

### **3b: te + i → [tchi]**

When "te" is followed by [i] sounds (usually within a word at morpheme boundaries):
- contente[tchi] (conte + nte, final -e becomes [i])
- parte[i] (no palatalization, just final -e → [i])

**Note**: This is less common than de[dji] because it requires specific morphological conditions.

**Notation**: `contente[tchi]`

### **3c: ti/di sequences**

Within words, ti and di always palatalize:
- notícia: no[tchi]cia
- partida: par[tchi]da
- dia: [dji]a
- médico: mé[dji]co

**Notation**: Mark the syllable where it occurs

---

## ~~Rule 4: Coalescence~~ (REMOVED - Not Obligatory)

**Previous Rule**: Coalescence (de + ô → djô)

**Status**: **NOT ANNOTATED in Steps 1-4**

**Rationale**: Coalescence is an **optional** phonetic process that happens in colloquial speech, not an obligatory pronunciation rule.

**Steps 1-4 (Obligatory):**
```
de[dji] ônibus
```
- "de" gets palatalization only
- Two separate words

**Step 5 (Optional/Colloquial):**
```
djônibus
```
- Coalescence written directly (no brackets)
- Vowel sandhi across word boundary

**Examples of optional coalescence (Step 5 only):**
- de ônibus → djônibus
- de outro → djoutro
- para o → pro

---

## Rule 4: Epenthetic [i] on Consonant-Final Words

**Rule**: Portuguese phonotactics don't allow most consonant-final words. Borrowed words get epenthetic [i] added.

### **4a: Creates ti/di → Palatalization applies**

When epenthetic [i] creates ti or di sequences:

- **Internet** (ends -t) → Interneti → Interne[**ti**] → Internet[chi]
- **iPad** (ends -d) → iPadi → iPa[**di**] → iPad[ji]

**Notation**: Use shorter forms [chi] and [ji] (not [tchi]/[dji]) to distinguish from internal palatalization

### **4b: Other consonants → Just [i]**

When epenthetic [i] doesn't create ti/di:

- **Facebook** (ends -k) → Facebooki → Facebook[i]
- **York** (ends -k) → Yorki → York[i] → Nova York[i]
- **Whatsapp** (ends -p) → Whatsappi → Whatsapp[i]

**Notation**: `word[i]`

---

## Rule 5: Nasal Vowel Endings

**Rule**: Vowels followed by m or n in the same syllable produce nasal vowels with specific phonetic realizations.

**Applies to**: Word-final syllables with m/n

### **5a: -em → [eyn]**

Final -em becomes nasal [e] + [y] glide + [n]:
- em (preposition) → em[eyn]
- também → também[eyn]
- alguém → alguém[eyn]

### **5b: -am → [ãwn]**

Final -am becomes nasal [a] + [w] glide + [n]:
- falam → falam[ãwn]
- estavam → estavam[ãwn]

### **5c: -im → [ing]**

Final -im becomes nasal [i] + velar nasal:
- sim → sim[ing]
- assim → assim[ing]
- jardim → jardim[ing]

### **5d: -om → [oun]**

Final -om becomes [o] + [u] glide + [n]:
- com (preposition) → com[oun]
- som → som[oun]

### **5e: -um/uma → [ũm]/[ũma]**

Final -um/-uma preserve the nasal [u] + consonant:
- um (article) → um[ũm]
- uma (article) → uma[ũma]
- algum → algum[ũm]

**Note**: Words with tilde (ão, ões, ãe, etc.) already indicate nasalization in writing and are NOT annotated per pedagogical decision.

**Notation**: `word[eyn]`, `word[ãwn]`, `word[ing]`, `word[oun]`, `word[ũm]`, `word[ũma]`

---

## Rule 6: Syllable-Final L → [u]

**Rule**: The letter "l" at the end of a syllable (coda position) becomes [u].

**Applies to**: ALL words with syllable-final "l"

### **6a: Simple words ending in L (one transformation only)**

Words with a single syllable-final L at the end:
- Brasil → Brasi~~l~~[u]
- futebol → futebo~~l~~[u]
- hotel → hote~~l~~[u]
- hospital → hospita~~l~~[u]
- azul → azu~~l~~[u]
- sol → so~~l~~[u]
- mal → ma~~l~~[u]
- mil → mi~~l~~[u]
- sal → sa~~l~~[u]
- mel → me~~l~~[u]
- papel → pape~~l~~[u]
- difícil → difíci~~l~~[u]
- fácil → fáci~~l~~[u]
- possível → possíve~~l~~[u]

**Notation**: `word~~l~~[u]` - strikethrough the final L, add [u]

### **6b: Complex words (multiple L's or mid-word L)**

Words with syllable-final L in the middle, or multiple syllable-final L's:

**Words ending in L (but with additional mid-word L)**:
- álcool → álcool[áucool] (two L's: ál-cool, both become u)

**Words NOT ending in L (mid-word L only)**:
- alto → alto[auto]
- calma → calma[cauma]
- falso → falso[fauso]
- volta → volta[vouta]
- multa → multa[muuta]

**Notation**: `word[fullword]` - full word repetition shows all transformations

**Rationale**:
- Multiple L transformations can't be shown with strikethrough alone
- Mid-word strikethrough creates visual clutter

**Phonetic process**: This is called "vocalization of /l/" - the lateral consonant becomes a back rounded vowel/glide.

**Note**: When "l" starts a syllable, it stays [l]: lá, livro, legal, salada (sa-LA-da)

---

## Rule Summary Table

| Rule | Pattern | Notation | Examples |
|------|---------|----------|----------|
| 1 | Final -o → [u] | word[u] | americano[u], o[u], como[u], do[u] |
| 1 | Final -os → [us] | word[us] | os[us], livros[us], dos[us] |
| 2 | Final -e → [i] | word[i] | nome[i], e[i] (and) |
| 2 | Final -es → [is] | word[is] | nomes[is], fortes[is] |
| 3a | de → de[dji] | de[dji] | de[dji] Miami (ALWAYS) |
| 3b | te + i → [tchi] | [tchi] | contente[tchi] |
| 3c | ti/di → [tchi]/[dji] | [tchi]/[dji] | notícia: no[tchi]cia |
| 4a | Epenthetic + ti/di | [chi]/[ji] | Internet[chi], iPad[ji] |
| 4b | Epenthetic + other | [i] | Facebook[i], York[i] |
| 5a | Final -em → [eyn] | word[eyn] | em[eyn], também[eyn] |
| 5b | Final -am → [ãwn] | word[ãwn] | falam[ãwn] |
| 5c | Final -im → [ing] | word[ing] | sim[ing], assim[ing] |
| 5d | Final -om → [oun] | word[oun] | com[oun], som[oun] |
| 5e | Final -um/uma → [ũm]/[ũma] | word[ũm]/word[ũma] | um[ũm], uma[ũma] |
| 6a | Simple word-final l | word~~l~~[u] | Brasil → Brasi~~l~~[u], futebol → futebo~~l~~[u] |
| 6b | Complex/multiple l's | word[fullword] | álcool → álcool[áucool], alto → alto[auto] |

---

## What is NOT Annotated

The following phonetic changes are NOT annotated in our system:

❌ **Sibilant sounds**: /s/ → [ʃ] at end of syllables (pedagogical decision)
❌ **R-sound variations**: /r/ varies by region and position (too variable)
❌ **Nasal vowels with tilde**: Words like são, irmãos already show nasalization with tilde (redundant to annotate)
❌ **Vowel reduction in unstressed syllables**: Internal vowel weakening (too complex)

---

## Obligatory vs. Optional

### **OBLIGATORY (annotated in Steps 1-4)**
All rules above (1-6) are **obligatory** and happen in:
- Formal speech
- Informal speech
- All Brazilian Portuguese dialects
- All speaking speeds

### **OPTIONAL (shown in Step 5 as reductions/colloquialisms)**
Not annotated in Steps 1-4:
- **Vowel reductions**: sou → sô, estou → tô
- **Contractions**: para o → pro
- **Infinitive dropping**: falar → falá
- **Coalescence**: de ônibus → djônibus, de outro → djoutro
- **Vowel sandhi**: na avenida → navenida
- These are **register-dependent** (informal/colloquial only)

---

## Pedagogical Application

### **Steps 1-4: Pronunciation Annotations**
Show obligatory pronunciation with compact notation:
```
Eu sou o[u] John.
Eu falo[u] inglês e[i] um[ũm] pouco[u] de[dji] espanhol.
Eu tenho[u] um[ũm] cachorro[u] e[i] uma[ũma] gata.
Eu moro[u] em[eyn] Nova York[i].
```

### **Step 5: Phonetic Orthography**
Write everything as pronounced (both obligatory and optional):
```
Sô John.
Falo inglês e ũm pocu djispanhol.
Tenhu ũm cachorro e ũma gata.
Moro eyn Nova Yorki.
```

---

## Why These Rules Matter

1. **Listening comprehension**: Students MUST recognize these changes to understand spoken Portuguese
2. **Accent reduction**: Students who don't apply these rules sound foreign
3. **Systematic patterns**: Understanding rules helps acquisition
4. **High frequency**: These changes affect nearly every sentence
5. **Obligatory nature**: Unlike English, these changes are not optional or dialectal

---

## Examples from the Syllabus

### **JOHN's Introduction (Step 1)**
```
Eu sou o[u] John.
Eu sou americano[u].
Eu sou de[dji] Miami.
Eu sou casado[u] com[oun] a Sarah.

Eu moro[u] em[eyn] Nova York[i].
Eu trabalho[u] como[u] analista.
Eu falo[u] inglês e[i] um[ũm] pouco[u] de[dji] espanhol.
Eu gosto[u] de[dji] música.
Eu vou de[dji] metrô para o[u] trabalho[u].
Eu tenho[u] um[ũm] cachorro[u] e[i] uma[ũma] gata.
Eu estou contente[tchi] em[eyn] falar português.
```

Every annotation follows the 6 obligatory rules documented above.

---

## Quick Reference for Annotators

When adding new vocabulary, check for **6 obligatory rules** (Steps 1-4):

1. ✅ **Rule 1**: Does it end in -o? → Add [u]
2. ✅ **Rule 1**: Does it end in -os? → Add [us]
3. ✅ **Rule 2**: Does it end in -e? → Add [i]
4. ✅ **Rule 2**: Does it end in -es? → Add [is]
5. ✅ **Rule 3**: Is it the word "de"? → Always de[dji]
6. ✅ **Rule 3**: Is it the word "e" (and)? → Always e[i]
7. ✅ **Rule 3**: Does it have ti/di sequences? → Check for palatalization
8. ✅ **Rule 1**: Is it the article "o"? → Always o[u]
9. ✅ **Rule 1**: Is it a contraction do/no? → Always do[u]/no[u]
10. ✅ **Rule 4**: Is it a borrowed word ending in consonant? → Add epenthetic [i], check for ti/di
11. ✅ **Rule 5**: Does it end in -em? → Add [eyn]
12. ✅ **Rule 5**: Does it end in -am? → Add [ãwn]
13. ✅ **Rule 5**: Does it end in -im? → Add [ing]
14. ✅ **Rule 5**: Does it end in -om? → Add [oun]
15. ✅ **Rule 5**: Does it end in -um/uma? → Add [ũm]/[ũma]
16. ✅ **Rule 6**: Does it have syllable-final l?
    - **Simple (one L only)**: Strike through the final l and add [u] (Brasil → Brasi~~l~~[u], futebol → futebo~~l~~[u])
    - **Complex (multiple L's or mid-word L)**: Use full word repetition (álcool → álcool[áucool], alto → alto[auto])

**DO NOT annotate** (these are optional, Step 5 only):
- ❌ Coalescence: de ônibus stays as `de[dji] ônibus` (not de[djô]nibus)
- ❌ Vowel sandhi: na avenida stays separate (not navenida)
- ❌ Reductions: sou stays as `sou` (not sô)

---

**END OF PRONUNCIATION RULES REFERENCE**
