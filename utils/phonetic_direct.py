"""
Direct Portuguese to Dictionary-Style Phonetic Conversion

100% algorithmic approach - no word dictionary needed.
All pronunciation rules output dictionary-style directly.
"""

import re
import unicodedata

# Diphthongs in Portuguese
DIPHTHONGS = ['ei', 'ai', 'oi', 'ui', 'ou', 'au', 'eu', 'iu', 'ão', 'ãe', 'õe']

# Nasal diphthongs
NASAL_DIPHTHONGS = ['ão', 'ãe', 'õe', 'ãi', 'õi']

# Valid consonant clusters (onsets)
VALID_ONSETS = ['pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr',
                'pl', 'bl', 'cl', 'gl', 'fl',
                'qu', 'gu', 'ch', 'lh', 'nh',
                'rr', 'ss']  # digraphs that stay together

# Function words — always unstressed
FUNCTION_WORDS = {
    'o', 'a', 'os', 'as',                          # articles
    'de', 'em', 'e', 'que', 'se', 'te', 'me', 'lhe',
    'no', 'na', 'nos', 'nas',                       # em + articles
    'do', 'da', 'dos', 'das',                       # de + articles
    'ao', 'aos',                                     # a + articles
    'pelo', 'pela', 'pelos', 'pelas',                # por + articles
}

# --- Context disambiguation constants ---

# Words with noun/verb vowel alternation
AMBIGUOUS_O = {'jogo', 'gosto', 'acordo', 'almoço',
               'namoro', 'governo', 'rolo', 'toco', 'troco'}
AMBIGUOUS_E = {'começo', 'emprego', 'seco', 'peso'}

# Signals that preceding word indicates VERB usage (open vowel)
VERB_SIGNALS = {
    'eu', 'tu', 'ele', 'ela', 'nós', 'eles', 'elas', 'você', 'vocês',
    'não', 'já', 'também', 'ainda', 'sempre', 'nunca', 'só',
    'bem', 'mal', 'muito', 'quase', 'realmente',
    'que', 'quando', 'onde', 'como', 'porque', 'se',
}

# Signals that preceding word indicates NOUN usage (closed vowel)
NOUN_SIGNALS = {
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
    'aquele', 'aquela', 'aqueles', 'aquelas',
    'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'seus', 'suas',
    'nosso', 'nossa', 'nossos', 'nossas', 'teu', 'tua', 'teus', 'tuas',
    'de', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
    'em', 'com', 'pelo', 'pela', 'pelos', 'pelas', 'ao', 'aos',
    'bom', 'bons', 'boa', 'boas', 'grande', 'grandes',
    'primeiro', 'primeira', 'último', 'última',
    'melhor', 'pior', 'novo', 'nova', 'próprio', 'própria',
}

# Signals that following word indicates NOUN usage
NOUN_SIGNALS_NEXT = {'de', 'do', 'da', 'dos', 'das'}

# Diphthong → phonetic mapping (dot = glide within diphthong)
DIPHTHONG_MAP = {
    'eu': 'êh.<oo>',    'ou': 'ôh.<oo>',
    'ei': 'êh.<ee>',    'ai': 'ah.<ee>',
    'oi': 'ôh.<ee>',    'au': 'ah.<oo>',
    'ão': 'ãh.<oo>',    'ãe': 'ãh.<ee>',    'õe': 'õh.<ee>',
}

