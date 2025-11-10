#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lesson Content Generator

Generates annotated Portuguese content for lessons using the pronunciation annotator.
This ensures consistency across all units and reduces manual annotation errors.

Usage:
    python utils/generate_lesson_content.py unit-2-content.txt > unit-2-annotated.html
"""

import sys
from annotate_pronunciation import annotate_pronunciation

def generate_lesson_content(sentences, title="Lesson"):
    """
    Generate annotated lesson content from plain Portuguese sentences.

    Args:
        sentences (list): List of Portuguese sentences
        title (str): Lesson title

    Returns:
        str: Annotated sentences ready for insertion into lesson HTML
    """

    output = []
    output.append(f"<!-- {title} - Generated Content -->")
    output.append("")

    for i, sentence in enumerate(sentences, 1):
        # Annotate the sentence
        annotated = annotate_pronunciation(sentence, skip_if_annotated=False)

        # Create HTML-ready format
        output.append(f"<!-- Sentence {i} -->")
        output.append(f'<div class="example-sentence p-3 rounded bg-white border-l-2 border-transparent">')
        output.append(f'    <div class="font-medium">{annotated}</div>')
        output.append(f'    <!-- Add translation here -->')
        output.append(f'</div>')
        output.append("")

    return "\n".join(output)

def main():
    """Command-line interface for lesson content generation."""

    # Fix Windows console encoding
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    # Example: Unit 2 content
    unit_2_sentences = [
        "Eu moro em Miami.",
        "Eu moro no Brasil.",
        "Eu trabalho como professor.",
        "Eu trabalho no hospital.",
        "Eu falo português e inglês.",
        "Eu tenho um cachorro.",
        "Eu tenho uma gata.",
        "Eu gosto de música.",
        "Eu gosto de futebol."
    ]

    # Generate annotated content
    content = generate_lesson_content(unit_2_sentences, "Unit 2: Daily Life")
    print(content)

    # Show statistics
    print("\n<!-- GENERATION STATS -->", file=sys.stderr)
    print(f"<!-- Processed: {len(unit_2_sentences)} sentences -->", file=sys.stderr)
    print(f"<!-- All pronunciation rules applied automatically -->", file=sys.stderr)

if __name__ == "__main__":
    main()
