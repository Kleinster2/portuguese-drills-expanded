#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Three-Step Lesson Generator

Generates lesson content in the three-step format:
1. Original (orthography)
2. Annotated (pronunciation guides)
3. Substituted (phonetic realization)

Usage:
    python utils/generate_three_step_lessons.py
"""

import sys
from annotate_pronunciation import annotate_pronunciation, format_substitution

def generate_three_step_html(sentence, translation):
    """
    Generate HTML for three-step lesson format.

    Args:
        sentence (str): Portuguese sentence
        translation (str): English translation

    Returns:
        str: HTML formatted for three-step display
    """
    # Step 1: Original
    original = sentence

    # Step 2: Annotated
    annotated = annotate_pronunciation(sentence, skip_if_annotated=False)

    # Step 3: Substituted
    substituted = format_substitution(annotated)

    # Convert to HTML with pronunciation spans
    def add_pronunciation_spans(text):
        """Convert /text/ annotations to HTML spans."""
        import re
        return re.sub(r'/([^/]+)/', r'<span class="pronunciation">/\1/</span>', text)

    annotated_html = add_pronunciation_spans(annotated)

    # Generate HTML
    html = f'''                    <div class="example-sentence p-4 rounded bg-white border-l-2 border-transparent space-y-2">
                        <!-- Step 1: Original -->
                        <div class="font-medium text-gray-900">{original}</div>
                        <div class="text-sm text-gray-600 italic">{translation}</div>

                        <!-- Step 2: Annotated -->
                        <div class="font-medium text-gray-700 bg-blue-50 px-3 py-2 rounded">{annotated_html}</div>

                        <!-- Step 3: Substituted -->
                        <div class="font-medium text-blue-600 bg-blue-100 px-3 py-2 rounded font-mono">{substituted}</div>
                    </div>'''

    return html


def main():
    """Generate three-step lessons for Unit 1."""

    # Fix Windows console encoding
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    print("=" * 80)
    print("THREE-STEP LESSON GENERATOR")
    print("=" * 80)
    print()

    # Unit 1 sentences
    lessons = [
        # Pattern 1.1: Names
        ("Eu sou o Daniel.", "I am Daniel. (masculine)"),
        ("Eu sou a Sofia.", "I am Sofia. (feminine)"),

        # Pattern 1.2: Professions
        ("Eu sou analista.", "I am an analyst. (same for m/f)"),
        ("Eu sou professor.", "I am a teacher. (masculine)"),
        ("Eu sou professora.", "I am a teacher. (feminine)"),

        # Pattern 1.3: Nationalities
        ("Eu sou americano.", "I am American. (masculine)"),
        ("Eu sou americana.", "I am American. (feminine)"),
        ("Eu sou brasileiro.", "I am Brazilian. (masculine)"),
        ("Eu sou brasileira.", "I am Brazilian. (feminine)"),

        # Pattern 1.4: Cities
        ("Eu sou de Miami.", "I am from Miami."),
        ("Eu sou de São Paulo.", "I am from São Paulo."),

        # Pattern 1.5: Countries
        ("Eu sou do Brasil.", "I am from Brazil. (masculine: o Brasil)"),
        ("Eu sou da França.", "I am from France. (feminine: a França)"),

        # Pattern 1.6: Characteristics
        ("Eu sou casado.", "I am married. (masculine)"),
        ("Eu sou casada.", "I am married. (feminine)"),
        ("Eu sou alto.", "I am tall. (masculine)"),
        ("Eu sou alta.", "I am tall. (feminine)"),
    ]

    print("Generated HTML for all Unit 1 patterns:")
    print()
    print("<!-- PATTERN 1.1: Names -->")
    for sentence, translation in lessons[:2]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("<!-- PATTERN 1.2: Professions -->")
    for sentence, translation in lessons[2:5]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("<!-- PATTERN 1.3: Nationalities -->")
    for sentence, translation in lessons[5:9]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("<!-- PATTERN 1.4: Cities -->")
    for sentence, translation in lessons[9:11]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("<!-- PATTERN 1.5: Countries -->")
    for sentence, translation in lessons[11:13]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("<!-- PATTERN 1.6: Characteristics -->")
    for sentence, translation in lessons[13:]:
        print(generate_three_step_html(sentence, translation))
        print()

    print("=" * 80)
    print("PLAIN TEXT PREVIEW")
    print("=" * 80)
    print()

    # Show a few examples in plain text
    for i, (sentence, translation) in enumerate(lessons[:3], 1):
        print(f"Example {i}:")
        print(f"  Original:     {sentence}")
        print(f"  Translation:  {translation}")
        annotated = annotate_pronunciation(sentence, skip_if_annotated=False)
        print(f"  Annotated:    {annotated}")
        substituted = format_substitution(annotated)
        print(f"  Substituted:  {substituted}")
        print()

if __name__ == "__main__":
    main()
