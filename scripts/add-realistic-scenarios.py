#!/usr/bin/env python3
"""
Add realistic, relevant scenarios to questions.
Scenarios should naturally lead to the grammar being tested.
"""

import json
import random

# Realistic scenarios organized by grammar topic and context
REALISTIC_SCENARIOS = {
    # === PROFESSIONS & IDENTITY ===
    "profession_doctor": [
        "At a hospital, someone asks what you do.",
        "You're introducing yourself at a medical conference.",
        "Someone asks about your career at a networking event."
    ],
    "profession_teacher": [
        "At a parent-teacher meeting, you introduce yourself.",
        "Someone asks what you do for work.",
        "You're meeting your student's family for the first time."
    ],
    "profession_student": [
        "At a university orientation, you introduce yourself.",
        "Someone asks if you work or study.",
        "You're explaining why you have a student discount."
    ],
    "profession_generic": [
        "At a job fair, someone asks about your occupation.",
        "You're filling out a form that asks for your profession.",
        "A new colleague asks what your role is."
    ],

    # === SER vs ESTAR ===
    "ser_characteristic": [
        "You're describing someone to a friend who hasn't met them.",
        "You're writing a dating profile.",
        "You're helping police describe a suspect."
    ],
    "estar_location": [
        "Someone calls asking where you are.",
        "You're giving your location to a delivery driver.",
        "A friend asks where the party is."
    ],
    "estar_temporary": [
        "A friend asks how you're feeling today.",
        "You're explaining why you look different.",
        "Someone notices you seem different than usual."
    ],

    # === ARTICLES ===
    "article_definite": [
        "You're pointing out a specific item in a room.",
        "You're talking about something you both can see.",
        "You're referring to the particular one you mentioned earlier."
    ],
    "article_indefinite": [
        "You're describing what you need to buy.",
        "You're talking about any one, not a specific one.",
        "You're mentioning something for the first time."
    ],

    # === ADJECTIVES ===
    "adjective_tall": [
        "You're describing someone at a crowded place so your friend can spot them.",
        "You're explaining why someone can reach the top shelf.",
        "You're describing physical characteristics to an artist."
    ],
    "adjective_size": [
        "You're shopping for clothes and discussing sizes.",
        "You're describing how much space something takes up.",
        "You're comparing the sizes of two options."
    ],

    # === POSSESSIVES ===
    "possessive": [
        "You're clarifying whose item this is.",
        "There's confusion about ownership and you need to specify.",
        "You're sorting belongings at a shared apartment."
    ],

    # === PAST TENSES ===
    "preterite_completed": [
        "A friend asks what you did yesterday.",
        "You're recounting a completed event.",
        "You're telling a story about what happened."
    ],
    "imperfect_habitual": [
        "You're reminiscing about your childhood habits.",
        "You're describing what you used to do regularly.",
        "You're talking about how things were back then."
    ],

    # === DEMONSTRATIVES ===
    "demonstrative_near": [
        "You're pointing to something right next to you.",
        "You're handing something to someone nearby.",
        "You're discussing something in your immediate vicinity."
    ],
    "demonstrative_far": [
        "You're pointing to something across the street.",
        "You're indicating something far from both of you.",
        "You're referencing something in the distance."
    ],

    # === SUBJUNCTIVE ===
    "subjunctive_hope": [
        "You're expressing a wish about an uncertain future event.",
        "You're telling someone what you hope happens.",
        "You're making a wish for someone."
    ],
    "subjunctive_doubt": [
        "You're expressing skepticism about something.",
        "You're not sure if something is true.",
        "You doubt whether this will happen."
    ],

    # === CONDITIONAL ===
    "conditional_hypothetical": [
        "You're daydreaming about what you'd do with lottery winnings.",
        "You're discussing a hypothetical scenario with friends.",
        "You're imagining what you would do in that situation."
    ],

    # === POR vs PARA ===
    "para_purpose": [
        "You're explaining why you're studying something.",
        "You're describing the goal of your actions.",
        "You're clarifying what something is intended for."
    ],
    "por_cause": [
        "You're explaining the reason something happened.",
        "You're describing what motivated your action.",
        "You're giving the cause of a situation."
    ],

    # === VERBS - DAILY ACTIVITIES ===
    "daily_routine": [
        "You're describing your typical morning.",
        "A friend asks about your daily schedule.",
        "You're explaining your regular habits."
    ],
    "ongoing_action": [
        "Someone calls and asks what you're doing right now.",
        "You're explaining what's happening at this moment.",
        "You're describing the current situation."
    ],
}

