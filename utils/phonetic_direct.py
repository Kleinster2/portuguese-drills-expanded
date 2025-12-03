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
                'qu', 'gu', 'ch', 'lh', 'nh']


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


def determine_o_quality(word, syllable, syl_index, is_stressed):
    """
    Determine if O should be ó (open) or ô (closed).

    Rules (priority order):
    1. O before nasal (m, n) → ô (closed)
    2. OU diphthong → ô (closed)
    3. Final unstressed -o → ô (closed, becomes 'oo')
    4. O with written accent ó → ó (open)
    5. O before L → ó (open)
    6. Stressed O in open syllable → ó (open)
    7. Unstressed O → ô (closed) - default
    """
    syl_lower = syllable.lower()
    word_lower = word.lower()

    # Rule 1: O before nasal
    if re.search(r'o[mn]', syl_lower):
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

    # Rule 6: Stressed O in open syllable
    if is_stressed:
        # Check if open syllable (ends with vowel)
        vowels = 'aeiouãõáéíóúâêô'
        if len(syl_lower) > 0 and syl_lower[-1] in vowels:
            return 'ó'

    # Rule 7: Default unstressed
    return 'ô'


def determine_e_quality(word, syllable, syl_index, is_stressed):
    """
    Determine if E should be é (open) or ê (closed).

    Rules (priority order):
    1. E before nasal (m, n, nh) → ê (closed)
    2. E in closed syllable (ends with consonant except L) → ê (closed)
    3. EU diphthong → ê (closed)
    4. EI diphthong → ê (closed)
    5. E before L → é (open)
    6. Stressed E in open syllable → é (open)
    7. Unstressed E → ê (closed) - default
    """
    syl_lower = syllable.lower()
    word_lower = word.lower()

    # Rule 1: E before nasal
    if re.search(r'e[mn]', syl_lower):
        return 'ê'

    # Rule 3: EU diphthong
    if 'eu' in syl_lower:
        return 'ê'

    # Rule 4: EI diphthong
    if 'ei' in syl_lower:
        return 'ê'

    # Rule 5: E before L
    if re.search(r'el', syl_lower):
        return 'é'

    # Rule 2: E in closed syllable (ends with consonant, not just has consonant)
    vowels = 'aeiouãõáéíóúâêô'
    # Closed syllable: ends with consonant (except L which is rule 4)
    if len(syl_lower) > 0 and syl_lower[-1] not in vowels:
        # Check if E (with any diacritic) is in this syllable
        has_e = any(c in 'eéêè' for c in syl_lower)
        if has_e and 'l' != syl_lower[-1]:
            return 'ê'

    # Rule 6: Stressed E in open syllable
    if is_stressed:
        return 'é'

    # Rule 7: Default unstressed
    return 'ê'


