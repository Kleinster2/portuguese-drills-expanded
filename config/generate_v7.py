#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate placement-test-questions-v7.0-pragmatic.json
Pragmatic allocation based on unit needs
"""

import json

def generate_v7_questions():
    questions = {
        "metadata": {
            "version": "7.0.0",
            "title": "Portuguese Placement Test - Pragmatic Allocation",
            "description": "Strategically allocated questions based on what each unit actually needs to test. ~215 questions with intelligent comp/prod distribution.",
            "variant": "pt-BR",
            "totalQuestions": 0,
            "estimatedMinutes": 70,
            "structure": "Pragmatic allocation: Pure grammar gets production-heavy, vocabulary gets comprehension-heavy, complex tenses get expanded coverage",
            "assessmentTypes": {
                "comprehension": "Portuguese to English with 6-7 strategic distractors",
                "production": "English to Portuguese with 8-10 strategic distractors"
            },
            "changelog": "v7.0: Complete redesign with pragmatic question allocation based on unit needs, not arbitrary 2-per-unit rule"
        },
        "phases": [
            {
                "num": 1,
                "name": "Foundation (A1)",
                "unitRange": [1, 25],
                "questionRange": [1, None],
                "description": "Absolute beginner - basic identity, present tense"
            },
            {
                "num": 2,
                "name": "Elementary (A2)",
                "unitRange": [26, 50],
                "questionRange": [None, None],
                "description": "Elementary - past tenses, questions, comparisons"
            },
            {
                "num": 3,
                "name": "Intermediate (B1)",
                "unitRange": [51, 75],
                "questionRange": [None, None],
                "description": "Intermediate - complex tenses, vocabulary expansion"
            },
            {
                "num": 4,
                "name": "Upper-Intermediate (B2)",
                "unitRange": [76, 89],
                "questionRange": [None, None],
                "description": "Upper-intermediate - subjunctive, advanced grammar"
            }
        ],
        "scoring": {
            "comprehensionOnly": "Can understand but not produce - needs speaking/writing practice",
            "productionOnly": "Rare - production harder than comprehension",
            "both": "True mastery - can understand AND produce",
            "placementLogic": "Last unit where BOTH comprehension AND production passed"
        },
        "questions": []
    }

    q_id = 1

    # Due to length limits, I'll create a comprehensive but focused version
    # with all the critical units fully implemented

    # PHASE 1: FOUNDATION (A1) - Units 1-25
    # ==========================================

    # Unit 1: Identity Statements (1C + 2P)
    questions["questions"].extend([
        {
            "id": q_id, "unit": 1, "unitName": "Identity Statements (Eu sou)", "phase": 1,
            "pt": "Eu sou professor",
            "question": "What does 'Eu sou professor' mean?",
            "correct": "I am a teacher",
            "options": ["I am a teacher", "I am a student", "I have a teacher", "I work as a teacher", "I was a teacher", "I am the teacher"]
        }
    ])
    q_id += 1

    questions["questions"].extend([
        {
            "id": q_id, "unit": 1, "unitName": "Identity Statements (Eu sou)", "phase": 1,
            "type": "production",
            "en": "I am Brazilian",
            "question": "Complete the sentence:",
            "template": "Eu __ brasileiro",
            "chips": ["sou", "é", "és", "somos", "são", "estou", "está", "era", "fui", "seria"],
            "correct": "sou",
            "hint": "Use 'ser' for identity (1st person singular)"
        }
    ])
    q_id += 1

    questions["questions"].extend([
        {
            "id": q_id, "unit": 1, "unitName": "Identity Statements (Eu sou)", "phase": 1,
            "type": "production",
            "en": "I am a doctor",
            "question": "Complete the sentence:",
            "template": "Eu __ médico",
            "chips": ["sou", "sou um", "é", "estou", "era", "fui", "seria", "seja", "somos", "são"],
            "correct": "sou",
            "hint": "Identity with professions - no article needed"
        }
    ])
    q_id += 1

    # Unit 2: Origin with Contractions (0C + 4P) - ALL 4 CONTRACTIONS
    for template, answer, country, hint_detail in [
        ("Eu sou __ Brasil", "do", "Brazil", "de + o = do (masculine singular)"),
        ("Eu sou __ Argentina", "da", "Argentina", "de + a = da (feminine singular)"),
        ("Eu sou __ Estados Unidos", "dos", "the United States", "de + os = dos (masculine plural)"),
        ("Eu sou __ Filipinas", "das", "the Philippines", "de + as = das (feminine plural)")
    ]:
        questions["questions"].append({
            "id": q_id, "unit": 2, "unitName": "Origin with Contractions (de + article)", "phase": 1,
            "type": "production",
            "en": f"I am from {country}",
            "question": "Complete the sentence:",
            "template": template,
            "chips": ["do", "da", "dos", "das", "de", "no", "na", "nos", "nas", "ao"],
            "correct": answer,
            "hint": f"Contraction: {hint_detail}"
        })
        q_id += 1

    # Unit 3: Definite Articles (0C + 4P) - ALL 4 ARTICLES
    for template, answer, en_text, hint in [
        ("__ menino está aqui", "O", "The boy is here", "Masculine singular article"),
        ("__ menina está aqui", "A", "The girl is here", "Feminine singular article"),
        ("__ meninos estão aqui", "Os", "The boys are here", "Masculine plural article"),
        ("__ meninas estão aqui", "As", "The girls are here", "Feminine plural article")
    ]:
        questions["questions"].append({
            "id": q_id, "unit": 3, "unitName": "Definite Articles (o, a, os, as)", "phase": 1,
            "type": "production",
            "en": en_text,
            "question": "Complete the sentence:",
            "template": template,
            "chips": ["O", "A", "Os", "As", "Um", "Uma", "Uns", "Umas"],
            "correct": answer,
            "hint": hint
        })
        q_id += 1

    # Unit 4: Indefinite Articles (0C + 4P) - ALL 4 ARTICLES
    for template, answer, en_text, hint in [
        ("Eu tenho __ cachorro", "um", "I have a dog", "Masculine singular indefinite article"),
        ("Eu tenho __ gata", "uma", "I have a cat (female)", "Feminine singular indefinite article"),
        ("Eu tenho __ livros", "uns", "I have some books", "Masculine plural indefinite article"),
        ("Eu tenho __ canetas", "umas", "I have some pens", "Feminine plural indefinite article")
    ]:
        questions["questions"].append({
            "id": q_id, "unit": 4, "unitName": "Indefinite Articles (um, uma, uns, umas)", "phase": 1,
            "type": "production",
            "en": en_text,
            "question": "Complete the sentence:",
            "template": template,
            "chips": ["um", "uma", "uns", "umas", "o", "a", "os", "as"],
            "correct": answer,
            "hint": hint
        })
        q_id += 1

    # Save for now - this file generation approach is getting too long
    # Let me use a more compact approach

    return questions, q_id

if __name__ == "__main__":
    data, last_id = generate_v7_questions()
    print(f"Generated {last_id-1} questions")
    print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
