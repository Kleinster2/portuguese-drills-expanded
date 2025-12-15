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

/**
 * Apply é/ê quality markers to phonetic transcription based on original Portuguese word.
 *
 * Uses algorithmic rules to determine E vowel quality:
 * 1. E before nasal (m, n, nh) → ê (closed)
 * 2. E in closed syllable (except before L) → ê (closed)
 * 3. EU diphthong → ê (closed)
 * 4. E before L → é (open)
 * 5. EI diphthong → é (open)
 * 6. Default (open syllable) → é (open)
 *
 * @param {string} phonetic - Basic phonetic transcription (e.g., "dah-nee-EH-oo")
 * @param {string} originalWord - Original Portuguese word (e.g., "daniel")
 * @returns {string} Phonetic with proper é/ê markers (e.g., "dah-nee-ÉH-oo")
 */
function applyEQualityToPhonetic(phonetic, originalWord) {
    let result = phonetic;
    const orig = originalWord.toLowerCase();

    // Rule 1 & 5: E before nasal consonants → Ê (closed)
    if (/e[mn]/.test(orig)) {
        result = result.replace(/E([MN])/gi, 'Ê$1');
    }

    // Rule 3: EU diphthong → Ê (closed)
    if (orig.includes('eu')) {
        result = result.replace(/E([HU])/g, 'Ê$1');
    }

    // Rule 4: E before L (becomes EH-oo after L→u) → É (open)
    if (orig.includes('el') || orig.endsWith('l')) {
        result = result.replace(/E([HL])/g, 'É$1');
        // After L vocalization: -el → -éu
        result = result.replace(/Ê([HL])-oo\b/g, 'É$1-oo');  // Override EU rule for -el words
    }

    // Rule 5: EI diphthong → É (open)
    if (orig.includes('ei')) {
        result = result.replace(/([LR])E([IY])/gi, '$1É$2');
        result = result.replace(/E([IY])/g, 'É$1');
    }

    // Rule 2: E in closed syllable (ends with consonant like -ês) → Ê (closed)
    if (orig.endsWith('ês') || (orig.endsWith('es') && !orig.includes('ei'))) {
        result = result.replace(/E([S])/gi, 'Ê$1');
    }

    return result;
}

// ============================================================================
// SUFFIX PATTERNS FOR DICTIONARY-STYLE PHONETICS
// ============================================================================

