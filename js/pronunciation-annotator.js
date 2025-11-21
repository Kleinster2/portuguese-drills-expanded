/**
 * Brazilian Portuguese Pronunciation Annotator (JavaScript Port)
 *
 * Applies 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4):
 * 1. Final unstressed -o → /u/
 * 2. Final unstressed -e → /i/, plural -es → /is/
 * 3. Palatalization (de → de/dji/, contente → contente/tchi/)
 * 4. Epenthetic /i/ on consonant-final borrowed words
 * 5. Nasal vowel endings (-em, -am, -im, -om, -um/uma)
 * 6. Syllable-final L → /u/
 *
 * NOTE: Coalescence (de ônibus → djônibus) is NOT applied here.
 *       It is an OPTIONAL feature for Step 5 (phonetic orthography) only.
 *
 * Version: 2.0 (JavaScript port)
 * Last Updated: 2025-01-10
 * Ported from: utils/annotate_pronunciation.py
 */

// ============================================================================
// EXCEPTION LISTS
// ============================================================================

const STRESSED_FINAL = new Set([
    'café', 'você', 'metrô', 'avô', 'avó', 'sofá', 'josé'
]);

const PROPER_NOUNS = new Set([
    'miami', 'john', 'sarah', 'carlos', 'brasil', 'brooklyn',
    'york', 'acme', 'facebook', 'internet', 'ipad', 'whatsapp',
    'daniel', 'sofia'
]);

// ============================================================================
// RULE 6B DICTIONARY - Mid-word syllable-final L
// ============================================================================

const RULE_7B_WORDS = {
    // voltar family
    'volta': 'volta/vouta/',
    'voltar': 'voltar/voutar/',
    'volto': 'volto/vouto/',
    'voltamos': 'voltamos/voutamos/',
    'voltam': 'voltam/voutam/',
    'voltei': 'voltei/voutei/',
    'voltou': 'voltou/voutou/',
    // último family
    'último': 'último/úutimu/',
    'última': 'última/úutima/',
    'últimos': 'últimos/úutimus/',
    'últimas': 'últimas/úutimas/'
};

// ============================================================================
// RULE 4 DICTIONARY - Epenthetic /i/ on borrowed words
// ============================================================================

const BORROWED_WORDS = {
    // Epenthetic + palatalization (ends in -t or -d)
    'internet': 'Internet/chi/',
    'ipad': 'iPad/ji/',
    // Epenthetic only (other consonants)
    'facebook': 'Facebook/i/',
    'whatsapp': 'Whatsapp/i/'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isAlreadyAnnotated(text) {
    // Check for /text/ pattern (pronunciation annotations)
    return /\/[^\/\s]+\//.test(text);
}

function isStressedFinal(word) {
    return STRESSED_FINAL.has(word.toLowerCase());
}

function hasTilde(word) {
    // Check if word has nasal tilde (ã, õ) - don't annotate these words
    return /[ãõ]/.test(word);
}

function protectAnnotations(text) {
    // Replace annotation content with placeholders to prevent nested annotations
    const replacements = {};
    let counter = 0;

    const protected = text.replace(/\/[^\/\s]+\//g, (match) => {
        const placeholder = `__PROTECTED_${counter}__`;
        replacements[placeholder] = match;
        counter++;
        return placeholder;
    });

    return { protected, replacements };
}

function restoreAnnotations(text, replacements) {
    // Restore protected annotation content
    let result = text;
    for (const [placeholder, original] of Object.entries(replacements)) {
        result = result.replace(placeholder, original);
    }
    return result;
}

// ============================================================================
// RULE APPLICATIONS
// ============================================================================

function applyRule7b(text) {
    // Rule 7b: Mid-word syllable-final L (dictionary)
    for (const [word, annotated] of Object.entries(RULE_7B_WORDS)) {
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(pattern, annotated);
    }
    return text;
}

function applyRule7a(text) {
    // Rule 7a: Word-final L → /u/
    // Match words ending in 'l' (but not already annotated)
    const replaceFinalL = (match) => {
        const word = match;
        if (hasTilde(word) || word.includes('/')) {
            return word;
        }
        // Replace final 'l' with /u/
        return word + '/u/';
    };

    // Match words ending in 'l' (not followed by /)
    text = text.replace(/\b\w+l\b(?!\/)/gi, replaceFinalL);

    return text;
}

