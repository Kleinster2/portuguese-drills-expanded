# -*- coding: utf-8 -*-
import json
import copy
import sys

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

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
print("\n--- Unit 2: de + article contractions (do/da/dos/das) ---")
unit2_qs = [q for q in questions if q['unit'] == 2]
print(f"Found {len(unit2_qs)} questions")
for q in unit2_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# Remove da (Q5) and dos (Q6), keep do (Q4) and das (Q7)
to_remove_ids = [5, 6]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Streamlining Unit 2: keep do+das diagonal'
        })
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# ========== STREAMLINE UNIT 3: Definite Articles (O/A/Os/As) ==========
print("\n--- Unit 3: Definite Articles (O/A/Os/As) ---")
unit3_qs = [q for q in questions if q['unit'] == 3]
print(f"Found {len(unit3_qs)} questions")
for q in unit3_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# Remove A (Q9) and Os (Q10), keep O (Q8) and As (Q11)
to_remove_ids = [9, 10]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Streamlining Unit 3: keep O+As diagonal'
        })
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# ========== STREAMLINE UNIT 4: Indefinite Articles (um/uma/uns/umas) ==========
print("\n--- Unit 4: Indefinite Articles (um/uma/uns/umas) ---")
unit4_qs = [q for q in questions if q['unit'] == 4]
print(f"Found {len(unit4_qs)} questions")
for q in unit4_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# Remove uma (Q13) and uns (Q14), keep um (Q12) and umas (Q15)
to_remove_ids = [13, 14]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Streamlining Unit 4: keep um+umas diagonal'
        })
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# ========== STREAMLINE UNIT 6: Adjective Agreement (alto/alta/altos/altas) ==========
print("\n--- Unit 6: Adjective Agreement (alto/alta/altos/altas) ---")
unit6_qs = [q for q in questions if q['unit'] == 6]
print(f"Found {len(unit6_qs)} questions")
for q in unit6_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# Remove alta (Q20) and altos (Q21), keep alto (Q19) and altas (Q22)
to_remove_ids = [20, 21]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Streamlining Unit 6: keep alto+altas diagonal'
        })
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# ========== STREAMLINE Unit 9: em contractions (no/na) ==========
print("\n--- Unit 9: em contractions (no/na) ---")
unit9_qs = [q for q in questions if q['unit'] == 9 and 'template' in q]
print(f"Found {len(unit9_qs)} production questions")
for q in unit9_qs:
    print(f"  Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

# Remove na (Q29), keep no (Q28)
to_remove_ids = [29]
for q in list(questions):
    if q['id'] in to_remove_ids:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Streamlining Unit 9: keep only no'
        })
        questions.remove(q)
        print(f"  REMOVED Q{q['id']}: {q.get('correct')} - {q.get('en', '')}")

print(f"\nTOTAL STREAMLINING REMOVALS: {len(removed_questions)} questions")

print("\n" + "="*80)
print("STEP 2: ENHANCE - Possessives (Units 31-33)")
print("="*80)

