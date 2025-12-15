/**
 * Pipeline C: LLM-based Dictionary Pronunciation
 *
 * Uses Claude to generate English-style pronunciation guides for Portuguese text.
 * This is more accurate than pattern matching for unknown words.
 *
 * Usage:
 *   node utils/llm-pronunciation.js "Eu sou brasileiro de São Paulo."
 *
 * Requires:
 *   ANTHROPIC_API_KEY environment variable
 */

const PHONETIC_CONVENTIONS = `
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
When asked for STANDARD only:
- Return ONLY the phonetic transcription, one line per input line.

When asked for BOTH standard and colloquial:
- Return two lines per input:
  - Line 1: "Standard: " followed by careful/formal pronunciation
  - Line 2: "Natural: " followed by colloquial pronunciation with sandhi

### Sandhi/Colloquial Features (for "Natural" mode):
Apply these OPTIONAL reductions that occur in natural speech:

1. **Vowel reductions in common verbs:**
   - sou → soh (not SOH-oo)
   - estou → toh (drop "es")
   - vou → voh

2. **Coalescence (word merging):**
   - de + vowel → dj + vowel: "de ônibus" → "DJOH-nee-boos" (not "jee OH-nee-boos")
   - "de água" → "DJAH-gwah"
   - "de amanhã" → "djah-mah-NYAH"

3. **Contractions:**
   - para o → "proh"
   - para a → "prah"
   - está → "tah"

4. **Infinitive r-dropping:**
   - falar → fah-LAH (drop final r sound)
   - comer → koh-MEH
   - viajar → vee-ah-ZHAH

5. **Unstressed vowel reduction:**
   - "você" → "seh" (in fast speech)
   - First syllable of "porque" often reduced

Preserve punctuation at the end of sentences.
`;

/**
 * Use Claude to generate dictionary-style pronunciation for Portuguese text.
 * @param {string} text - Portuguese text to convert
 * @param {Object} options - Options
 * @param {boolean} options.showBoth - If true, show both standard and natural (with sandhi) pronunciations
 * @returns {Promise<string|{standard: string, natural: string}>} English-style phonetic transcription
 */
async function formatLlmPronunciation(text, options = {}) {
    const { showBoth = false } = options;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }

    const prompt = showBoth
        ? `Convert this Portuguese text to dictionary-style pronunciation. Show BOTH versions:
1. Standard (careful/formal pronunciation)
2. Natural (colloquial with sandhi, contractions, and reductions)

Format each sentence as:
Standard: [pronunciation]
Natural: [pronunciation with sandhi]

Text:
${text}`
        : `Convert this Portuguese text to dictionary-style pronunciation:\n\n${text}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: PHONETIC_CONVENTIONS,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const result = data.content[0].text.trim();

    if (showBoth) {
        // Parse the result into standard and natural
        const lines = result.split('\n').filter(l => l.trim());
        const parsed = { standard: '', natural: '' };

        for (const line of lines) {
            if (line.toLowerCase().startsWith('standard:')) {
                parsed.standard = line.replace(/^standard:\s*/i, '').trim();
            } else if (line.toLowerCase().startsWith('natural:')) {
                parsed.natural = line.replace(/^natural:\s*/i, '').trim();
            }
        }

        return parsed;
    }

    return result;
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatLlmPronunciation, PHONETIC_CONVENTIONS };
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);

    const tests = args.length > 0 ? [args.join(' ')] : [
        'Eu sou brasileiro de São Paulo.',
        'O médico trabalha no hospital.',
        'A felicidade é importante na vida.',
        'Meu irmão mora em Florianópolis.',
        'Estamos estudando português juntos.',
    ];

    console.log('='.repeat(70));
    console.log('PIPELINE C: LLM-BASED DICTIONARY PRONUNCIATION');
    console.log('='.repeat(70));
    console.log();

    for (const text of tests) {
        console.log(`PT: ${text}`);
        try {
            const result = await formatLlmPronunciation(text);
            console.log(`EN: ${result}`);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
        console.log();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