// Patterns matched against ORIGINAL Portuguese words (with accents preserved)
// Format: [regex_pattern, phonetic_suffix, chars_to_remove_from_end]
const SUFFIX_PATTERNS = [
    // -eiro/-eira (common profession/agent suffix)
    [/eiro$/, 'EH-roo', 4],      // engenheiro → engenh + EH-roo
    [/eira$/, 'EH-rah', 4],      // engenheira → engenh + EH-rah

    // -ção (noun suffix, very common)
    [/ção$/, 'SOW (nasal)', 3],  // informação → informa + SOW
    [/ções$/, 'SOYNS (nasal)', 4],  // informações → informa + SOYNS

    // -inho/-inha (diminutive)
    [/inho$/, 'EEN-yoo', 4],     // gatinho → gat + EEN-yoo
    [/inha$/, 'EEN-yah', 4],     // gatinha → gat + EEN-yah

    // -mente (adverb suffix)
    [/mente$/, 'MEN-chee', 5],   // realmente → real + MEN-chee

    // -dade (noun suffix)
    [/dade$/, 'DAH-jee', 4],     // cidade → ci + DAH-jee
    [/dades$/, 'DAH-jees', 5],   // cidades → ci + DAH-jees

    // -oso/-osa (adjective suffix)
    [/oso$/, 'OH-zoo', 3],       // famoso → fam + OH-zoo
    [/osa$/, 'OH-zah', 3],       // famosa → fam + OH-zah

    // -ista (profession/ideology)
    [/ista$/, 'EES-tah', 4],     // artista → art + EES-tah
    [/istas$/, 'EES-tahs', 5],   // artistas → art + EES-tahs

    // -ável/-ível (adjective suffix)
    [/ável$/, 'AH-vew', 4],      // amável → am + AH-vew
    [/ível$/, 'EE-vew', 4],      // possível → poss + EE-vew

    // -ão (augmentative/noun)
    [/ão$/, 'OW (nasal)', 2],    // irmão → irm + OW
    [/ões$/, 'OYNS (nasal)', 3], // irmões → irm + OYNS

    // -ar/-er/-ir (verb infinitives)
    [/ar$/, 'AHR', 2],           // falar → fal + AHR
    [/er$/, 'EHR', 2],           // comer → com + EHR
    [/ir$/, 'EER', 2],           // partir → part + EER

    // -ando/-endo/-indo (gerund)
    [/ando$/, 'AHN-doo', 4],     // falando → fal + AHN-doo
    [/endo$/, 'EN-doo', 4],      // comendo → com + EN-doo
    [/indo$/, 'EEN-doo', 4],     // partindo → part + EEN-doo

    // -ado/-ido (past participle)
    [/ado$/, 'AH-doo', 3],       // falado → fal + AH-doo
    [/ada$/, 'AH-dah', 3],       // falada → fal + AH-dah
    [/ido$/, 'EE-doo', 3],       // comido → com + EE-doo
    [/ida$/, 'EE-dah', 3],       // comida → com + EE-dah

    // -ção with ti sound (special case)
    [/tiba$/, 'CHEE-bah', 4],    // Curitiba → Curi + CHEE-bah
    [/tivo$/, 'CHEE-voo', 4],    // ativo → a + CHEE-voo
    [/tiva$/, 'CHEE-vah', 4],    // ativa → a + CHEE-vah

    // -nte (present participle / adjective)
    [/nte$/, 'N-chee', 3],       // contente → conte + N-chee
    [/ntes$/, 'N-chees', 4],     // contentes → conte + N-chees

    // -gem (noun suffix)
    [/gem$/, 'ZHAYN (nasal)', 3],  // viagem → via + ZHAYN
    [/gens$/, 'ZHAYNS (nasal)', 4], // viagens → via + ZHAYNS

    // -ês/-esa (nationality/origin)
    [/ês$/, 'EHS', 2],           // português → portugu + EHS
    [/esa$/, 'EH-zah', 3],       // portuguesa → portugu + EH-zah

    // -al (adjective/noun)
    [/al$/, 'OW', 2],            // final → fin + OW (L vocalization)
    [/ais$/, 'ICE', 3],          // finais → fin + ICE

    // -ol (L vocalization)
    [/ol$/, 'OW', 2],            // espanhol → espanh + OW

    // -el (L vocalization)
    [/el$/, 'EW', 2],            // papel → pap + EW
    [/éis$/, 'EH-ees', 3],       // papéis → pap + EH-ees

    // -il (L vocalization)
    [/il$/, 'EW', 2],            // difícil → difíc + EW
];