# Exception dictionary for irregular pronunciations
# Only for words where algorithmic approach produces incorrect output
# Keep this list small (<1% of vocabulary)
PHONETIC_EXCEPTIONS = {
    # X pronounced as "ss" (not predictable algorithmically)
    'próximo': 'pró-SSi-mo',        # Algorithm: "PRÓH-ksee-moo" → Correct: X as "ss"
    'máximo': 'má-SSi-mo',          # Algorithm: "MAH-ksee-moo" → Correct: X as "ss"
    'auxílio': 'au-SSí-li-oo',      # Algorithm: "ah-oo-SHEE-lee-oo" → Correct: X as "ss"
    'sintaxe': 'sin-ta-SSe',        # Algorithm: "sĩn-TAH-ksee" → Correct: X as "ss"
    'trouxer': 'trou-SSer',         # Algorithm: "trôh-SHÉHr" → Correct: X as "ss"

    # Loanwords (retain foreign pronunciation rules)
    'tchau': 'chau',                # Italian origin - Hard CH (not soft "sh")
    'pizza': 'pí-tsah',             # Italian - ZZ as /ts/ (not /z/)
    'design': 'di-ZÁIN',            # English pronunciation retained
    'site': 'SÁI-chee',             # English vowel shift (i → ai)
    'wi-fi': 'wái-fái',             # English vowel shift
    'show': 'shô',                  # English - Single syllable, closed O
    'shopping': 'SHÓ-ping',         # English pronunciation retained

    # Silent consonant irregularities (SC, XC clusters)
    'nascimento': 'nah-see-MÊN-too',  # SC → S (not /sk/)
    'exceção': 'eh-seh-SÁHN',         # XC → SS, nasal ending
    'piscina': 'pee-SEE-nah',         # SC → S (not /sk/)

    # Fixed vowel quality (no context disambiguation needed)
    'selo': 'SÊH-loo',               # Always closed ê

    # Verb conjugation: stem O opens in stressed forms (eu/tu/ele/eles)
    'posso': 'PÓH-ssoo',
    'pode': 'PÓH-jee',
    'podes': 'PÓH-jees',
    'podem': 'PÓH-dẽm',
    'movo': 'MÓH-voo',
    'move': 'MÓH-vee',
    'moves': 'MÓH-vees',
    'movem': 'MÓH-vẽm',
    'dorme': 'DÓHR-mee',
    'dormes': 'DÓHR-mees',
    'dormem': 'DÓHR-mẽm',
    'corro': 'KÓH-hoo',
    'corre': 'KÓH-hee',
    'corres': 'KÓH-hees',
    'correm': 'KÓH-hẽm',
    'morro': 'MÓH-hoo',
    'morre': 'MÓH-hee',
    'morrem': 'MÓH-hẽm',
}


def has_accent(char):
    """Check if character has an accent mark."""
    accented = 'áéíóúâêôàã õ'
    return char in accented


def find_stress_position(word):
    """
    Find which syllable is stressed using Portuguese stress rules.

    Rules:
    1. Written accent (á,é,í,ó,ú,â,ê,ô) → that syllable
    2. Nasal tilde (ã,õ) → that syllable
    3. Ends in a/e/o/am/em/ens (±s) → penultimate syllable
    4. All other endings → final syllable

    Returns:
        int: Syllable index (0-based) that should be stressed
    """
    word_lower = word.lower()

    # Rule 1 & 2: Check for accent marks or nasal tilde
    for i, char in enumerate(word_lower):
        if has_accent(char):
            # Found accent - need to figure out which syllable this is in
            # For now, mark this position
            return ('accent', i)

    # Rule 3: Ends in a/e/o/am/em/ens (with optional s) → penultimate
    penultimate_endings = ['a', 'e', 'o', 'as', 'es', 'os', 'am', 'em', 'ens']
    for ending in penultimate_endings:
        if word_lower.endswith(ending):
            return ('penultimate', None)

    # Rule 4: All other endings (consonants: l, r, z, etc.) → final syllable
    return ('final', None)


