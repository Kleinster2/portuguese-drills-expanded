#!/usr/bin/env python3
"""
Enhance comprehensive assessment:
1. Add more scenarios (target: 70% coverage)
2. Create multi-step questions for B2 level
"""

import json
import random
from typing import Dict, List, Any

# Common names and locations
NAMES = ["Maria", "João", "Ana", "Paulo", "Carlos", "Sofia", "Pedro", "Lucia", "Bruno", "Carla"]
LOCATIONS = ["café", "store", "market", "office", "classroom", "park", "restaurant", "library"]

# COMPREHENSIVE SCENARIO TEMPLATES
SCENARIO_TEMPLATES = {
    # === A1 Level ===
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
    "Ser vs Estar": [
        "You're describing your friend {name} to someone who hasn't met them.",
        "You're at a party and notice {name} looks different today.",
        "You're introducing your colleague {name} to a client."
    ],
    "Articles": [
        "You're making a shopping list for groceries.",
        "You're describing what you see in a room.",
        "You're telling a friend what you need to buy."
    ],
    "Present Tense": [
        "You're describing your daily routine to a friend.",
        "You're explaining what {name} does every day.",
        "You're talking about habits in your family."
    ],
    "Family Members": [
        "You're showing photos of your family to a new friend.",
        "You're explaining your family structure to someone.",
        "You're describing who will attend a family gathering."
    ],
    "Common Question Words": [
        "You're trying to get information about an event.",
        "You're helping a tourist who's asking for directions.",
        "You're curious about your friend's weekend plans."
    ],
    "Locations and Directions": [
        "You're giving directions to someone who's lost.",
        "You're explaining where different places are in your neighborhood.",
        "You're planning to meet a friend and need to describe the location."
    ],
    "Basic Food Vocabulary": [
        "You're at a market shopping for ingredients.",
        "You're ordering food at a restaurant.",
        "You're describing what you like to eat."
    ],
    "Drinks and Beverages": [
        "You're at a café deciding what to order.",
        "You're hosting a party and asking guests their preferences.",
        "You're shopping for drinks for a gathering."
    ],
    "Colors": [
        "You're describing what someone is wearing.",
        "You're shopping for clothes and discussing colors.",
        "You're painting a room and choosing colors."
    ],
    "Clothing Basics": [
        "You're shopping for clothes and describing what you need.",
        "You're helping a friend choose an outfit.",
        "You're packing for a trip and listing what to bring."
    ],
    "Body Parts": [
        "You're at a doctor's office explaining where it hurts.",
        "You're teaching body parts to a child.",
        "You're describing an injury to someone."
    ],
    "Weather Expressions": [
        "You're checking the forecast before a trip.",
        "You're talking about today's weather with a colleague.",
        "You're planning outdoor activities and discussing the weather."
    ],
    "Time Expressions": [
        "You're scheduling a meeting with a colleague.",
        "You're explaining when something happened.",
        "You're talking about your daily schedule."
    ],
    "Emotions and Feelings": [
        "You're describing how you felt about a recent event.",
        "You're checking in with a friend about their mood.",
        "You're explaining your emotional state to someone."
    ],
    "House and Rooms": [
        "You're giving a tour of your new apartment.",
        "You're describing where items are in your house.",
        "You're looking for a place to rent and describing your needs."
    ],
    "Frequency Adverbs": [
        "You're describing how often you exercise.",
        "You're talking about your weekly routines.",
        "You're explaining your habits to a friend."
    ],
    "Food and Meals": [
        "You're describing what you typically eat for breakfast.",
        "You're inviting friends over for dinner and planning the menu.",
        "You're at a restaurant deciding what to order."
    ],

    # === A2 Level ===
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
    "Immediate Future": [
        "You're telling someone what you're about to do right now.",
        "You're describing plans happening very soon.",
        "You're explaining what's going to happen in the next few minutes."
    ],
    "Object Pronouns": [
        "You're explaining who you gave something to.",
        "You're describing actions involving people.",
        "You're clarifying who did what to whom."
    ],
    "Possessive": [
        "You're clarifying whose belongings are whose.",
        "You're describing family relationships.",
        "You're organizing items at a shared apartment."
    ],
    "Reflexive Verbs": [
        "You're describing your morning routine.",
        "You're explaining daily self-care activities.",
        "You're talking about getting ready for an event."
    ],

    # === B1 Level ===
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
    "Irregular Verbs": [
        "You're describing actions using common irregular verbs.",
        "You're explaining what someone did using irregular past forms.",
        "You're talking about daily activities with irregular verbs."
    ],
    "Past Perfect": [
        "You're explaining what had happened before another past event.",
        "You're telling a story with events in different past times.",
        "You're clarifying the sequence of past events."
    ],

    # === B2 Level ===
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
    ],
    "Future Subjunctive": [
        "You're talking about conditions for future actions.",
        "You're expressing what will happen if something occurs.",
        "You're discussing future possibilities with uncertainty."
    ],
    "Introduction to Subjunctive Mood": [
        "You're expressing doubt or uncertainty about something.",
        "You're making recommendations to someone.",
        "You're discussing emotions about potential events."
    ],

    # Catch-all scenarios for units not specifically listed
    "DEFAULT_PRODUCTION": [
        "You're practicing Portuguese with a language partner.",
        "You're writing a message to a Portuguese-speaking friend.",
        "You're preparing for a conversation in Portuguese."
    ],
    "DEFAULT_COMPREHENSION": [
        "You're reading a message from a Portuguese speaker.",
        "You're listening to someone speak Portuguese.",
        "You're trying to understand a Portuguese sentence."
    ]
}

