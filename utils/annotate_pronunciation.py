#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Brazilian Portuguese Pronunciation Annotator

Applies 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4):
1. Final unstressed -o → [u]
2. Final unstressed -e → [i]
3. Palatalization (de → de[dji], contente → contente[tchi])
4. Epenthetic [i] on consonant-final borrowed words
5. Nasal vowel endings (-em, -am, -im, -om, -um/uma)
6. Syllable-final L → [u]

NOTE: Coalescence (de ônibus → djônibus) is NOT applied here.
      It is an OPTIONAL feature for Step 5 (phonetic orthography) only.

Version: 1.1
Last Updated: 2025-01-07
"""

import re
from typing import Dict, Set

# ============================================================================
# EXCEPTION LISTS
# ============================================================================

# Words with stressed final vowels (don't apply Rule 1/2)
STRESSED_FINAL = {
    'café', 'você', 'metrô', 'avô', 'avó', 'sofá', 'José',
}

# Words with tilde (nasalization already marked, don't apply Rule 6)
TILDE_WORDS = {
    'são', 'irmão', 'irmãos', 'irmã', 'irmãs', 'mão', 'não',
    'pão', 'alemão', 'alemães', 'pães',
}

# Proper nouns (handle carefully)
PROPER_NOUNS = {
    'Miami', 'John', 'Sarah', 'Carlos', 'Brasil', 'Brooklyn',
    'York', 'Acme', 'Facebook', 'Internet', 'iPad', 'Whatsapp',
}

# Words that end in -o/-e but are adjectives/nouns that change
# We still annotate them, but this is for reference
VARIABLE_WORDS = {
    'americano', 'brasileiro', 'casado', 'solteiro', 'alto', 'baixo',
}

# ============================================================================
# RULE 7B DICTIONARY - Mid-word syllable-final L
# ============================================================================

RULE_7B_WORDS = {
    # voltar family
    'volta': 'volta[vouta]',
    'voltar': 'voltar[voutar]',
    'volto': 'volto[vouto]',
    'voltamos': 'voltamos[voutamos]',
    'voltam': 'voltam[voutam]',
    'voltei': 'voltei[voutei]',
    'voltou': 'voltou[voutou]',

    # último family
    'último': 'último[úutimu]',
    'última': 'última[úutima]',
    'últimos': 'últimos[úutimus]',
    'últimas': 'últimas[úutimas]',

    # Add more high-frequency words as needed
    # 'alto': 'alto[auto]',
    # 'calma': 'calma[cauma]',
    # 'falso': 'falso[fauso]',
    # 'álcool': 'álcool[áucool]',
}

# ============================================================================
# RULE 5 DICTIONARY - Epenthetic [i] on borrowed words
# ============================================================================

BORROWED_WORDS = {
    # Epenthetic + palatalization (ends in -t or -d)
    'Internet': 'Internet[chi]',
    'iPad': 'iPad[ji]',

    # Epenthetic only (other consonants)
    'Facebook': 'Facebook[i]',
    'Whatsapp': 'Whatsapp[i]',
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def is_already_annotated(text: str) -> bool:
    """Check if text already has pronunciation annotations."""
    return '[' in text and ']' in text

def is_stressed_final(word: str) -> bool:
    """Check if word has stressed final vowel (exception to Rules 1/2)."""
    return word.lower() in STRESSED_FINAL

def has_tilde(word: str) -> bool:
    """Check if word has tilde (exception to Rule 6)."""
    return any(c in word for c in 'ãõáéíóúâêôà') or word.lower() in TILDE_WORDS

def protect_brackets(text: str) -> tuple[str, dict]:
    """
    Replace bracketed content with placeholders to prevent nested annotations.
    Returns (protected_text, replacements_dict)
    """
    replacements = {}
    counter = [0]

    def replace_bracket(match):
        placeholder = f"__PROTECTED_{counter[0]}__"
        replacements[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    # Match [...] patterns and replace with placeholders
    protected = re.sub(r'\[[^\]]+\]', replace_bracket, text)
    return protected, replacements

def restore_brackets(text: str, replacements: dict) -> str:
    """Restore protected bracketed content."""
    for placeholder, original in replacements.items():
        text = text.replace(placeholder, original)
    return text

# ============================================================================
# RULE APPLICATIONS
# ============================================================================

def apply_rule_7b(text: str) -> str:
    """Rule 7b: Mid-word syllable-final L (dictionary)."""
    for word, annotated in RULE_7B_WORDS.items():
        # Case-insensitive replacement, preserve original case for first letter
        pattern = r'\b' + word + r'\b'
        text = re.sub(pattern, annotated, text, flags=re.IGNORECASE)
    return text

def apply_rule_7a(text: str) -> str:
    """Rule 7a: Word-final L → ~~l~~[u]."""
    # Match words ending in 'l' (but not already annotated)
    def replace_final_l(match):
        word = match.group(0)
        # Don't annotate if already has brackets
        if '[' in word or ']' in word:
            return word
        # Don't annotate proper nouns starting with capital
        if word[0].isupper() and word in PROPER_NOUNS:
            # Special case: Brasil gets annotated even though it's proper
            if word == 'Brasil':
                return 'Brasi~~l~~[u]'
            return word
        # Apply: word ending in l → word~~l~~[u]
        return word[:-1] + '~~l~~[u]'

    # Only match if not followed by annotation bracket
    return re.sub(r'\b\w+l\b(?!\[)', replace_final_l, text)

def apply_rule_5(text: str) -> str:
    """Rule 5: Nasal vowel endings."""
    # Don't annotate words with tilde

    # Rule 5a: -em → [eyn]
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(bem)(?!\[)\b', r'bem[beyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(sem)(?!\[)\b', r'sem[seyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(tem)(?!\[)\b', r'tem[teyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(quem)(?!\[)\b', r'quem[keyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(cem)(?!\[)\b', r'cem[seyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nem)(?!\[)\b', r'nem[neyn]', text, flags=re.IGNORECASE)

    # em (no initial consonant, just ending)
    text = re.sub(r'\b(em)(?!\[)\b', r'em[eyn]', text)

    # Long words (show ending only)
    text = re.sub(r'\b(também)(?!\[)\b', r'\1[eyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(alguém)(?!\[)\b', r'\1[eyn]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(ninguém)(?!\[)\b', r'\1[eyn]', text, flags=re.IGNORECASE)

    # Rule 5b: -am → [ãwn] (verb endings, not already annotated)
    def annotate_am(match):
        word = match.group(0)
        if has_tilde(word) or '[' in word:
            return word
        return word + '[ãwn]'
    text = re.sub(r'\b(\w+am)\b(?!\[)', annotate_am, text)

    # Rule 5c: -im → [ing]
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(sim)(?!\[)\b', r'sim[sing]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(assim)(?!\[)\b', r'assim[ssing]', text, flags=re.IGNORECASE)

    # Long words (show ending only)
    text = re.sub(r'\b(jardim)(?!\[)\b', r'jardim[ing]', text, flags=re.IGNORECASE)

    # Rule 5d: -om → [oun]
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(com)(?!\[)\b', r'com[coun]', text)
    text = re.sub(r'\b(som)(?!\[)\b', r'som[soun]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(bom)(?!\[)\b', r'bom[boun]', text, flags=re.IGNORECASE)

    # Rule 5e: um/uma → [ũm]/[ũma]
    text = re.sub(r'\b(um)(?!\[)\b', r'um[ũm]', text)
    text = re.sub(r'\b(uma)(?!\[)\b', r'uma[ũma]', text)
    text = re.sub(r'\b(algum)(?!\[)\b', r'algum[ũm]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(alguma)(?!\[)\b', r'alguma[ũma]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nenhum)(?!\[)\b', r'nenhum[ũm]', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nenhuma)(?!\[)\b', r'nenhuma[ũma]', text, flags=re.IGNORECASE)

    return text

def apply_rule_4(text: str) -> str:
    """Rule 4: Epenthetic [i] on consonant-final borrowed words."""
    for word, annotated in BORROWED_WORDS.items():
        pattern = r'\b' + word + r'\b'
        text = re.sub(pattern, annotated, text)
    return text

# ============================================================================
# REMOVED: Coalescence (was old Rule 4)
# ============================================================================
# Coalescence (de ônibus → djônibus) is NOT an obligatory rule.
# It is an OPTIONAL phonetic process for Step 5 (colloquial/phonetic orthography).
# In Steps 1-4, we keep: de[dji] ônibus (two separate words)
# Only in Step 5: djônibus (coalescence written directly)
# ============================================================================

def apply_rule_3(text: str) -> str:
    """Rule 3: Palatalization."""
    # Rule 3a: de → de[dji] (ALWAYS, but not if already annotated)
    # Must happen BEFORE Rule 2 to prevent de[i] first
    text = re.sub(r'\b(de)(?!\[)\b', r'de[dji]', text)

    # Rule 3b: contente → contente[tchi] (not if already annotated)
    def annotate_contente(match):
        word = match.group(0)
        if '[' in word:
            return word
        return word + '[tchi]'
    text = re.sub(r'\b(contente)s?(?!\[)\b', annotate_contente, text, flags=re.IGNORECASE)

    # Add more palatalization patterns as needed

    return text

def apply_rule_2(text: str) -> str:
    """Rule 2: Final unstressed -e → [i]."""
    # Conjunction 'e' (and) - but not 'de' (already handled by Rule 3)
    text = re.sub(r'\b(e)(?!\[)\b', r'e[i]', text)

    # Words ending in -e (but not stressed, not already annotated)
    def replace_final_e(match):
        word = match.group(0)
        # Skip if word is 'de' (handled by Rule 3)
        if word.lower() == 'de':
            return word
        if is_stressed_final(word):
            return word
        if '[' in word or ']' in word:
            return word
        # Apply: word ending in e → word[i]
        return word + '[i]'

    # Match words ending in 'e' followed by word boundary (not followed by [)
    text = re.sub(r'\b\w+e\b(?!\[)', replace_final_e, text)

    return text

def apply_rule_1(text: str) -> str:
    """Rule 1: Final unstressed -o → [u]."""
    # Protect existing brackets from nested annotation
    protected, replacements = protect_brackets(text)

    # Function words (specific patterns to avoid over-matching)
    protected = re.sub(r'\bo\b', r'o[u]', protected)  # Article 'o'
    protected = re.sub(r'\bdo\b', r'do[u]', protected)  # Contraction de+o
    protected = re.sub(r'\bno\b', r'no[u]', protected)  # Contraction em+o
    protected = re.sub(r'\bao\b', r'ao[u]', protected)  # Contraction a+o
    protected = re.sub(r'\bcomo\b', r'como[u]', protected, flags=re.IGNORECASE)  # 'as/like'

    # Plural forms
    protected = re.sub(r'\bos\b', r'os[us]', protected)  # Article 'os'
    protected = re.sub(r'\bdos\b', r'dos[us]', protected)  # Contraction de+os
    protected = re.sub(r'\bnos\b', r'nos[us]', protected)  # Contraction em+os
    protected = re.sub(r'\baos\b', r'aos[us]', protected)  # Contraction a+os

    # Words ending in -o (but not stressed, not already annotated, not followed by ~~)
    def replace_final_o(match):
        word = match.group(0)
        if is_stressed_final(word):
            return word
        # Apply: word ending in o → word[u]
        return word + '[u]'

    # Match words ending in 'o' (not followed by ~~ or [)
    protected = re.sub(r'\b\w+o\b(?![~\[])', replace_final_o, protected)

    # Words ending in -os → [us] (not already annotated or followed by ~~)
    def replace_final_os(match):
        word = match.group(0)
        return word + '[us]'

    protected = re.sub(r'\b\w+os\b(?![~\[])', replace_final_os, protected)

    # Restore protected content
    return restore_brackets(protected, replacements)

# ============================================================================
# MAIN ANNOTATION FUNCTION
# ============================================================================

def annotate_pronunciation(text: str, skip_if_annotated: bool = True) -> str:
    """
    Apply all 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4).

    Args:
        text: Portuguese text to annotate
        skip_if_annotated: If True, skip text that already has annotations

    Returns:
        Annotated text with pronunciation markers
    """
    if skip_if_annotated and is_already_annotated(text):
        return text

    # Apply rules in order
    # Note: Order matters! Some rules depend on others not having been applied yet

    # Rule 6 FIRST - prevents -ol words from getting double annotation
    # Rule 6b first (dictionary) - before 6a to avoid conflicts
    text = apply_rule_7b(text)

    # Rule 6a (word-final L) - BEFORE Rule 1 to handle -ol, -el, -al endings
    text = apply_rule_7a(text)

    # Rule 5 (nasal vowels) - BEFORE Rule 1 to prevent "com" issues
    text = apply_rule_5(text)

    # Rule 4 (epenthetic)
    text = apply_rule_4(text)

    # REMOVED: Coalescence (was old Rule 4) - optional, Step 5 only
    # In Steps 1-4: de[dji] ônibus (two separate words)
    # In Step 5: djônibus (coalescence written directly)

    # Rule 3 (palatalization) - BEFORE Rule 2 to handle 'de' before final -e
    text = apply_rule_3(text)

    # Rule 2 (final -e)
    text = apply_rule_2(text)

    # Rule 1 (final -o) - LAST, after L and nasals are handled
    text = apply_rule_1(text)

    return text

# ============================================================================
# COMMAND LINE INTERFACE
# ============================================================================

def main():
    """Test the annotation system with examples."""
    import sys

    # Fix Windows console encoding for Unicode
    if sys.platform == 'win32':
        import codecs
        sys.stdout.reconfigure(encoding='utf-8')

    test_sentences = [
        "Eu sou o John.",
        "Eu sou americano.",
        "Eu sou de Miami.",
        "Eu sou casado com a Sarah.",
        "Eu moro em Nova York.",
        "Eu trabalho como analista.",
        "Eu falo inglês e um pouco de espanhol.",
        "Eu gosto de música.",
        "Eu vou de metrô para o trabalho.",
        "Eu tenho um cachorro e uma gata.",
        "Eu estou contente em falar português.",
        "Eu gosto de futebol.",
        "Eu vou de ônibus para o escritório.",
        "Eu sou brasileiro.",
        "Sou de São Paulo.",
        "Também sou analista.",
    ]

    print("Brazilian Portuguese Pronunciation Annotator")
    print("=" * 60)
    print()

    for sentence in test_sentences:
        annotated = annotate_pronunciation(sentence)
        print(f"Original:  {sentence}")
        print(f"Annotated: {annotated}")
        print()

if __name__ == "__main__":
    main()
