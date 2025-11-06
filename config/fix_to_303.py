# -*- coding: utf-8 -*-
import json

# Load the current v8.0
with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v8.0-streamlined.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Load original to get Q14
with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v7.1.2-no-spoilers.json', 'r', encoding='utf-8') as f:
    original = json.load(f)

# Get Q14 (uns) from original
q14_original = [q for q in original['questions'] if q['id'] == 14][0]

print(f"Current question count: {len(data['questions'])}")
print(f"\nAdding back Q14: {q14_original['en']} -> {q14_original['correct']}")

# Find where to insert (after other Unit 4 questions, before Unit 5)
questions = data['questions']
insert_pos = 0
for i, q in enumerate(questions):
    if q['unit'] == 4:
        insert_pos = i + 1
    elif q['unit'] > 4:
        break

# Insert Q14
questions.insert(insert_pos, q14_original)

# Renumber all questions
for i, q in enumerate(questions, 1):
    q['id'] = i

# Update metadata
data['metadata']['totalQuestions'] = len(questions)
data['metadata']['changelog'] = 'v8.0: Strategic streamlining of 2x2 matrices (-8 questions: Units 2,3,4,6,9). Enhanced possessives (Units 31-33) with plural forms. Enhanced demonstratives (Unit 72) with gender/number coverage (+3 questions). Total: 303 questions. ' + data['metadata'].get('changelog', '').replace('v8.0: Strategic streamlining of 2x2 matrices (-8 questions). Enhanced possessives (Units 31-33) with plural forms. Enhanced demonstratives (Unit 72) with gender/number coverage (+3 questions). Total: 303 questions. ', '')

# Update phase range
data['phases'][3]['questionRange'][1] = len(questions)

# Save
with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v8.0-streamlined.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"New question count: {len(questions)}")
print(f"✓ Saved with {len(questions)} questions")

# Verify Unit 4 diagonal coverage
unit4 = [q for q in questions if q['unit'] == 4]
print(f"\nUnit 4 now has {len(unit4)} questions:")
for q in unit4:
    print(f"  {q['correct']}: {q.get('en', '')}")

if len(unit4) == 3:
    print("\nNote: Unit 4 has 3 questions (um + uns + umas)")
    print("This gives diagonal PLUS one middle - still effective coverage")
