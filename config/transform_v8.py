import json
import copy

def get_question_text(q):
    """Get the Portuguese text from a question, handling different formats."""
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

original_questions = copy.deepcopy(data['questions'])
questions = data['questions']

# Track changes
removed_questions = []
modified_questions = []
added_questions = []

print("="*80)
print("STEP 1: STREAMLINING - Remove diagonal pairs from 2x2 matrices")
print("="*80)

# ========== STREAMLINE UNIT 2: de + article contractions ==========
print("\n--- Unit 2: de + article contractions (do/da/dos/das) ---")
unit2_questions = [q for q in questions if q['unit'] == 2]
print(f"Found {len(unit2_questions)} Unit 2 questions:")
for q in unit2_questions:
    print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

# Keep do + das (masc.sing + fem.pl), remove da + dos
# Based on the 'correct' field
unit2_to_remove = []
for q in unit2_questions:
    correct = q.get('correct', '')
    if correct == 'da':
        unit2_to_remove.append(q)
        print(f"  REMOVE (da): Q{q['id']}")
    elif correct == 'dos':
        unit2_to_remove.append(q)
        print(f"  REMOVE (dos): Q{q['id']}")

# ========== STREAMLINE UNIT 3: Definite Articles ==========
print("\n--- Unit 3: Definite Articles (o/a/os/as) ---")
unit3_questions = [q for q in questions if q['unit'] == 3]
print(f"Found {len(unit3_questions)} Unit 3 questions:")
for q in unit3_questions:
    print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

# Keep o + as (masc.sing + fem.pl), remove a + os
unit3_to_remove = []
for q in unit3_questions:
    if 'correct' in q:
        correct = q['correct']
        if correct == 'a':
            unit3_to_remove.append(q)
            print(f"  REMOVE (a): Q{q['id']}")
        elif correct == 'os':
            unit3_to_remove.append(q)
            print(f"  REMOVE (os): Q{q['id']}")
    elif 'pt' in q:
        # For comprehension questions, analyze the pt text
        pt = q['pt']
        # Count articles
        if pt.count(' a ') > 0 and pt.count(' o ') == 0 and pt.count(' as ') == 0:
            unit3_to_remove.append(q)
            print(f"  REMOVE (a): Q{q['id']}")
        elif pt.count(' os ') > 0 and pt.count(' o ') == 0 and pt.count(' as ') == 0:
            unit3_to_remove.append(q)
            print(f"  REMOVE (os): Q{q['id']}")

# ========== STREAMLINE UNIT 6: Adjective Agreement ==========
print("\n--- Unit 6: Adjective Agreement ---")
unit6_questions = [q for q in questions if q['unit'] == 6]
print(f"Found {len(unit6_questions)} Unit 6 questions:")
for q in unit6_questions:
    print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

# Keep masc.sing + fem.pl, remove fem.sing + masc.pl
# Analyze the text to determine which form is being tested
unit6_to_remove = []
for q in unit6_questions:
    text = get_question_text(q)
    # Look for adjective patterns - pequena/pequenos suggest singular fem / plural masc
    if 'pequena' in text.lower() or 'grande ' in text.lower():
        # Could be feminine singular
        if 'pequenas' not in text.lower() and 'pequeno' not in text.lower():
            unit6_to_remove.append(q)
            print(f"  REMOVE (likely fem.sing): Q{q['id']}")
    elif 'pequenos' in text.lower():
        if 'pequeno ' not in text.lower() and 'pequenas' not in text.lower():
            unit6_to_remove.append(q)
            print(f"  REMOVE (likely masc.pl): Q{q['id']}")

# ========== STREAMLINE em Contractions (no/na/nos/nas) ==========
print("\n--- em Contractions (no/na/nos/nas) ---")
# Search for questions testing em contractions
em_contraction_questions = []
for q in questions:
    if q.get('unitName') and 'em' in q.get('unitName', '').lower() and 'contraction' in q.get('unitName', '').lower():
        em_contraction_questions.append(q)
    elif 'correct' in q and q['correct'] in ['no', 'na', 'nos', 'nas']:
        # Check if it's a location/contraction context
        text = get_question_text(q)
        if 'template' in q:  # Production questions with templates
            em_contraction_questions.append(q)

print(f"Found {len(em_contraction_questions)} em contraction questions:")
for q in em_contraction_questions:
    print(f"  Q{q['id']}: Unit {q['unit']} - {get_question_text(q)} -> {get_answer(q)}")

