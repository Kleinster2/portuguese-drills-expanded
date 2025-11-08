#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complex test with challenging Portuguese text.
"""

import sys
from annotate_pronunciation import annotate_pronunciation

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def test_sentence(original, description=""):
    """Test annotation on a single sentence."""
    annotated = annotate_pronunciation(original, skip_if_annotated=False)
    if description:
        print(f"[{description}]")
    print(f"Original:  {original}")
    print(f"Annotated: {annotated}")
    print()
    return annotated

def main():
    print("=" * 80)
    print("COMPLEX TEXT ANNOTATION TEST - CHALLENGING CASES")
    print("=" * 80)
    print()

    print("TEST 1: Multiple Nasal Patterns in One Sentence")
    print("-" * 80)
    test_sentence(
        "Alguém também tem cem irmãos bons e bem felizes.",
        "Mixed short/long nasal words, plural endings"
    )

    print("TEST 2: Many L Vocalizations")
    print("-" * 80)
    test_sentence(
        "O Brasil é legal para quem fala português e espanhol.",
        "Multiple final L words"
    )
    test_sentence(
        "Ele joga futebol e basquetebol no principal estádio central.",
        "Multiple -ol, -al endings"
    )

    print("TEST 3: Palatalization Variations")
    print("-" * 80)
    test_sentence(
        "O presidente está diferente depois de tudo.",
        "Multiple -ente, -ude words"
    )
    test_sentence(
        "De repente, a gente fica contente com pouco.",
        "de + palatalization triggers"
    )

    print("TEST 4: Mixed Verb Forms")
    print("-" * 80)
    test_sentence(
        "Nós falamos português, vocês falam espanhol, e eles falam inglês.",
        "Multiple conjugations with -mos, -m endings"
    )
    test_sentence(
        "Eu como pão, você come arroz, e ela come feijão.",
        "Multiple subjects, verb forms, nasal nouns"
    )

    print("TEST 5: Contractions and Prepositions")
    print("-" * 80)
    test_sentence(
        "Vou do escritório para o hospital com o médico.",
        "do, para o, com o combinations"
    )
    test_sentence(
        "Estou na escola, no clube, e num restaurante famoso.",
        "na, no, num contractions"
    )

    print("TEST 6: Numbers and Quantifiers")
    print("-" * 80)
    test_sentence(
        "Tenho dois carros, três casas, quatro gatos, e cinco cachorros.",
        "Numbers + plural nouns"
    )
    test_sentence(
        "Muito pouco dinheiro e muitos poucos amigos.",
        "muito/pouco variations"
    )

    print("TEST 7: Proper Nouns Mixed with Common Words")
    print("-" * 80)
    test_sentence(
        "Carlos e Sarah trabalham no Google em São Paulo com José.",
        "Mix of Portuguese and foreign proper nouns"
    )
    test_sentence(
        "O Facebook e o WhatsApp são do Mark.",
        "Tech company names"
    )

    print("TEST 8: Stressed vs Unstressed Endings")
    print("-" * 80)
    test_sentence(
        "Eu tomo café no sofá e vou para o metrô.",
        "café (stressed) vs resto (unstressed)"
    )
    test_sentence(
        "Você está no avô do José?",
        "avô (stressed), José (stressed)"
    )

    print("TEST 9: Long Complex Sentence")
    print("-" * 80)
    test_sentence(
        "Quando eu trabalho no hospital central de Lisboa, sempre falo português com os professores brasileiros que também estudam espanhol e inglês.",
        "Everything at once!"
    )

    print("TEST 10: Colloquial Reductions (Manual + Auto)")
    print("-" * 80)
    test_sentence(
        "_Tô_ _falando_ português _pro_ meu irmão que _tá_ estudando _no_ Brasil.",
        "Manual reductions + automatic annotations"
    )
    test_sentence(
        "_Vô_ _pro_ trabalho de ônibus porque _tô_ sem carro.",
        "Mixed manual transformations"
    )

    print("TEST 11: Adjective Agreement")
    print("-" * 80)
    test_sentence(
        "Ela é alta, bonita, inteligente, e muito feliz.",
        "Feminine adjectives"
    )
    test_sentence(
        "Os professores brasileiros são altos e simpáticos.",
        "Masculine plural"
    )

    print("TEST 12: Borrowed Words and Tech Terms")
    print("-" * 80)
    test_sentence(
        "Uso o iPad para ver o Facebook, Instagram, e Netflix.",
        "Multiple borrowed words"
    )
    test_sentence(
        "Download o software do site da Microsoft.",
        "Tech vocabulary"
    )

    print("TEST 13: Diminutives and Augmentatives")
    print("-" * 80)
    test_sentence(
        "O cachorrinho está no carrinho pequeno.",
        "-inho diminutive endings"
    )
    test_sentence(
        "Um casarão enorme com portão grande.",
        "-ão augmentative"
    )

    print("TEST 14: All Nasal Patterns Together")
    print("-" * 80)
    test_sentence(
        "Com bem cem bons sons vem sem nem um também.",
        "Every nasal pattern in one sentence"
    )

    print("TEST 15: Sentence with Everything")
    print("-" * 80)
    test_sentence(
        "_Tô_ usando o Facebook _pro_ falar com alguém do Brasil sobre futebol, espanhol, e Portugal.",
        "Manual reductions + all 6 rules"
    )

    print("\n" + "=" * 80)
    print("✅ COMPLEX TEST COMPLETE")
    print("=" * 80)
    print("\nKey things to verify:")
    print("  ✓ Multiple L vocalizations in same sentence")
    print("  ✓ Short vs long nasal word distinction")
    print("  ✓ Contractions (do, no, na, num, pelo)")
    print("  ✓ Stressed words NOT annotated (café, você, avô)")
    print("  ✓ Proper nouns handled correctly")
    print("  ✓ Borrowed words get epenthesis")
    print("  ✓ Manual reductions preserved")
    print("  ✓ Adjective endings (-o/-a/-os/-as)")
    print("  ✓ Verb conjugations (-mos, -m, -o, -e)")
    print("  ✓ Palatalization (de, -ente, -ude)")
    print()

if __name__ == '__main__':
    main()