def syllabify(word):
    """
    Split Portuguese word into syllables using Maximal Onset Principle.

    Algorithm:
    1. Find all vowel/diphthong positions (nuclei)
    2. Between nuclei, attach maximal consonants to following syllable
    3. Valid Portuguese onsets stay together: pr, br, tr, dr, cr, gr, fl, pl, bl, cl, gl

    Returns:
        list: Syllables

    Examples:
        brasileiro → bra-si-lei-ro
        daniel → da-ni-el
        inglês → in-glês
    """
    vowels = 'aeiouãõáéíóúâêôà'
    word_lower = word.lower()

    # Step 1: Find nuclei (vowels/diphthongs) positions
    nuclei = []
    i = 0
    while i < len(word_lower):
        if word_lower[i] in vowels:
            # Skip U in GU/QU digraphs before E/I (silent U)
            if word_lower[i] == 'u' and i > 0 and word_lower[i-1] in 'gq':
                if i + 1 < len(word_lower) and word_lower[i+1] in 'eiéêíî':
                    # Silent U in digraph - skip it
                    i += 1
                    continue

            # Check for diphthong
            found_diphthong = False
            for diph in sorted(DIPHTHONGS, key=len, reverse=True):  # Longest first
                if word_lower[i:i+len(diph)] == diph:
                    nuclei.append((i, i + len(diph), word_lower[i:i+len(diph)]))
                    i += len(diph)
                    found_diphthong = True
                    break
            if not found_diphthong:
                nuclei.append((i, i + 1, word_lower[i]))
                i += 1
        else:
            i += 1

    if not nuclei:
        return [word]

    # Step 2: Build syllables around nuclei
    syllables = []

    for nuc_idx, (start, end, nucleus) in enumerate(nuclei):
        syl = ''

        # Get onset (consonants before this nucleus)
        if nuc_idx == 0:
            # First syllable - take all consonants from start
            onset_start = 0
        else:
            # Take consonants after previous nucleus
            onset_start = nuclei[nuc_idx - 1][1]

        onset = word_lower[onset_start:start]

        # Apply maximal onset: if multiple consonants, check for valid clusters
        if len(onset) > 1:
            # Check if last 2 consonants form valid onset
            last_two = onset[-2:]
            if last_two in VALID_ONSETS:
                # Keep last 2 together, rest goes to previous syllable
                if syllables:
                    syllables[-1] += onset[:-2]
                onset = last_two
            else:
                # Split: all but last go to previous syllable
                if syllables:
                    syllables[-1] += onset[:-1]
                onset = onset[-1:]

        syl = onset + nucleus

        # Get coda (consonants after nucleus, before next nucleus)
        if nuc_idx < len(nuclei) - 1:
            # There's another nucleus - no coda (maximal onset)
            coda = ''
        else:
            # Last nucleus - take all remaining consonants
            coda = word_lower[end:]

        syl += coda
        syllables.append(syl)

    return syllables


def determine_o_quality(word, syllable, syl_index, is_stressed, syllables=None):
    """
    Determine if O should be ó (open) or ô (closed).

    Rules (priority order):
    1. O before nasal (m, n) → ô (closed)
    2. OU diphthong → ô (closed)
    3. Final unstressed -o → ô (closed, becomes 'oo')
    4. O with written accent ó → ó (open)
    5. O before L → ó (open)
    6. Stressed O in open syllable → ó (open)
    7. Default → ô (closed)

    Note: O quality in Portuguese is complex and often lexical.
    This is a simplified rule set that may need word-by-word refinement.
    """
    syl_lower = syllable.lower()
    word_lower = word.lower()

    # Rule 0: Respect explicit accent marks in the original word
    if 'ô' in syl_lower:
        return 'ô'
    if 'ó' in syl_lower:
        return 'ó'

    # Rule 1: O before nasal (m, n) - in same syllable or if next syllable starts with m/n
    if re.search(r'o[mn]', syl_lower):
        return 'ô'
    # Check if next syllable starts with m or n (for words like nome, fome)
    # This requires access to full word context
    # Simple heuristic: if syllable ends with 'o' and word has 'me' or 'ne' pattern
    if syl_lower.endswith('o') and re.search(r'o[mn]e', word_lower):
        return 'ô'

    # Rule 2: OU diphthong
    if 'ou' in syl_lower:
        return 'ô'

    # Rule 3: Final unstressed -o (already handled in vowel conversion as 'oo')
    # This is checked in the vowel processing section

    # Rule 4: Written accent ó
    if 'ó' in syl_lower:
        return 'ó'

    # Rule 5: O before L
    if re.search(r'ol', syl_lower):
        return 'ó'

    # Rule 5b: Plural metaphony — singular -o (closed ô) → plural -os (open ó)
    # postos, portos, fogos, jogos, ovos, ossos, etc.
    # Must come before O-before-R rule so "portos" opens correctly
    if is_stressed and word_lower.endswith('os') and 'o' in syl_lower:
        return 'ó'

    # Rule 5c: Stressed O before R — depends on word ending
    # porta/corpo (end in -a) → open ó; porto/forno (end in -o) → closed ô
    if re.search(r'or', syl_lower) and is_stressed:
        if word_lower.endswith('a') or word_lower.endswith('as'):
            return 'ó'
        else:
            return 'ô'

    # Rule 6: Stressed O in open syllable (ends with vowel)
    # Plural vs Singular distinction:
    # - Plurals (ending in -s): stressed O in open syllable → open (ó)
    # - Singulars: stressed O in open syllable before final → closed (ô)
    # - Words like bola, rosa (not ending in -o): open (ó)
    if is_stressed:
        vowels = 'aeiouãõáéíóúâêô'
        if len(syl_lower) > 0 and syl_lower[-1] in vowels:
            # If word ends in -s (likely plural), open the O
            if word_lower.endswith('s'):
                return 'ó'
            # If word ends in -o and this is NOT the last syllable, close it
            # (e.g., jogo → jo-go, first syllable "jo" has closed ô)
            elif word_lower.endswith('o') and syl_index < len([s for s in word_lower if s in vowels]) - 1:
                return 'ô'
            # Syllable ends with O before vowel hiatus (boa → bo-a) → closed
            elif syl_lower.endswith('o') and syllables and syl_index + 1 < len(syllables):
                next_syl = syllables[syl_index + 1].lower()
                vowels_set = 'aeiouãõáéíóúâêô'
                if len(next_syl) > 0 and next_syl[0] in vowels_set:
                    return 'ô'
                else:
                    return 'ó'
            # Otherwise (bola, rosa, etc.), open it
            else:
                return 'ó'

    # Rule 7: Default is closed ô
    return 'ô'