# Keep no + nas (masc.sing + fem.pl), remove na + nos
em_to_remove = []
for q in em_contraction_questions:
    correct = q.get('correct', '')
    if correct == 'na':
        em_to_remove.append(q)
        print(f"  REMOVE (na): Q{q['id']}")
    elif correct == 'nos':
        em_to_remove.append(q)
        print(f"  REMOVE (nos): Q{q['id']}")

# ========== Consolidate removals ==========
all_removals = unit2_to_remove + unit3_to_remove + unit6_to_remove + em_to_remove
print(f"\n\nTOTAL STREAMLINING REMOVALS: {len(all_removals)} questions")

# Store removed questions for summary
for q in all_removals:
    removed_questions.append({
        'id': q['id'],
        'unit': q['unit'],
        'text': get_question_text(q),
        'correct': get_answer(q),
        'reason': 'Streamlining: Diagonal testing'
    })
    questions.remove(q)

print("\n" + "="*80)
print("STEP 2: ENHANCE - Possessives (Units 31-33)")
print("="*80)

# ========== ENHANCE UNITS 31-33: Possessives ==========
for unit_num, possessive_forms in [(31, 'meu/minha/meus/minhas'),
                                     (32, 'seu/sua/seus/suas'),
                                     (33, 'nosso/nossa/nossos/nossas')]:
    print(f"\n--- Unit {unit_num}: {possessive_forms.split('/')[0].capitalize()} possessives ---")
    unit_questions = [q for q in questions if q['unit'] == unit_num]
    print(f"Found {len(unit_questions)} questions:")
    for q in unit_questions:
        print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

    # Identify which question to replace (feminine singular)
    masc_form = possessive_forms.split('/')[0]  # meu, seu, nosso
    fem_sing_form = possessive_forms.split('/')[1]  # minha, sua, nossa
    fem_pl_form = possessive_forms.split('/')[3]  # minhas, suas, nossas

    for q in unit_questions:
        text = get_question_text(q)
        if fem_sing_form in text and masc_form not in text:
            # This is the feminine singular question - needs replacement with feminine plural
            print(f"  MODIFY: Q{q['id']} - Replace {fem_sing_form} with {fem_pl_form}")

            before = copy.deepcopy(q)

            # Determine the noun being used and its plural
            noun_mappings = {
                'livro': 'livros', 'carro': 'carros', 'casa': 'casas',
                'amiga': 'amigas', 'irmã': 'irmãs', 'mãe': 'mães',
                'filha': 'filhas', 'tia': 'tias', 'prima': 'primas',
                'caneta': 'canetas', 'bolsa': 'bolsas', 'chave': 'chaves'
            }

            # Replace possessive
            if 'pt' in q:
                for sing, plur in noun_mappings.items():
                    if sing in q['pt']:
                        q['pt'] = q['pt'].replace(fem_sing_form, fem_pl_form)
                        q['pt'] = q['pt'].replace(sing, plur)
                        break

            if 'template' in q:
                for sing, plur in noun_mappings.items():
                    if sing in q['template']:
                        q['template'] = q['template'].replace(fem_sing_form, fem_pl_form)
                        q['template'] = q['template'].replace(sing, plur)
                        break

            if 'en' in q:
                # Update English - make plural
                en_noun_mappings = {
                    'book': 'books', 'car': 'cars', 'house': 'houses',
                    'friend': 'friends', 'sister': 'sisters', 'mother': 'mothers',
                    'daughter': 'daughters', 'aunt': 'aunts', 'cousin': 'cousins',
                    'pen': 'pens', 'bag': 'bags', 'key': 'keys'
                }
                for sing, plur in en_noun_mappings.items():
                    if sing in q['en'].lower():
                        q['en'] = q['en'].replace(sing, plur)
                        q['en'] = q['en'].replace(sing.capitalize(), plur.capitalize())
                        break

            # Update correct answer
            if 'correct' in q:
                if q['type'] == 'comprehension':
                    # English - make plural
                    for sing, plur in en_noun_mappings.items():
                        if sing in q['correct'].lower():
                            q['correct'] = q['correct'].replace(sing, plur)
                            break
                else:
                    # Production - update if needed
                    q['correct'] = fem_pl_form

            # Update options for comprehension
            if 'options' in q:
                new_options = []
                for opt in q['options']:
                    if opt == before.get('correct'):
                        new_options.append(q['correct'])
                    else:
                        new_options.append(opt)
                q['options'] = new_options

            # Update chips for production
            if 'chips' in q and fem_sing_form in q['chips']:
                q['chips'] = [fem_pl_form if chip == fem_sing_form else chip for chip in q['chips']]

            modified_questions.append({
                'id': q['id'],
                'unit': q['unit'],
                'before': before,
                'after': copy.deepcopy(q),
                'change': f'Replace {fem_sing_form} with {fem_pl_form} for diagonal testing'
            })