function applyRule5(text) {
    // Rule 5: Nasal vowel endings

    // Rule 5a: -em → /eyn/
    // Short words (show full syllable)
    text = text.replace(/\b(tem)(?!\/)\b/gi, (m, p1) => `${p1}/teyn/`);
    text = text.replace(/\b(quem)(?!\/)\b/gi, (m, p1) => `${p1}/keyn/`);
    text = text.replace(/\b(sem)(?!\/)\b/gi, (m, p1) => `${p1}/seyn/`);
    text = text.replace(/\b(bem)(?!\/)\b/gi, (m, p1) => `${p1}/beyn/`);
    text = text.replace(/\b(cem)(?!\/)\b/gi, (m, p1) => `${p1}/seyn/`);
    text = text.replace(/\b(nem)(?!\/)\b/gi, (m, p1) => `${p1}/neyn/`);

    // Generic -em (not already annotated)
    text = text.replace(/\b(em)(?!\/)\b/g, 'em/eyn/');

    // Long words (show ending only)
    text = text.replace(/\b(também)(?!\/)\b/gi, (m, p1) => `${p1}/eyn/`);
    text = text.replace(/\b(alguém)(?!\/)\b/gi, (m, p1) => `${p1}/eyn/`);
    text = text.replace(/\b(ninguém)(?!\/)\b/gi, (m, p1) => `${p1}/eyn/`);

    // Rule 5b: -am → /ãwn/ (verb endings, not already annotated)
    const annotateAm = (match) => {
        const word = match;
        if (hasTilde(word) || word.includes('/')) {
            return word;
        }
        return word + '/ãwn/';
    };
    text = text.replace(/\b(\w+am)\b(?!\/)/g, annotateAm);

    // Rule 5c: -im → /ing/
    // Short words
    text = text.replace(/\b(sim)(?!\/)\b/gi, (m, p1) => `${p1}/sing/`);
    text = text.replace(/\b(assim)(?!\/)\b/gi, (m, p1) => `${p1}/ssing/`);
    // Long words
    text = text.replace(/\b(jardim)(?!\/)\b/gi, (m, p1) => `${p1}/ing/`);

    // Rule 5d: -om → /oun/
    text = text.replace(/\b(com)(?!\/)\b/g, 'com/coun/');
    text = text.replace(/\b(som)(?!\/)\b/gi, (m, p1) => `${p1}/soun/`);
    text = text.replace(/\b(bom)(?!\/)\b/gi, (m, p1) => `${p1}/boun/`);

    // Rule 5e: um/uma → /ũm///ũma/ (case-insensitive for sentence start)
    text = text.replace(/\b(um)(?!\/)\b/gi, (m, p1) => `${p1}/ũm/`);
    text = text.replace(/\b(uma)(?!\/)\b/gi, (m, p1) => `${p1}/ũma/`);
    text = text.replace(/\b(algum)(?!\/)\b/gi, (m, p1) => `${p1}/ũm/`);
    text = text.replace(/\b(alguma)(?!\/)\b/gi, (m, p1) => `${p1}/ũma/`);
    text = text.replace(/\b(nenhum)(?!\/)\b/gi, (m, p1) => `${p1}/ũm/`);
    text = text.replace(/\b(nenhuma)(?!\/)\b/gi, (m, p1) => `${p1}/ũma/`);

    return text;
}

function applyRule4(text) {
    // Rule 4: Epenthetic /i/ on consonant-final borrowed words
    for (const [word, annotated] of Object.entries(BORROWED_WORDS)) {
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(pattern, annotated);
    }
    return text;
}

function applyRule3(text) {
    // Rule 3: Palatalization

    // Rule 3a: de → de/dji/ (ALWAYS, but not if already annotated)
    text = text.replace(/\b(de)(?!\/)\b/g, 'de/dji/');

    // Rule 3b: Words ending in -te → /tchi/ (unstressed final -te palatalization)
    // This must run BEFORE Rule 2 (final -e) to prevent -te words from getting /i/
    const annotateTe = (match) => {
        const word = match;
        // Skip if word is 'de' (already handled above)
        if (word.toLowerCase() === 'de') {
            return word;
        }
        // Skip if already annotated
        if (word.includes('/')) {
            return word;
        }
        // Skip if stressed final (though rare for -te words)
        if (isStressedFinal(word)) {
            return word;
        }
        // Apply: word ending in te → word/tchi/
        return word + '/tchi/';
    };
    text = text.replace(/\b\w+te\b(?!\/)/gi, annotateTe);

    // Rule 3c: Words ending in -de → /dji/ (unstressed final -de palatalization)
    // This must run BEFORE Rule 2 (final -e) to prevent -de words from getting /i/
    const annotateDe = (match) => {
        const word = match;
        // Skip if word is standalone 'de' (already handled above)
        if (word.toLowerCase() === 'de') {
            return word;
        }
        // Skip if already annotated
        if (word.includes('/')) {
            return word;
        }
        // Skip if stressed final
        if (isStressedFinal(word)) {
            return word;
        }
        // Apply: word ending in de → word/dji/
        return word + '/dji/';
    };
    text = text.replace(/\b\w+de\b(?!\/)/gi, annotateDe);

    return text;
}

