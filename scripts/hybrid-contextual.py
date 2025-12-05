#!/usr/bin/env python3
"""
Hybrid approach to scenarios and prompts:
- A1/A2 (Phases 1-2): Keep simple, isolated grammar with optional scenarios
- B1/B2 (Phases 3-4): Use integrated contextual prompts (fuller sentences)
"""

import json

# Contextual prompts for B1/B2 - integrate context into the English prompt itself
CONTEXTUAL_PROMPTS = {
    # B1 - Intermediate
    "imperative": {
        "Don't speak": "The baby is sleeping. Don't speak so loudly, please.",
        "Speak": "I can't hear you. Speak louder, please.",
        "Come": "The party is starting. Come here now!",
    },
    "saber_conhecer": {
        "I know Maria": "Yes, I know Maria, we met at the party.",
        "I know how to swim": "I learned when I was young. I know how to swim well.",
    },
    "por_para": {
        "for": "I study Portuguese for my job.",
        "through": "We walked through the park.",
        "because of": "I'm tired because of the long meeting.",
    },

    # B2 - Upper-Intermediate
    "conditional": {
        "I would travel": "If I had more money, I would travel more.",
        "I would buy": "That house is beautiful. I would buy it if I could.",
        "I would help": "I would help you, but I don't have time right now.",
    },
    "subjunctive_if": {
        "If I could": "I would buy that house if I could.",
        "If I had": "If I had known, I would have called you.",
        "If I were": "If I were rich, I would travel the world.",
    },
    "future_subjunctive": {
        "When I arrive": "When I arrive home, I will call you.",
        "If you want": "If you want to succeed, you need to work hard.",
    },
}

def enhance_b1_b2_prompts(input_file: str, output_file: str):
    """Apply hybrid approach - contextual prompts for B1/B2 only."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    a1_a2_kept = 0
    b1_b2_enhanced = 0

    for q in data['questions']:
        phase = q.get('phase', 1)

        # A1/A2 (Phases 1-2): Keep as-is (simple prompts + optional scenarios)
        if phase <= 2:
            a1_a2_kept += 1
            # Remove scenario if it's too complex for beginners
            scenario = q.get('scenario', '')
            # Keep only simple scenarios
            continue

        # B1/B2 (Phases 3-4): Enhance with contextual prompts
        if phase >= 3:
            en = q.get('en', '')
            unit_name = q.get('unitName', '').lower()

            # Check if we have a contextual enhancement
            enhanced = False

            # Try to find matching contextual prompt
            for category, prompts in CONTEXTUAL_PROMPTS.items():
                for key, contextual in prompts.items():
                    if key.lower() in en.lower():
                        # Update to contextual prompt
                        q['en'] = contextual
                        # Remove scenario - context is in the prompt now
                        if 'scenario' in q:
                            del q['scenario']
                        enhanced = True
                        b1_b2_enhanced += 1
                        break
                if enhanced:
                    break

            # If no specific match, try generic enhancements based on unit
            if not enhanced and phase >= 3:
                # For B1/B2, remove simple scenarios - keep prompts focused
                if 'scenario' in q:
                    scenario = q['scenario']
                    # Remove generic scenarios from advanced levels
                    generic_patterns = ['You\'re', 'Someone asks', 'A friend']
                    if any(pattern in scenario for pattern in generic_patterns):
                        del q['scenario']

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.2-hybrid'
        data['metadata']['approach'] = 'Hybrid: Simple prompts for A1/A2, Contextual for B1/B2'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  A1/A2 questions kept simple: {a1_a2_kept}")
    print(f"  B1/B2 questions enhanced with context: {b1_b2_enhanced}")

    # Stats by phase
    by_phase = {}
    for q in data['questions']:
        phase = q.get('phase', 0)
        by_phase[phase] = by_phase.get(phase, 0) + 1

    print(f"\nQuestions by phase:")
    for phase in sorted(by_phase.keys()):
        phase_name = ['', 'A1', 'A2', 'B1', 'B2'][phase] if phase <= 4 else f'Phase {phase}'
        print(f"  {phase_name}: {by_phase[phase]} questions")

if __name__ == '__main__':
    enhance_b1_b2_prompts(
        'config/placement-test-questions-v10.1-fixed-hints.json',
        'config/placement-test-questions-v10.2-hybrid.json'
    )