def syllable_to_phonetic(word, syllable, syl_index, total_syls, stress_info, syllables=None):
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

    Returns:
        str: Phonetic transcription of syllable
    """
    syl = syllable.lower()
    stress_type, stress_pos = stress_info

    # Determine if this syllable is stressed
    is_stressed = False
    if stress_type == 'accent':
        is_stressed = any(has_accent(c) for c in syllable)
    elif stress_type == 'penultimate':
        is_stressed = (syl_index == total_syls - 2)
    elif stress_type == 'final':
        is_stressed = (syl_index == total_syls - 1)

    result = ''
    i = 0

    while i < len(syl):
        # Check for diphthongs FIRST (atomic units)
        found_diphthong = False

        # EU diphthong → ÊH-oo (first part capitalized, second part stays lowercase)
        if syl[i:i+2] == 'eu':
            result += 'êh-<oo>'
            i += 2
            found_diphthong = True

        # OU diphthong → ÔH (closed O, single sound)
        elif syl[i:i+2] == 'ou':
            result += 'ôh'
            i += 2
            found_diphthong = True

        # EI diphthong → ÊH (closed E, single sound)
        elif syl[i:i+2] == 'ei':
            result += 'êh'
            i += 2
            found_diphthong = True

        # AI diphthong → AH-ee (first part capitalized, second part stays lowercase)
        elif syl[i:i+2] == 'ai':
            result += 'ah-<ee>'
            i += 2
            found_diphthong = True

        # OI diphthong → OH-ee (first part capitalized, second part stays lowercase)
        elif syl[i:i+2] == 'oi':
            result += 'oh-<ee>'
            i += 2
            found_diphthong = True

        # AU diphthong → AH-oo (first part capitalized, second part stays lowercase)
        elif syl[i:i+2] == 'au':
            result += 'ah-<oo>'
            i += 2
            found_diphthong = True

        # ÃO nasal diphthong → ÃH-oo (nasal, first part capitalized, second lowercase)
        elif syl[i:i+2] == 'ão':
            result += 'ãh-<oo>'
            i += 2
            found_diphthong = True

        # ÃE nasal diphthong → ÃH-ee (nasal, first part capitalized, second lowercase)
        elif syl[i:i+2] == 'ãe':
            result += 'ãh-<ee>'
            i += 2
            found_diphthong = True

        # ÕE nasal diphthong → ÕH-ee (nasal, first part capitalized, second lowercase)
        elif syl[i:i+2] == 'õe':
            result += 'õh-<ee>'
            i += 2
            found_diphthong = True

        if found_diphthong:
            continue

        # Not a diphthong - process character by character
        char = syl[i]

        # Palatalization: d/t + e/i → j/ch + ee (only when e/i is NOT part of a diphthong)
        if char == 'd':
            if i + 1 < len(syl) and syl[i+1] in 'ei':
                # Check if e/i is part of a diphthong (ei, eu, etc.)
                is_diphthong = False
                if i + 2 < len(syl):
                    if syl[i+1:i+3] in ['ei', 'eu']:
                        is_diphthong = True

                # Only palatalize if NOT a diphthong, and e/i is final or before vowel
                if not is_diphthong and (i + 2 >= len(syl) or syl[i+2] in 'aeiouãõáéíóúâêô'):
                    result += 'jee'
                    i += 2
                    continue
            result += 'd'
        elif char == 't':
            if i + 1 < len(syl) and syl[i+1] in 'ei':
                # Check if e/i is part of a diphthong (ei, eu, etc.)
                is_diphthong = False
                if i + 2 < len(syl):
                    if syl[i+1:i+3] in ['ei', 'eu']:
                        is_diphthong = True

                # Only palatalize if NOT a diphthong, and e/i is final or before vowel
                if not is_diphthong and (i + 2 >= len(syl) or syl[i+2] in 'aeiouãõáéíóúâêô'):
                    result += 'chee'
                    i += 2
                    continue
            result += 't'

        # Other consonants
        elif char == 'b':
            result += 'b'
        elif char == 'ç':
            # Ç (cedilha) always sounds like S
            result += 's'
        elif char == 'c':
            # Check for CH digraph first
            if i + 1 < len(syl) and syl[i+1] == 'h':
                result += 'sh'
                i += 1  # Skip the H
            elif i + 1 < len(syl) and syl[i+1] in 'ei':
                result += 's'
            else:
                result += 'k'
        elif char == 'f':
            result += 'f'
        elif char == 'g':
            if i + 1 < len(syl) and syl[i+1] in 'ei':
                result += 'j'
            else:
                result += 'g'
        elif char == 'h':
            pass  # Silent
        elif char == 'j':
            result += 'zh'
        elif char == 'k':
            result += 'k'
        elif char == 'l':
            # L handling: word-final L vocalizes, syllable-final L stays
            if i == len(syl) - 1:
                # Syllable-final L
                if syl_index == total_syls - 1:
                    # Word-final L → vocalization to /w/ glide
                    # Special case: after U, don't add -oo (U already represents that sound)
                    if i > 0 and syl[i-1] in 'uúũ':
                        # After U: L vocalizes but merges with U sound
                        pass  # Don't add anything, U already covers it
                    else:
                        # After other vowels: add -oo for vocalization
                        # Use special marker <> to keep this lowercase even in stressed syllables
                        result += '-<oo>'
                else:
                    # Syllable-final but not word-final → keep as l
                    result += 'l'
            else:
                result += 'l'
        elif char == 'm':
            result += 'm'
        elif char == 'n':
            result += 'n'
        elif char == 'p':
            result += 'p'
        elif char == 'q':
            if i + 1 < len(syl) and syl[i+1] == 'u':
                result += 'k'
                i += 1
            else:
                result += 'k'
        elif char == 'r':
            # Strong R only at word-initial position
            # All other positions (including syllable-initial after first syllable) = flap r
            if i == 0 and syl_index == 0:
                # Word-initial R = strong R
                result += 'H'
            else:
                # All other positions = flap r
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
        elif char == 'v':
            result += 'v'
        elif char == 'w':
            result += 'w'
        elif char == 'x':
            result += 'sh'
        elif char == 'z':
            result += 'z'

        # Vowels (not in diphthongs)
        elif char in 'aáàã':
            # Check if followed by m/n in same syllable (nasalization)
            if i + 1 < len(syl) and syl[i+1] in 'mn':
                result += 'ãh'
            else:
                result += 'ah'
        elif char in 'eéêè':
            # Check if followed by m/n in same syllable (nasalization)
            if i + 1 < len(syl) and syl[i+1] in 'mn':
                # Nasal E → ẽ (we'll use ê with tilde for simplicity)
                result += 'ẽ'
            else:
                # Apply E quality rules
                quality = determine_e_quality(word, syllable, syl_index, is_stressed)
                if char == 'é' or quality == 'é':
                    result += 'É'
                else:  # ê or default
                    result += 'Ê'
        elif char in 'iíĩ':
            # Check if followed by m/n in same syllable (nasalization)
            if i + 1 < len(syl) and syl[i+1] in 'mn':
                result += 'ĩ'
            else:
                result += 'ee'
        elif char in 'oóôõ':
            # Apply O quality rules
            is_final = (i == len(syl) - 1) and (syl_index == total_syls - 1)

            if is_final and char == 'o':
                # Final unstressed -o → oo (closed, no quality marker needed)
                result += 'oo'
            else:
                # Check if followed by m/n in same syllable (nasalization)
                if i + 1 < len(syl) and syl[i+1] in 'mn':
                    result += 'õh'
                else:
                    # Determine quality: ó (open) vs ô (closed)
                    quality = determine_o_quality(word, syllable, syl_index, is_stressed)
                    if char == 'ó' or quality == 'ó':
                        result += 'Ó'
                    else:  # ô or default
                        result += 'Ô'
        elif char in 'uúũ':
            # Check if U is silent (after g/q before e/i)
            if char == 'u' and i > 0 and syl[i-1] in 'gq':
                if i + 1 < len(syl) and syl[i+1] in 'eiéêíî':
                    # Silent U in GU/QU digraph - skip
                    i += 1
                    continue
            # Check if followed by m/n in same syllable (nasalization)
            if i + 1 < len(syl) and syl[i+1] in 'mn':
                result += 'ũ'
            else:
                result += 'oo'

        i += 1

    # Mark final consonants (coda) to stay lowercase even in stressed syllables
    # Scan backwards and wrap trailing consonants that come AFTER any existing markers
    vowel_chars = 'aeiouãõáéíóúâêôÁÉÍÓÚÂÊÔÃÕẽĩũẼĨŨ'
    i = len(result) - 1
    coda_start = -1

    # Scan backwards from end, skipping consonants
    while i >= 0 and result[i] not in vowel_chars and result[i] not in '<>-':
        i -= 1

    # If we ended on a consonant (not vowel, not marker), we have a coda
    if i >= 0 and i < len(result) - 1 and result[i] in vowel_chars:
        # Consonants are everything after this vowel
        coda_start = i + 1
        coda = result[coda_start:]
        # Only wrap if there's actual content and no existing markers
        if coda and not any(c in coda for c in '<>'):
            result = result[:coda_start] + '<' + coda + '>'
    elif i >= 0 and result[i] == '>':
        # We have a marker, check if there are consonants after it
        marker_end = i + 1
        if marker_end < len(result):
            coda = result[marker_end:]
            if coda:
                result = result[:marker_end] + '<' + coda + '>'

    # Apply stress (CAPITALS for entire stressed syllable)
    if is_stressed:
        # Capitalize entire syllable, preserving É/Ê and Ó/Ô that were already set
        # Also preserve content inside <...> markers as lowercase
        # Don't use .upper() as it loses the vowel quality distinctions
        result_new = ''
        i = 0
        while i < len(result):
            char = result[i]

            # Check for special marker <...>
            if char == '<':
                # Find closing >
                close_idx = result.find('>', i)
                if close_idx != -1:
                    # Keep content inside <> as lowercase, remove markers
                    result_new += result[i+1:close_idx]
                    i = close_idx + 1
                    continue

            if char in 'ÉÊ':
                # Already capitalized E with quality - keep as is
                result_new += char
            elif char in 'éê':
                # Lowercase E with quality - capitalize
                result_new += char.upper()
            elif char in 'ÓÔ':
                # Already capitalized O with quality - keep as is
                result_new += char
            elif char in 'óô':
                # Lowercase O with quality - capitalize
                result_new += char.upper()
            elif char in 'ÃÕ':
                # Already capitalized nasal vowels - keep as is
                result_new += char
            elif char == 'ã':
                # Lowercase nasal A - capitalize
                result_new += 'Ã'
            elif char == 'õ':
                # Lowercase nasal O - capitalize
                result_new += 'Õ'
            elif char == 'ẽ':
                # Lowercase nasal E - capitalize
                result_new += 'Ẽ'
            elif char == 'Ẽ':
                # Already capitalized nasal E - keep as is
                result_new += char
            elif char == 'ĩ':
                # Lowercase nasal I - capitalize
                result_new += 'Ĩ'
            elif char == 'Ĩ':
                # Already capitalized nasal I - keep as is
                result_new += char
            elif char == 'ũ':
                # Lowercase nasal U - capitalize
                result_new += 'Ũ'
            elif char == 'Ũ':
                # Already capitalized nasal U - keep as is
                result_new += char
            else:
                # All other characters - capitalize
                result_new += char.upper()

            i += 1
        result = result_new
    else:
        # Lowercase and remove markers
        result_new = ''
        i = 0
        while i < len(result):
            char = result[i]

            # Check for special marker <...>
            if char == '<':
                # Find closing >
                close_idx = result.find('>', i)
                if close_idx != -1:
                    # Keep content inside <> as lowercase, remove markers
                    result_new += result[i+1:close_idx]
                    i = close_idx + 1
                    continue

            result_new += char.lower()
            i += 1
        result = result_new

    return result


def portuguese_to_phonetic(word):
    """
    Convert Portuguese word to dictionary-style phonetic transcription.

    100% algorithmic - no dictionary lookup needed.

    Args:
        word: Portuguese word

    Returns:
        str: Dictionary-style phonetic (e.g., "brah-zee-LÉI-roo")
    """
    # 1. Syllabify
    syllables = syllabify(word)

    # 2. Find stress
    stress_info = find_stress_position(word)

    # 3. Convert each syllable
    phonetic_syllables = []
    for i, syl in enumerate(syllables):
        phon = syllable_to_phonetic(word, syl, i, len(syllables), stress_info, syllables)
        phonetic_syllables.append(phon)

    # 4. Join with hyphens
    result = '-'.join(phonetic_syllables)

    return result


# Test function
if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    test_words = [
        'eu',
        'sou',
        'brasileiro',
        'de',
        'daniel',
        'inglês',
        'português',
        'contente',
        'gato',
        'casa',
    ]

    print('100% ALGORITHMIC PHONETIC CONVERSION\n')
    print('=' * 60)
    for word in test_words:
        try:
            phonetic = portuguese_to_phonetic(word)
            print(f'{word:15} → {phonetic}')
        except Exception as e:
            print(f'{word:15} → ERROR: {e}')
