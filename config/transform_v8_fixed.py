import json
import copy

def get_question_text(q):
    """Get the Portuguese text from a question."""
    if 'pt' in q:
        return q['pt']
    elif 'template' in q:
        return q['template']
    return 'N/A'

def get_answer(q):
    """Get the correct answer from a question."""
    return q.get('correct', 'N/A')

# Load v7.1.2
with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v7.1.2-no-spoilers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data['questions']
removed_questions = []
modified_questions = []
added_questions = []

print("="*80)
print("STEP 1: STREAMLINING - Remove from 2x2 matrices")
print("="*80)

# ========== STREAMLINE UNIT 2: de + article (do/da/dos/das) ==========
print("\n--- Unit 2: de + article contractions ---")
unit2_qs = [q for q in questions if q['unit'] == 2]
print(f"Found {len(unit2_qs)} questions")
for q in unit2_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {get_question_text(q)}")

# Remove da (Q5) and dos (Q6), keep do (Q4) and das (Q7)
to_remove_ids = [5, 6]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({'id': q['id'], 'unit': q['unit'],
                                 'text': get_question_text(q), 'correct': get_answer(q),
                                 'reason': 'Streamlining Unit 2: keep do+das diagonal'})
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}")

# ========== STREAMLINE UNIT 3: Definite Articles (o/a/os/as) ==========
print("\n--- Unit 3: Definite Articles ---")
unit3_qs = [q for q in questions if q['unit'] == 3]
print(f"Found {len(unit3_qs)} questions")
for q in unit3_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {get_question_text(q)}")

# Remove A (Q9) and Os (Q10), keep O (Q8) and As (Q11)
to_remove_ids = [9, 10]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({'id': q['id'], 'unit': q['unit'],
                                 'text': get_question_text(q), 'correct': get_answer(q),
                                 'reason': 'Streamlining Unit 3: keep O+As diagonal'})
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}")

# ========== STREAMLINE UNIT 6: Adjective Agreement (alto/alta/altos/altas) ==========
print("\n--- Unit 6: Adjective Agreement ---")
unit6_qs = [q for q in questions if q['unit'] == 6]
print(f"Found {len(unit6_qs)} questions")
for q in unit6_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {get_question_text(q)}")

# Remove alta (Q20) and altos (Q21), keep alto (Q19) and altas (Q22)
to_remove_ids = [20, 21]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({'id': q['id'], 'unit': q['unit'],
                                 'text': get_question_text(q), 'correct': get_answer(q),
                                 'reason': 'Streamlining Unit 6: keep alto+altas diagonal'})
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}")

# ========== STREAMLINE Unit 9: em contractions (no/na) ==========
print("\n--- Unit 9: em contractions ---")
unit9_qs = [q for q in questions if q['unit'] == 9]
print(f"Found {len(unit9_qs)} questions")
for q in unit9_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {get_question_text(q)}")

# Remove na (Q29), keep no (Q28)
# Note: There's no full 2x2 matrix here, but we'll streamline to 1 question
to_remove_ids = [29]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({'id': q['id'], 'unit': q['unit'],
                                 'text': get_question_text(q), 'correct': get_answer(q),
                                 'reason': 'Streamlining Unit 9: keep only no'})
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}")

print(f"\nTOTAL STREAMLINING REMOVALS: {len(removed_questions)} questions")

# We need to remove 1 more to hit -8 total. Let me check for nos/nas
print("\n--- Searching for nos/nas contractions ---")
for q in questions:
    if q.get('correct') in ['nos', 'nas']:
        print(f"  Q{q['id']}: Unit {q['unit']} - {q.get('correct')} - {get_question_text(q)}")

print("\n" + "="*80)
print("STEP 2: ENHANCE - Possessives (Units 31-33)")
print("="*80)

# ========== ENHANCE UNITS 31-33: Possessives ==========
possessive_updates = [
    (31, 'Meu/Minha', 'Minha', 'Minhas', 98, 'm�e', 'm�es', 'mother', 'mothers'),
    (32, 'Seu/Sua', 'Sua', 'Suas', 100, 'casa', 'casas', 'house', 'houses'),
    (33, 'Nosso/Nossa', 'Nossa', 'Nossas', 102, 'amiga', 'amigas', 'friend', 'friends')
]

