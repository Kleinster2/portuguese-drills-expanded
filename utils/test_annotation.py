#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test the annotation system with fresh Portuguese text.
"""

import sys
from annotate_pronunciation import annotate_pronunciation

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def test_sentence(original):
    """Test annotation on a single sentence."""
    annotated = annotate_pronunciation(original, skip_if_annotated=False)
    print(f"Original:  {original}")
    print(f"Annotated: {annotated}")
    print()
    return annotated

def main():
    print("=" * 70)
    print("FRESH TEXT ANNOTATION TEST")
    print("=" * 70)
    print()

    print("TEST CASE 1: Maria's Introduction (Step 1)")
    print("-" * 70)
    print()

    step1_sentences = [
        "Eu sou a Maria.",
        "Eu sou portuguesa de Lisboa.",
        "Eu moro no Porto com meu irmão.",
        "Eu trabalho em um hospital.",
        "Eu falo português e espanhol.",
        "Eu gosto de café e de futebol.",
        "Eu vou de ônibus para o trabalho.",
        "Eu tenho dois gatos e um cachorro.",
        "Eu estou em casa agora.",
        "Eu estou contente de estudar inglês.",
    ]

    for sentence in step1_sentences:
        test_sentence(sentence)

    print("\n" + "=" * 70)
    print("TEST CASE 2: Step 4 with Manual Reductions")
    print("-" * 70)
    print()

    step4_sentences = [
        "_Sô_ a Maria.",
        "_Sô_ portuguesa de Lisboa.",
        "Moro no Porto com meu irmão.",
        "_Vô_ de ônibus _pro_ trabalho.",
        "_Tô_ em casa agora.",
        "_Tô_ contente de _estudá_ inglês.",
    ]

    for sentence in step4_sentences:
        annotated = test_sentence(sentence)

    print("\n" + "=" * 70)
    print("TEST CASE 3: Complex Sentences")
    print("-" * 70)
    print()

    complex_sentences = [
        "Eu também gosto de música brasileira.",
        "Você é muito alto e bonito.",
        "Ele está no escritório agora.",
        "Nós somos professores de português.",
        "Eles vão de metrô para a escola.",
        "O nome dele é Francisco.",
        "A colega da Sarah trabalha na Acme.",
        "Eu estudo português com um professor brasileiro.",
    ]

    for sentence in complex_sentences:
        test_sentence(sentence)

    print("\n" + "=" * 70)
    print("TEST CASE 4: Edge Cases")
    print("-" * 70)
    print()

    edge_cases = [
        "Eu uso Facebook e Internet.",  # Epenthesis rule
        "Brasil é bonito.",  # L vocalization + proper noun
        "Eu sou do Brasil.",  # Contraction
        "Eu falo com alguém.",  # Nasal vowel (long word)
        "Ela está bem.",  # Nasal vowel (short word)
        "Ele é alto.",  # Mid-word L vocalization
    ]

    for sentence in edge_cases:
        test_sentence(sentence)

    print("\n" + "=" * 70)
    print("✅ TEST COMPLETE")
    print("=" * 70)
    print()
    print("Check above for:")
    print("  1. All -o words have [_u_]")
    print("  2. All -e words have [_i_] (except stressed)")
    print("  3. 'de' becomes de[_dji_]")
    print("  4. Nasal vowels annotated: em[_eyn_], com[_coun_], etc.")
    print("  5. Final L vocalized: futebo~~l~~[_u_], espanho~~l~~[_u_]")
    print("  6. Manual reductions preserved: _Sô_, _Tô_, _Vô_")
    print()

if __name__ == '__main__':
    main()
