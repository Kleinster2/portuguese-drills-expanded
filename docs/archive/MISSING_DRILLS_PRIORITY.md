# Missing Drills - Priority Implementation List

**Date:** 2025-11-04
**Status:** Ready for Development
**Total Drills Needed:** 16 (6 High-Priority Grammar + 10 Vocabulary)

---

## 📊 Overview

This document specifies all missing drill files identified through comprehensive curriculum-drill cross-analysis. Each drill follows the established pattern from existing drills with:
- Bilingual support (English/Spanish)
- BP/EP mode toggle
- Spanish analogies
- Multiple difficulty levels
- Systematic progression

---

## 🔴 PHASE 1: High-Priority Grammar Drills (6)

These drills cover core grammar structures with no current drill support. **Priority: IMMEDIATE**

---

### 1. `comparatives.json`

**Unit:** 47 - Comparatives (mais...que, menos...que)
**Priority:** 🔴 HIGH
**Rationale:** Core grammar structure essential for expressing comparisons

**Content Structure:**

#### Level 1: Basic Comparatives with Adjectives
- mais + adjective + que (more...than)
- menos + adjective + que (less...than)
- tão + adjective + quanto (as...as)

**Example Exercises:**
```
English: "She is taller than her brother"
BP: "Ela é mais alta que o irmão dela"
EP: "Ela é mais alta do que o irmão dela"
```

**Key Patterns:**
- BP commonly uses "que" alone
- EP often uses "do que" (more formal)
- tão...quanto = equal comparison
- mais velho vs. maior (older in age vs. bigger)

#### Level 2: Comparatives with Verbs
- trabalhar mais que (work more than)
- comer menos que (eat less than)
- correr tão rápido quanto (run as fast as)

#### Level 3: Irregular Comparatives
- bom → melhor (good → better)
- mau → pior (bad → worse)
- grande → maior (big → bigger)
- pequeno → menor (small → smaller)

**Spanish Analogy:**
- Portuguese "mais...que" = Spanish "más...que"
- But: melhor/pior (PT) = mejor/peor (ES)
- Note: Portuguese uses "tão...quanto" where Spanish uses "tan...como"

**Common Mistakes to Address:**
- ❌ "mais bom" → ✅ "melhor"
- ❌ "mais grande" for size comparisons → ✅ "maior"
- BP: "que" is sufficient; "do que" is formal

---

### 2. `superlatives.json`

**Unit:** 48 - Superlatives (O mais..., O menos...)
**Priority:** 🔴 HIGH
**Rationale:** Builds on comparatives; essential for expressing extremes

**Content Structure:**

#### Level 1: Relative Superlatives
- o mais + adjective + de (the most...of/in)
- o menos + adjective + de (the least...of/in)
- Gender/number agreement required

**Example Exercises:**
```
English: "She is the tallest in the class"
BP: "Ela é a mais alta da turma"
EP: "Ela é a mais alta da turma"
```

**Key Patterns:**
- Article agrees with subject: o/a/os/as mais...
- "de" contracts: de + o = do, de + a = da
- Position: superlative before or after noun

#### Level 2: Irregular Superlatives
- bom → o melhor (the best)
- mau → o pior (the worst)
- grande → o maior (the biggest)
- pequeno → o menor (the smallest)

#### Level 3: Absolute Superlatives
- -íssimo suffix (very, extremely)
- bonito → boníssimo (very beautiful)
- fácil → facílimo (very easy)
- Irregular: bom → ótimo, mau → péssimo

**Spanish Analogy:**
- Portuguese "o mais" = Spanish "el más"
- -íssimo (PT) = -ísimo (ES)
- ótimo/péssimo (PT) = óptimo/pésimo (ES) - spelling differs

**Common Mistakes to Address:**
- Agreement: ❌ "a mais alto" → ✅ "a mais alta"
- ❌ "o mais bom" → ✅ "o melhor"
- Placement: Both "o livro mais interessante" and "o mais interessante livro" possible

---

### 3. `months.json`

**Unit:** 51 - Months of the Year
**Priority:** 🔴 HIGH
**Rationale:** High-frequency vocabulary; essential for dates, scheduling

