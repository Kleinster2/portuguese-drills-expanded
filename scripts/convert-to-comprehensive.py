#!/usr/bin/env python3
"""
Convert placement test questions to comprehensive assessment format.
Adds scenarios, fixes chip arrays, randomizes positions.
"""

import json
import random
from typing import Dict, List, Any

# Scenario templates by unit type/topic
SCENARIO_TEMPLATES = {
    # A1 Level
    "Identity Statements": [
        "You're at a networking event introducing yourself.",
        "You're filling out a registration form and need to state your profession.",
        "You meet someone new at a café and they ask about you."
    ],
    "Origin with Contractions": [
        "Someone asks where you're from at an international conference.",
        "You're chatting with a new classmate about your backgrounds.",
        "A travel blogger asks about your hometown."
    ],
    "Ser vs Estar - Basic": [
        "You're describing your friend {name} to someone who hasn't met them.",
        "You're at a party and notice {name} looks different today.",
        "You're introducing your colleague {name} to a client."
    ],
    "Articles": [
        "You're making a shopping list for groceries.",
        "You're describing what you see in a room.",
        "You're telling a friend what you need to buy."
    ],
    "Present Tense - Regular": [
        "You're describing your daily routine to a friend.",
        "You're explaining what {name} does every day.",
        "You're talking about habits in your family."
    ],

    # A2 Level
    "Preterite Tense": [
        "You're telling your colleague about your weekend.",
        "You're sharing a story about what happened yesterday.",
        "You're recounting a recent trip you took."
    ],
    "Imperfect Tense": [
        "You're reminiscing about your childhood with an old friend.",
        "You're describing what life was like when you were younger.",
        "You're telling someone about a habit you had in the past."
    ],
    "Comparatives": [
        "You're comparing two restaurants you've tried.",
        "You're helping a friend decide between two options.",
        "You're describing differences between two people."
    ],

    # B1 Level
    "Demonstratives": [
        "You're at a {location} and need to point out specific items or people.",
        "You're shopping and asking about products at different distances.",
        "You're giving directions and referencing nearby and distant landmarks."
    ],
    "Por vs Para": [
        "You're explaining why you're studying Portuguese.",
        "You're telling someone about your travel plans.",
        "You're describing the purpose of your work project."
    ],
    "Future Tense": [
        "You're discussing your plans for next week.",
        "You're making predictions about tomorrow.",
        "You're talking about upcoming events."
    ],

    # B2 Level
    "Present Subjunctive": [
        "You're expressing hopes and worries about an upcoming situation.",
        "You're giving advice to a friend about what they should do.",
        "You're talking about uncertain future events."
    ],
    "Imperfect Subjunctive": [
        "You're having a hypothetical conversation with a friend.",
        "You're discussing what you would do in an imaginary situation.",
        "You're expressing wishes about things that aren't true."
    ],
    "Conditional Tense": [
        "You're daydreaming about what you would do with more resources.",
        "You're being polite and making a gentle request.",
        "You're discussing hypothetical scenarios."
    ]
}

# Common names for personalization
NAMES = ["Maria", "João", "Ana", "Paulo", "Carlos", "Sofia", "Pedro", "Lucia"]

# Locations for spatial contexts
LOCATIONS = ["café", "store", "market", "office", "classroom", "park"]

def get_scenario_for_question(question: Dict[str, Any]) -> str:
    """Generate appropriate scenario based on question unit."""
    unit_name = question.get('unitName', '')

    # Find matching scenario template
    for key, templates in SCENARIO_TEMPLATES.items():
        if key.lower() in unit_name.lower():
            template = random.choice(templates)
            # Personalize with random name if {name} placeholder
            if '{name}' in template:
                template = template.replace('{name}', random.choice(NAMES))
            # Add location if {location} placeholder
            if '{location}' in template:
                template = template.replace('{location}', random.choice(LOCATIONS))
            return template

    # Fallback: generic scenario based on question type
    if question.get('type') == 'production':
        return "Complete the sentence in Portuguese."
    return None

def fix_chip_array(chips: List[str], correct: str) -> List[str]:
    """
    Fix chip array to:
    1. Remove duplicates
    2. Avoid clustering hints
    3. Randomize position of correct answer
    """
    # Remove duplicates while preserving order
    seen = set()
    unique_chips = []
    for chip in chips:
        if chip not in seen:
            seen.add(chip)
            unique_chips.append(chip)

    # Shuffle to randomize correct answer position
    random.shuffle(unique_chips)

    return unique_chips

def determine_question_type(question: Dict[str, Any]) -> str:
    """
    Determine if question should be:
    - contextualizedProduction (70%)
    - quickCheck (30%)
    - multiStep (advanced levels only)
    """
    # Quick checks: fundamental grammar without much context needed
    quick_check_units = [
        "Articles",
        "Noun Plurals",
        "Comparatives",
        "Adjective Agreement"
    ]

    unit_name = question.get('unitName', '')
    for quick_unit in quick_check_units:
        if quick_unit.lower() in unit_name.lower():
            return 'quickCheck'

    # Default: contextualized production
    if question.get('type') in ['production', 'comprehension']:
        return 'contextualizedProduction'

    return question.get('type', 'production')

def convert_question(question: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a single question to comprehensive format."""
    converted = question.copy()

    # Determine question type
    new_type = determine_question_type(question)
    converted['type'] = new_type

    # Add scenario for contextualizedProduction
    if new_type == 'contextualizedProduction':
        scenario = get_scenario_for_question(question)
        if scenario:
            converted['scenario'] = scenario

    # Fix chips array if present
    if 'chips' in converted:
        correct = converted.get('correct')
        converted['chips'] = fix_chip_array(converted['chips'], correct)

    # Fix options array for comprehension questions
    if 'options' in converted:
        options = converted['options']
        random.shuffle(options)
        converted['options'] = options

    return converted

def convert_question_bank(input_file: str, output_file: str):
    """Convert entire question bank."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")
    print()

    # Convert questions
    converted_questions = []
    for i, q in enumerate(data['questions']):
        if (i + 1) % 50 == 0:
            print(f"Converting question {i + 1}/{len(data['questions'])}...")

        converted = convert_question(q)
        converted_questions.append(converted)

    # Update metadata
    data['questions'] = converted_questions
    if 'metadata' in data:
        data['metadata']['version'] = data['metadata'].get('version', '8.0') + '-comprehensive'
        data['metadata']['description'] = 'Comprehensive language assessment with contextualized production questions'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ Conversion complete!")
    print(f"  - Total questions: {len(converted_questions)}")

    # Stats
    type_counts = {}
    for q in converted_questions:
        qtype = q.get('type', 'unknown')
        type_counts[qtype] = type_counts.get(qtype, 0) + 1

    print(f"\n  Question types:")
    for qtype, count in sorted(type_counts.items()):
        pct = (count / len(converted_questions)) * 100
        print(f"    - {qtype}: {count} ({pct:.1f}%)")

    # Count scenarios
    with_scenario = sum(1 for q in converted_questions if 'scenario' in q)
    print(f"\n  Questions with scenarios: {with_scenario} ({(with_scenario/len(converted_questions))*100:.1f}%)")

if __name__ == '__main__':
    convert_question_bank(
        'config/placement-test-questions-v8.0-streamlined.json',
        'config/placement-test-questions-v9.0-comprehensive.json'
    )
