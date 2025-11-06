import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('placement-test-questions-v7.0-pragmatic-FULL.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data.get('questions', [])
critical = []
minor = []

# Stative verbs that don't normally take continuous form in English
stative_verbs = ['like', 'love', 'want', 'need', 'know', 'understand', 'believe', 'prefer', 'hate']

for q in questions:
    qid = q.get('id')
    qtype = q.get('type')
    unit = q.get('unit')

    if qtype == 'comprehension':
        pt = q.get('pt', '')
        correct = q.get('correct', '')
        options = q.get('options', [])

        # CRITICAL: Tense ambiguity - present simple can also be continuous
        # But ONLY for dynamic verbs, not stative verbs
        present_tense_checks = [
            ('falo', 'speak', 'speaking', False),  # dynamic
            ('moro', 'live', 'living', False),      # dynamic
            ('trabalho', 'work', 'working', False), # dynamic
            ('estudo', 'study', 'studying', False), # dynamic
            ('como', 'eat', 'eating', False),       # dynamic
            ('bebo', 'drink', 'drinking', False),   # dynamic
            ('abro', 'open', 'opening', False),     # dynamic
            ('leio', 'read', 'reading', False),     # dynamic
            ('escrevo', 'write', 'writing', False), # dynamic
            ('faço', 'do', 'doing', False),         # dynamic
            ('vejo', 'see', 'seeing', False),       # dynamic (can be continuous)
            ('ouço', 'hear', 'hearing', False),     # dynamic (can be continuous)
            ('compro', 'buy', 'buying', False),     # dynamic
            ('vendo', 'sell', 'selling', False),    # dynamic
            ('aprendo', 'learn', 'learning', False),# dynamic
            ('gosto', 'like', 'liking', True),      # STATIVE - skip
        ]

        for verb_pt, verb_en, verb_ing, is_stative in present_tense_checks:
            if is_stative:
                continue

            if verb_pt in pt.lower() and f'I {verb_en}' in correct:
                alt = f'I am {verb_ing}'
                # Check if the alternative is in ANY option
                if not any(alt in opt for opt in options):
                    critical.append({
                        'id': qid, 'unit': unit, 'type': 'COMP',
                        'pt': pt, 'correct': correct, 'also': alt,
                        'issue': 'Present simple vs continuous - no temporal context',
                        'severity': 'CRITICAL'
                    })
                    break

        # CRITICAL: Question forms with você - check if continuous form is missing
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
                    if not any(alt in opt for opt in options):
                        critical.append({
                            'id': qid, 'unit': unit, 'type': 'COMP',
                            'pt': pt, 'correct': correct, 'also': alt,
                            'issue': 'Question: present simple vs continuous',
                            'severity': 'CRITICAL'
                        })
                        break

        # MINOR: Preposition variations
        if 'no trabalho' in pt and 'at work' in correct.lower():
            if not any('in work' in opt.lower() for opt in options):
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct,
                    'also': correct.replace('at work', 'in work'),
                    'issue': 'Preposition: "at work" vs "in work" (at work is standard)',
                    'severity': 'MINOR'
                })

        # MINOR: at home vs home
        if 'em casa' in pt and 'at home' in correct.lower():
            # Check if just "home" (without "at") appears in any option
            home_only = correct.replace('at home', 'home')
            if home_only != correct and not any(home_only == opt for opt in options):
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct, 'also': home_only,
                    'issue': '"at home" vs "home" (both acceptable in modern English)',
                    'severity': 'MINOR'
                })

        # MINOR: na escola - at school vs in school
        if 'na escola' in pt and 'at school' in correct.lower():
            if not any('in school' in opt.lower() for opt in options):
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'COMP',
                    'pt': pt, 'correct': correct,
                    'also': correct.replace('at school', 'in school'),
                    'issue': 'Preposition: "at school" vs "in school" (both acceptable)',
                    'severity': 'MINOR'
                })

    elif qtype == 'production':
        en = q.get('en', '')
        template = q.get('template', '')
        correct_chip = q.get('correct', '')
        chips = q.get('chips', [])

        # CRITICAL: Gender ambiguity - only for gendered adjectives/nouns
        # Check brasileiro/brasileira
        if 'I am Brazilian' in en and 'brasileiro' in template:
            # The template has "brasileiro" hardcoded, so it's asking for gender
            # This is actually testing the VERB (sou), not the adjective
            # So this is a FALSE POSITIVE - the template already specifies masculine
            # Actually, wait - let me check the template more carefully
            if '__ brasileiro' in template:  # If brasileiro is in template, it's fixed
                # This means the question is assuming masculine speaker
                # Without context, this IS ambiguous
                critical.append({
                    'id': qid, 'unit': unit, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'Template should be "__ brasileir__" with both chips',
                    'issue': 'Gender assumed in template without context',
                    'severity': 'CRITICAL'
                })

        # Check for adjectives where gender matters but isn't specified
        # If "I am [adjective]" and template has gendered adjective
        if 'I am ' in en:
            gender_pairs = [
                ('tired', 'cansado', 'cansada'),
                ('happy', 'feliz', 'feliz'),  # invariable
                ('tall', 'alto', 'alta'),
                ('short', 'baixo', 'baixa'),
                ('beautiful', 'bonito', 'bonita'),
                ('ugly', 'feio', 'feia'),
            ]

            for en_adj, masc, fem in gender_pairs:
                if masc != fem and en_adj in en.lower():
                    if masc in template and fem not in template:
                        # Check if the fem form is available as a chip
                        if fem not in chips:
                            critical.append({
                                'id': qid, 'unit': unit, 'type': 'PROD',
                                'en': en, 'template': template, 'correct': correct_chip,
                                'also': f'{fem} (if female speaker)',
                                'issue': f'Gender ambiguity: {masc}/{fem} - speaker gender unknown',
                                'severity': 'CRITICAL'
                            })

        # MINOR: Formality você vs tu
        if 'You ' in en and 'Você' in template:
            tu_forms = ['tu', 'és', 'estás', 'tens']
            if any(tf in chips for tf in tu_forms):
                minor.append({
                    'id': qid, 'unit': unit, 'type': 'PROD',
                    'en': en, 'template': template, 'correct': correct_chip,
                    'also': 'tu form (regional variation)',
                    'issue': 'Formality: você vs tu (test expects standard você)',
                    'severity': 'MINOR'
                })

        # MINOR: Onde vs Aonde (only flag if BOTH are in chips)
        if 'where' in en.lower():
            if 'Onde' in chips and 'Aonde' in chips:
                # Check if it's a location (static) or direction (motion)
                if any(v in template for v in ['mora', 'fica', 'está', 'é']):
                    # Static location - Onde is correct
                    minor.append({
                        'id': qid, 'unit': unit, 'type': 'PROD',
                        'en': en, 'template': template, 'correct': correct_chip,
                        'also': 'Aonde (incorrect but commonly confused)',
                        'issue': 'Onde vs Aonde - onde correct for static location',
                        'severity': 'MINOR'
                    })

