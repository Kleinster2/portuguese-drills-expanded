#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demonstration of Annotation vs. Substitution Mode

Shows the difference between annotated text (with /notation/) and
substitution mode (phonetic realization).

Usage:
    python utils/demo_substitution.py
"""

import sys
from annotate_pronunciation import annotate_pronunciation, format_substitution

def main():
    """Demonstrate annotation vs. substitution mode."""

    # Fix Windows console encoding
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    # Demo sentences
    sentences = [
        "Eu sou o Daniel.",
        "Eu sou professor de português.",
        "Eu trabalho no Brasil.",
        "De manhã eu falo português com a Sofia.",
        "Eu tenho um cachorro e uma gata.",
        "Eu moro em São Paulo com a minha família.",
        "Eu também sou analista de dados.",
    ]

    print("=" * 80)
    print("ANNOTATION vs. SUBSTITUTION MODE")
    print("=" * 80)
    print()
    print("This demonstrates the difference between:")
    print("  • ANNOTATION MODE: Shows phonetic guides with /notation/")
    print("  • SUBSTITUTION MODE: Replaces text with phonetic realization")
    print()
    print("=" * 80)
    print()

    for i, sentence in enumerate(sentences, 1):
        # Generate both versions
        annotated = annotate_pronunciation(sentence, skip_if_annotated=False)
        substituted = format_substitution(annotated)

        print(f"Example {i}:")
        print(f"  Original:      {sentence}")
        print(f"  Annotated:     {annotated}")
        print(f"  Substituted:   {substituted}")
        print()

    print("=" * 80)
    print("KEY TRANSFORMATIONS")
    print("=" * 80)
    print()
    print("• Final -o  → u     (sou → su, no → nu, trabalho → trabalhu)")
    print("• Final -or → oh    (professor → professoh)")
    print("• Final -e  → i     (de → di)")
    print("• de        → dji   (standalone: de → dji)")
    print("• Final -te → tchi  (contente → contentchi)")
    print("• com       → coun  (nasal: com → coun)")
    print("• um/uma    → ũm/ũma (nasal: um → ũm)")
    print("• também    → tambeyn (nasal: também → tambeyn)")
    print()

if __name__ == "__main__":
    main()
