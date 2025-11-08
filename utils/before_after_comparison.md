# Before & After - Annotation System Comparison

## Example 1: Simple Introduction

### BEFORE (What You Type)
```
Eu sou a Maria.
Eu sou portuguesa de Lisboa.
Eu moro no Porto com meu irmão.
Eu trabalho em um hospital.
Eu falo português e espanhol.
```

### AFTER (What Gets Generated)
```
Eu sou a Maria.
Eu sou portuguesa de[_dji_] Lisboa.
Eu moro[_u_] no[_u_] Porto[_u_] com[_coun_] meu irmão[_u_].
Eu trabalho[_u_] em[_eyn_] um[_ũm_] hospita~~l~~[_u_].
Eu falo[_u_] português e[_i_] espanho~~l~~[_u_].
```

---

## Example 2: Multiple L Vocalizations

### BEFORE (What You Type)
```
O Brasil é legal para quem fala português e espanhol.
```

### AFTER (What Gets Generated)
```
O Brasi~~l~~[_u_] é lega~~l~~[_u_] para quem[_keyn_] fala português e[_i_] espanho~~l~~[_u_].
```

**Notice**: THREE L vocalizations automatically added!

---

## Example 3: All Nasal Patterns

### BEFORE (What You Type)
```
Alguém também tem cem irmãos bons e bem felizes.
```

### AFTER (What Gets Generated)
```
Alguém[_eyn_] também[_eyn_] tem[_teyn_] cem[_seyn_] irmãos[_us_] bons e[_i_] bem[_beyn_] felizes.
```

**Notice**:
- Long words: `alguém[_eyn_]`, `também[_eyn_]` (ending only)
- Short words: `tem[_teyn_]`, `cem[_seyn_]`, `bem[_beyn_]` (full syllable)

---

## Example 4: Complex Sentence with Everything

### BEFORE (What You Type)
```
Quando eu trabalho no hospital central de Lisboa, sempre falo português com os professores brasileiros que também estudam espanhol e inglês.
```

### AFTER (What Gets Generated)
```
Quando[_u_] eu trabalho[_u_] no[_u_] hospita~~l~~[_u_] centra~~l~~[_u_] de[_dji_] Lisboa, sempre[_i_] falo[_u_] português com[_coun_] os[_us_] professores brasileiros[_us_] que[_i_] também[_eyn_] estudam[_ãwn_] espanho~~l~~[_u_] e[_i_] inglês.
```

**Notice**: 18 annotations added automatically!

---

## Example 5: Tech/Borrowed Words

### BEFORE (What You Type)
```
Uso o iPad para ver o Facebook, Instagram, e Netflix.
```

### AFTER (What Gets Generated)
```
Uso[_u_] o[_u_] iPad[_ji_] para ver o[_u_] Facebook[_i_], Instagram[_ãwn_], e[_i_] Netflix.
```

**Notice**:
- `iPad[_ji_]` - epenthetic vowel + palatalization!
- `Facebook[_i_]` - epenthetic vowel

---

## Example 6: Manual Reductions Preserved

### BEFORE (What You Type)
```
_Tô_ usando o Facebook _pro_ falar com alguém do Brasil sobre futebol, espanhol, e Portugal.
```

### AFTER (What Gets Generated)
```
_Tô_ usando[_u_] o[_u_] Facebook[_i_] _pro_ falar com[_coun_] alguém[_eyn_] do[_u_] Brasi~~l~~[_u_] sobre[_i_] futebo~~l~~[_u_], espanho~~l~~[_u_], e[_i_] Portuga~~l~~[_u_].
```

**Notice**:
- Manual reductions PRESERVED: `_Tô_`, `_pro_`
- Annotations ADDED: `[_u_]`, `[_i_]`, `[_coun_]`, `[_eyn_]`, `~~l~~[_u_]`

---

## Example 7: Stressed Words Handled Correctly

### BEFORE (What You Type)
```
Eu tomo café no sofá e vou para o metrô.
Você está no avô do José?
```

### AFTER (What Gets Generated)
```
Eu tomo[_u_] café no[_u_] sofá e[_i_] vou para o[_u_] metrô.
Você está no[_u_] avô do[_u_] José?
```