function applyRule2(text) {
    // Rule 2: Final unstressed -e → /i/, plural -es → /is/

    // Conjunction 'e' (and) - but not 'de' (already handled by Rule 3)
    text = text.replace(/\b(e)(?!\/)\b/g, 'e/i/');

    // Plural words ending in -es → /is/ (must come before singular -e)
    const replacePluralEs = (match) => {
        const word = match;
        // Skip if word is 'de' (handled by Rule 3)
        if (word.toLowerCase() === 'de') {
            return word;
        }
        // Skip stressed words (like 'vocês', 'José')
        if (isStressedFinal(word)) {
            return word;
        }
        // Skip words with tildes (ãe, õe)
        if (hasTilde(word)) {
            return word;
        }
        // Skip already annotated
        if (word.includes('/')) {
            return word;
        }
        // Apply: word ending in es → word/is/
        return word + '/is/';
    };

    // Match words ending in 'es' followed by word boundary (not followed by /)
    text = text.replace(/\b\w+es\b(?!\/)/g, replacePluralEs);

    // Singular words ending in -e (but not stressed, not tilde, not already annotated)
    const replaceFinalE = (match) => {
        const word = match;
        // Skip if word is 'de' (handled by Rule 3)
        if (word.toLowerCase() === 'de') {
            return word;
        }
        if (isStressedFinal(word)) {
            return word;
        }
        if (hasTilde(word)) {
            return word;
        }
        if (word.includes('/')) {
            return word;
        }
        // Apply: word ending in e → word/i/
        return word + '/i/';
    };

    // Match words ending in 'e' followed by word boundary (not followed by /)
    text = text.replace(/\b\w+e\b(?!\/)/g, replaceFinalE);

    return text;
}

function applyRule1(text) {
    // Rule 1: Final unstressed -o → /u/

    // Protect existing annotations from nested annotation
    const { protected, replacements } = protectAnnotations(text);
    let result = protected;

    // Function words (specific patterns to avoid over-matching)
    // Use capture group to preserve case
    result = result.replace(/\b(o)\b/gi, '$1/u/');  // Article 'o/O'
    result = result.replace(/\b(do)\b/gi, '$1/u/');  // Contraction de+o
    result = result.replace(/\b(no)\b/gi, '$1/u/');  // Contraction em+o
    result = result.replace(/\b(ao)\b/gi, '$1/u/');  // Contraction a+o
    result = result.replace(/\b(como)\b/gi, '$1/u/');  // 'as/like'

    // Plural forms (preserve case with capture group)
    result = result.replace(/\b(os)\b/gi, '$1/us/');  // Article 'os/Os'
    result = result.replace(/\b(dos)\b/gi, '$1/us/');  // Contraction de+os
    result = result.replace(/\b(nos)\b/gi, '$1/us/');  // Contraction em+os
    result = result.replace(/\b(aos)\b/gi, '$1/us/');  // Contraction a+os

    // Words ending in -o (but not stressed, not tilde, not already annotated)
    const replaceFinalO = (match) => {
        const word = match;
        if (isStressedFinal(word) || hasTilde(word)) {
            return word;
        }
        // Apply: word ending in o → word/u/
        return word + '/u/';
    };

    // Match words ending in 'o' (not followed by /)
    result = result.replace(/\b\w+o\b(?!\/)/gi, replaceFinalO);

    // Words ending in -os → /us/ (not tilde, not already annotated)
    const replaceFinalOs = (match) => {
        const word = match;
        if (hasTilde(word)) {
            return word;
        }
        return word + '/us/';
    };

    result = result.replace(/\b\w+os\b(?!\/)/gi, replaceFinalOs);

    // Restore protected content
    return restoreAnnotations(result, replacements);
}

// ============================================================================
// MAIN ANNOTATION FUNCTION
// ============================================================================

function annotatePronunciation(text, skipIfAnnotated = true) {
    /**
     * Apply all 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4).
     *
     * @param {string} text - Portuguese text to annotate
     * @param {boolean} skipIfAnnotated - If true, skip text that already has annotations
     * @returns {string} - Annotated text with pronunciation markers
     */
    if (skipIfAnnotated && isAlreadyAnnotated(text)) {
        return text;
    }

    // Apply rules in order
    // Note: Order matters! Some rules depend on others not having been applied yet

    // Rule 7 FIRST - prevents -ol words from getting double annotation
    // Rule 7b first (dictionary) - before 7a to avoid conflicts
    text = applyRule7b(text);

    // Rule 7a (word-final L) - BEFORE Rule 1 to handle -ol, -el, -al endings
    text = applyRule7a(text);

    // Rule 5 (nasal vowels) - BEFORE Rule 1 to prevent "com" issues
    text = applyRule5(text);

    // Rule 4 (epenthetic)
    text = applyRule4(text);

    // REMOVED: Coalescence (was old Rule 4) - optional, Step 5 only
    // In Steps 1-4: de/dji/ ônibus (two separate words)
    // In Step 5: djônibus (coalescence written directly)

    // Rule 3 (palatalization) - BEFORE Rule 2 to handle 'de' before final -e
    text = applyRule3(text);

    // Rule 2 (final -e)
    text = applyRule2(text);

    // Rule 1 (final -o) - LAST, after L and nasals are handled
    text = applyRule1(text);

    return text;
}

// Export for use in Node.js and browser environments
// For Node.js, it's a direct export. For browsers, it's attached to window for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { annotatePronunciation };
} else if (typeof window !== 'undefined') {
    window.annotatePronunciation = annotatePronunciation;
}