// Word mappings for dictionary-style (works on ORIGINAL Portuguese words)
const WORD_MAPPINGS_DICT = {
    // Pronouns and common words
    'eu': 'EH-oo',
    'e': 'ee',       // conjunction "and"
    'o': 'oo',       // article
    'a': 'ah',
    'os': 'oos',
    'as': 'ahs',

    // Verb forms
    'sou': 'SOH',
    'moro': 'MOH-roo',
    'trabalho': 'trah-BAH-lyoo',
    'falo': 'FAH-loo',
    'gosto': 'GOHS-too',
    'tenho': 'TEN-yoo',
    'vou': 'VOH',
    'estou': 'ess-TOH',

    // Prepositions
    'de': 'jee',
    'do': 'doo',
    'da': 'dah',
    'dos': 'doos',
    'das': 'dahs',
    'no': 'noo',
    'na': 'nah',
    'nos': 'noos',
    'nas': 'nahs',
    'com': 'KOHN (nasal)',
    'como': 'KOH-moo',
    'para': 'PAH-rah',
    'em': 'EYN (nasal)',
    'ao': 'ow',
    'aos': 'ows',

    // Nasal words
    'bem': 'BAYN (nasal)',
    'tem': 'TAYN (nasal)',
    'sem': 'SAYN (nasal)',
    'um': 'OOM (nasal)',
    'uma': 'OO-mah (nasal)',
    'sim': 'SEEN (nasal)',
    'bom': 'BOHN (nasal)',
    'som': 'SOHN (nasal)',
    'também': 'tahm-BAYN (nasal)',
    'quem': 'KAYN (nasal)',

    // Common adjectives
    'americano': 'ah-meh-ree-KAH-noo',
    'americana': 'ah-meh-ree-KAH-nah',
    'brasileiro': 'brah-zee-LEH-roo',
    'brasileira': 'brah-zee-LEH-rah',
    'casado': 'kah-ZAH-doo',
    'casada': 'kah-ZAH-dah',
    'solteiro': 'sohl-TEH-roo',
    'solteira': 'sohl-TEH-rah',
    'alto': 'AHL-too',
    'alta': 'AHL-tah',
    'baixo': 'BAI-shoo',
    'baixa': 'BAI-shah',
    'muito': 'MWEEN-too',
    'muita': 'MWEEN-tah',
    'pouco': 'POH-koo',
    'pouca': 'POH-kah',

    // Common nouns
    'professor': 'pro-feh-SOHR',
    'professora': 'pro-feh-SOH-rah',
    'analista': 'ah-nah-LEES-tah',
    'cachorro': 'kah-SHOH-hoo',
    'gata': 'GAH-tah',
    'gato': 'GAH-too',
    'música': 'MOO-zee-kah',
    'futebol': 'foo-cheh-BOW',
    'trabalho': 'trah-BAH-lyoo',
    'escritório': 'ess-kree-TOH-ree-oo',
    'metrô': 'meh-TROH',
    'ônibus': 'OH-nee-boos',

    // Place names
    'miami': 'mee-AH-mee',
    'york': 'YORK',
    'nova': 'NOH-vah',
    'paulo': 'POW-loo',
    'são': 'SOW (nasal)',
    'brasil': 'brah-ZEW',
    'frança': 'FRAHN-sah',
    'curitiba': 'koo-ree-CHEE-bah',

    // Names
    'daniel': 'dah-nee-EW',
    'sofia': 'so-FEE-ah',
    'maria': 'mah-REE-ah',
    'carlos': 'KAHR-loos',
    'john': 'JAWN',
    'sarah': 'SAH-rah',

    // Other common words
    'inglês': 'een-GLEHS',
    'espanhol': 'ess-pahn-YOW',
    'português': 'por-too-GEHS',
    'contente': 'kohn-TEN-chee',
    'que': 'kee',
    'mais': 'mice',
    'mas': 'mahs',
    'não': 'NOW (nasal)',
    'já': 'ZHAH',
    'aqui': 'ah-KEE',
    'ali': 'ah-LEE',
    'onde': 'OHN-jee',
    'quando': 'KWAHN-doo',
    'porque': 'por-KEH',
    'sempre': 'SEM-pree',
    'nunca': 'NOON-kah',
    'tudo': 'TOO-doo',
    'nada': 'NAH-dah',
};

/**
 * Convert a Portuguese word stem to basic phonetics.
 * @param {string} stem - Portuguese stem (lowercase)
 * @returns {string} Basic phonetic transcription of the stem
 */
function convertStemToPhonetic(stem) {
    if (!stem) return '';

    let result = stem;

    // Handle digraphs first (order matters!)
    result = result.replace(/nh/g, 'ny');
    result = result.replace(/lh/g, 'ly');
    result = result.replace(/ch/g, 'sh');
    result = result.replace(/rr/g, 'h');
    result = result.replace(/ss/g, 's');
    result = result.replace(/qu/g, 'k');
    result = result.replace(/gu(?=[ei])/g, 'g');

    // Handle vowels with accents
    result = result.replace(/[áà]/g, 'AH');
    result = result.replace(/[éè]/g, 'EH');
    result = result.replace(/[íì]/g, 'EE');
    result = result.replace(/[óò]/g, 'OH');
    result = result.replace(/[úù]/g, 'OO');
    result = result.replace(/â/g, 'ah');
    result = result.replace(/ê/g, 'eh');
    result = result.replace(/ô/g, 'oh');
    result = result.replace(/ã/g, 'ah(n)');
    result = result.replace(/õ/g, 'oh(n)');

    // Handle common vowel combinations
    result = result.replace(/ou/g, 'oh');
    result = result.replace(/ei/g, 'ay');
    result = result.replace(/ai/g, 'eye');
    result = result.replace(/au/g, 'ow');

    // Handle basic vowels (unaccented)
    result = result.replace(/a/g, 'ah');
    result = result.replace(/e/g, 'eh');
    result = result.replace(/i/g, 'ee');
    result = result.replace(/o/g, 'oh');
    result = result.replace(/u/g, 'oo');

    // Handle consonants
    result = result.replace(/ç/g, 's');
    result = result.replace(/j/g, 'zh');
    result = result.replace(/x/g, 'sh');
    result = result.replace(/z$/g, 's');  // final z sounds like s

    // Clean up repeated vowels
    result = result.replace(/(ah){2,}/g, 'ah');
    result = result.replace(/(eh){2,}/g, 'eh');
    result = result.replace(/(ee){2,}/g, 'ee');
    result = result.replace(/(oh){2,}/g, 'oh');
    result = result.replace(/(oo){2,}/g, 'oo');

    return result;
}