**Content Structure:**

#### Level 1: Month Names Recognition
- janeiro, fevereiro, março, abril, maio, junho
- julho, agosto, setembro, outubro, novembro, dezembro
- All masculine: o janeiro, o mês de janeiro
- No capitalization in Portuguese (unlike English)

**Example Exercises:**
```
English: "My birthday is in June"
BP: "Meu aniversário é em junho"
EP: "O meu aniversário é em junho"
```

#### Level 2: Preposition Usage
- em + month (in [month])
- "em janeiro" (in January)
- no mês de janeiro (in the month of January)
- Special: de...a (from...to): "de maio a agosto"

#### Level 3: Cultural Context
- Summer months in Brazil: dezembro-março (opposite Northern Hemisphere)
- Carnival: usually fevereiro/março
- School year: fevereiro-dezembro in Brazil
- Common expressions: "no meio do ano" (mid-year), "fim de ano" (end of year)

**Spanish Analogy:**
- Nearly identical: enero (ES) vs janeiro (PT), febrero vs fevereiro
- Portuguese doesn't capitalize: ❌ "Janeiro" → ✅ "janeiro"
- Same preposition: en (ES) = em (PT)

**Pronunciation Notes:**
- janeiro: /ʒa-NEY-ru/ (BR)
- julho: /ʒU-lyu/ (BR) - note the /ʒ/ sound
- outubro: /o-TU-bru/ (BR) - not "ok-TO-ber"

---

### 4. `dates.json`

**Unit:** 52 - Calendar Dates
**Priority:** 🔴 HIGH
**Rationale:** Essential practical skill; builds on numbers and months

**Content Structure:**

#### Level 1: Basic Date Format
- Pattern: [day] de [month] de [year]
- "15 de junho de 2024"
- Exception: primeiro de [month] (1st of month), not "um de"

**Example Exercises:**
```
English: "Today is March 15th, 2024"
BP: "Hoje é 15 de março de 2024"
EP: "Hoje é 15 de março de 2024"
```

**Key Patterns:**
- Say: "quinze de março" (15 of March)
- Special: primeiro de maio (May 1st), not "um de maio"
- Years: "dois mil e vinte e quatro" (2024)

