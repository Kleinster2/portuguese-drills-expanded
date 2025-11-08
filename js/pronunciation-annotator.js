/**
 * Brazilian Portuguese Pronunciation Annotator (JavaScript Port)
 *
 * Applies 6 OBLIGATORY pronunciation rules to Portuguese text (Steps 1-4):
 * 1. Final unstressed -o → [u]
 * 2. Final unstressed -e → [i], plural -es → [is]
 * 3. Palatalization (de → de[dji], contente → contente[tchi])
 * 4. Epenthetic [i] on consonant-final borrowed words
 * 5. Nasal vowel endings (-em, -am, -im, -om, -um/uma)
 * 6. Syllable-final L → [u]
 *
 * NOTE: Coalescence (de ônibus → djônibus) is NOT applied here.
 *       It is an OPTIONAL feature for Step 5 (phonetic orthography) only.
 *
 * Version: 1.5 (JavaScript port)
 * Last Updated: 2025-01-07
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
    'york', 'acme', 'facebook', 'internet', 'ipad', 'whatsapp'
]);

// ============================================================================
// RULE 6B DICTIONARY - Mid-word syllable-final L
// ============================================================================

const RULE_7B_WORDS = {
    // voltar family
    'volta': 'volta[_vouta_]',
    'voltar': 'voltar[_voutar_]',
    'volto': 'volto[_vouto_]',
    'voltamos': 'voltamos[_voutamos_]',
    'voltam': 'voltam[_voutam_]',
    'voltei': 'voltei[_voutei_]',
    'voltou': 'voltou[_voutou_]',
    // último family
    'último': 'último[_úutimu_]',
    'última': 'última[_úutima_]',
    'últimos': 'últimos[_úutimus_]',
    'últimas': 'últimas[_úutimas_]'
};

// ============================================================================
// RULE 4 DICTIONARY - Epenthetic [i] on borrowed words
// ============================================================================

const BORROWED_WORDS = {
    // Epenthetic + palatalization (ends in -t or -d)
    'internet': 'Internet[_chi_]',
    'ipad': 'iPad[_ji_]',
    // Epenthetic only (other consonants)
    'facebook': 'Facebook[_i_]',
    'whatsapp': 'Whatsapp[_i_]'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isAlreadyAnnotated(text) {
    return text.includes('[') && text.includes(']');
}

function isStressedFinal(word) {
    return STRESSED_FINAL.has(word.toLowerCase());
}

function hasTilde(word) {
    // Check if word has nasal tilde (ã, õ) - don't annotate these words
    return /[ãõ]/.test(word);
}

function protectBrackets(text) {
    // Replace bracketed content with placeholders to prevent nested annotations
    const replacements = {};
    let counter = 0;

    const protected = text.replace(/\[[^\]]+\]/g, (match) => {
        const placeholder = `__PROTECTED_${counter}__`;
        replacements[placeholder] = match;
        counter++;
        return placeholder;
    });

    return { protected, replacements };
}

function restoreBrackets(text, replacements) {
    // Restore protected bracketed content
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
    // Rule 7a: Word-final L → ~~l~~[_u_]
    // Match words ending in 'l' (but not already annotated)
    const replaceFinalL = (match) => {
        const word = match;
        if (hasTilde(word) || word.includes('[')) {
            return word;
        }
        // Replace final 'l' with ~~l~~[_u_]
        return word.replace(/l$/i, '~~l~~[_u_]');
    };

    // Match words ending in 'l' (not followed by ~~ or [)
    text = text.replace(/\b\w+l\b(?![~\[])/gi, replaceFinalL);

    return text;
}

function applyRule5(text) {
    // Rule 5: Nasal vowel endings

    // Rule 5a: -em → [_eyn_]
    // Short words (show full syllable)
    text = text.replace(/\b(tem)(?!\[)\b/gi, (m, p1) => `${p1}[_teyn_]`);
    text = text.replace(/\b(quem)(?!\[)\b/gi, (m, p1) => `${p1}[_keyn_]`);
    text = text.replace(/\b(sem)(?!\[)\b/gi, (m, p1) => `${p1}[_seyn_]`);
    text = text.replace(/\b(bem)(?!\[)\b/gi, (m, p1) => `${p1}[_beyn_]`);
    text = text.replace(/\b(cem)(?!\[)\b/gi, (m, p1) => `${p1}[_seyn_]`);
    text = text.replace(/\b(nem)(?!\[)\b/gi, (m, p1) => `${p1}[_neyn_]`);

    // Generic -em (not already annotated)
    text = text.replace(/\b(em)(?!\[)\b/g, 'em[_eyn_]');

    // Long words (show ending only)
    text = text.replace(/\b(também)(?!\[)\b/gi, (m, p1) => `${p1}[_eyn_]`);
    text = text.replace(/\b(alguém)(?!\[)\b/gi, (m, p1) => `${p1}[_eyn_]`);
    text = text.replace(/\b(ninguém)(?!\[)\b/gi, (m, p1) => `${p1}[_eyn_]`);

    // Rule 5b: -am → [_ãwn_] (verb endings, not already annotated)
    const annotateAm = (match) => {
        const word = match;
        if (hasTilde(word) || word.includes('[')) {
            return word;
        }
        return word + '[_ãwn_]';
    };
    text = text.replace(/\b(\w+am)\b(?!\[)/g, annotateAm);

    // Rule 5c: -im → [_ing_]
    // Short words
    text = text.replace(/\b(sim)(?!\[)\b/gi, (m, p1) => `${p1}[_sing_]`);
    text = text.replace(/\b(assim)(?!\[)\b/gi, (m, p1) => `${p1}[_ssing_]`);
    // Long words
    text = text.replace(/\b(jardim)(?!\[)\b/gi, (m, p1) => `${p1}[_ing_]`);

    // Rule 5d: -om → [_oun_]
    text = text.replace(/\b(com)(?!\[)\b/g, 'com[_coun_]');
    text = text.replace(/\b(som)(?!\[)\b/gi, (m, p1) => `${p1}[_soun_]`);
    text = text.replace(/\b(bom)(?!\[)\b/gi, (m, p1) => `${p1}[_boun_]`);

    // Rule 5e: um/uma → [_ũm_]/[_ũma_] (case-insensitive for sentence start)
    text = text.replace(/\b(um)(?!\[)\b/gi, (m, p1) => `${p1}[_ũm_]`);
    text = text.replace(/\b(uma)(?!\[)\b/gi, (m, p1) => `${p1}[_ũma_]`);
    text = text.replace(/\b(algum)(?!\[)\b/gi, (m, p1) => `${p1}[_ũm_]`);
    text = text.replace(/\b(alguma)(?!\[)\b/gi, (m, p1) => `${p1}[_ũma_]`);
    text = text.replace(/\b(nenhum)(?!\[)\b/gi, (m, p1) => `${p1}[_ũm_]`);
    text = text.replace(/\b(nenhuma)(?!\[)\b/gi, (m, p1) => `${p1}[_ũma_]`);

    return text;
}

function applyRule4(text) {
    // Rule 4: Epenthetic [_i_] on consonant-final borrowed words
    for (const [word, annotated] of Object.entries(BORROWED_WORDS)) {
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(pattern, annotated);
    }
    return text;
}

function applyRule3(text) {
    // Rule 3: Palatalization

    // Rule 3a: de → de[_dji_] (ALWAYS, but not if already annotated)
    text = text.replace(/\b(de)(?!\[)\b/g, 'de[_dji_]');

    // Rule 3b: Words ending in -te → [_tchi_] (unstressed final -te palatalization)
    // This must run BEFORE Rule 2 (final -e) to prevent -te words from getting [_i_]
    const annotateTe = (match) => {
        const word = match;
        // Skip if word is 'de' (already handled above)
        if (word.toLowerCase() === 'de') {
            return word;
        }
        // Skip if already annotated
        if (word.includes('[')) {
            return word;
        }
        // Skip if stressed final (though rare for -te words)
        if (isStressedFinal(word)) {
            return word;
        }
        // Apply: word ending in te → word[_tchi_]
        return word + '[_tchi_]';
    };
    text = text.replace(/\b\w+te\b(?!\[)/gi, annotateTe);

    return text;
}

function applyRule2(text) {
    // Rule 2: Final unstressed -e → [_i_], plural -es → [_is_]

    // Conjunction 'e' (and) - but not 'de' (already handled by Rule 3)
    text = text.replace(/\b(e)(?!\[)\b/g, 'e[_i_]');

    // Plural words ending in -es → [_is_] (must come before singular -e)
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
        if (word.includes('[') || word.includes(']')) {
            return word;
        }
        // Apply: word ending in es → word[_is_]
        return word + '[_is_]';
    };

    // Match words ending in 'es' followed by word boundary (not followed by [)
    text = text.replace(/\b\w+es\b(?!\[)/g, replacePluralEs);

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
        if (word.includes('[') || word.includes(']')) {
            return word;
        }
        // Apply: word ending in e → word[_i_]
        return word + '[_i_]';
    };

    // Match words ending in 'e' followed by word boundary (not followed by [)
    text = text.replace(/\b\w+e\b(?!\[)/g, replaceFinalE);

    return text;
}

function applyRule1(text) {
    // Rule 1: Final unstressed -o → [_u_]

    // Protect existing brackets from nested annotation
    const { protected, replacements } = protectBrackets(text);
    let result = protected;

    // Function words (specific patterns to avoid over-matching)
    // Use capture group to preserve case
    result = result.replace(/\b(o)\b/gi, '$1[_u_]');  // Article 'o/O'
    result = result.replace(/\b(do)\b/gi, '$1[_u_]');  // Contraction de+o
    result = result.replace(/\b(no)\b/gi, '$1[_u_]');  // Contraction em+o
    result = result.replace(/\b(ao)\b/gi, '$1[_u_]');  // Contraction a+o
    result = result.replace(/\b(como)\b/gi, '$1[_u_]');  // 'as/like'

    // Plural forms (preserve case with capture group)
    result = result.replace(/\b(os)\b/gi, '$1[_us_]');  // Article 'os/Os'
    result = result.replace(/\b(dos)\b/gi, '$1[_us_]');  // Contraction de+os
    result = result.replace(/\b(nos)\b/gi, '$1[_us_]');  // Contraction em+os
    result = result.replace(/\b(aos)\b/gi, '$1[_us_]');  // Contraction a+os

    // Words ending in -o (but not stressed, not tilde, not already annotated, not followed by ~~)
    const replaceFinalO = (match) => {
        const word = match;
        if (isStressedFinal(word) || hasTilde(word)) {
            return word;
        }
        // Apply: word ending in o → word[_u_]
        return word + '[_u_]';
    };

    // Match words ending in 'o' (not followed by ~~ or [)
    result = result.replace(/\b\w+o\b(?![~\[])/gi, replaceFinalO);

    // Words ending in -os → [_us_] (not tilde, not already annotated or followed by ~~)
    const replaceFinalOs = (match) => {
        const word = match;
        if (hasTilde(word)) {
            return word;
        }
        return word + '[_us_]';
    };

    result = result.replace(/\b\w+os\b(?![~\[])/gi, replaceFinalOs);

    // Restore protected content
    return restoreBrackets(result, replacements);
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

    // Rule 6 FIRST - prevents -ol words from getting double annotation
    // Rule 6b first (dictionary) - before 6a to avoid conflicts
    text = applyRule7b(text);

    // Rule 6a (word-final L) - BEFORE Rule 1 to handle -ol, -el, -al endings
    text = applyRule7a(text);

    // Rule 5 (nasal vowels) - BEFORE Rule 1 to prevent "com" issues
    text = applyRule5(text);

    // Rule 4 (epenthetic)
    text = applyRule4(text);

    // REMOVED: Coalescence (was old Rule 4) - optional, Step 5 only
    // In Steps 1-4: de[dji] ônibus (two separate words)
    // In Step 5: djônibus (coalescence written directly)

    // Rule 3 (palatalization) - BEFORE Rule 2 to handle 'de' before final -e
    text = applyRule3(text);

    // Rule 2 (final -e)
    text = applyRule2(text);

    // Rule 1 (final -o) - LAST, after L and nasals are handled
    text = applyRule1(text);

    return text;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.annotatePronunciation = annotatePronunciation;
}