def get_scenario_for_question(q):
    """Generate realistic scenario based on question content."""

    # Get basic info
    en = q.get('en', '').lower()
    unit_name = q.get('unitName', '').lower()
    question_text = q.get('question', '').lower()

    # PROFESSIONS
    if 'doctor' in en or 'médico' in str(q.get('template', '')):
        return random.choice(REALISTIC_SCENARIOS['profession_doctor'])
    if 'teacher' in en or 'professor' in en:
        return random.choice(REALISTIC_SCENARIOS['profession_teacher'])
    if 'student' in en or 'estudante' in str(q.get('template', '')):
        return random.choice(REALISTIC_SCENARIOS['profession_student'])

    # SER vs ESTAR
    if 'ser' in unit_name and 'estar' in unit_name:
        if 'am' in en and ('happy' in en or 'sad' in en or 'tired' in en):
            return random.choice(REALISTIC_SCENARIOS['estar_temporary'])
        elif 'is' in en and ('tall' in en or 'short' in en or 'intelligent' in en):
            return random.choice(REALISTIC_SCENARIOS['ser_characteristic'])

    # Location
    if 'where' in question_text or 'location' in unit_name:
        return random.choice(REALISTIC_SCENARIOS['estar_location'])

    # ARTICLES
    if 'article' in unit_name:
        if 'the' in en:
            return random.choice(REALISTIC_SCENARIOS['article_definite'])
        elif 'a ' in en or 'an ' in en:
            return random.choice(REALISTIC_SCENARIOS['article_indefinite'])

    # ADJECTIVES
    if 'tall' in en or 'short' in en or 'height' in en:
        return random.choice(REALISTIC_SCENARIOS['adjective_tall'])
    if 'big' in en or 'small' in en or 'large' in en:
        return random.choice(REALISTIC_SCENARIOS['adjective_size'])

    # POSSESSIVES
    if 'possessive' in unit_name or 'my ' in en or 'your ' in en or 'his ' in en or 'her ' in en:
        return random.choice(REALISTIC_SCENARIOS['possessive'])

    # PAST TENSES
    if 'preterite' in unit_name or 'simple past' in unit_name:
        return random.choice(REALISTIC_SCENARIOS['preterite_completed'])
    if 'imperfect' in unit_name and 'subjunctive' not in unit_name:
        return random.choice(REALISTIC_SCENARIOS['imperfect_habitual'])

    # DEMONSTRATIVES
    if 'demonstrative' in unit_name:
        if 'this' in en or 'these' in en or 'este' in str(q.get('chips', [])):
            return random.choice(REALISTIC_SCENARIOS['demonstrative_near'])
        elif 'that' in en or 'those' in en or 'aquele' in str(q.get('chips', [])):
            return random.choice(REALISTIC_SCENARIOS['demonstrative_far'])

    # SUBJUNCTIVE
    if 'subjunctive' in unit_name:
        if 'hope' in en or 'wish' in en or 'espero' in str(q.get('template', '')):
            return random.choice(REALISTIC_SCENARIOS['subjunctive_hope'])
        elif 'doubt' in en or 'duvido' in str(q.get('template', '')):
            return random.choice(REALISTIC_SCENARIOS['subjunctive_doubt'])

    # CONDITIONAL
    if 'conditional' in unit_name or 'would' in en:
        return random.choice(REALISTIC_SCENARIOS['conditional_hypothetical'])

    # POR vs PARA
    if 'para' in unit_name or 'por' in unit_name:
        if 'to' in en and ('study' in en or 'learn' in en or 'become' in en):
            return random.choice(REALISTIC_SCENARIOS['para_purpose'])
        elif 'because' in en or 'due to' in en:
            return random.choice(REALISTIC_SCENARIOS['por_cause'])

    # DAILY ACTIVITIES
    if any(verb in en for verb in ['eat', 'drink', 'work', 'study', 'sleep', 'wake']):
        if 'every' in en or 'always' in en or 'usually' in en:
            return random.choice(REALISTIC_SCENARIOS['daily_routine'])
        elif 'now' in en or 'currently' in en:
            return random.choice(REALISTIC_SCENARIOS['ongoing_action'])

    # No specific scenario - return None
    return None

def add_realistic_scenarios(input_file: str, output_file: str):
    """Add realistic scenarios to production questions only."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    scenarios_added = 0
    scenarios_kept = 0

    for q in data['questions']:
        # Only process production questions (have template + chips)
        if not (q.get('template') and q.get('chips')):
            # Remove scenario from comprehension questions
            if 'scenario' in q:
                del q['scenario']
            continue

        # Try to generate a realistic scenario
        new_scenario = get_scenario_for_question(q)

        if new_scenario:
            q['scenario'] = new_scenario
            scenarios_added += 1
        elif 'scenario' in q:
            # Keep existing scenario if it's not generic
            scenarios_kept += 1
        # If no scenario and can't generate one, leave it without scenario

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '9.5-realistic'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Scenarios added: {scenarios_added}")
    print(f"  Scenarios kept: {scenarios_kept}")

    # Final count
    production_qs = [q for q in data['questions'] if q.get('template') and q.get('chips')]
    with_scenario = sum(1 for q in production_qs if 'scenario' in q and q.get('scenario'))
    print(f"  Production questions with scenarios: {with_scenario}/{len(production_qs)} ({(with_scenario/len(production_qs))*100:.1f}%)")

if __name__ == '__main__':
    add_realistic_scenarios(
        'config/placement-test-questions-v9.4-cleaned.json',
        'config/placement-test-questions-v9.5-realistic.json'
    )
