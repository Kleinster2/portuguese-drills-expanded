import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('placement-test-questions-v7.0-pragmatic-FULL.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data.get('questions', [])
critical = []
minor = []

for q in questions:
    qid = q.get('id')
    qtype = q.get('type')
    unit = q.get('unit')

    if qtype == 'comprehension':
        pt = q.get('pt', '')
        correct = q.get('correct', '')
        options = q.get('options', [])

        # CRITICAL: Tense ambiguity - present simple can also be continuous
        present_tense_checks = [
            ('falo', 'speak', 'speaking'),
            ('moro', 'live', 'living'),
            ('trabalho', 'work', 'working'),
            ('estudo', 'study', 'studying'),
            ('como', 'eat', 'eating'),
            ('bebo', 'drink', 'drinking'),
            ('abro', 'open', 'opening'),
            ('leio', 'read', 'reading'),
            ('escrevo', 'write', 'writing'),
            ('faço', 'do', 'doing'),
            ('vejo', 'see', 'seeing'),
            ('ouço', 'hear', 'hearing'),
            ('compro', 'buy', 'buying'),
            ('vendo', 'sell', 'selling'),
            ('aprendo', 'learn', 'learning'),
        ]

        for verb_pt, verb_en, verb_ing in present_tense_checks:
            if verb_pt in pt.lower() and f'I {verb_en}' in correct:
                alt = f'I am {verb_ing}'
                if alt not in ' '.join(options):
                    critical.append({
                        'id': qid, 'unit': unit, 'type': 'COMP',
                        'pt': pt, 'correct': correct, 'also': alt,
                        'issue': 'Present simple vs continuous - no temporal context',
                        'severity': 'CRITICAL'
                    })
                    break

        # CRITICAL: Question forms with você
        if 'Você' in pt and '?' in pt:
            question_checks = [
                ('fala', 'speak', 'speaking'),
                ('mora', 'live', 'living'),
                ('trabalha', 'work', 'working'),
                ('estuda', 'study', 'studying'),
                ('come', 'eat', 'eating'),
                ('bebe', 'drink', 'drinking'),
            ]
            for verb_pt, verb_en, verb_ing in question_checks:
                if verb_pt in pt.lower() and f'Do you {verb_en}' in correct:
                    alt = f'Are you {verb_ing}'
                    if alt not in ' '.join(options):
                        critical.append({
                            'id': qid, 'unit': unit, 'type': 'COMP',
                            'pt': pt, 'correct': correct, 'also': alt,
                            'issue': 'Question: present simple vs continuous',
                            'severity': 'CRITICAL'
                        })
                        break

        # MINOR: Preposition variations
        if 'no trabalho' in pt and 'at work' in correct.lower():
            if 'in work' not in ' '.join(options).lower():
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct, 'also': correct.replace('at work', 'in work'),
                    'issue': 'Preposition: at vs in work',
                    'severity': 'MINOR'
                })

        # MINOR: at home vs home
        if 'em casa' in pt and 'at home' in correct.lower():
            alt = correct.replace('at home', 'home')
            if alt != correct and alt not in options:
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct, 'also': alt,
                    'issue': 'at home vs home',
                    'severity': 'MINOR'
                })

        # MINOR: na escola - at school vs in school
        if 'na escola' in pt and 'at school' in correct.lower():
            if 'in school' not in ' '.join(options).lower():
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct, 'also': correct.replace('at school', 'in school'),
                    'issue': 'Preposition: at vs in school',
                    'severity': 'MINOR'
                })

    elif qtype == 'production':
        en = q.get('en', '')
        template = q.get('template', '')
        correct_chip = q.get('correct', '')
        chips = q.get('chips', [])

        # CRITICAL: Gender ambiguity
        if 'I am Brazilian' in en and 'brasileiro' in template:
            critical.append({
                'id': qid, 'unit': unit, 'type': 'PROD',
                'en': en, 'template': template, 'correct': correct_chip,
                'also': 'brasileira (if female)',
                'issue': 'Gender of speaker unknown',
                'severity': 'CRITICAL'
            })

        # Check tired = cansado/cansada
        if 'I am tired' in en and 'cansado' in template:
            if 'cansada' not in chips:
                critical.append({
                    'id': qid, 'unit': unit, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'cansada (if female)',
                    'issue': 'Gender ambiguity in adjective',
                    'severity': 'CRITICAL'
                })

        # MINOR: Formality você vs tu
        if 'You ' in en and 'Você' in template:
            tu_forms = ['tu', 'és', 'estás', 'tens']
            if any(tf in chips for tf in tu_forms):
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'tu form',
                    'issue': 'Formality: você vs tu',
                    'severity': 'MINOR'
                })

        # MINOR: Onde vs Aonde
        if 'where' in en.lower():
            if 'Onde' in chips and 'Aonde' in chips:
                if 'mora' in template or 'fica' in template or 'está' in template:
                    minor.append({
                        'id': qid, 'unit': unit, 'type': 'PROD',
                        'en': en, 'template': template, 'correct': correct_chip,
                        'also': 'Aonde (debatable)',
                        'issue': 'Onde vs Aonde usage',
                        'severity': 'MINOR'
                    })

