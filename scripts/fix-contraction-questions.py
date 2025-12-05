#!/usr/bin/env python3
"""
Replace poor contraction questions (country gender) with useful ones.
Use only nouns ending in -o/-a/-os/-as (clear gender markers).
Never use -e/-es (ambiguous gender).
"""

import json

# Good contraction examples with clear gender markers
CLEAR_CONTRACTIONS = {
    # DE + O = DO (masculine singular)
    "do": [
        {
            "en": "I come from the park",
            "template": "Eu venho __ parque",
            "correct": "do",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "from the (masculine)",
            "scenario": "You're telling a friend where you just came from."
        },
        {
            "en": "I live near the museum",
            "template": "Eu moro perto __ museu",
            "correct": "do",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "near the (masculine)",
            "scenario": "Someone asks where you live in the city."
        },
        {
            "en": "The book is on top of the table",
            "template": "O livro está em cima __ mesa",
            "correct": "da",  # mesa is feminine
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "on top of the (feminine)"
        },
    ],

    # DE + A = DA (feminine singular)
    "da": [
        {
            "en": "I come from school",
            "template": "Eu venho __ escola",
            "correct": "da",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "from the (feminine)",
            "scenario": "Your parent asks where you've been."
        },
        {
            "en": "I live near the beach",
            "template": "Eu moro perto __ praia",
            "correct": "da",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "near the (feminine)",
            "scenario": "You're describing your neighborhood."
        },
        {
            "en": "The door of the house",
            "template": "A porta __ casa",
            "correct": "da",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "of the (feminine)"
        },
    ],

    # EM + O = NO (masculine singular)
    "no": [
        {
            "en": "I live in the building",
            "template": "Eu moro __ prédio",
            "correct": "no",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "in the (masculine)",
            "scenario": "Someone asks where your apartment is."
        },
        {
            "en": "I work in the office",
            "template": "Eu trabalho __ escritório",
            "correct": "no",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "in the (masculine)",
            "scenario": "A friend asks where you work."
        },
        {
            "en": "The book is on the table",
            "template": "O livro está __ mesa",
            "correct": "na",  # mesa is feminine
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "on the (feminine)"
        },
    ],

    # EM + A = NA (feminine singular)
    "na": [
        {
            "en": "I live in the city",
            "template": "Eu moro __ cidade",
            "correct": "na",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "in the (feminine)",
            "scenario": "Someone asks where you live."
        },
        {
            "en": "I study in the library",
            "template": "Eu estudo __ biblioteca",
            "correct": "na",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "in the (feminine)",
            "scenario": "Your roommate is looking for you."
        },
        {
            "en": "The cat is on the chair",
            "template": "O gato está __ cadeira",
            "correct": "na",
            "chips": ["do", "da", "no", "na", "de", "em", "o", "a", "(blank)"],
            "hint": "on the (feminine)"
        },
    ],

    # DE + OS = DOS (masculine plural)
    "dos": [
        {
            "en": "The house of the neighbors",
            "template": "A casa __ vizinhos",
            "correct": "dos",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "of the (masculine plural)"
        },
        {
            "en": "I come from the parks",
            "template": "Eu venho __ parques",
            "correct": "dos",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "from the (masculine plural)"
        },
    ],

    # DE + AS = DAS (feminine plural)
    "das": [
        {
            "en": "The teacher of the students",
            "template": "A professora __ alunas",
            "correct": "das",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "of the (feminine plural)"
        },
        {
            "en": "I come from the schools",
            "template": "Eu venho __ escolas",
            "correct": "das",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "from the (feminine plural)"
        },
    ],

    # EM + OS = NOS (masculine plural)
    "nos": [
        {
            "en": "I work in the offices",
            "template": "Eu trabalho __ escritórios",
            "correct": "nos",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "in the (masculine plural)"
        },
    ],

    # EM + AS = NAS (feminine plural)
    "nas": [
        {
            "en": "I study in the libraries",
            "template": "Eu estudo __ bibliotecas",
            "correct": "nas",
            "chips": ["dos", "das", "nos", "nas", "de", "em", "os", "as", "(blank)"],
            "hint": "in the (feminine plural)"
        },
    ],
}

def fix_contraction_questions(input_file: str, output_file: str):
    """Replace poor contraction questions with useful ones."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    replaced = 0

    for q in data['questions']:
        # Find contraction questions
        template = q.get('template', '')
        unit_name = q.get('unitName', '').lower()

        # Check if this is a contraction question with country/ambiguous noun
        if 'contraction' in unit_name or ('de' in unit_name.lower() and 'em' in unit_name.lower()):
            # Check for poor examples
            poor_examples = ['brasil', 'portugal', 'frança', 'japão', 'café', 'leite', 'restaurante', 'hotel']

            if any(bad in template.lower() for bad in poor_examples):
                # Replace with a good example
                # Choose based on what contraction it's testing
                chips = q.get('chips', [])
                correct = q.get('correct', '')

                # Find a replacement from our good examples
                if correct in CLEAR_CONTRACTIONS:
                    import random
                    replacement = random.choice(CLEAR_CONTRACTIONS[correct])

                    q['en'] = replacement['en']
                    q['template'] = replacement['template']
                    q['correct'] = replacement['correct']
                    q['chips'] = replacement['chips']
                    q['hint'] = replacement.get('hint', '')
                    if 'scenario' in replacement:
                        q['scenario'] = replacement['scenario']

                    replaced += 1
                    print(f"  Replaced: {template} -> {replacement['template']}")

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.3-clear-contractions'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Contraction questions replaced: {replaced}")
    print(f"  Now using only clear gender markers (-o/-a/-os/-as)")

if __name__ == '__main__':
    fix_contraction_questions(
        'config/placement-test-questions-v10.2-hybrid.json',
        'config/placement-test-questions-v10.3-clear-contractions.json'
    )