for unit_num, poss_name, old_poss, new_poss, q_id, pt_noun_sing, pt_noun_pl, en_noun_sing, en_noun_pl in possessive_updates:
    print(f"\n--- Unit {unit_num}: {poss_name} possessives ---")
    unit_qs = [q for q in questions if q['unit'] == unit_num]
    print(f"Found {len(unit_qs)} questions")

    # Find the question to modify
    for q in questions:
        if q['id'] == q_id:
            print(f"  MODIFYING Q{q['id']}: {old_poss} -> {new_poss}")

            before = copy.deepcopy(q)

            # Update template
            if 'template' in q:
                q['template'] = q['template'].replace(pt_noun_sing, pt_noun_pl)

            # Update English
            if 'en' in q:
                q['en'] = q['en'].replace(en_noun_sing, en_noun_pl)
                q['en'] = q['en'].replace(en_noun_sing.capitalize(), en_noun_pl.capitalize())

            # Update correct answer
            q['correct'] = new_poss

            # Update chips - replace old possessive with new
            if 'chips' in q:
                q['chips'] = [new_poss if chip == old_poss else chip for chip in q['chips']]

            modified_questions.append({
                'id': q['id'],
                'unit': q['unit'],
                'before': before,
                'after': copy.deepcopy(q),
                'change': f'Replace {old_poss} with {new_poss} for plural testing'
            })

            print(f"    BEFORE: {before['en']} -> {before['correct']}")
            print(f"    AFTER:  {q['en']} -> {q['correct']}")
            break

print("\n" + "="*80)
print("STEP 3: ENHANCE - Demonstratives (Unit 72)")
print("="*80)

# ========== ENHANCE UNIT 72: Demonstratives ==========
print("\n--- Unit 72: Demonstratives ---")
unit72_qs = [q for q in questions if q['unit'] == 72]
print(f"Found {len(unit72_qs)} questions")
for q in unit72_qs:
    print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

# Remove all existing Unit 72 questions (Q250, Q251, Q252)
for q in list(questions):
    if q['unit'] == 72:
        removed_questions.append({'id': q['id'], 'unit': q['unit'],
                                 'text': get_question_text(q), 'correct': get_answer(q),
                                 'reason': 'Replaced with gender/number enhanced questions'})
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}")

# Create 6 new demonstrative questions
new_demonstratives = [
    # este (masc.sing, near)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "comprehension",
        "pt": "Este livro é interessante",
        "question": "What does 'Este livro é interessante' mean?",
        "correct": "This book is interesting",
        "options": [
            "This book is interesting",
            "That book is interesting",
            "These books are interesting",
            "Those books are interesting",
            "The book is interesting",
            "This book was interesting"
        ]
    },
    # estas (fem.pl, near)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "production",
        "en": "These houses are big",
        "question": "How do you say 'These houses are big'?",
        "template": "__ casas s�o __",
        "correct": "Estas casas são grandes",
        "chips": [
            "Estas",
            "Estes",
            "Esta",
            "Este",
            "casas",
            "s�o",
            "grandes",
            "grande",
            "est�o",
            "casa"
        ]
    },
    # esse (masc.sing, medium)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "comprehension",
        "pt": "Esse carro é novo",
        "question": "What does 'Esse carro é novo' mean?",
        "correct": "That car is new",
        "options": [
            "That car is new",
            "This car is new",
            "Those cars are new",
            "These cars are new",
            "The car is new",
            "That car was new"
        ]
    },
    # essas (fem.pl, medium)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "production",
        "en": "Those girls are friends",
        "question": "How do you say 'Those girls are friends'?",
        "template": "__ meninas s�o __",
        "correct": "Essas meninas são amigas",
        "chips": [
            "Essas",
            "Esses",
            "Essa",
            "Esse",
            "meninas",
            "s�o",
            "amigas",
            "amiga",
            "est�o",
            "menina"
        ]
    },
    # aquele (masc.sing, far)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "comprehension",
        "pt": "Aquele homem é professor",
        "question": "What does 'Aquele homem é professor' mean?",
        "correct": "That man is a teacher",
        "options": [
            "That man is a teacher",
            "This man is a teacher",
            "Those men are teachers",
            "These men are teachers",
            "The man is a teacher",
            "That man was a teacher"
        ]
    },
    # aquelas (fem.pl, far)
    {
        "unit": 72,
        "unitName": "Demonstratives",
        "phase": 3,
        "type": "production",
        "en": "Those flowers are beautiful",
        "question": "How do you say 'Those flowers are beautiful'?",
        "template": "__ flores s�o __",
        "correct": "Aquelas flores são bonitas",
        "chips": [
            "Aquelas",
            "Aqueles",
            "Aquela",
            "Aquele",
            "flores",
            "s�o",
            "bonitas",
            "bonita",
            "est�o",
            "flor"
        ]
    }
]