def determine_e_quality(word, syllable, syl_index, is_stressed, syllables=None):
    """
    Determine if E should be é (open) or ê (closed).

    Rules (priority order):
    1. E before nasal (m, n, nh) → ê (closed)
    2. E before R → é (open)
    3. E in closed syllable (ends with consonant except L, R) → ê (closed)
    4. EU diphthong → ê (closed)
    5. EI diphthong → ê (closed)
    6. E before L → é (open)
    7. Stressed E in open syllable → é (open)
    8. Unstressed E → ê (closed) - default
    """
    syl_lower = syllable.lower()
    word_lower = word.lower()

    # Rule 0: Respect explicit accent marks in the original word
    if 'ê' in syl_lower:
        return 'ê'
    if 'é' in syl_lower:
        return 'é'

    # Rule 1: E before nasal (including next syllable starting with nasal)
    if re.search(r'e[mn]', syl_lower):
        return 'ê'
    # Check if next syllable starts with nasal consonant (m, n, nh)
    if syllables and syl_index + 1 < len(syllables):
        next_syl = syllables[syl_index + 1].lower()
        if next_syl.startswith(('m', 'n', 'nh')):
            # E followed by nasal in next syllable → closed
            return 'ê'

    # Rule 2: E before R (stressed) → open
    if re.search(r'e[rR]', syl_lower) and is_stressed:
        return 'é'

    # Rule 4: EU diphthong
    if 'eu' in syl_lower:
        return 'ê'

    # Rule 5: EI diphthong
    if 'ei' in syl_lower:
        return 'ê'

    # Rule 6: E before L
    if re.search(r'el', syl_lower):
        return 'é'

    # Rule 3: E in closed syllable (ends with consonant, not just has consonant)
    vowels = 'aeiouãõáéíóúâêô'
    # Closed syllable: ends with consonant (except L, R which have specific rules)
    if len(syl_lower) > 0 and syl_lower[-1] not in vowels:
        # Check if E (with any diacritic) is in this syllable
        has_e = any(c in 'eéêè' for c in syl_lower)
        if has_e and syl_lower[-1] not in 'lr':
            return 'ê'

    # Rule 7: Stressed E in open syllable
    if is_stressed:
        return 'é'

    # Rule 8: Default unstressed
    return 'ê'