print("\n" + "="*80)
print("STEP 3: ENHANCE - Demonstratives (Unit 72)")
print("="*80)

# ========== ENHANCE UNIT 72: Demonstratives ==========
print("\n--- Unit 72: Demonstratives ---")
unit72_questions = [q for q in questions if q['unit'] == 72]
print(f"Found {len(unit72_questions)} questions:")
for q in unit72_questions:
    print(f"  Q{q['id']}: {get_question_text(q)} -> {get_answer(q)}")

# Remove all existing Unit 72 questions
for q in unit72_questions:
    removed_questions.append({
        'id': q['id'],
        'unit': q['unit'],
        'text': get_question_text(q),
        'correct': get_answer(q),
        'reason': 'Replaced with gender/number enhanced questions'
    })
    questions.remove(q)

# Create 6 new demonstrative questions with diagonal testing
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
        "correct": "Estas casas são grandes",
        "chips": [
            "Estas",
            "Estes",
            "Esta",
            "casas",
            "são",
            "grandes",
            "grande",
            "est�o",
            "é",
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
        "correct": "Essas meninas são amigas",
        "chips": [
            "Essas",
            "Esses",
            "Essa",
            "meninas",
            "são",
            "amigas",
            "amiga",
            "est�o",
            "é",
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
        "correct": "Aquelas flores são bonitas",
        "chips": [
            "Aquelas",
            "Aqueles",
            "Aquela",
            "flores",
            "são",
            "bonitas",
            "bonita",
            "est�o",
            "é",
            "flor"
        ]
    }
]

# Find the position where Unit 72 questions were
insert_position = len(questions)
for i, q in enumerate(questions):
    if q['unit'] > 72:
        insert_position = i
        break

# Insert new demonstrative questions
for new_q in new_demonstratives:
    questions.insert(insert_position, new_q)
    insert_position += 1
    added_questions.append(new_q)
    print(f"  ADD: {get_question_text(new_q)} ({new_q['type']})")

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

print(f"Updated metadata:")
print(f"  Version: {data['metadata']['version']}")
print(f"  Total questions: {data['metadata']['totalQuestions']}")

print("\n" + "="*80)
print("STEP 6: Save v8.0 file")
print("="*80)

with open('C:/Users/klein/cascadeprojects/portuguese-drills-expanded/config/placement-test-questions-v8.0-streamlined.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to: placement-test-questions-v8.0-streamlined.json")

print("\n" + "="*80)
print("SUMMARY REPORT")
print("="*80)

print(f"\nQUESTIONS REMOVED: {len(removed_questions)}")
for r in removed_questions:
    print(f"  Q{r['id']}: Unit {r['unit']} - {r['text']} -> {r['correct']}")
    print(f"    Reason: {r['reason']}")

print(f"\nQUESTIONS MODIFIED: {len(modified_questions)}")
for m in modified_questions:
    print(f"  Q{m['id']}: Unit {m['unit']}")
    print(f"    BEFORE: {get_question_text(m['before'])} -> {m['before'].get('correct', 'N/A')}")
    print(f"    AFTER:  {get_question_text(m['after'])} -> {m['after'].get('correct', 'N/A')}")
    print(f"    Change: {m['change']}")

print(f"\nQUESTIONS ADDED: {len(added_questions)}")
for a in added_questions:
    print(f"  Unit {a['unit']}: {get_question_text(a)} ({a['type']})")
    print(f"    -> {a.get('correct', 'N/A')}")

print(f"\n{'='*80}")
print(f"FINAL COUNT: {len(questions)} questions")
print(f"Expected: 303 questions")
print(f"Match: {'YES' if len(questions) == 303 else 'NO'}")
print(f"{'='*80}")
