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
    unit_name = q.get('unitName', '')

    if qtype == 'comprehension':
        pt = q.get('pt', '')
        correct = q.get('correct', '')
        options = q.get('options', [])

        # CRITICAL: Present tense ambiguity (dynamic verbs only)
        # Portuguese present tense can mean both English simple and continuous
        dynamic_verbs = [
            ('falo', 'I speak', 'I am speaking'),
            ('moro', 'I live', 'I am living'),
            ('trabalho', 'I work', 'I am working'),
            ('estudo', 'I study', 'I am studying'),
            ('como', 'I eat', 'I am eating'),
            ('bebo', 'I drink', 'I am drinking'),
            ('abro', 'I open', 'I am opening'),
            ('leio', 'I read', 'I am reading'),
            ('escrevo', 'I write', 'I am writing'),
            ('faço', 'I do', 'I am doing'),
            ('compro', 'I buy', 'I am buying'),
            ('vendo', 'I sell', 'I am selling'),
            ('aprendo', 'I learn', 'I am learning'),
            ('corro', 'I run', 'I am running'),
            ('ando', 'I walk', 'I am walking'),
        ]

        for pt_verb, en_simple, en_cont in dynamic_verbs:
            if pt_verb in pt.lower() and en_simple in correct:
                # Check if continuous form is in options
                if not any(en_cont.lower() in opt.lower() for opt in options):
                    critical.append({
                        'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'COMP',
                        'pt': pt, 'correct': correct, 'also': en_cont,
                        'issue': 'Tense ambiguity',
                        'detail': f'Portuguese present can be English simple OR continuous',
                        'severity': 'CRITICAL'
                    })
                break

        # CRITICAL: Question forms - Do you X vs Are you Xing
        if 'Você' in pt and '?' in pt:
            question_verbs = [
                ('fala', 'Do you speak', 'Are you speaking'),
                ('mora', 'Do you live', 'Are you living'),
                ('trabalha', 'Do you work', 'Are you working'),
                ('estuda', 'Do you study', 'Are you studying'),
                ('come', 'Do you eat', 'Are you eating'),
                ('bebe', 'Do you drink', 'Are you drinking'),
            ]
            for pt_verb, en_simple, en_cont in question_verbs:
                if pt_verb in pt.lower() and en_simple in correct:
                    if not any(en_cont.lower() in opt.lower() for opt in options):
                        critical.append({
                            'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'COMP',
                            'pt': pt, 'correct': correct, 'also': en_cont,
                            'issue': 'Question tense ambiguity',
                            'detail': f'Portuguese question can be simple OR continuous',
                            'severity': 'CRITICAL'
                        })
                    break

        # MINOR: Preposition variations
        prep_checks = [
            ('no trabalho', 'at work', 'in work'),
            ('na escola', 'at school', 'in school'),
            ('no hospital', 'at the hospital', 'in the hospital'),
        ]

        for pt_prep, en_std, en_alt in prep_checks:
            if pt_prep in pt.lower() and en_std.lower() in correct.lower():
                if not any(en_alt.lower() in opt.lower() for opt in options):
                    minor.append({
                        'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'COMP',
                        'pt': pt, 'correct': correct, 'also': en_alt,
                        'issue': 'Preposition variation',
                        'detail': f'Both "{en_std}" and "{en_alt}" acceptable',
                        'severity': 'MINOR'
                    })
                break

        # MINOR: "at home" vs "home"
        if 'em casa' in pt and 'at home' in correct.lower():
            alt = correct.replace('at home', 'home').replace('At home', 'Home')
            if not any(alt == opt for opt in options):
                minor.append({
                    'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'COMP',
                    'pt': pt, 'correct': correct, 'also': alt,
                    'issue': 'Home preposition',
                    'detail': '"at home" vs "home" - both acceptable in English',
                    'severity': 'MINOR'
                })

    elif qtype == 'production':
        en = q.get('en', '')
        template = q.get('template', '')
        correct_chip = q.get('correct', '')
        chips = q.get('chips', [])

        # CRITICAL: Gender ambiguity in first-person statements
        # When "I am [gendered adjective/noun]" without context

        # Check brasileiro/brasileira specifically
        if 'I am Brazilian' in en and 'brasileiro' in template:
            critical.append({
                'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'PROD',
                'en': en, 'template': template, 'correct': correct_chip,
                'also': 'Template should allow both brasileiro/brasileira',
                'issue': 'Gender assumption',
                'detail': 'Speaker gender unknown - template assumes masculine',
                'severity': 'CRITICAL'
            })

        # Check other gendered adjectives
        gender_adjectives = [
            ('tired', 'cansado', 'cansada'),
            ('tall', 'alto', 'alta'),
            ('short', 'baixo', 'baixa'),
            ('beautiful', 'bonito', 'bonita'),
            ('handsome', 'bonito', 'bonita'),
            ('ugly', 'feio', 'feia'),
        ]

        if 'I am ' in en:
            for en_adj, masc, fem in gender_adjectives:
                if en_adj in en.lower() and masc in template.lower():
                    if fem not in chips and fem != masc:
                        critical.append({
                            'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'PROD',
                            'en': en, 'template': template, 'correct': correct_chip,
                            'also': f'{fem} (if female speaker)',
                            'issue': f'Gender ambiguity - {masc}/{fem}',
                            'detail': 'Speaker gender unknown',
                            'severity': 'CRITICAL'
                        })
                    break

        # MINOR: Formality (você vs tu)
        if 'You ' in en and 'Você' in template:
            tu_indicators = ['tu', 'és', 'estás', 'tens']
            if any(form in chips for form in tu_indicators):
                minor.append({
                    'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'tu form',
                    'issue': 'Formality variation',
                    'detail': 'Test expects você (standard), but tu valid regionally',
                    'severity': 'MINOR'
                })

        # MINOR: Onde vs Aonde (only if both in chips)
        if 'where' in en.lower() and 'Onde' in chips and 'Aonde' in chips:
            # Static location verbs use "onde"
            static_verbs = ['mora', 'fica', 'está', 'é']
            if any(v in template.lower() for v in static_verbs):
                minor.append({
                    'id': qid, 'unit': unit, 'unit_name': unit_name, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'Aonde (common error)',
                    'issue': 'Onde vs Aonde',
                    'detail': 'Onde = where (static), Aonde = to where (motion)',
                    'severity': 'MINOR'
                })

