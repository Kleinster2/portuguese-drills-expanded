import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('config/prompts/ser-estar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

prompt = data['systemPrompt']

# CHANGE 1: Simplify weather category - remove temperature, ensolarado, ventoso
old_weather = """2. **WEATHER/TEMPERATURE** (always estar):
   - Está quente hoje. (It's hot today)
   - Está ensolarado. (It's sunny)
   - ⚠️ CRITICAL: NEVER use "frio/fria" (cold) - ONLY use: quente, morno, ensolarado, nublado, chuvoso, ventoso
   - Example: "It's cloudy." / (subject omitted) ______ nublado.
   - Note: Portuguese does not have an equivalent to English "it" for weather. The subject is simply omitted."""

new_weather = """2. **WEATHER CONDITIONS** (always estar):
   - Está nublado. (It's cloudy)
   - Está chovendo. (It's raining)
   - Example: "It's cloudy." / (subject omitted) ______ nublado.
   - Example: "It's raining." / (subject omitted) ______ chovendo.
   - Note: Portuguese omits the subject for weather. ONLY use: nublado, chuvoso, chovendo
   - DO NOT use temperature words in weather questions."""

prompt = prompt.replace(old_weather, new_weather)
print("Change 1: Simplified weather category (removed temperature, ensolarado, ventoso)")

# CHANGE 2: Update TEMPORARY CONDITIONS to remove temperature examples
old_temp_conditions = """4. **TEMPORARY CONDITIONS/STATES** (always estar):
   - Estou cansado. (I am tired)
   - A comida está pronta. (The food is ready)
   - ⚠️ CRITICAL: For temperature, ONLY use "quente" or "morno" - NEVER use "frio/fria"
   - ⚠️ CRITICAL: NEVER use "café" as a subject - use: chá, sopa, comida, água instead
   - Example: "The door is open." / A porta ______ aberta."""

new_temp_conditions = """4. **TEMPORARY CONDITIONS/STATES** (always estar):
   - Estou cansado. (I am tired)
   - A comida está pronta. (The food is ready)
   - A porta está aberta. (The door is open)
   - Example: "The door is open." / A porta ______ aberta.
   - For food/drink examples, ONLY use pre-approved templates (see template library below)."""

prompt = prompt.replace(old_temp_conditions, new_temp_conditions)
print("Change 2: Simplified temporary conditions (removed inline temperature warnings)")

# CHANGE 3: Update Layer 1 forbidden words section to include ensolarado/ventoso
old_layer1 = """🚨🚨🚨 MANDATORY QUESTION GENERATION RULES 🚨🚨🚨

BEFORE generating ANY question, you MUST verify it does NOT contain these FORBIDDEN words:

❌ NEVER use: café, frio/fria, velho/velha, feliz

These words cause technical AI errors and MUST be avoided.

✅ APPROVED ALTERNATIVES YOU MUST USE INSTEAD:
- For weather/temperature: quente, morno, ensolarado, nublado, chuvoso, ventoso
- For food temperature: quente, morno/morna
- For happiness: contente (ALWAYS use this, NEVER feliz)
- For drinks: chá, suco, água, leite
- For food: sopa, comida, pão, arroz

If you generate a question with café, frio, velho, or feliz, the system WILL break."""

new_layer1 = """🚨🚨🚨 MANDATORY QUESTION GENERATION RULES 🚨🚨🚨

BEFORE generating ANY question, you MUST verify it does NOT contain these FORBIDDEN words:

❌ NEVER use: café, frio/fria, velho/velha, feliz, ensolarado, ventoso

These words cause technical AI errors and MUST be avoided.

✅ ONLY USE PRE-APPROVED TEMPLATES:
- See "APPROVED QUESTION TEMPLATES" section below
- DO NOT improvise food/drink/weather examples
- ONLY use the exact templates provided

If you generate a question with café, frio, velho, feliz, ensolarado, or ventoso, the system WILL break."""

prompt = prompt.replace(old_layer1, new_layer1)
print("Change 3: Updated Layer 1 to include ensolarado/ventoso in forbidden list")

# CHANGE 4: Add positive template library
template_library = """

✅✅✅ APPROVED QUESTION TEMPLATES - USE THESE EXACT EXAMPLES ✅✅✅

For categories that involve weather, food, or drinks, you MUST use ONLY these pre-approved templates.
DO NOT improvise or create new examples with food, drinks, or weather.

**WEATHER (use only these 2):**
1. "It's cloudy." / (subject omitted) ______ nublado.
2. "It's raining." / (subject omitted) ______ chovendo.

**FOOD/DRINK TEMPERATURE (use only if needed, maximum once per 10 questions):**
1. "The soup is hot." / A sopa ______ quente.
2. "The tea is warm." / O chá ______ morno.

**FOOD STATE (preferred - use these instead of temperature):**
1. "The food is ready." / A comida ______ pronta.
2. "The rice is cooked." / O arroz ______ cozido.
3. "The bread is fresh." / O pão ______ fresco.

For all other categories (professions, time, location, emotions, etc.), you may create varied examples.
But for WEATHER and FOOD/DRINK: ONLY use templates above.

"""

# Find insertion point
insertion_point = prompt.find("Use ser for: inherent qualities")
prompt = prompt[:insertion_point] + template_library + prompt[insertion_point:]
print("Change 4: Added approved question templates library")

# CHANGE 5: Add post-generation mandatory self-check at the END
self_check = """

🚨🚨🚨 MANDATORY FINAL CHECK BEFORE PRESENTING EACH QUESTION 🚨🚨🚨

After you mentally compose a question, STOP and verify:

1. ❌ Does it contain: café, frio, fria, velho, velha, feliz, ensolarado, or ventoso?
   → If YES: DISCARD THIS QUESTION IMMEDIATELY. Generate a completely different question from a different category.

2. ❌ Does it use any drink besides: chá, suco, água, leite?
   → If YES: DISCARD THIS QUESTION. Use approved templates only.

3. ❌ Does it use any food besides: sopa, comida, arroz, pão?
   → If YES: DISCARD THIS QUESTION. Use approved templates only.

4. ❌ For weather, did you use anything besides: nublado, chovendo, chuvoso?
   → If YES: DISCARD THIS QUESTION. Use approved templates only.

5. ✅ Only if ALL checks pass: Present the question to the user.

This verification is MANDATORY. Perform this check mentally before every single question. NO EXCEPTIONS.

If you find yourself generating café, frio, ensolarado, or ventoso repeatedly, STOP using that category entirely and focus on other categories (professions, time, location, nationalities, emotions, adjectives, etc.).

"""

# Add before CORE DIRECTIVES
core_directives = "CORE DIRECTIVES (Do Not Break)"
insertion_point_end = prompt.find(core_directives)
prompt = prompt[:insertion_point_end] + self_check + prompt[insertion_point_end:]
print("Change 5: Added mandatory post-generation self-check at the end")

# CHANGE 6: Update approved emotions list
old_moods_list = """   - ⚠️ CRITICAL: For happiness, ALWAYS use "contente" - NEVER EVER use "feliz"
   - Approved emotions: contente, triste, bravo, irritado, preocupado, cansado"""

new_moods_list = """   - ⚠️ CRITICAL: For happiness, ALWAYS use "contente" - NEVER EVER use "feliz"
   - Approved emotions: contente, triste, bravo, irritado, preocupado, cansado
   - DO NOT use: feliz, alegre, animado"""

prompt = prompt.replace(old_moods_list, new_moods_list)
print("Change 6: Updated approved emotions list")

data['systemPrompt'] = prompt

with open('config/prompts/ser-estar.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nSuccessfully implemented all solutions!")