/**
 * Try to match a suffix pattern and return phonetic transcription.
 * @param {string} word - Original Portuguese word
 * @returns {string|null} Phonetic transcription if pattern matched, null otherwise
 */
function applySuffixPattern(word) {
    const wordLower = word.toLowerCase();

    for (const [pattern, suffixPhonetic, charsToCut] of SUFFIX_PATTERNS) {
        if (pattern.test(wordLower)) {
            // Get the stem (part before the suffix)
            const stem = charsToCut > 0 ? wordLower.slice(0, -charsToCut) : wordLower;

            // Convert stem to basic phonetics
            const stemPhonetic = convertStemToPhonetic(stem);

            // Combine stem + suffix
            if (stemPhonetic) {
                return `${stemPhonetic}-${suffixPhonetic}`;
            } else {
                return suffixPhonetic;
            }
        }
    }

    return null;
}

/**
 * Fallback: Convert unknown Portuguese word to phonetics using basic rules.
 * @param {string} word - Original Portuguese word
 * @returns {string} Basic phonetic transcription
 */
function syllabifyAndConvert(word) {
    // Apply full word conversion
    let phonetic = convertStemToPhonetic(word.toLowerCase());

    // Try to identify stressed syllable (simplified rules)
    // Portuguese stress rules:
    // 1. If has accent → that syllable is stressed
    // 2. If ends in a, e, o, am, em → penultimate
    // 3. If ends in consonant (not s), i, u → final

    if (/[áéíóúâêô]/.test(word.toLowerCase())) {
        // Has accent - already marked with CAPS in convertStemToPhonetic
    } else if (/[aeo]s?$|[ae]m$/.test(word.toLowerCase())) {
        // Ends in vowel (with optional s) or am/em → stress penultimate
        phonetic = phonetic.toUpperCase();  // Mark whole word for now
    } else {
        // Ends in consonant or i/u → stress final
        phonetic = phonetic.toUpperCase();
    }

    return phonetic;
}

/**
 * Format text in dictionary-style pronunciation with stress marking.
 *
 * This is an INDEPENDENT pipeline that works directly on original Portuguese text.
 * It does NOT depend on annotatePronunciation() or format_substitution().
 *
 * Converts Portuguese text to English-like pronunciation respelling:
 * - CAPITALS indicate stressed syllables
 * - Hyphens separate syllables
 * - (nasal) markers for nasal vowels
 *
 * @param {string} text - Original Portuguese text
 * @returns {string} Dictionary-style phonetic respelling
 *
 * @example
 * formatDictionaryStyle("Eu sou o Daniel")
 * // Returns: "EH-oo SOH oo dah-nee-EW"
 *
 * @example
 * formatDictionaryStyle("Eu sou de Miami")
 * // Returns: "EH-oo SOH jee mee-AH-mee"
 *
 * @example
 * formatDictionaryStyle("Eu sou engenheiro de Curitiba")
 * // Returns: "EH-oo SOH en-zhen-EH-roo jee koo-ree-CHEE-bah"
 */
function formatDictionaryStyle(text) {
    // Extract words and punctuation
    // Note: \w doesn't match accented characters in JS, so we include them explicitly
    const tokens = text.match(/[\wáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]+|[.,!?;:]/g) || [];
    const result = [];

    for (const token of tokens) {
        // Pass through punctuation
        if (/^[.,!?;:]$/.test(token)) {
            // Attach to previous word if exists
            if (result.length > 0) {
                result[result.length - 1] = result[result.length - 1] + token;
            }
            continue;
        }

        const word = token;
        const lookup = word.toLowerCase();

        // 1. Check word mappings first (exact match)
        if (WORD_MAPPINGS_DICT[lookup]) {
            result.push(WORD_MAPPINGS_DICT[lookup]);
            continue;
        }

        // 2. Try suffix patterns (on original word)
        const patternResult = applySuffixPattern(word);
        if (patternResult) {
            result.push(patternResult);
            continue;
        }

        // 3. Fallback: basic conversion
        const fallback = syllabifyAndConvert(word);
        result.push(fallback);
    }

    return result.join(' ');
}

// Export for use in Node.js and browser environments
// For Node.js, it's a direct export. For browsers, it's attached to window for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { annotatePronunciation, formatDictionaryStyle };
} else if (typeof window !== 'undefined') {
    window.annotatePronunciation = annotatePronunciation;
    window.formatDictionaryStyle = formatDictionaryStyle;
}
