"""
Pipeline C: LLM-based Dictionary Pronunciation

Uses Claude to generate English-style pronunciation guides for Portuguese text.
This is more accurate than pattern matching for unknown words.

Usage:
    python utils/llm_pronunciation.py "Eu sou brasileiro de São Paulo."

Requires:
    ANTHROPIC_API_KEY environment variable
"""

import os
import sys
import json

try:
    import anthropic
except ImportError:
    print("Error: anthropic package not installed. Run: pip install anthropic")
    sys.exit(1)


PHONETIC_CONVENTIONS = """
## Dictionary Phonetic Conventions for Brazilian Portuguese

Convert Portuguese text to English-style pronunciation respelling.

### IMPORTANT: Dialect
Use MAINSTREAM Brazilian Portuguese (São Paulo/interior style), NOT:
- Carioca (Rio) - no "chiado" (s→sh before consonants or final)
- European Portuguese - no "sh" sounds for s/z
- Final S is always "s" or "ss", NEVER "sh"
- Example: "depois" → deh-POYCE (not deh-POYSH)

### Rules:
1. **Stressed syllables**: UPPERCASE (e.g., brah-zee-LEH-roo)
2. **Unstressed syllables**: lowercase (e.g., brah-zee)
3. **Syllable separator**: hyphen (e.g., ah-meh-ree-KAH-noo)
4. **Nasal sounds**: add "(nasal)" after the syllable (e.g., KOHN (nasal))

### Vowel Mappings:
- a → ah
- e (open, stressed) → EH
- e (closed/unstressed) → eh or ee
- i → ee
- o (open, stressed) → OH
- o (closed/unstressed) → oh or oo
- u → oo

### Special Sounds:
- ão → OW (nasal) - e.g., são → SOW (nasal)
- ã → ah (nasal)
- em, -ém → EYN (nasal) - e.g., bem → BAYN (nasal)
- om → OHN (nasal) - e.g., com → KOHN (nasal)
- um → OOM (nasal)
- nh → ny - e.g., tenho → TEN-yoo
- lh → ly - e.g., trabalho → trah-BAH-lyoo
- ch → sh
- final L → W sound (vocalization) - e.g., Brasil → brah-ZEW, futebol → foo-cheh-BOW
- de → jee (palatalization)
- di → jee
- te (unstressed final) → chee
- ti → chee

### Examples:
- eu → EH-oo (always, the diphthong EU is one syllable)
- meu → MEH-oo
- brasileiro → brah-zee-LEH-roo
- americano → ah-meh-ree-KAH-noo
- cachorro → kah-SHOH-hoo
- trabalho → trah-BAH-lyoo
- futebol → foo-cheh-BOW
- daniel → dah-nee-EW
- música → MOO-zee-kah
- português → por-too-GEHS
- engenheiro → en-zhen-YEH-roo
- informação → een-for-mah-SOW (nasal)
- cidade → see-DAH-jee
- felicidade → feh-lee-see-DAH-jee
- médico → MEH-jee-koo
- hospital → ohs-pee-TOW

### Output Format:
Return ONLY the phonetic transcription, one line per input line.
Preserve punctuation at the end of sentences.
"""


def format_llm_pronunciation(text: str) -> str:
    """
    Use Claude to generate dictionary-style pronunciation for Portuguese text.

    Args:
        text: Portuguese text to convert

    Returns:
        English-style phonetic transcription
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")

    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=PHONETIC_CONVENTIONS,
        messages=[
            {
                "role": "user",
                "content": f"Convert this Portuguese text to dictionary-style pronunciation:\n\n{text}"
            }
        ]
    )

    return message.content[0].text.strip()


def main():
    """Command-line interface for Pipeline C."""
    if len(sys.argv) < 2:
        # Default test sentences
        tests = [
            "Eu sou brasileiro de São Paulo.",
            "O médico trabalha no hospital.",
            "A felicidade é importante na vida.",
            "Meu irmão mora em Florianópolis.",
            "Estamos estudando português juntos.",
        ]
    else:
        tests = [" ".join(sys.argv[1:])]

    print("=" * 70)
    print("PIPELINE C: LLM-BASED DICTIONARY PRONUNCIATION")
    print("=" * 70)
    print()

    for text in tests:
        print(f"PT: {text}")
        try:
            result = format_llm_pronunciation(text)
            print(f"EN: {result}")
        except Exception as e:
            print(f"Error: {e}")
        print()


if __name__ == "__main__":
    main()
