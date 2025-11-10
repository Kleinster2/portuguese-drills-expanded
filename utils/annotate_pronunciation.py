#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Brazilian Portuguese Pronunciation Annotator

Applies 7 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4):
1. Final unstressed -o → [u]
1b. Final unstressed -or → [oh] (important for English speakers)
2. Final unstressed -e → [i], plural -es → [is]
3. Palatalization (de → de[dji], contente → contente[tchi])
4. Epenthetic [i] on consonant-final borrowed words
5. Nasal vowel endings (-em, -am, -im, -om, -um/uma)
6. Syllable-final L → [u]

NOTE: Coalescence (de ônibus → djônibus) is NOT applied here.
      It is an OPTIONAL feature for Step 5 (phonetic orthography) only.

Version: 1.9
Last Updated: 2025-01-10
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

# Words with tildes (ã, õ) are automatically detected and not annotated
# No hardcoded list needed - the has_tilde() function checks for ã and õ

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
    'volta': 'volta/vouta/',
    'voltar': 'voltar/voutar/',
    'volto': 'volto/vouto/',
    'voltamos': 'voltamos/voutamos/',
    'voltam': 'voltam/voutam/',
    'voltei': 'voltei/voutei/',
    'voltou': 'voltou/voutou/',

    # último family
    'último': 'último/úutimu/',
    'última': 'última/úutima/',
    'últimos': 'últimos/úutimus/',
    'últimas': 'últimas/úutimas/',

    # Add more high-frequency words as needed
    # 'alto': 'alto/auto/',
    # 'calma': 'calma/cauma/',
    # 'falso': 'falso/fauso/',
    # 'álcool': 'álcool/áucool/',
}

# ============================================================================
# RULE 5 DICTIONARY - Epenthetic [i] on borrowed words
# ============================================================================