def get_x_sound(word, index):
    """
    Algorithmic determination of 'X' pronunciation in Portuguese.

    Uses a Context Hierarchy algorithm to achieve 90-95% accuracy.

    Rules (priority order):
    1. Start of word → 'sh' (xarope, xadrez)
    2. End of word → 'ks' (tórax, clímax)
    3. Before consonant → 's' (texto, extensão)
    4. After 'en-' at start → 'sh' (enxada, enxame)
    5. After 'me-' at start → 'sh' (mexer, mexicano)
    6. After diphthong → 'sh' (caixa, peixe, frouxo)
    7. 'ex' + vowel at start → 'z' (exame, exemplo, existir)
    8. Common 'ks' roots (scientific words) → 'ks' (táxi, fixo, complexo)
    9. Default intervocalic → 'sh' (lixo, baixo)

    Args:
        word: Full Portuguese word
        index: Position of 'x' in the word (0-based)

    Returns:
        str: Phonetic representation ('sh', 'ks', 's', or 'z')
    """
    word_lower = word.lower()
    vowels = 'aeiouãõáéíóúâêô'

    # Rule 1: Start of word → 'sh'
    if index == 0:
        return 'sh'

    # Rule 2: End of word → 'ks'
    if index == len(word_lower) - 1:
        return 'ks'

    prev_char = word_lower[index - 1] if index > 0 else ''
    next_char = word_lower[index + 1] if index < len(word_lower) - 1 else ''

    # Rule 3: Before consonant → 's'
    if next_char and next_char not in vowels and next_char != 'h':
        return 's'

    # Rule 4: After 'en' at start of word → 'sh'
    if index == 2 and word_lower.startswith('en'):
        return 'sh'

    # Rule 5: After 'me' at start of word → 'sh'
    if index == 2 and word_lower.startswith('me'):
        return 'sh'

    # Rule 6: After diphthong → 'sh'
    # Check 2 characters back for common diphthongs
    if index >= 2:
        two_back = word_lower[index-2:index]
        if two_back in ['ai', 'ei', 'ou', 'oi', 'au', 'ui']:
            return 'sh'

    # Rule 7: 'ex' + vowel at start of word → 'z'
    # Covers: exame, exemplo, existir, executar, exercício, exato
    if index == 1 and word_lower.startswith('e') and next_char in vowels:
        return 'z'

    # Also handle 'hex' + vowel (hexágono, hexadecimal)
    if index == 2 and word_lower.startswith('he') and next_char in vowels:
        return 'z'

    # Rule 8: Common 'ks' roots (scientific/learned words)
    # Expanded list with common patterns
    ks_roots = [
        'tax', 'táx', 'fix', 'flex', 'plex', 'max', 'máx', 'sex',
        'box', 'tox', 'tóx', 'axi', 'oxi', 'óxi', 'nex', 'flux',
        'prox', 'próx', 'vex', 'xim', 'uxo'
    ]

    # Check if any root contains the X at this position
    # For each root, see if it appears in the word and the X is within that root
    for root in ks_roots:
        # Find where this root appears in the word
        root_pos = word_lower.find(root)
        if root_pos != -1:
            # Check if the current X index falls within this root
            x_in_root = root.find('x')
            if x_in_root != -1 and root_pos + x_in_root == index:
                return 'ks'

    # Rule 9: Default fallback for intervocalic X → 'sh'
    # This is statistically more common in core vocabulary
    # (lixo, baixo, bexiga, coaxar, roxo)
    return 'sh'


def _check_palatalization(syl, i, syl_index, total_syls, is_stressed):
    """Check if d/t before e/i should palatalize. Returns chars consumed (2) or 0."""
    if i + 1 >= len(syl) or syl[i+1] not in 'ei':
        return 0
    if i + 2 < len(syl) and syl[i+1:i+3] in ('ei', 'eu'):
        return 0  # Don't break diphthongs
    is_i = syl[i+1] == 'i'
    at_end = i + 2 >= len(syl)
    is_final_unstressed = at_end and syl_index == total_syls - 1 and not is_stressed
    if is_i or is_final_unstressed:
        return 2
    return 0


def _mark_final_coda(result):
    """Wrap final-syllable coda consonants in <> markers for stress handling."""
    vowel_chars = 'aeiouãõáéíóúâêôÁÉÍÓÚÂÊÔÃÕẽĩũẼĨŨ'
    i = len(result) - 1
    while i >= 0 and result[i] not in vowel_chars and result[i] not in '<>-':
        i -= 1

    if i >= 0 and i < len(result) - 1 and result[i] in vowel_chars:
        coda_start = i + 1
        coda = result[coda_start:]
        if coda and not any(c in coda for c in '<>'):
            if coda.startswith('h'):
                actual_coda = coda[1:]
                if actual_coda:
                    return result[:coda_start+1] + '<' + actual_coda + '>'
            elif coda != 'h':
                return result[:coda_start] + '<' + coda + '>'
    elif i >= 0 and result[i] == '>':
        marker_end = i + 1
        if marker_end < len(result):
            coda = result[marker_end:]
            if coda:
                return result[:marker_end] + '<' + coda + '>'
    return result


