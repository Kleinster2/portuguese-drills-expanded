import json

with open('config/placement-test-questions-grammar-v1.0.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Phase 2 target questions
targets = {
    'ele': ['28', '79', '82', '83', '88', '94', '115', '152'],
    'ela': ['32', '146', '147', '157', '247', '253'],
    'eles': ['85', '244', '250'],
    'elas': ['86', '256'],
    'vocês': ['84', '118', '156', '159', '163', '261', '264']
}

all_target_ids = []
for ids in targets.values():
    all_target_ids.extend(ids)

print("="*80)
print("PHASE 2 QUESTION ANALYSIS")
print("="*80)

found_questions = {}
for q in data['questions']:
    if q['id'] in all_target_ids:
        found_questions[q['id']] = q

# Process by target pronoun
for target_pronoun, ids in targets.items():
    print(f"\n{'='*80}")
    print(f"TARGET PRONOUN: {target_pronoun.upper()}")
    print(f"{'='*80}")
    
    for qid in ids:
        if qid in found_questions:
            q = found_questions[qid]
            print(f"\n--- Q{qid} ---")
            print(f"Current Subject: {q.get('subjectPronoun', 'N/A')}")
            print(f"Template: {q.get('portugueseTemplate', 'N/A')}")
            print(f"English: {q.get('englishSentence', 'N/A')}")
            print(f"Chips: {q.get('chips', [])}")
            if 'gender' in q:
                print(f"Gender field: {q['gender']}")
        else:
            print(f"\n--- Q{qid} ---")
            print("ERROR: Question not found!")

# Summary
print(f"\n{'='*80}")
print("VERIFICATION SUMMARY")
print(f"{'='*80}")
still_eu = []
already_converted = []
for qid in all_target_ids:
    if qid in found_questions:
        subj = found_questions[qid].get('subjectPronoun', 'N/A')
        if subj == 'eu':
            still_eu.append(qid)
        else:
            already_converted.append((qid, subj))
    else:
        print(f"ERROR: Q{qid} not found in file")

print(f"\nStill 'eu': {len(still_eu)} questions - {still_eu}")
if already_converted:
    print(f"\nAlready converted:")
    for qid, subj in already_converted:
        print(f"  Q{qid} -> {subj}")