def get_scenario_for_question(question: Dict[str, Any]) -> str:
    """Generate appropriate scenario based on question unit."""
    unit_name = question.get('unitName', '')
    q_type = question.get('type', 'production')

    # Try exact match first
    if unit_name in SCENARIO_TEMPLATES:
        template = random.choice(SCENARIO_TEMPLATES[unit_name])
        return personalize_scenario(template)

    # Try partial match
    for key, templates in SCENARIO_TEMPLATES.items():
        if key.lower() in unit_name.lower():
            template = random.choice(templates)
            return personalize_scenario(template)

    # Fallback to default
    if 'production' in q_type or 'contextualized' in q_type:
        template = random.choice(SCENARIO_TEMPLATES['DEFAULT_PRODUCTION'])
    else:
        template = random.choice(SCENARIO_TEMPLATES['DEFAULT_COMPREHENSION'])

    return personalize_scenario(template)

def personalize_scenario(template: str) -> str:
    """Add names and locations to scenario templates."""
    if '{name}' in template:
        template = template.replace('{name}', random.choice(NAMES))
    if '{location}' in template:
        template = template.replace('{location}', random.choice(LOCATIONS))
    return template

def should_convert_to_multistep(question: Dict[str, Any]) -> bool:
    """Determine if B2 question should be multi-step."""
    if question.get('phase') != 4:
        return False

    unit_name = question.get('unitName', '').lower()
    q_type = question.get('type', '')

    # Only convert production questions
    if q_type != 'contextualizedProduction':
        return False

    # Convert subjunctive + conditional pairs
    if any(keyword in unit_name for keyword in ['imperfect subjunctive', 'conditional', 'hypothetical']):
        # About 50% of eligible questions
        return random.random() < 0.5

    return False

def create_multistep_from_conditional(question: Dict[str, Any]) -> Dict[str, Any]:
    """Convert conditional question to multi-step (if-then)."""
    # This is a simplified example - would need more sophisticated logic
    # For now, mark as multi-step ready
    multi = question.copy()
    multi['type'] = 'multiStep'

    # Placeholder - would need to split into steps based on sentence structure
    # For now, keep as regular question but flagged for manual review
    multi['needsManualConversion'] = True

    return multi

def enhance_questions(input_file: str, output_file: str):
    """Enhance question bank with more scenarios and multi-step."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")
    print()

    enhanced = []
    scenarios_added = 0
    multistep_created = 0

    for i, q in enumerate(data['questions']):
        if (i + 1) % 50 == 0:
            print(f"Processing question {i + 1}/{len(data['questions'])}...")

        # Add scenario if missing
        if 'scenario' not in q or not q['scenario']:
            scenario = get_scenario_for_question(q)
            if scenario:
                q['scenario'] = scenario
                scenarios_added += 1

        # Check for multi-step conversion
        if should_convert_to_multistep(q):
            # Mark for manual multi-step conversion
            q['suggestMultiStep'] = True
            multistep_created += 1

        enhanced.append(q)

    # Update data
    data['questions'] = enhanced
    if 'metadata' in data:
        data['metadata']['version'] = '9.1-enhanced'
        data['metadata']['scenarioCoverage'] = f"{(sum(1 for q in enhanced if 'scenario' in q)/len(enhanced))*100:.1f}%"

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("\nEnhancement complete!")
    print(f"  Scenarios added: {scenarios_added}")
    print(f"  Questions flagged for multi-step: {multistep_created}")

    # Final stats
    with_scenario = sum(1 for q in enhanced if 'scenario' in q)
    print(f"\n  Total questions with scenarios: {with_scenario}/{len(enhanced)} ({(with_scenario/len(enhanced))*100:.1f}%)")

if __name__ == '__main__':
    enhance_questions(
        'config/placement-test-questions-v9.0-comprehensive.json',
        'config/placement-test-questions-v9.1-enhanced.json'
    )