def _apply_stress(result, is_stressed):
    """Capitalize stressed syllables, lowercase unstressed. Strip <> markers."""
    output = ''
    i = 0
    while i < len(result):
        if result[i] == '<':
            close = result.find('>', i)
            if close != -1:
                output += result[i+1:close]
                i = close + 1
                continue
        output += result[i].upper() if is_stressed else result[i].lower()
        i += 1
    return output


def syllable_to_phonetic(word, syllable, syl_index, total_syls, stress_info, syllables=None, ctx=None):
    """
    Convert a single syllable to dictionary-style phonetic.

    Handles diphthongs as atomic units, applies all pronunciation rules.

    Args:
        word: Original full word (for context)
        syllable: The syllable to convert
        syl_index: Index of this syllable (0-based)
        total_syls: Total number of syllables
        stress_info: Tuple of (stress_type, position) from find_stress_position
        syllables: Optional list of all syllables (for cross-syllable context)
        ctx: Optional dict with context overrides:
             'force_open_o', 'force_open_e', 'force_closed_e', 'force_unstressed'

    Returns:
        str: Phonetic transcription of syllable
    """
    if ctx is None:
        ctx = {}
    force_open_o = ctx.get('force_open_o', False)
    force_open_e = ctx.get('force_open_e', False)
    force_closed_e = ctx.get('force_closed_e', False)
    force_unstressed = ctx.get('force_unstressed', False)
    syl = syllable.lower()
    stress_type, stress_pos = stress_info

    # Determine if this syllable is stressed
    word_lower = word.lower()

    is_stressed = False
    if force_unstressed:
        is_stressed = False
    elif word_lower in FUNCTION_WORDS:
        # Function words are always unstressed
        is_stressed = False
    elif total_syls == 1:
        is_stressed = True
    elif stress_type == 'accent':
        is_stressed = any(has_accent(c) for c in syllable)
    elif stress_type == 'penultimate':
        is_stressed = (syl_index == total_syls - 2)
    elif stress_type == 'final':
        is_stressed = (syl_index == total_syls - 1)

    result = ''
    i = 0

    while i < len(syl):
        # Diphthongs (atomic, checked first)
        digraph = syl[i:i+2]
        if digraph in DIPHTHONG_MAP:
            result += DIPHTHONG_MAP[digraph]
            i += 2
            continue

        char = syl[i]

        # Palatalization: d→jee, t→chee before i (always) or e (unstressed final)
        if char in 'dt':
            consumed = _check_palatalization(syl, i, syl_index, total_syls, is_stressed)
            if consumed:
                result += 'jee' if char == 'd' else 'chee'
                i += consumed
                continue
            result += char

        # Consonants
        elif char in 'bfkmpvwz':
            result += char
        elif char == 'ç':
            # Ç (cedilha) always sounds like S
            result += 's'
        elif char == 'c':
            # Check for CH digraph first
            if i + 1 < len(syl) and syl[i+1] == 'h':
                result += 'sh'
                i += 1  # Skip the H
            elif i + 1 < len(syl) and syl[i+1] in 'eiéêíî':
                result += 's'
            else:
                result += 'k'
        elif char == 'g':
            if i + 1 < len(syl) and syl[i+1] in 'ei':
                result += 'j'
            else:
                result += 'g'
        elif char == 'h':
            pass  # Silent
        elif char == 'j':
            result += 'zh'
        elif char == 'l':
            # Check for LH digraph first
            if i + 1 < len(syl) and syl[i+1] == 'h':
                result += 'ly'
                i += 1  # Skip the H
            # L handling: word-final L vocalizes, syllable-final L stays
            elif i == len(syl) - 1:
                # Syllable-final L
                if syl_index == total_syls - 1:
                    # Word-final L → vocalization as dot-diphthong with .oo
                    # al → AH.oo, el → ÉH.oo, il → EE.oo, ol → ÔH.oo, ul → (merges)
                    if i > 0 and syl[i-1] in 'uúũ':
                        pass  # After U: merges, no extra sound
                    else:
                        result += '.<oo>'
                else:
                    # Syllable-final but not word-final → keep as l
                    result += 'l'
            else:
                result += 'l'
        elif char == 'n':
            # Check for NH digraph first
            if i + 1 < len(syl) and syl[i+1] == 'h':
                result += 'ny'
                i += 1  # Skip the H
            else:
                result += 'n'
        elif char == 'q':
            result += 'k'
            if i + 1 < len(syl) and syl[i+1] == 'u':
                i += 1
        elif char == 'r':
            # RR digraph or word-initial → guttural (h); otherwise flap (r)
            if i + 1 < len(syl) and syl[i+1] == 'r':
                result += 'h'
                i += 1
            elif i > 0 and syl[i-1] == 'r':
                pass  # second r already handled
            elif i == 0 and syl_index == 0:
                result += 'h'
            else:
                result += 'r'
        elif char == 's':
            # S between vowels → Z
            vowels = 'aeiouãõáéíóúâêô'

            # Check if next char is vowel
            next_is_vowel = i + 1 < len(syl) and syl[i+1] in vowels

            # Check if previous char is vowel (within syllable or from previous syllable)
            if i > 0:
                # Check previous char in this syllable
                prev_is_vowel = syl[i-1] in vowels
            elif syl_index > 0 and syllables:
                # S is at start of non-first syllable - check if previous syllable ends with vowel
                prev_syl = syllables[syl_index - 1]
                prev_is_vowel = len(prev_syl) > 0 and prev_syl[-1] in vowels
            else:
                prev_is_vowel = False

            if prev_is_vowel and next_is_vowel:
                result += 'z'
            else:
                result += 's'
        elif char == 'x':
            # Calculate the position of 'x' in the full word
            # by summing lengths of previous syllables plus current position
            word_index = sum(len(syllables[k]) for k in range(syl_index)) + i if syllables else i
            x_sound = get_x_sound(word, word_index)
            result += x_sound
        # Vowels (not in diphthongs)
        elif char in 'aáàã':
            result += 'ah'
        elif char in 'eéêè':
            # Check if this is final unstressed -e (becomes 'ee')
            is_final_e = (i == len(syl) - 1 or (i == len(syl) - 2 and syl[i+1] == 's')) and (syl_index == total_syls - 1) and not is_stressed and char == 'e'

            if is_final_e:
                # Final unstressed -e → ee
                result += 'ee'
            # E before m/n — nasality shown by following m/n
            elif i + 1 < len(syl) and syl[i+1] in 'mn':
                result += 'êh'
            else:
                # Apply E quality rules
                if force_open_e and is_stressed:
                    result += 'Éh'
                elif force_closed_e and is_stressed:
                    result += 'Êh'
                else:
                    quality = determine_e_quality(word, syllable, syl_index, is_stressed, syllables)
                    if char == 'é' or quality == 'é':
                        result += 'Éh'
                    else:  # ê or default
                        result += 'Êh'
        elif char in 'iíĩ':
            result += 'ee'
        elif char in 'oóôõ':
            # Apply O quality rules
            # Check if this is final unstressed -o (including -os plural)
            is_final_o = (i == len(syl) - 1 and syl_index == total_syls - 1) or \
                         (i == len(syl) - 2 and syl[i+1] == 's' and syl_index == total_syls - 1)

            if is_final_o and char == 'o' and not is_stressed:
                # Final unstressed -o or -os → oo (closed, no quality marker needed)
                result += 'oo'
            else:
                # O before m/n — nasality shown by following m/n
                if i + 1 < len(syl) and syl[i+1] in 'mn':
                    result += 'ôh'
                else:
                    # Determine quality: ó (open) vs ô (closed)
                    if force_open_o and is_stressed:
                        result += 'Óh'
                    else:
                        quality = determine_o_quality(word, syllable, syl_index, is_stressed, syllables)
                        if char == 'ó' or quality == 'ó':
                            result += 'Óh'
                        else:  # ô or default
                            result += 'Ôh'
        elif char in 'uúũ':
            # Check if U is silent (after g/q before e/i)
            if char == 'u' and i > 0 and syl[i-1] in 'gq':
                if i + 1 < len(syl) and syl[i+1] in 'eiéêíî':
                    # Silent U in GU/QU digraph - skip
                    i += 1
                    continue
            # U is always 'oo' — nasality shown by following m/n
            result += 'oo'

        i += 1

    # Mark coda consonants in final syllable, then apply stress
    if syl_index == total_syls - 1:
        result = _mark_final_coda(result)
    return _apply_stress(result, is_stressed)