BORROWED_WORDS = {
    # Epenthetic + palatalization (ends in -t or -d)
    'Internet': 'Internet/chi/',
    'iPad': 'iPad/ji/',

    # Epenthetic only (other consonants)
    'Facebook': 'Facebook/i/',
    'Whatsapp': 'Whatsapp/i/',
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def is_already_annotated(text: str) -> bool:
    """Check if text already has pronunciation annotations."""
    # Check for /text/ pattern (pronunciation annotations)
    return bool(re.search(r'/[^/\s]+/', text))

def is_stressed_final(word: str) -> bool:
    """Check if word has stressed final vowel (exception to Rules 1/2)."""
    return word.lower() in STRESSED_FINAL

def has_tilde(word: str) -> bool:
    """Check if word has nasal tilde (ã, õ) - don't annotate these words."""
    return any(c in word for c in 'ãõ')

def protect_annotations(text: str) -> tuple[str, dict]:
    """
    Replace annotation content with placeholders to prevent nested annotations.
    Returns (protected_text, replacements_dict)
    """
    replacements = {}
    counter = [0]

    def replace_annotation(match):
        placeholder = f"__PROTECTED_{counter[0]}__"
        replacements[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    # Match /text/ patterns (pronunciation annotations) and replace with placeholders
    protected = re.sub(r'/[^/\s]+/', replace_annotation, text)
    return protected, replacements

def restore_annotations(text: str, replacements: dict) -> str:
    """Restore protected annotation content."""
    for placeholder, original in replacements.items():
        text = text.replace(placeholder, original)
    return text

# ============================================================================
# RULE APPLICATIONS
# ============================================================================

def apply_rule_7b(text: str) -> str:
    """Rule 7b: Mid-word syllable-final L (dictionary)."""
    for word, annotated in RULE_7B_WORDS.items():
        # Case-insensitive replacement
        pattern = r'\b' + word + r'\b'
        text = re.sub(pattern, annotated, text, flags=re.IGNORECASE)
    return text

def apply_rule_7a(text: str) -> str:
    """Rule 7a: Word-final L → /u/."""
    # Match words ending in 'l' (but not already annotated)
    def replace_final_l(match):
        word = match.group(0)
        # Don't annotate if already has annotation
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Apply: word ending in l → word/u/ (final L sounds like u)
        return word + '/u/'
        # Apply: word ending in l → word/u/ (final L sounds like u)
        return word + "/u/"

    # Only match if not followed by annotation
    return re.sub(r'\b\w+l\b(?!/)', replace_final_l, text)

def apply_rule_5(text: str) -> str:
    """Rule 5: Nasal vowel endings."""
    # Don't annotate words with tilde

    # Rule 5a: -em → /eyn/
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(bem)(?!/)\b', r'bem/beyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(sem)(?!/)\b', r'sem/seyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(tem)(?!/)\b', r'tem/teyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(quem)(?!/)\b', r'quem/keyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(cem)(?!/)\b', r'cem/seyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nem)(?!/)\b', r'nem/neyn/', text, flags=re.IGNORECASE)

    # em (no initial consonant, just ending)
    text = re.sub(r'\b(em)(?!/)\b', r'em/eyn/', text)

    # Long words (show ending only)
    text = re.sub(r'\b(também)(?!/)\b', r'\1/eyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(alguém)(?!/)\b', r'\1/eyn/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(ninguém)(?!/)\b', r'\1/eyn/', text, flags=re.IGNORECASE)

    # Rule 5b: -am → /ãwn/ (verb endings, not already annotated)
    def annotate_am(match):
        word = match.group(0)
        if has_tilde(word) or ('/' in word and re.search(r'/[^/\s]+/', word)):
            return word
        return word + '/ãwn/'
    text = re.sub(r'\b(\w+am)\b(?!/)', annotate_am, text)

    # Rule 5c: -im → /ing/
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(sim)(?!/)\b', r'sim/sing/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(assim)(?!/)\b', r'assim/ssing/', text, flags=re.IGNORECASE)

    # Long words (show ending only)
    text = re.sub(r'\b(jardim)(?!/)\b', r'jardim/ing/', text, flags=re.IGNORECASE)

    # Rule 5d: -om → /oun/
    # Short words (show full syllable with consonant for clarity)
    text = re.sub(r'\b(com)(?!/)\b', r'com/coun/', text)
    text = re.sub(r'\b(som)(?!/)\b', r'som/soun/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(bom)(?!/)\b', r'bom/boun/', text, flags=re.IGNORECASE)

    # Rule 5e: um/uma → /ũm///ũma/
    # Case-insensitive to handle sentence-initial capitalization (Um, Uma)
    text = re.sub(r'\b(um)(?!/)\b', r'\1/ũm/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(uma)(?!/)\b', r'\1/ũma/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(algum)(?!/)\b', r'\1/ũm/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(alguma)(?!/)\b', r'\1/ũma/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nenhum)(?!/)\b', r'\1/ũm/', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(nenhuma)(?!/)\b', r'\1/ũma/', text, flags=re.IGNORECASE)

    return text

def apply_rule_4(text: str) -> str:
    """Rule 4: Epenthetic /i/ on consonant-final borrowed words."""
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
    # Rule 3a: de → de/dji/ (ALWAYS, but not if already annotated)
    # Must happen BEFORE Rule 2 to prevent de/i/ first
    text = re.sub(r'\b(de)(?!/)\b', r'de/dji/', text)

    # Rule 3b: Words ending in -te → /tchi/ (unstressed final -te palatalization)
    # This must run BEFORE Rule 2 (final -e) to prevent -te words from getting /i/
    def annotate_te(match):
        word = match.group(0)
        # Skip if word is 'de' (already handled above)
        if word.lower() == 'de':
            return word
        # Skip if already annotated
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Skip if stressed final (though rare for -te words)
        if is_stressed_final(word):
            return word
        # Apply: word ending in te → word/tchi/
        return word + '/tchi/'
    text = re.sub(r'\b\w+te\b(?!/)', annotate_te, text, flags=re.IGNORECASE)

    # Rule 3c: Words ending in -de → /dji/ (unstressed final -de palatalization)
    # This must run BEFORE Rule 2 (final -e) to prevent -de words from getting /i/
    def annotate_de(match):
        word = match.group(0)
        # Skip if word is standalone 'de' (already handled above)
        if word.lower() == 'de':
            return word
        # Skip if already annotated
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Skip if stressed final
        if is_stressed_final(word):
            return word
        # Apply: word ending in de → word/dji/
        return word + '/dji/'
    text = re.sub(r'\b\w+de\b(?!/)', annotate_de, text, flags=re.IGNORECASE)

    return text

def apply_rule_2(text: str) -> str:
    """Rule 2: Final unstressed -e → /i/, plural -es → /is/."""
    # Conjunction 'e' (and) - but not 'de' (already handled by Rule 3)
    text = re.sub(r'\b(e)(?!/)\b', r'e/i/', text)

    # Plural words ending in -es → /is/ (must come before singular -e)
    def replace_plural_es(match):
        word = match.group(0)
        # Skip if word is 'de' (handled by Rule 3)
        if word.lower() == 'de':
            return word
        # Skip stressed words (like 'vocês', 'José')
        if is_stressed_final(word):
            return word
        # Skip words with tildes (ãe, õe)
        if has_tilde(word):
            return word
        # Skip already annotated
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Apply: word ending in es → word/is/
        return word + '/is/'

    # Match words ending in 'es' followed by word boundary (not followed by /)
    text = re.sub(r'\b\w+es\b(?!/)', replace_plural_es, text)

    # Singular words ending in -e (but not stressed, not tilde, not already annotated)
    def replace_final_e(match):
        word = match.group(0)
        # Skip if word is 'de' (handled by Rule 3)
        if word.lower() == 'de':
            return word
        if is_stressed_final(word):
            return word
        if has_tilde(word):
            return word
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Apply: word ending in e → word/i/
        return word + '/i/'

    # Match words ending in 'e' followed by word boundary (not followed by /)
    text = re.sub(r'\b\w+e\b(?!/)', replace_final_e, text)

    return text

def apply_rule_1b(text: str) -> str:
    """Rule 1b: Final unstressed -or → /oh/ (important for English speakers)."""
    # English speakers tend to pronounce -or like English "or"
    # In Brazilian Portuguese, final -or sounds like /oh/ (like "oh!" in English)
    # Examples: professor → /professoh/, doutor → /doutoh/, melhor → /melyoh/

    def replace_final_or(match):
        word = match.group(0)
        # Skip if already annotated
        if '/' in word and re.search(r'/[^/\s]+/', word):
            return word
        # Skip if word has tilde (rare but possible)
        if has_tilde(word):
            return word
        # Skip stressed words (rare for -or endings but check anyway)
        if is_stressed_final(word):
            return word
        # Apply: word ending in or → word/oh/
        return word + '/oh/'

    # Match words ending in 'or' (not followed by /)
    text = re.sub(r'\b\w+or\b(?!/)', replace_final_or, text)
    return text

def apply_rule_1(text: str) -> str:
    """Rule 1: Final unstressed -o → /u/."""
    # Protect existing annotations from nested annotation
    protected, replacements = protect_annotations(text)

    # Function words (specific patterns to avoid over-matching)
    # Use capture group to preserve case
    protected = re.sub(r'\b(o)\b', r'\1/u/', protected, flags=re.IGNORECASE)  # Article 'o/O'
    protected = re.sub(r'\b(do)\b', r'\1/u/', protected, flags=re.IGNORECASE)  # Contraction de+o
    protected = re.sub(r'\b(no)\b', r'\1/u/', protected, flags=re.IGNORECASE)  # Contraction em+o
    protected = re.sub(r'\b(ao)\b', r'\1/u/', protected, flags=re.IGNORECASE)  # Contraction a+o
    protected = re.sub(r'\b(como)\b', r'\1/u/', protected, flags=re.IGNORECASE)  # 'as/like'

    # Plural forms (preserve case with capture group)
    protected = re.sub(r'\b(os)\b', r'\1/us/', protected, flags=re.IGNORECASE)  # Article 'os/Os'
    protected = re.sub(r'\b(dos)\b', r'\1/us/', protected, flags=re.IGNORECASE)  # Contraction de+os
    protected = re.sub(r'\b(nos)\b', r'\1/us/', protected, flags=re.IGNORECASE)  # Contraction em+os
    protected = re.sub(r'\b(aos)\b', r'\1/us/', protected, flags=re.IGNORECASE)  # Contraction a+os

    # Words ending in -o (but not stressed, not tilde, not already annotated)
    def replace_final_o(match):
        word = match.group(0)
        if is_stressed_final(word) or has_tilde(word):
            return word
        # Apply: word ending in o → word/u/
        return word + '/u/'

    # Match words ending in 'o' (not followed by /)
    protected = re.sub(r'\b\w+o\b(?!/)', replace_final_o, protected)

    # Words ending in -os → /us/ (not tilde, not already annotated)
    def replace_final_os(match):
        word = match.group(0)
        if has_tilde(word):
            return word
        return word + '/us/'

    protected = re.sub(r'\b\w+os\b(?!/)', replace_final_os, protected)

    # Restore protected content
    return restore_annotations(protected, replacements)

# ============================================================================
# MAIN ANNOTATION FUNCTION
# ============================================================================

def annotate_pronunciation(text: str, skip_if_annotated: bool = True) -> str:
    """
    Apply all 7 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4).

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

    # Rule 1b (final -or) - MUST be before Rule 1 because -or also ends in -o
    text = apply_rule_1b(text)

    # Rule 1 (final -o) - LAST, after L and nasals and -or are handled
    text = apply_rule_1(text)

    return text

# ============================================================================
# FORMATTING FUNCTIONS
# ============================================================================

def format_substitution(annotated: str) -> str:
    """
    Format annotated text in substitution mode: replace original with phonetic.

    Mirrors the JavaScript formatSubstitutionMode() function.

    Args:
        annotated (str): Text with pronunciation annotations like "sou/u/"

    Returns:
        str: Text with phonetic substitutions applied

    Examples:
        >>> format_substitution("Eu sou/u/ professor/oh/.")
        'Eu su professoh.'

        >>> format_substitution("De/dji/ manhã eu falo/u/ português.")
        'Dji manhã eu falu português.'
    """
    result = annotated

    # STEP 1: Handle compound transformations first (most specific patterns)

    # Final -te → tchi (more specific than -e → i)
    result = re.sub(r'(\S+)te/tchi/', r'\1tchi', result, flags=re.IGNORECASE)

    # Final -de → dji (more specific than -e → i, but not standalone "de")
    result = re.sub(r'(\S+)de/dji/', r'\1dji', result, flags=re.IGNORECASE)

    # Verb -am → ãwn
    result = re.sub(r'(\S+)am/ãwn/', r'\1ãwn', result, flags=re.IGNORECASE)

    # STEP 2: Handle nasal patterns

    # -em nasal patterns (tem, bem, etc.) - complete replacement
    result = re.sub(r'\b(tem|quem|sem|bem|cem|nem|em)/([^/]+)/', r'\2', result, flags=re.IGNORECASE)

    # também, alguém, ninguém (show full word with ending highlighted)
    result = re.sub(r'(\S+ém)/eyn/', lambda m: m.group(1)[:-2] + 'eyn', result, flags=re.IGNORECASE)

    # Short nasal words: com, som, bom - complete replacement
    result = re.sub(r'\b(com|som|bom)/([^/]+)/', r'\2', result, flags=re.IGNORECASE)

    # um/uma → ũm/ũma - complete replacement
    result = re.sub(r'\b(um|uma|algum|alguma|nenhum|nenhuma)/([^/]+)/', r'\2', result, flags=re.IGNORECASE)

    # STEP 3: Handle palatalization

    # de → dji (complete replacement)
    result = re.sub(r'\bde/dji/', 'dji', result, flags=re.IGNORECASE)

    # STEP 4: Handle final vowel changes (must be after compound patterns)

    # Final -os → us (before -o to avoid conflicts)
    result = re.sub(r'(\S+)os/us/', r'\1us', result, flags=re.IGNORECASE)

    # Final -o → u (includes words with special chars like "ção")
    result = re.sub(r'(\S+)o/u/', r'\1u', result, flags=re.IGNORECASE)

    # Single letter 'o' (article) - special case
    result = re.sub(r'\bo/u/', 'u', result, flags=re.IGNORECASE)

    # Final -es → is (before -e to avoid conflicts)
    result = re.sub(r'(\S+)es/is/', r'\1is', result, flags=re.IGNORECASE)

    # Final -e → i (includes words with special chars)
    result = re.sub(r'(\S+)e/i/', r'\1i', result, flags=re.IGNORECASE)

    # Single letter 'e' (conjunction) - special case
    result = re.sub(r'\be/i/', 'i', result, flags=re.IGNORECASE)

    # Final -or → oh
    result = re.sub(r'(\S+)or/oh/', r'\1oh', result, flags=re.IGNORECASE)

    # Final -l → u (L vocalization - replace L with u)
    result = re.sub(r'(\S+)l/u/', r'\1u', result, flags=re.IGNORECASE)

    # STEP 5: Clean up any remaining annotations (fallback)
    result = re.sub(r'/([^/]+)/', r'\1', result)
    result = re.sub(r'~~([^~]+)~~', r'\1', result)

    return result


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
        # Test cases for Rule 1b: -or → [oh]
        "Eu sou professor.",
        "Ele é doutor.",
        "Qual é o melhor?",
        "O senhor é professor?",
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