# Generate comprehensive report
with open('FINAL-AMBIGUITY-REPORT.txt', 'w', encoding='utf-8') as out:
    out.write('='*80 + '\n')
    out.write('AMBIGUOUS QUESTION REPORT - v7.0 PLACEMENT TEST\n')
    out.write('Final Comprehensive Analysis\n')
    out.write('='*80 + '\n\n')

    out.write(f'Total questions analyzed: {len(questions)}\n')
    out.write(f'CRITICAL ambiguity issues: {len(critical)}\n')
    out.write(f'MINOR ambiguity issues: {len(minor)}\n\n')

    # Breakdown by type
    tense_crit = [c for c in critical if 'tense' in c['issue'].lower()]
    gender_crit = [c for c in critical if 'gender' in c['issue'].lower()]
    prep_min = [m for m in minor if 'preposition' in m['issue'].lower()]
    formal_min = [m for m in minor if 'formality' in m['issue'].lower()]

    out.write('BREAKDOWN BY ISSUE TYPE:\n')
    out.write(f'  Critical - Tense ambiguity: {len(tense_crit)}\n')
    out.write(f'  Critical - Gender ambiguity: {len(gender_crit)}\n')
    out.write(f'  Minor - Preposition variation: {len(prep_min)}\n')
    out.write(f'  Minor - Formality variation: {len(formal_min)}\n')
    out.write(f'  Other: {len(critical) + len(minor) - len(tense_crit) - len(gender_crit) - len(prep_min) - len(formal_min)}\n\n')

    out.write('='*80 + '\n\n')
    out.write('CRITICAL ISSUES (Multiple clearly valid answers)\n')
    out.write('='*80 + '\n\n')

    for i, item in enumerate(critical, 1):
        out.write(f"{i}. Q{item['id']} (Unit {item['unit']}: {item['unit_name']}) [{item['type']}]\n")
        if 'pt' in item:
            out.write(f"   Portuguese: \"{item['pt']}\"\n")
            out.write(f"   Current correct: \"{item['correct']}\"\n")
            out.write(f"   Also valid: \"{item['also']}\"\n")
        else:
            out.write(f"   English: \"{item['en']}\"\n")
            out.write(f"   Template: \"{item['template']}\"\n")
            out.write(f"   Current correct: \"{item['correct']}\"\n")
            out.write(f"   Also valid: {item['also']}\n")
        out.write(f"   Issue: {item['issue']}\n")
        out.write(f"   Detail: {item['detail']}\n\n")

    out.write('='*80 + '\n\n')
    out.write('MINOR ISSUES (Arguable edge cases)\n')
    out.write('='*80 + '\n\n')

    for i, item in enumerate(minor, 1):
        out.write(f"{i}. Q{item['id']} (Unit {item['unit']}: {item['unit_name']}) [{item['type']}]\n")
        if 'pt' in item:
            out.write(f"   Portuguese: \"{item['pt']}\"\n")
            out.write(f"   Current correct: \"{item['correct']}\"\n")
            out.write(f"   Also valid: \"{item['also']}\"\n")
        else:
            out.write(f"   English: \"{item['en']}\"\n")
            out.write(f"   Template: \"{item['template']}\"\n")
            out.write(f"   Current correct: \"{item['correct']}\"\n")
            out.write(f"   Also valid: {item['also']}\n")
        out.write(f"   Issue: {item['issue']}\n")
        out.write(f"   Detail: {item['detail']}\n\n")

    # Top 10 most problematic
    out.write('='*80 + '\n\n')
    out.write('TOP 10 MOST PROBLEMATIC QUESTIONS WITH SUGGESTED FIXES\n')
    out.write('='*80 + '\n\n')

    all_issues = [(c, 'CRITICAL') for c in critical] + [(m, 'MINOR') for m in minor]
    all_issues.sort(key=lambda x: (0 if x[1] == 'CRITICAL' else 1, x[0]['id']))

    for i, (item, sev) in enumerate(all_issues[:10], 1):
        out.write(f"{i}. Q{item['id']} [{item['type']}] - {sev}\n")
        if 'pt' in item:
            out.write(f"   PT: \"{item['pt']}\"\n")
            out.write(f"   Correct: \"{item['correct']}\"\n")
            out.write(f"   Also valid: \"{item['also']}\"\n")
        else:
            out.write(f"   EN: \"{item['en']}\"\n")
            out.write(f"   Template: \"{item['template']}\"\n")
            out.write(f"   Correct: \"{item['correct']}\"\n")
            out.write(f"   Also: {item['also']}\n")
        out.write(f"   Problem: {item['detail']}\n")

        # Specific fix recommendations
        if 'Tense' in item['issue']:
            out.write(f"   FIX: Add temporal context to Portuguese sentence:\n")
            out.write(f"        - For habitual/general: add 'sempre', 'todos os dias', 'geralmente'\n")
            out.write(f"        - For ongoing: add 'agora', 'neste momento', 'atualmente'\n")
            if 'pt' in item:
                out.write(f"        Example: \"{item['pt']}\" → \"Eu sempre falo português\" (habitual)\n")
        elif 'Gender' in item['issue']:
            out.write(f"   FIX: One of the following:\n")
            out.write(f"        1. Add gender context (name, avatar, 'male'/'female' indicator)\n")
            out.write(f"        2. Modify template to have 2 blanks: \"Eu __ brasileir__\"\n")
            out.write(f"        3. Accept both masculine/feminine as correct answers\n")
        elif 'Preposition' in item['issue']:
            out.write(f"   FIX: Accept both prepositions as correct (add to alternatives array)\n")
        elif 'home' in item['issue'].lower():
            out.write(f"   FIX: Accept both 'at home' and 'home' (add to alternatives array)\n")
        elif 'Formality' in item['issue']:
            out.write(f"   FIX: Acceptable - test standardizes on 'você' (Brazilian standard)\n")
            out.write(f"        Note: 'tu' is valid but regional (RS, Nordeste)\n")
        elif 'Onde' in item['issue']:
            out.write(f"   FIX: Keep 'Onde' as only correct answer (prescriptive grammar)\n")
            out.write(f"        Note: 'Aonde' is motion (vai aonde = where to), not location\n")
        out.write('\n')

print('=' * 60)
print('FINAL AMBIGUITY REPORT GENERATED')
print('=' * 60)
print(f'File: FINAL-AMBIGUITY-REPORT.txt')
print(f'Total questions analyzed: {len(questions)}')
print(f'CRITICAL issues: {len(critical)}')
print(f'MINOR issues: {len(minor)}')
print()
print('Breakdown:')
print(f'  - Tense ambiguity (CRITICAL): {len(tense_crit)}')
print(f'  - Gender ambiguity (CRITICAL): {len(gender_crit)}')
print(f'  - Preposition variation (MINOR): {len(prep_min)}')
print(f'  - Formality variation (MINOR): {len(formal_min)}')
print('=' * 60)