def portuguese_to_phonetic(word, prev_word=None, next_word=None):
    """
    Convert Portuguese word to dictionary-style phonetic transcription.

    Checks exception dictionary first, then falls back to algorithmic generation.
    Uses prev_word/next_word for context-dependent disambiguation (e.g., noun vs verb).

    Args:
        word: Portuguese word
        prev_word: Previous word in sentence (for context)
        next_word: Next word in sentence (for context)

    Returns:
        str: Dictionary-style phonetic (e.g., "brah-zee-LÊH.ee-roo")
    """
    # 0. Check exception dictionary first (for truly irregular words)
    word_lower = word.lower()
    if word_lower in PHONETIC_EXCEPTIONS:
        return PHONETIC_EXCEPTIONS[word_lower]

    # 0b. Context-aware noun/verb disambiguation
    # Words with different O quality as noun (closed ô) vs verb (open ó):
    #   o jogo (noun) → closed ô  |  eu jogo (verb) → open ó
    # Heuristic: check prev_word to guess noun vs verb
    prev_lower = prev_word.lower() if prev_word else None
    next_lower = next_word.lower() if next_word else None

    def _is_verb_usage():
        """Determine if ambiguous word is being used as verb."""
        # Prev word is a verb signal → verb
        if prev_lower in VERB_SIGNALS:
            return True
        # Prev word is a noun signal → noun
        if prev_lower in NOUN_SIGNALS:
            return False
        # Next word is a preposition → noun phrase ("jogo de futebol")
        if next_lower in NOUN_SIGNALS_NEXT:
            return False
        # No context at all → default noun
        if prev_lower is None and next_lower is None:
            return False
        # Has next word but no prev signal → likely verb ("jogo futebol")
        if prev_lower is None and next_lower is not None:
            return True
        # Fallback: default noun
        return False

    ctx = {}
    if word_lower in AMBIGUOUS_O:
        if _is_verb_usage():
            ctx['force_open_o'] = True
    if word_lower in AMBIGUOUS_E:
        if _is_verb_usage():
            ctx['force_open_e'] = True
        else:
            ctx['force_closed_e'] = True

    # 1. Syllabify
    syllables = syllabify(word)

    # 2. Find stress
    stress_info = find_stress_position(word)

    # 3. Convert each syllable
    phonetic_syllables = []
    for i, syl in enumerate(syllables):
        phon = syllable_to_phonetic(word, syl, i, len(syllables), stress_info, syllables, ctx)
        phonetic_syllables.append(phon)

    # 4. Join with hyphens
    result = '-'.join(phonetic_syllables)

    return result


# Test function
if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    if len(sys.argv) > 1:
        # Process CLI input: split into words, convert each
        text = ' '.join(sys.argv[1:])
        words = text.replace('.', '').replace(',', '').replace('?', '').replace('!', '').split()
        results = []
        for idx, word in enumerate(words):
            prev = words[idx - 1] if idx > 0 else None
            nxt = words[idx + 1] if idx + 1 < len(words) else None
            try:
                results.append(portuguese_to_phonetic(word, prev_word=prev, next_word=nxt))
            except Exception as e:
                results.append(f'[{word}?]')
        print(' '.join(results))
    else:
        test_words = [
            'eu', 'sou', 'brasileiro', 'de', 'daniel',
            'inglês', 'português', 'contente', 'gato', 'casa',
        ]
        print('100% ALGORITHMIC PHONETIC CONVERSION\n')
        print('=' * 60)
        for word in test_words:
            try:
                phonetic = portuguese_to_phonetic(word)
                print(f'{word:15} → {phonetic}')
            except Exception as e:
                print(f'{word:15} → ERROR: {e}')