# ========== ENHANCE UNITS 31-33: Possessives ==========
possessive_updates = [
    # (unit, name, old_possessive, new_possessive, question_id, pt_noun_singular, pt_noun_plural, en_singular, en_plural)
    (31, 'Meu/Minha', 'Minha', 'Minhas', 98, 'mãe', 'mães', 'mother', 'mothers'),
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

            # Update template if present
            if 'template' in q:
                q['template'] = q['template'].replace(pt_noun_sing, pt_noun_pl)

            # Update English - handle singular verb to plural correctly
            if 'en' in q:
                q['en'] = q['en'].replace(en_noun_sing, en_noun_pl)
                q['en'] = q['en'].replace(en_noun_sing.capitalize(), en_noun_pl.capitalize())
                # Fix verb agreement (works -> work, studies -> study)
                q['en'] = q['en'].replace(' works', ' work')
                q['en'] = q['en'].replace(' studies', ' study')
                q['en'] = q['en'].replace(' lives', ' live')
                q['en'] = q['en'].replace(' is ', ' are ')

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
    print(f"  Q{q['id']}: {q.get('en', q.get('pt', 'N/A'))}")

# Remove all existing Unit 72 questions (Q250, Q251, Q252)
for q in list(questions):
    if q['unit'] == 72:
        removed_questions.append({
            'id': q['id'], 'unit': q['unit'],
            'text': get_question_text(q), 'correct': get_answer(q),
            'en': q.get('en', ''),
            'reason': 'Replaced with gender/number enhanced questions'
        })
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
        "template": "__ casas são __",
        "correct": "Estas casas são grandes",
        "chips": [
            "Estas",
            "Estes",
            "Esta",
            "Este",
            "casas",
            "são",
            "grandes",
            "grande",
            "estão",
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
        "template": "__ meninas são __",
        "correct": "Essas meninas são amigas",
        "chips": [
            "Essas",
            "Esses",
            "Essa",
            "Esse",
            "meninas",
            "são",
            "amigas",
            "amiga",
            "estão",
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
        "template": "__ flores são __",
        "correct": "Aquelas flores são bonitas",
        "chips": [
            "Aquelas",
            "Aqueles",
            "Aquela",
            "Aquele",
            "flores",
            "são",
            "bonitas",
            "bonita",
            "estão",
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
    en_or_pt = new_q.get('en', new_q.get('pt', 'N/A'))
    print(f"  ADDED: {new_q['type'][:4]} - {en_or_pt}")

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
    en_text = r.get('en', r['text'])
    print(f"   Q{r['id']}: Unit {r['unit']} - {r['correct']} - {en_text}")
    print(f"      Reason: {r['reason']}")

print(f"\n2. QUESTIONS MODIFIED: {len(modified_questions)}")
for m in modified_questions:
    print(f"   Q{m['id']}: Unit {m['unit']}")
    print(f"      BEFORE: {m['before'].get('en', 'N/A')} -> {m['before']['correct']}")
    print(f"      AFTER:  {m['after'].get('en', 'N/A')} -> {m['after']['correct']}")
    print(f"      Change: {m['change']}")

print(f"\n3. QUESTIONS ADDED: {len(added_questions)}")
for a in added_questions:
    en_or_pt = a.get('en', a.get('pt', 'N/A'))
    print(f"   Unit {a['unit']}: {en_or_pt} ({a['type']})")
    print(f"      -> {a['correct']}")

print(f"\n{'='*80}")
print(f"FINAL COUNT: {len(questions)} questions")
print(f"Expected: 303 questions")
print(f"Match: {'YES ✓' if len(questions) == 303 else 'NO ✗'}")

if len(questions) != 303:
    diff = len(questions) - 303
    print(f"Difference: {diff:+d} questions")
    streamlining_removals = len([r for r in removed_questions if 'Streamlining' in r['reason']])
    unit72_removals = len([r for r in removed_questions if 'Unit 72' in r['reason'] or r['unit'] == 72])
    print(f"\nBreakdown:")
    print(f"  Original: 308 questions")
    print(f"  Streamlining removals: -{streamlining_removals}")
    print(f"  Unit 72 removals: -{unit72_removals}")
    print(f"  Unit 72 additions: +{len(added_questions)}")
    print(f"  Net: 308 - {streamlining_removals} - {unit72_removals} + {len(added_questions)} = {308 - streamlining_removals - unit72_removals + len(added_questions)}")

print(f"{'='*80}")

# Verify diagonal testing
print("\n" + "="*80)
print("VERIFICATION: Diagonal Testing Coverage")
print("="*80)

# Check Unit 2
unit2_remaining = [q for q in questions if q['unit'] == 2]
print(f"\nUnit 2 (de contractions): {len(unit2_remaining)} questions")
for q in unit2_remaining:
    print(f"  {q.get('correct')}: {q.get('en', '')}")

# Check Unit 3
unit3_remaining = [q for q in questions if q['unit'] == 3]
print(f"\nUnit 3 (definite articles): {len(unit3_remaining)} questions")
for q in unit3_remaining:
    print(f"  {q.get('correct')}: {q.get('en', '')}")

# Check Unit 4
unit4_remaining = [q for q in questions if q['unit'] == 4]
print(f"\nUnit 4 (indefinite articles): {len(unit4_remaining)} questions")
for q in unit4_remaining:
    print(f"  {q.get('correct')}: {q.get('en', '')}")

# Check Unit 6
unit6_remaining = [q for q in questions if q['unit'] == 6]
print(f"\nUnit 6 (adjective agreement): {len(unit6_remaining)} questions")
for q in unit6_remaining:
    print(f"  {q.get('correct')}: {q.get('en', '')}")

# Check Units 31-33
for unit_num in [31, 32, 33]:
    unit_remaining = [q for q in questions if q['unit'] == unit_num]
    print(f"\nUnit {unit_num} (possessives): {len(unit_remaining)} questions")
    for q in unit_remaining:
        print(f"  {q.get('correct')}: {q.get('en', '')}")

# Check Unit 72
unit72_remaining = [q for q in questions if q['unit'] == 72]
print(f"\nUnit 72 (demonstratives): {len(unit72_remaining)} questions")
for q in unit72_remaining:
    demo = q.get('pt', q.get('template', '')).split()[0] if q.get('pt') or q.get('template') else q.get('correct', '')
    print(f"  {demo}: {q.get('en', q.get('pt', ''))}")

print(f"\n{'='*80}")