# Write detailed report
with open('ambiguity-report-v2.txt', 'w', encoding='utf-8') as out:
    out.write('AMBIGUOUS QUESTION REPORT - v7.0 (REFINED ANALYSIS)\n')
    out.write('='*80 + '\n\n')
    out.write(f'Total questions analyzed: {len(questions)}\n')
    out.write(f'Critical ambiguity issues: {len(critical)}\n')
    out.write(f'Minor ambiguity issues: {len(minor)}\n\n')
    out.write('='*80 + '\n\n')

    out.write('SUMMARY BY ISSUE TYPE\n')
    out.write('='*80 + '\n\n')

    # Count by issue type
    tense_issues = [c for c in critical if 'tense' in c['issue'].lower()]
    gender_issues = [c for c in critical if 'gender' in c['issue'].lower()]

    out.write(f'Present tense ambiguity (PT simple = EN simple OR continuous): {len(tense_issues)}\n')
    out.write(f'Gender ambiguity (speaker gender unknown): {len(gender_issues)}\n')
    out.write(f'Preposition variations: {len([m for m in minor if "reposition" in m["issue"]])}\n')
    out.write(f'Formality variations (você/tu): {len([m for m in minor if "ormality" in m["issue"]])}\n')
    out.write(f'Other: {len(critical) - len(tense_issues) - len(gender_issues)}\n\n')

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

    # Top 10 most problematic with detailed fixes
    out.write('\n' + '='*80 + '\n\n')
    out.write('TOP 10 MOST PROBLEMATIC QUESTIONS WITH SUGGESTED FIXES\n')
    out.write('='*80 + '\n\n')

    # Sort by severity and ID
    all_issues = [(c, 'CRITICAL') for c in critical] + [(m, 'MINOR') for m in minor]
    all_issues.sort(key=lambda x: (0 if x[1] == 'CRITICAL' else 1, x[0]['id']))

    for item, sev in all_issues[:10]:
        out.write(f"Q{item['id']} [{item['type']}] - {sev}\n")
        if 'pt' in item:
            out.write(f"  PT: \"{item['pt']}\"\n")
            out.write(f"  Current correct: \"{item['correct']}\"\n")
            out.write(f"  Also valid: \"{item['also']}\"\n")
        else:
            out.write(f"  EN: \"{item['en']}\"\n")
            out.write(f"  Template: \"{item['template']}\"\n")
            out.write(f"  Current correct: \"{item['correct']}\"\n")
            out.write(f"  Also valid: {item['also']}\n")
        out.write(f"  Problem: {item['issue']}\n")

        # Suggest specific fix
        if 'Present simple vs continuous' in item['issue']:
            out.write(f"  FIX: Add temporal adverb to Portuguese:\n")
            out.write(f"       - For habitual: 'sempre', 'todos os dias', 'geralmente'\n")
            out.write(f"       - For continuous: 'agora', 'neste momento', 'atualmente'\n")
            out.write(f"       Example: \"{item.get('pt', '')}\" → \"Eu sempre falo português\"\n")
        elif 'Gender assumed' in item['issue'] or 'Gender ambiguity' in item['issue']:
            out.write(f"  FIX: Either:\n")
            out.write(f"       1. Add context (name, photo) indicating speaker gender\n")
            out.write(f"       2. Make template gender-neutral: 'Eu __ brasileir__' with both chips\n")
            out.write(f"       3. Accept both masculine and feminine as correct\n")
        elif 'Preposition' in item['issue']:
            out.write(f"  FIX: Accept both prepositions as correct (add to alternatives)\n")
        elif 'at home vs home' in item['issue']:
            out.write(f"  FIX: Accept both forms as correct (add to alternatives)\n")
        elif 'Formality' in item['issue']:
            out.write(f"  FIX: Acceptable - test is standardized on 'você' (Brazilian standard)\n")
        elif 'Onde' in item['issue']:
            out.write(f"  FIX: Accept 'Onde' only (test is grammatically prescriptive)\n")
        out.write('\n')

print('Report generated: ambiguity-report-v2.txt')
print(f'Total: {len(critical)} critical, {len(minor)} minor issues')
print(f'  - Tense ambiguity: {len([c for c in critical if "tense" in c["issue"].lower()])}')
print(f'  - Gender ambiguity: {len([c for c in critical if "gender" in c["issue"].lower()])}')
