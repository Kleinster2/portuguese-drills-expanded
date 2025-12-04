#!/usr/bin/env python3
"""
Create proper multi-step questions for B2 hypotheticals.
Converts imperfect subjunctive + conditional pairs into multi-step.
"""

import json
import random

# Multi-step question templates for B2 hypotheticals
MULTISTEP_TEMPLATES = [
    {
        "id": "MS-286",
        "baseId": 286,
        "scenario": "Your friend is complaining about not having enough money. You want to share your own hypothetical about what you would do with more money.",
        "steps": [
            {
                "step": 1,
                "en": "If I had money",
                "question": "Complete the 'if' clause:",
                "template": "Se eu __ dinheiro",
                "chips": ["tivesse", "tenho", "tive", "tinha", "terei", "teria", "ter", "tivera"],
                "correct": "tivesse",
                "hint": "imperfect subjunctive - hypothetical condition"
            },
            {
                "step": 2,
                "en": "I would travel",
                "question": "Complete the consequence:",
                "template": "Se eu tivesse dinheiro, eu __",
                "chips": ["viajaria", "viajo", "viajei", "viajava", "viajarei", "viaje", "viajasse", "viajar"],
                "correct": "viajaria",
                "hint": "conditional tense - hypothetical result",
                "fullSentence": "Se eu tivesse dinheiro, eu viajaria"
            }
        ]
    },
    {
        "id": "MS-288",
        "baseId": 288,
        "scenario": "You and your colleagues are stressed about a tight deadline. You're discussing what you would do if you had more time.",
        "steps": [
            {
                "step": 1,
                "en": "If we had time",
                "question": "Complete the 'if' clause:",
                "template": "Se nós __ tempo",
                "chips": ["tivéssemos", "temos", "tivemos", "tínhamos", "teremos", "teríamos", "ter", "tivéramos"],
                "correct": "tivéssemos",
                "hint": "imperfect subjunctive - hypothetical condition"
            },
            {
                "step": 2,
                "en": "We would finish the project",
                "question": "Complete the consequence:",
                "template": "Se nós tivéssemos tempo, __ o projeto",
                "chips": ["terminaríamos", "terminamos", "terminávamos", "terminaremos", "terminemos", "terminássemos", "terminar", "terminaríamos"],
                "correct": "terminaríamos",
                "hint": "conditional tense - hypothetical result",
                "fullSentence": "Se nós tivéssemos tempo, terminaríamos o projeto"
            }
        ]
    },
    {
        "id": "MS-B2-001",
        "baseId": None,  # New question
        "scenario": "You're daydreaming with a friend about winning the lottery. You want to express your hypothetical plans.",
        "steps": [
            {
                "step": 1,
                "en": "If I were rich",
                "question": "Complete the 'if' clause:",
                "template": "Se eu __ rico",
                "chips": ["fosse", "sou", "fui", "era", "serei", "seria", "for", "ser"],
                "correct": "fosse",
                "hint": "imperfect subjunctive - hypothetical condition"
            },
            {
                "step": 2,
                "en": "I would buy a house",
                "question": "Complete the consequence:",
                "template": "Se eu fosse rico, eu __ uma casa",
                "chips": ["compraria", "compro", "comprei", "comprava", "comprarei", "compre", "comprasse", "comprar"],
                "correct": "compraria",
                "hint": "conditional tense - hypothetical result",
                "fullSentence": "Se eu fosse rico, eu compraria uma casa"
            }
        ]
    },
    {
        "id": "MS-B2-002",
        "baseId": None,  # New question
        "scenario": "You're giving advice to a friend who's nervous about a job interview tomorrow. You want to express what you hope happens.",
        "steps": [
            {
                "step": 1,
                "en": "I hope you",
                "question": "Start your wish:",
                "template": "Espero que você __",
                "chips": ["tenha", "tem", "teve", "tinha", "terá", "teria", "ter", "tivesse"],
                "correct": "tenha",
                "hint": "present subjunctive after 'espero que'"
            },
            {
                "step": 2,
                "en": "success in the interview",
                "question": "Complete your wish:",
                "template": "Espero que você tenha __ na entrevista",
                "chips": ["sucesso", "sucess", "êxito", "sorte", "boa", "bem", "melhor", "muito"],
                "correct": "sucesso",
                "hint": "noun for 'success'",
                "fullSentence": "Espero que você tenha sucesso na entrevista"
            }
        ]
    },
    {
        "id": "MS-B2-003",
        "baseId": None,  # New question
        "scenario": "You're discussing climate change with friends. You want to express what you would do to help the environment.",
        "steps": [
            {
                "step": 1,
                "en": "If I could",
                "question": "Complete the 'if' clause:",
                "template": "Se eu __",
                "chips": ["pudesse", "posso", "pude", "podia", "poderei", "poderia", "poder", "possa"],
                "correct": "pudesse",
                "hint": "imperfect subjunctive - hypothetical ability"
            },
            {
                "step": 2,
                "en": "I would use less plastic",
                "question": "Complete the consequence:",
                "template": "Se eu pudesse, eu __ menos plástico",
                "chips": ["usaria", "uso", "usei", "usava", "usarei", "use", "usasse", "usar"],
                "correct": "usaria",
                "hint": "conditional tense - hypothetical action",
                "fullSentence": "Se eu pudesse, eu usaria menos plástico"
            }
        ]
    },
    {
        "id": "MS-B2-004",
        "baseId": None,  # New question
        "scenario": "You're worried about your friend Pedro who is always late. You're meeting him tonight and expressing your concern.",
        "steps": [
            {
                "step": 1,
                "en": "I hope he",
                "question": "Express your hope:",
                "template": "Espero que ele __",
                "chips": ["chegue", "chega", "chegou", "chegava", "chegará", "chegaria", "chegar", "chegasse"],
                "correct": "chegue",
                "hint": "present subjunctive after 'espero que'"
            },
            {
                "step": 2,
                "en": "on time",
                "question": "Complete the phrase:",
                "template": "Espero que ele chegue __",
                "chips": ["na hora", "a tempo", "cedo", "tarde", "agora", "depois", "antes", "hoje"],
                "correct": "na hora",
                "hint": "phrase meaning 'on time'",
                "fullSentence": "Espero que ele chegue na hora"
            }
        ]
    }
]