#### Level 2: Asking About Dates
- Que dia é hoje? (What day is today?)
- Qual é a data? (What's the date?)
- Quando é seu aniversário? (When is your birthday?)
- Em que dia...? (On what day...?)

#### Level 3: Date Prepositions
- em + date (on [date]): "em 25 de dezembro"
- no dia + number: "no dia 15" (on the 15th)
- Writing dates: 15/06/2024 (day/month/year format in Portuguese)

**Spanish Analogy:**
- Same structure: el 15 de marzo (ES) = 15 de março (PT)
- Exception: primero (ES) = primeiro (PT) for 1st
- Date format: d/m/a in both languages (unlike m/d/y in US English)

**Common Mistakes to Address:**
- ❌ "um de maio" → ✅ "primeiro de maio"
- ❌ "março quinze" → ✅ "quinze de março"
- Writing: ❌ 06/15/2024 → ✅ 15/06/2024

---

### 5. `weather.json`

**Unit:** 54 - Weather Expressions
**Priority:** 🔴 HIGH
**Rationale:** Common conversation topic; involves unique verb usage

**Content Structure:**

#### Level 1: Basic Weather with "Fazer"
- Fazer + weather noun (impersonal construction)
- Faz calor (It's hot) - literally "makes heat"
- Faz frio (It's cold)
- Faz sol (It's sunny)
- Faz vento (It's windy)

**Example Exercises:**
```
English: "It's hot today"
BP: "Faz calor hoje" or "Tá calor"
EP: "Está calor hoje"
```

**Key Patterns:**
- Impersonal verb: always 3rd person singular "faz"
- BP spoken: "Tá calor" instead of "Está fazendo calor"
- No article: ❌ "Faz o calor" → ✅ "Faz calor"

#### Level 2: Weather with "Estar"
- Está chovendo (It's raining) - progressive
- Está nevando (It's snowing)
- Está nublado (It's cloudy) - adjective
- Está ensolarado (It's sunny) - adjective

#### Level 3: Weather Descriptions
- O tempo está bom/ruim (The weather is good/bad)
- Que tempo faz? (What's the weather like?)
- Como está o tempo? (How's the weather?)
- Temperature: "Está 25 graus" (It's 25 degrees Celsius)

**Spanish Analogy:**
- Portuguese "Faz calor" = Spanish "Hace calor" (identical construction)
- Portuguese "Está chovendo" = Spanish "Está lloviendo"
- Temperature: grados (ES) = graus (PT)

**BP vs EP Differences:**
- BP spoken: "Tá chovendo" very common
- EP: "Está a chover" (gerund with "a")
- BP: Celsius always (never Fahrenheit)

---

### 6. `frequency-adverbs.json`

**Unit:** 63 - Frequency Adverbs
**Priority:** 🔴 HIGH
**Rationale:** sempre, nunca, às vezes are VERY common in daily speech

**Content Structure:**

#### Level 1: Basic Frequency Adverbs
- sempre (always)
- nunca (never)
- às vezes (sometimes)
- frequentemente / muitas vezes (frequently/often)
- raramente (rarely)

**Example Exercises:**
```
English: "I always drink coffee in the morning"
BP: "Eu sempre tomo café de manhã"
EP: "Eu tomo sempre café de manhã"
```

**Key Patterns:**
- BP: adverb usually BEFORE verb: "Eu sempre falo"
- EP: adverb often AFTER verb: "Eu falo sempre"
- nunca + verb (no double negative needed like Spanish)

#### Level 2: Frequency Expressions
- todos os dias (every day)
- toda semana (every week)
- uma vez por semana (once a week)
- duas vezes por mês (twice a month)
- de vez em quando (from time to time)

#### Level 3: Question Formation
- Com que frequência...? (How often...?)
- Você sempre...? (Do you always...?)
- Quantas vezes por...? (How many times per...?)

**Spanish Analogy:**
- siempre (ES) = sempre (PT)
- nunca (ES) = nunca (PT)
- a veces (ES) = às vezes (PT) - note Portuguese contraction
- Spanish uses double negative: "No hago nunca" vs Portuguese: "Nunca faço"

**Common Mistakes to Address:**
- BP placement: ✅ "Eu sempre vou" (natural) vs. formal "Eu vou sempre"
- ❌ "Eu não nunca faço" → ✅ "Eu nunca faço" (no double negative)
- às vezes = contraction of "a as vezes" (must have accent)

---

## 🟡 PHASE 2: Vocabulary Drills (10)

These drills support vocabulary-focused units. **Priority: MEDIUM** (create after Phase 1)

---

### 7. `clothing.json`

**Unit:** 56 - Clothing Basics
**Priority:** 🟡 MEDIUM
**Content Focus:** Gender agreement, vestir/usar verbs, colors with clothing

**Key Vocabulary:**
- Basics: camisa (f), camiseta (f), calça (f - singular!), sapato (m - usually plural)
- Outerwear: jaqueta (f), casaco (m), vestido (m)
- Accessories: chapéu (m), boné (m), óculos (m - plural)

**Grammar Integration:**
- Gender agreement: camisa branca, sapato preto
- Verbs: vestir (to wear/dress), usar (to use/wear), colocar (to put on), tirar (to take off)
- estar vestido/a de (to be dressed in)

**Example Exercise:**
```
"I'm wearing a white shirt and black pants"
BP: "Estou usando uma camisa branca e calça preta"
Note: calça is singular in Portuguese (unlike "pants" in English)
```

**Spanish Analogy:**
- camisa (ES) = camisa (PT) [same]
- pantalones (ES) = calça (PT) [singular/plural difference!]
- zapatos (ES) = sapatos (PT) [same]

---

### 8. `body-parts.json`

**Unit:** 57 - Body Parts
**Priority:** 🟡 MEDIUM
**Content Focus:** Articles with body parts, doer construction, reflexive verbs

**Key Vocabulary:**
- Head: cabeça (f), olhos (m), nariz (m), boca (f), orelha (f)
- Body: braço (m), mão (f), perna (f), pé (m), dedo (m)
- Internal: coração (m), estômago (m)

**Grammar Integration:**
- Use definite article: "a cabeça" not "minha cabeça" (doer construction)
- Doer: "A cabeça dói" (The head hurts) or "Dói a cabeça"
- Machucei o braço (I hurt my arm) - article, not possessive

**Example Exercise:**
```
"My head hurts"
BP: "A cabeça dói" or "Minha cabeça dói" or "Estou com dor de cabeça"
More natural: "Tô com dor de cabeça"
```

**Spanish Analogy:**
- cabeza (ES) = cabeça (PT)
- Similar article usage: "Me duele la cabeza" (ES) = "Dói a cabeça" (PT)
- oreja (ES) = orelha (PT) / oído (ES inner) = ouvido (PT)

---

### 9. `emotions.json`

**Unit:** 59 - Emotions and Feelings
**Priority:** 🟡 MEDIUM
**Content Focus:** estar + emotion, sentir-se, ficar adjectives

**Key Vocabulary:**
- Basic: feliz, triste, cansado/a, animado/a, estressado/a
- Strong: furioso/a, deprimido/a, ansioso/a, nervoso/a
- States: com medo (afraid), com fome (hungry), com sede (thirsty)

**Grammar Integration:**
- estar + emotion adjective (temporary state)
- sentir-se + emotion (to feel)
- ficar + emotion (to become, to get)
- estar com + noun phrase (com medo, com raiva)

**Example Exercise:**
```
"I'm feeling sad today"
BP: "Estou me sentindo triste hoje" or "Tô triste hoje"
Alternative: "Estou triste hoje"
```

**Spanish Analogy:**
- feliz (ES) = feliz (PT), triste (ES) = triste (PT)
- estar + adj works same way in both
- tener miedo (ES) = estar com medo / ter medo (PT)

---

### 10. `directions.json`

**Unit:** 60 - Locations and Directions
**Priority:** 🟡 MEDIUM
**Content Focus:** à esquerda/direita, perto/longe, imperative for directions

**Key Vocabulary:**
- Directions: esquerda (left), direita (right), frente (front), atrás (behind)
- Distance: perto (near), longe (far), aqui (here), ali/lá (there)
- Movement: vire (turn), siga (follow), vá (go), pegue (take)

**Grammar Integration:**
- Prepositions: à esquerda, à direita (note crase!)
- estar + location: "Fica perto daqui" (It's close to here)
- Imperatives for giving directions
- em frente de (in front of), atrás de (behind)

**Example Exercise:**
```
"Turn right at the corner"
BP: "Vire à direita na esquina"
Informal: "Vira à direita ali"
```

**Spanish Analogy:**
- izquierda (ES) = esquerda (PT), derecha (ES) = direita (PT)
- cerca (ES) = perto (PT), lejos (ES) = longe (PT)
- doble (ES) = vire (PT) for "turn"

---

### 11. `house-rooms.json`

**Unit:** 61 - House and Rooms
**Priority:** 🟡 MEDIUM
**Content Focus:** em/no/na + rooms, ter/estar in house context

**Key Vocabulary:**
- Rooms: quarto (m), sala (f), cozinha (f), banheiro (m), quintal (m)
- Features: porta (f), janela (f), teto (m), chão (m), parede (f)
- Furniture: cama (f), sofá (m), mesa (f), cadeira (f)

**Grammar Integration:**
- Preposition: "Estou na cozinha" (I'm in the kitchen)
- Location: no quarto, na sala, no banheiro
- ter + noun: "Minha casa tem três quartos"

**Example Exercise:**
```
"The bathroom is upstairs"
BP: "O banheiro é/fica lá em cima"
Or: "O banheiro fica no andar de cima"
```

**Spanish Analogy:**
- cuarto (ES) = quarto (PT), sala (ES) = sala (PT)
- cocina (ES) = cozinha (PT), baño (ES) = banheiro (PT)
- Similar preposition usage: en la cocina (ES) = na cozinha (PT)

---

### 12. `food-meals.json`

**Unit:** 64 - Food and Meals Expanded
**Priority:** 🟡 MEDIUM
**Content Focus:** Meal names, ordering food, preferences, cooking verbs

**Key Vocabulary:**
- Meals: café da manhã (breakfast), almoço (lunch), jantar (dinner), lanche (snack)
- Foods: arroz (m), feijão (m), carne (f), frango (m), peixe (m), salada (f)
- Drinks: água (f), suco (m), refrigerante (m), cerveja (f)

**Grammar Integration:**
- Verbs: tomar (café da manhã), almoçar, jantar, comer, beber
- Ordering: "Eu queria..." (I would like...), "Vou querer..." (I'll have...)
- Preferences: gostar de, preferir, amar, detestar

**Example Exercise:**
```
"I usually have breakfast at 8am"
BP: "Eu geralmente tomo café da manhã às 8 horas"
Casual: "Eu tomo café às 8"
```

**Spanish Analogy:**
- desayuno (ES) = café da manhã (PT) - completely different!
- almuerzo (ES) = almoço (PT) - similar
- cena (ES) = jantar (PT) - different words

---

### 13. `hobbies.json`

**Unit:** 66 - Hobbies and Leisure Activities
**Priority:** 🟡 MEDIUM
**Content Focus:** jogar vs. praticar, fazer activities, free time expressions

**Key Vocabulary:**
- Sports: futebol (m), vôlei (m), natação (f), corrida (f), ciclismo (m)
- Arts: música (f), dança (f), pintura (f), fotografia (f)
- Leisure: ler (read), assistir (watch), ouvir (listen), tocar (play instrument)

**Grammar Integration:**
- jogar + ball sport: jogar futebol, jogar tênis
- praticar + non-ball sport: praticar natação, praticar corrida
- fazer + activity: fazer yoga, fazer caminhada
- tocar + instrument: tocar violão, tocar piano

**Example Exercise:**
```
"I like to play soccer on weekends"
BP: "Eu gosto de jogar futebol nos fins de semana"
Common: "Gosto de jogar bola"
```

**Spanish Analogy:**
- jugar (ES) = jogar (PT), practicar (ES) = praticar (PT)
- tocar (ES) = tocar (PT) for instruments [same]
- fútbol (ES) = futebol (PT)

---

### 14. `technology.json`

**Unit:** 67 - Technology and Communication
**Priority:** 🟡 MEDIUM
**Content Focus:** Modern vocabulary, usar, ligar, conectar, digital communication

**Key Vocabulary:**
- Devices: celular (m), computador (m), tablet (m), notebook (m)
- Internet: internet (f), wifi (m), aplicativo (m), site (m), e-mail (m)
- Actions: enviar (send), receber (receive), baixar (download), postar (post)

**Grammar Integration:**
- usar + device/app: "Eu uso WhatsApp"
- ligar/desligar (turn on/off)
- estar conectado/a (to be connected)
- mandar mensagem (send message)

**Example Exercise:**
```
"I need to charge my phone"
BP: "Eu preciso carregar meu celular"
Common: "Preciso carregar o celular"
```

**Spanish Analogy:**
- celular (ES/PT both in Latin America) vs móvil (ES Spain)
- ordenador (ES Spain) vs computador (PT/ES Latin America)
- email (same in both, pronunciation differs)

---

### 15. `shopping.json`

**Unit:** 68 - Shopping and Money
**Priority:** 🟡 MEDIUM
**Content Focus:** Quanto custa?, buying phrases, bargaining, payment methods

**Key Vocabulary:**
- Money: dinheiro (m), real/reais (m), centavo (m), preço (m), desconto (m)
- Shopping: comprar, vender, custar, pagar, gastar
- Places: loja (f), mercado (m), shopping (m), feira (f)

**Grammar Integration:**
- Quanto custa? / Quanto é? (How much?)
- Custa + price: "Custa 50 reais"
- Payment: pagar em dinheiro, pagar com cartão, pagar no Pix
- É caro/barato (It's expensive/cheap)

**Example Exercise:**
```
"How much does this cost?"
BP: "Quanto custa isso?" or "Quanto é?"
Very common: "Quanto tá?"
```

**Spanish Analogy:**
- ¿Cuánto cuesta? (ES) = Quanto custa? (PT) [nearly identical]
- dinero (ES) = dinheiro (PT)
- comprar (ES) = comprar (PT), vender (ES) = vender (PT) [same]

---

### 16. `health-medical.json`

**Unit:** 70 - Health and Medical Basics
**Priority:** 🟡 MEDIUM
**Content Focus:** Symptoms, estar doente, médico, pharmacy vocabulary

**Key Vocabulary:**
- Conditions: doente (sick), doença (illness), dor (pain), febre (fever)
- Symptoms: tosse (f), dor de cabeça, náusea (f), tontura (f)
- Medical: médico (m), hospital (m), farmácia (f), remédio (m), receita (f)

**Grammar Integration:**
- estar doente / estar com [symptom]
- doer construction: "A garganta dói" (throat hurts)
- ter + symptom: "Eu tenho febre" (I have a fever)
- ir ao médico (go to the doctor)

**Example Exercise:**
```
"I'm not feeling well, I have a headache"
BP: "Não estou me sentindo bem, estou com dor de cabeça"
Casual: "Tô mal, tô com dor de cabeça"
```

**Spanish Analogy:**
- enfermo (ES) = doente (PT), dolor (ES) = dor (PT)
- médico (ES) = médico (PT) [same]
- farmacia (ES) = farmácia (PT) [accent placement differs]
- estar enfermo (ES) = estar doente (PT)

---

## 📋 Implementation Guidelines

### File Format
All drills should follow the established JSON format with:
- `metadata`: name, description, difficulty, unitNumber
- `spanishAnalogies`: comparison section
- `commonMistakes`: explicit error correction
- `culturalNotes`: BP vs EP differences, regional variations
- `exercises`: multiple levels with progressive difficulty

### Bilingual Support
- English prompts and explanations
- Spanish speaker support sections
- Portuguese examples in both BP and EP where they differ

### Difficulty Progression
- Level 1: Recognition and basic patterns
- Level 2: Production and application
- Level 3: Complex usage and exceptions

### BP/EP Toggle
- Clearly mark differences
- Default to BP for speech patterns (more common globally)
- Include EP formal alternatives

---

## ✅ Success Criteria

Each completed drill should:
1. ✅ Cover all vocabulary/grammar from corresponding curriculum unit
2. ✅ Include 15-30 varied exercises
3. ✅ Provide Spanish analogies for every major concept
4. ✅ Address 3-5 common mistakes explicitly
5. ✅ Include BP vs EP notes where relevant
6. ✅ Progress from recognition → production → application
7. ✅ Match quality/format of existing drills (e.g., ser-estar.json, preterite-tense.json)

---

## 📊 Estimated Effort

**Phase 1 (High-Priority Grammar Drills):**
- Per drill: 3-4 hours of development
- Total: 18-24 hours for 6 drills
- Timeline: 2-3 weeks (part-time)

**Phase 2 (Vocabulary Drills):**
- Per drill: 2-3 hours of development (simpler than grammar drills)
- Total: 20-30 hours for 10 drills
- Timeline: 3-4 weeks (part-time)

**Overall Timeline:** 5-7 weeks for complete implementation

---

## 🎯 Next Steps

1. **Start with Phase 1, Drill #1:** `comparatives.json`
   - Most urgently needed
   - Builds foundation for `superlatives.json`
   - Clear grammar rules make it easier to implement

2. **Reference existing drills:**
   - Use `ser-estar.json` as template for grammar drills
   - Use `colors.json` and `days-of-week.json` as templates for vocabulary drills
   - Follow `preterite-tense.json` for complex multi-level progression

3. **Test thoroughly:**
   - Ensure all exercises have correct BP/EP forms
   - Verify Spanish analogies are accurate
   - Check that common mistakes section is helpful

---

**Document Status:** ✅ READY FOR DEVELOPMENT
**Created:** 2025-11-04
**Last Updated:** 2025-11-04