# Write report
with open('ambiguity-report.txt', 'w', encoding='utf-8') as out:
    out.write('AMBIGUOUS QUESTION REPORT - v7.0\n')
    out.write('='*80 + '\n\n')
    out.write(f'Total questions analyzed: {len(questions)}\n')
    out.write(f'Critical ambiguity issues: {len(critical)}\n')
    out.write(f'Minor ambiguity issues: {len(minor)}\n\n')
    out.write('='*80 + '\n\n')

    out.write('CRITICAL ISSUES (Multiple clearly valid answers)\n')
    out.write('='*80 + '\n\n')

    for item in critical:
        out.write(f"Q{item['id']} (Unit {item['unit']}) [{item['type']}]\n")
        if 'pt' in item:
            out.write(f"  Portuguese: {item['pt']}\n")
            out.write(f"  Current correct: {item['correct']}\n")
        else:
            out.write(f"  English: {item['en']}\n")
            out.write(f"  Template: {item['template']}\n")
            out.write(f"  Current correct: {item['correct']}\n")
        out.write(f"  Also valid: {item['also']}\n")
        out.write(f"  Issue: {item['issue']}\n\n")

    out.write('\n' + '='*80 + '\n\n')
    out.write('MINOR ISSUES (Arguable edge cases)\n')
    out.write('='*80 + '\n\n')

    for item in minor:
        out.write(f"Q{item['id']} (Unit {item['unit']}) [{item['type']}]\n")
        if 'pt' in item:
            out.write(f"  Portuguese: {item['pt']}\n")
            out.write(f"  Current correct: {item['correct']}\n")
        else:
            out.write(f"  English: {item['en']}\n")
            out.write(f"  Template: {item['template']}\n")
            out.write(f"  Current correct: {item['correct']}\n")
        out.write(f"  Also valid: {item['also']}\n")
        out.write(f"  Issue: {item['issue']}\n\n")

    # Top 10 most problematic
    out.write('\n' + '='*80 + '\n\n')
    out.write('TOP 10 MOST PROBLEMATIC QUESTIONS\n')
    out.write('='*80 + '\n\n')

    # Sort by severity and ID
    all_issues = [(c, 'CRITICAL') for c in critical] + [(m, 'MINOR') for m in minor]
    all_issues.sort(key=lambda x: (0 if x[1] == 'CRITICAL' else 1, x[0]['id']))

    for item, sev in all_issues[:10]:
        out.write(f"Q{item['id']} [{item['type']}] - {sev}\n")
        if 'pt' in item:
            out.write(f"  PT: {item['pt']}\n")
            out.write(f"  Correct: \"{item['correct']}\"\n")
            out.write(f"  Also: \"{item['also']}\"\n")
        else:
            out.write(f"  EN: {item['en']}\n")
            out.write(f"  Template: {item['template']}\n")
            out.write(f"  Correct: {item['correct']}\n")
            out.write(f"  Also: {item['also']}\n")
        out.write(f"  Problem: {item['issue']}\n")

        # Suggest fix
        if 'Present simple vs continuous' in item['issue']:
            out.write(f"  Fix: Add temporal context (sempre, agora, etc.) to distinguish tense\n")
        elif 'Gender' in item['issue']:
            out.write(f"  Fix: Specify gender in question or accept both answers\n")
        elif 'Preposition' in item['issue']:
            out.write(f"  Fix: Accept both prepositions or use different location\n")
        elif 'Formality' in item['issue']:
            out.write(f"  Fix: Acceptable - test expects você (standard)\n")
        elif 'Onde' in item['issue']:
            out.write(f"  Fix: Use clearer context or accept regional variation\n")
        out.write('\n')

print('Report generated: ambiguity-report.txt')
print(f'Total: {len(critical)} critical, {len(minor)} minor issues')