# Find insertion point (after Unit 71, before Unit 73)
insert_position = len(questions)
for i, q in enumerate(questions):
    if q['unit'] > 72:
        insert_position = i
        break

# Insert new questions
for new_q in new_demonstratives:
    questions.insert(insert_position, new_q)
    insert_position += 1
    added_questions.append(new_q)
    print(f"  ADDED: {new_q['type']} - {get_question_text(new_q)}")

print(f"\nTOTAL ADDITIONS: {len(added_questions)} questions")

print("\n" + "="*80)
print("STEP 4: Renumber all questions sequentially")
print("="*80)

for i, q in enumerate(questions, 1):
    q['id'] = i

print(f"Renumbered {len(questions)} questions (1-{len(questions)})")

print("\n" + "="*80)
print("STEP 5: Update metadata")
print("="*80)

data['metadata']['version'] = '8.0.0'
data['metadata']['totalQuestions'] = len(questions)
data['metadata']['title'] = 'Portuguese Placement Test - Streamlined with Enhanced Coverage'
data['metadata']['description'] = 'Streamlined 2x2 matrices using diagonal testing (masc.sing + fem.pl). Enhanced possessives and demonstratives with full gender/number coverage.'
data['metadata']['changelog'] = 'v8.0: Strategic streamlining of 2x2 matrices (-8 questions). Enhanced possessives (Units 31-33) with plural forms. Enhanced demonstratives (Unit 72) with gender/number coverage (+3 questions). Total: 303 questions. ' + data['metadata']['changelog']

# Update phase ranges
data['phases'][3]['questionRange'][1] = len(questions)

print(f"Version: {data['metadata']['version']}")
print(f"Total questions: {data['metadata']['totalQuestions']}")

print("\n" + "="*80)
print("STEP 6: Save v8.0 file")
print("="*80)

with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v8.0-streamlined.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to: placement-test-questions-v8.0-streamlined.json")

print("\n" + "="*80)
print("SUMMARY REPORT")
print("="*80)

print(f"\n1. QUESTIONS REMOVED: {len(removed_questions)}")
for r in removed_questions:
    print(f"   Q{r['id']}: Unit {r['unit']} - {r['text']} -> {r['correct']}")
    print(f"      Reason: {r['reason']}")

print(f"\n2. QUESTIONS MODIFIED: {len(modified_questions)}")
for m in modified_questions:
    print(f"   Q{m['id']}: Unit {m['unit']}")
    print(f"      BEFORE: {m['before'].get('en', 'N/A')} -> {m['before']['correct']}")
    print(f"      AFTER:  {m['after'].get('en', 'N/A')} -> {m['after']['correct']}")
    print(f"      Change: {m['change']}")

print(f"\n3. QUESTIONS ADDED: {len(added_questions)}")
for a in added_questions:
    print(f"   Unit {a['unit']}: {a.get('en', a.get('pt', 'N/A'))} ({a['type']})")
    print(f"      -> {a['correct']}")

print(f"\n{'='*80}")
print(f"FINAL COUNT: {len(questions)} questions")
print(f"Expected: 303 questions")
print(f"Match: {'YES' if len(questions) == 303 else 'NO'}")

if len(questions) != 303:
    diff = len(questions) - 303
    print(f"Difference: {diff:+d} questions")
    print("\nNote: We removed {0} streamlining + 3 old Unit 72 = {1} total removals".format(
        len([r for r in removed_questions if 'Streamlining' in r['reason']]),
        len([r for r in removed_questions if 'Streamlining' in r['reason']]) + 3))
    print(f"      We added {len(added_questions)} new Unit 72 questions")
    print(f"      Net change: 308 - {len(removed_questions)} + {len(added_questions)} = {308 - len(removed_questions) + len(added_questions)}")

print(f"{'='*80}")
