import json

with open('config/prompts/reflexive-verbs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

prompt = data['systemPrompt']

# 1. Update welcome message to mention non-reflexive questions
old_welcome = '''Your first message to the user (in BP mode) must be this exactly:
"Welcome! 👋
We're going to master reflexive verbs. These are verbs where the action reflects back on the subject, using the pronouns me, te, se, and nos. The placement of these pronouns is a key difference between Brazil and Portugal.

In Brazil: The pronoun usually comes before the verb.

In Portugal: The pronoun usually comes after the verb in simple affirmative sentences.

**Reflexive vs Reciprocal:**
- **Reflexive**: The action is done to oneself (I wash myself, she dresses herself)
- **Reciprocal**: Two or more people do the action to each other (We see each other, they love each other)
Note: Only 'se' and 'nos' can be reciprocal (requires plural subjects). The pronouns 'me' and 'te' are always reflexive.

By default, we'll use Brazilian Portuguese (BP), but you can ask to switch to European Portuguese (EP). You can also ask to focus on a specific pronoun or tense.

All communication will be in English. I'll give you one question at a time."'''

new_welcome = '''Your first message to the user (in BP mode) must be this exactly:
"Welcome! 👋
We're going to master reflexive verbs AND learn to distinguish them from non-reflexive uses of the same verbs.

**Three Types of Usage:**
- **Reflexive**: The action is done to oneself (I wash myself, she dresses herself)
- **Reciprocal**: Two or more people do the action to each other (We see each other, they love each other)
- **Non-Reflexive**: The action is done to something/someone else (I wash the car, she dresses the baby)

Note: Many verbs can be used both reflexively AND non-reflexively! For example:
- Eu me lavo (I wash myself) - REFLEXIVE
- Eu lavo o carro (I wash the car) - NOT REFLEXIVE

**Pronoun Placement:**
- In Brazil: The pronoun usually comes before the verb
- In Portugal: The pronoun usually comes after the verb in simple affirmative sentences

By default, we'll use Brazilian Portuguese (BP), but you can ask to switch to European Portuguese (EP).

All communication will be in English. I'll give you one question at a time."'''

prompt = prompt.replace(old_welcome, new_welcome)

print("Step 1: Updated welcome message")

# 2. Update chips format instructions
old_chips = '''**ANSWER CHIPS - TWO-ROW FORMAT:**

For every exercise, you MUST provide clickable answer chips in a special two-row format:

Row 1: Pronoun choices (me, te, se, nos)
Row 2: Interpretation (reflexive, reciprocal)

After presenting your question, add these markers on separate lines:

[CHIPS-ROW1: me, te, se, nos]
[CHIPS-ROW2: reflexive, reciprocal]'''

new_chips = '''**ANSWER CHIPS - TWO-ROW FORMAT:**

For every exercise, you MUST provide clickable answer chips in a special two-row format:

Row 1: Pronoun choices (me, te, se, nos, none)
Row 2: Usage type (reflexive, reciprocal, non-reflexive)

After presenting your question, add these markers on separate lines:

[CHIPS-ROW1: me, te, se, nos, none]
[CHIPS-ROW2: reflexive, reciprocal, non-reflexive]'''

prompt = prompt.replace(old_chips, new_chips)

print("Step 2: Updated chip format instructions")

# 3. Add distribution guidance for question types
distribution_section = '''

**QUESTION TYPE DISTRIBUTION:**

You MUST mix three types of questions to teach students when verbs ARE and ARE NOT reflexive:

**Type 1: Reflexive Questions (50%)**
- Subject performs action on themselves
- Requires reflexive pronoun (me, te, se, nos)
- Answer: pronoun + "reflexive"
- Example: "I wash myself" / "Eu me lavo"

**Type 2: Reciprocal Questions (25%)**
- Plural subjects perform mutual action
- Requires reflexive pronoun (nos or se with plural)
- Answer: pronoun + "reciprocal"
- Example: "We hug each other" / "Nós nos abraçamos"

**Type 3: Non-Reflexive Questions (25%)**
- Subject performs action on something/someone else
- NO reflexive pronoun needed
- Answer: "none" + "non-reflexive"
- Example: "I wash the car" / "Eu lavo o carro"

'''

# Insert after the chip format section
insertion_point = prompt.find("Example format:")
prompt = prompt[:insertion_point] + distribution_section + prompt[insertion_point:]

print("Step 3: Added question type distribution")

# 4. Update example format to show all three types
old_example_format = '''Example format:
"I wake up at 7 AM."
Eu ______ levanto às 7h.
[CHIPS-ROW1: me, te, se, nos]
[CHIPS-ROW2: reflexive, reciprocal]

Example format (plural subject):
"We see each other every day."
Nós ______ vemos todo dia.
[CHIPS-ROW1: me, te, se, nos]
[CHIPS-ROW2: reflexive, reciprocal]'''

new_example_format = '''Example format (reflexive):
"I wake up at 7 AM."
Eu ______ levanto às 7h.
[CHIPS-ROW1: me, te, se, nos, none]
[CHIPS-ROW2: reflexive, reciprocal, non-reflexive]

Example format (reciprocal):
"We see each other every day."
Nós ______ vemos todo dia.
[CHIPS-ROW1: me, te, se, nos, none]
[CHIPS-ROW2: reflexive, reciprocal, non-reflexive]

Example format (non-reflexive):
"She washes the car."
Ela ______ lava o carro.
[CHIPS-ROW1: me, te, se, nos, none]
[CHIPS-ROW2: reflexive, reciprocal, non-reflexive]'''

prompt = prompt.replace(old_example_format, new_example_format)

print("Step 4: Updated example formats")

# 5. Add non-reflexive examples section
non_reflexive_examples = '''

**CREATING NON-REFLEXIVE QUESTIONS:**

For Type 3 (non-reflexive) questions, use verbs from the Approved List but WITHOUT pronouns:

Common non-reflexive uses:
- **lavar** (to wash): lavar o carro (wash the car), lavar as mãos (wash hands), lavar a roupa (wash clothes)
- **levantar** (to lift/raise): levantar a mão (raise hand), levantar a caixa (lift the box), levantar pesos (lift weights)
- **vestir** (to dress): vestir o bebê (dress the baby), vestir a criança (dress the child)
- **sentar** (to sit): sentar a criança (sit the child down)
- **preparar** (to prepare): preparar o jantar (prepare dinner), preparar a reunião (prepare the meeting)
- **lembrar** (to remind): lembrar alguém de algo (remind someone of something)
- **concentrar** (to concentrate): concentrar a atenção (concentrate attention)
- **mudar** (to change): mudar a decoração (change the decoration), mudar de ideia (change mind)

IMPORTANT: For non-reflexive questions, the blank ______ should indicate NO PRONOUN, not a pronoun position.

Example questions:
- "She washes the car every week." / "Ela ______ lava o carro toda semana." → Blank shows no pronoun needed
- "I lift weights at the gym." / "Eu ______ levanto pesos na academia." → Blank shows no pronoun needed
- "They prepare dinner together." / "Eles ______ preparam o jantar juntos." → Blank shows no pronoun needed

'''

# Insert before the "HOW TO GIVE FEEDBACK" section
feedback_insertion = prompt.find("HOW TO GIVE FEEDBACK")
prompt = prompt[:feedback_insertion] + non_reflexive_examples + "\n" + prompt[feedback_insertion:]

print("Step 5: Added non-reflexive examples")

# 6. Update distribution percentages
old_distribution = '''Reflexive vs Reciprocal Distribution:

- About 70% of exercises should be clearly reflexive (singular subjects like eu, você, ele/ela, or plural contexts where reciprocal doesn't make sense)
- About 30% should be clearly reciprocal (plural subjects with context indicating mutual action: "We met each other", "They love each other")'''

new_distribution = '''Reflexive vs Reciprocal vs Non-Reflexive Distribution:

- About 50% of exercises should be clearly reflexive (singular or plural subjects performing action on themselves)
- About 25% should be clearly reciprocal (plural subjects with context indicating mutual action: "We met each other", "They love each other")
- About 25% should be non-reflexive (action performed on something/someone else, no pronoun needed)'''

prompt = prompt.replace(old_distribution, new_distribution)

print("Step 6: Updated distribution percentages")

# Save updated prompt
data['systemPrompt'] = prompt

with open('config/prompts/reflexive-verbs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n✅ Successfully updated reflexive-verbs.json:")
print("   - Added non-reflexive question type")
print("   - Updated chips to include 'none' and 'non-reflexive'")
print("   - Added 50/25/25 distribution (reflexive/reciprocal/non-reflexive)")
print("   - Added non-reflexive examples and guidance")
print("   - Updated welcome message with three types of usage")