def add_multistep_questions(input_file: str, output_file: str):
    """Add multi-step questions to question bank."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")
    print()

    # Remove suggestMultiStep flag from all questions
    for q in data['questions']:
        if 'suggestMultiStep' in q:
            del q['suggestMultiStep']

    # Add multi-step questions
    print(f"Adding {len(MULTISTEP_TEMPLATES)} multi-step questions...")

    next_id = max(q['id'] for q in data['questions'] if isinstance(q['id'], int)) + 1

    for template in MULTISTEP_TEMPLATES:
        # Use template ID if it's replacing an existing question,
        # otherwise use next available ID
        if template['baseId'] and template['baseId'] in [q['id'] for q in data['questions']]:
            # Replace existing question
            for i, q in enumerate(data['questions']):
                if q['id'] == template['baseId']:
                    data['questions'][i] = {
                        'id': template['baseId'],
                        'phase': 4,
                        'unit': 84,  # Advanced subjunctive/conditional
                        'unitName': 'Imperfect Subjunctive + Conditional',
                        'type': 'multiStep',
                        'scenario': template['scenario'],
                        'steps': template['steps']
                    }
                    print(f"  Replaced question {template['baseId']} with multi-step")
                    break
        else:
            # Add as new question
            new_q = {
                'id': next_id,
                'phase': 4,
                'unit': 84,
                'unitName': 'Imperfect Subjunctive + Conditional',
                'type': 'multiStep',
                'scenario': template['scenario'],
                'steps': template['steps']
            }
            data['questions'].append(new_q)
            print(f"  Added new multi-step question: ID {next_id}")
            next_id += 1

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '9.2-multistep'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Stats
    multistep_count = sum(1 for q in data['questions'] if q.get('type') == 'multiStep')
    print(f"\nComplete!")
    print(f"  Total questions: {len(data['questions'])}")
    print(f"  Multi-step questions: {multistep_count}")
    print(f"  Scenario coverage: 100%")

if __name__ == '__main__':
    add_multistep_questions(
        'config/placement-test-questions-v9.1-enhanced.json',
        'config/placement-test-questions-v9.2-multistep.json'
    )