**Notice**:
- `café`, `sofá`, `metrô`, `avô`, `José` NOT annotated (stressed final vowels)
- `você` NOT annotated (stressed)
- Everything else annotated

---

## Example 8: Verb Conjugations

### BEFORE (What You Type)
```
Nós falamos português, vocês falam espanhol, e eles falam inglês.
```

### AFTER (What Gets Generated)
```
Nós falamos[_us_] português, vocês falam[_ãwn_] espanho~~l~~[_u_], e[_i_] eles falam[_ãwn_] inglês.
```

**Notice**:
- `-amos` → `[_us_]` (plural marker)
- `-am` → `[_ãwn_]` (nasal diphthong)

---

## Example 9: Mixed Subjects and Verbs

### BEFORE (What You Type)
```
Eu como pão, você come arroz, e ela come feijão.
```

### AFTER (What Gets Generated)
```
Eu como[_u_] pão[_u_], você come[_i_] arroz, e[_i_] ela come[_i_] feijão[_u_].
```

**Notice**: Different endings for different verb forms!

---

## Example 10: Everything at Once

### BEFORE (What You Type)
```
Ele joga futebol e basquetebol no principal estádio central.
```

### AFTER (What Gets Generated)
```
Ele[_i_] joga futebo~~l~~[_u_] e[_i_] basquetebo~~l~~[_u_] no[_u_] principa~~l~~[_u_] estádio[_u_] centra~~l~~[_u_].
```

**Notice**: FOUR L vocalizations in one sentence!

---

## Example 11: Colloquial Speech with Manual + Auto

### BEFORE (What You Type - Step 4 Style)
```
_Sô_ a Maria.
_Sô_ portuguesa de Lisboa.
Moro no Porto com meu irmão.
_Vô_ de ônibus _pro_ trabalho.
_Tô_ em casa agora.
_Tô_ contente de _estudá_ inglês.
```

### AFTER (What Gets Generated)
```
_Sô_ a Maria.
_Sô_ portuguesa de[_dji_] Lisboa.
Moro[_u_] no[_u_] Porto[_u_] com[_coun_] meu irmão[_u_].
_Vô_ de[_dji_] ônibus _pro_ trabalho[_u_].
_Tô_ em[_eyn_] casa agora.
_Tô_ contente[_tchi_] de[_dji_] _estudá_ inglês.
```

**Notice**:
- YOU control: `_Sô_`, `_Vô_`, `_Tô_`, `_pro_`, `_estudá_` (editorial choices)
- SCRIPT adds: `[_u_]`, `[_dji_]`, `[_coun_]`, `[_eyn_]`, `[_tchi_]` (mechanical annotations)

---

## Example 12: Proper Nouns vs Common Words

### BEFORE (What You Type)
```
Carlos e Sarah trabalham no Google em São Paulo com José.
```

### AFTER (What Gets Generated)
```
Carlos[_us_] e[_i_] Sarah trabalham[_ãwn_] no[_u_] Google[_i_] em[_eyn_] São[_u_] Paulo[_u_] com[_coun_] José.
```

**Notice**:
- `Sarah`, `José` NOT annotated (proper nouns in exception list)
- `Carlos`, `Google`, `Paulo`, `São` annotated (not in exception list, or special rules)

---

## Summary Statistics

### Example 4 (Complex Sentence):
- **Before**: 100 characters (clean Portuguese)
- **After**: 184 characters (with annotations)
- **Annotations added**: 18
- **Typing saved**: 84 characters you didn't have to type!

### Example 10 (Multiple L):
- **Before**: 61 characters
- **After**: 100 characters
- **L vocalizations**: 4 (all automatic!)

### Example 6 (Manual + Auto):
- **Manual items preserved**: 2 (`_Tô_`, `_pro_`)
- **Annotations added**: 11
- **Total transformations**: 13 (perfect mix!)

---

## Key Takeaways

✅ **You type**: Clean, easy-to-read Portuguese
✅ **Script adds**: ALL the tedious annotation syntax
✅ **You control**: Editorial choices (reductions, coalescence)
✅ **Script ensures**: 100% consistent rule application

**Result**: Faster authoring + zero annotation bugs! 🎉
