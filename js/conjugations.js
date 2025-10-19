/**
 * Conjugations Module
 * Handles all verb conjugation logic for Portuguese drills
 */

// Check if conjugation buttons should be shown for current drill
function shouldShowConjugationButtons(content, activeDrills) {
  // List of verb drills that support conjugation buttons
  const verbDrills = [
    'regular-ar', 'regular-er', 'regular-ir',
    'irregular-verbs', 'ser-estar', 'reflexive-verbs',
    'imperfect-tense', 'future-tense', 'conditional-tense',
    'present-subjunctive', 'imperfect-subjunctive', 'future-subjunctive',
    'imperative'
  ];

  // Check if any verb drill is active
  const hasVerbDrill = verbDrills.some(drill => activeDrills.includes(drill));

  console.log('🔍 shouldShowConjugationButtons DEBUG:');
  console.log('  activeDrills:', activeDrills);
  console.log('  hasVerbDrill:', hasVerbDrill);
  console.log('  content:', content);

  if (!hasVerbDrill) {
    return false;
  }

  // Check if message contains a blank and a verb in parentheses
  // Support multiple blank formats: ______, ___, [blank], etc.
  const hasBlank = content.includes('______') || content.includes('___') || /\[blank\]/i.test(content) || /_+/.test(content);
  // Match verbs ending in -ar, -er, -ir, with optional reflexive pronouns (-se, -me, -te, -nos)
  const hasVerb = /\(([a-záàâãéêíóôõúç]+(?:ar|er|ir)(?:-(?:se|me|te|nos))?)\)/i.test(content);

  console.log('  hasBlank:', hasBlank);
  console.log('  hasVerb:', hasVerb);
  console.log('  result:', hasBlank && hasVerb);

  return hasBlank && hasVerb;
}

// Extract verb infinitive from message
function extractVerbFromMessage(content) {
  // Extract verb from pattern: ______ (falar/comer/abrir) or (sentar-se)
  // Look for the LAST occurrence to avoid matching English words like "(singular)" that end in -ar
  // Match verbs with optional reflexive pronouns (-se, -me, -te, -nos)
  const matches = content.matchAll(/\(([a-záàâãéêíóôõúç]+(?:ar|er|ir)(?:-(?:se|me|te|nos))?)\)/gi);
  const allMatches = Array.from(matches);

  // Return the last match (the Portuguese verb, not English clarifiers)
  if (allMatches.length > 0) {
    const lastMatch = allMatches[allMatches.length - 1];
    let verb = lastMatch[1].toLowerCase();

    // Strip reflexive pronoun to get the base verb for conjugation
    verb = verb.replace(/-(?:se|me|te|nos)$/, '');

    return verb;
  }

  return null;
}

// Determine verb type by ending
function getVerbType(infinitive) {
  if (infinitive.endsWith('ar')) return 'ar';
  if (infinitive.endsWith('er')) return 'er';
  if (infinitive.endsWith('ir')) return 'ir';
  return null;
}

// Conjugate regular -ar verbs
function conjugateArVerb(infinitive, tense) {
  // Get the stem by removing -ar
  const stem = infinitive.slice(0, -2);

  if (tense === 'present') {
    return {
      'eu': stem + 'o',
      'ele/ela/você': stem + 'a',
      'a gente': stem + 'a',
      'nós': stem + 'amos',
      'eles/elas/vocês': stem + 'am'
    };
  } else if (tense === 'past') {
    // Handle orthographic changes for -car, -gar, -çar verbs
    let euStem = stem;
    if (stem.endsWith('c')) {
      euStem = stem.slice(0, -1) + 'qu';
    } else if (stem.endsWith('g')) {
      euStem = stem.slice(0, -1) + 'gu';
    } else if (stem.endsWith('ç')) {
      euStem = stem.slice(0, -1) + 'c';
    }

    return {
      'eu': euStem + 'ei',
      'ele/ela/você': stem + 'ou',
      'a gente': stem + 'ou',
      'nós': stem + 'amos',
      'eles/elas/vocês': stem + 'aram'
    };
  } else if (tense === 'imperfect') {
    return {
      'eu': stem + 'ava',
      'ele/ela/você': stem + 'ava',
      'a gente': stem + 'ava',
      'nós': stem + 'ávamos',
      'eles/elas/vocês': stem + 'avam'
    };
  } else if (tense === 'future') {
    return {
      'eu': infinitive + 'ei',
      'ele/ela/você': infinitive + 'á',
      'a gente': infinitive + 'á',
      'nós': infinitive + 'emos',
      'eles/elas/vocês': infinitive + 'ão'
    };
  } else if (tense === 'conditional') {
    return {
      'eu': infinitive + 'ia',
      'ele/ela/você': infinitive + 'ia',
      'a gente': infinitive + 'ia',
      'nós': infinitive + 'íamos',
      'eles/elas/vocês': infinitive + 'iam'
    };
  } else if (tense === 'present-subjunctive') {
    return {
      'eu': stem + 'e',
      'ele/ela/você': stem + 'e',
      'a gente': stem + 'e',
      'nós': stem + 'emos',
      'eles/elas/vocês': stem + 'em'
    };
  } else if (tense === 'imperfect-subjunctive') {
    return {
      'eu': stem + 'asse',
      'ele/ela/você': stem + 'asse',
      'a gente': stem + 'asse',
      'nós': stem + 'ássemos',
      'eles/elas/vocês': stem + 'assem'
    };
  } else if (tense === 'future-subjunctive') {
    return {
      'eu': stem + 'ar',
      'ele/ela/você': stem + 'ar',
      'a gente': stem + 'ar',
      'nós': stem + 'armos',
      'eles/elas/vocês': stem + 'arem'
    };
  }
}

// Conjugate regular -er verbs
function conjugateErVerb(infinitive, tense) {
  // Get the stem by removing -er
  const stem = infinitive.slice(0, -2);

  if (tense === 'present') {
    return {
      'eu': stem + 'o',
      'ele/ela/você': stem + 'e',
      'a gente': stem + 'e',
      'nós': stem + 'emos',
      'eles/elas/vocês': stem + 'em'
    };
  } else if (tense === 'past') {
    return {
      'eu': stem + 'i',
      'ele/ela/você': stem + 'eu',
      'a gente': stem + 'eu',
      'nós': stem + 'emos',
      'eles/elas/vocês': stem + 'eram'
    };
  } else if (tense === 'imperfect') {
    return {
      'eu': stem + 'ia',
      'ele/ela/você': stem + 'ia',
      'a gente': stem + 'ia',
      'nós': stem + 'íamos',
      'eles/elas/vocês': stem + 'iam'
    };
  } else if (tense === 'future') {
    return {
      'eu': infinitive + 'ei',
      'ele/ela/você': infinitive + 'á',
      'a gente': infinitive + 'á',
      'nós': infinitive + 'emos',
      'eles/elas/vocês': infinitive + 'ão'
    };
  } else if (tense === 'conditional') {
    return {
      'eu': infinitive + 'ia',
      'ele/ela/você': infinitive + 'ia',
      'a gente': infinitive + 'ia',
      'nós': infinitive + 'íamos',
      'eles/elas/vocês': infinitive + 'iam'
    };
  } else if (tense === 'present-subjunctive') {
    return {
      'eu': stem + 'a',
      'ele/ela/você': stem + 'a',
      'a gente': stem + 'a',
      'nós': stem + 'amos',
      'eles/elas/vocês': stem + 'am'
    };
  } else if (tense === 'imperfect-subjunctive') {
    return {
      'eu': stem + 'esse',
      'ele/ela/você': stem + 'esse',
      'a gente': stem + 'esse',
      'nós': stem + 'êssemos',
      'eles/elas/vocês': stem + 'essem'
    };
  } else if (tense === 'future-subjunctive') {
    return {
      'eu': stem + 'er',
      'ele/ela/você': stem + 'er',
      'a gente': stem + 'er',
      'nós': stem + 'ermos',
      'eles/elas/vocês': stem + 'erem'
    };
  }
}

// Conjugate regular -ir verbs
function conjugateIrVerb(infinitive, tense) {
  // Get the stem by removing -ir
  const stem = infinitive.slice(0, -2);

  if (tense === 'present') {
    return {
      'eu': stem + 'o',
      'ele/ela/você': stem + 'e',
      'a gente': stem + 'e',
      'nós': stem + 'imos',
      'eles/elas/vocês': stem + 'em'
    };
  } else if (tense === 'past') {
    return {
      'eu': stem + 'i',
      'ele/ela/você': stem + 'iu',
      'a gente': stem + 'iu',
      'nós': stem + 'imos',
      'eles/elas/vocês': stem + 'iram'
    };
  } else if (tense === 'imperfect') {
    return {
      'eu': stem + 'ia',
      'ele/ela/você': stem + 'ia',
      'a gente': stem + 'ia',
      'nós': stem + 'íamos',
      'eles/elas/vocês': stem + 'iam'
    };
  } else if (tense === 'future') {
    return {
      'eu': infinitive + 'ei',
      'ele/ela/você': infinitive + 'á',
      'a gente': infinitive + 'á',
      'nós': infinitive + 'emos',
      'eles/elas/vocês': infinitive + 'ão'
    };
  } else if (tense === 'conditional') {
    return {
      'eu': infinitive + 'ia',
      'ele/ela/você': infinitive + 'ia',
      'a gente': infinitive + 'ia',
      'nós': infinitive + 'íamos',
      'eles/elas/vocês': infinitive + 'iam'
    };
  } else if (tense === 'present-subjunctive') {
    return {
      'eu': stem + 'a',
      'ele/ela/você': stem + 'a',
      'a gente': stem + 'a',
      'nós': stem + 'amos',
      'eles/elas/vocês': stem + 'am'
    };
  } else if (tense === 'imperfect-subjunctive') {
    return {
      'eu': stem + 'isse',
      'ele/ela/você': stem + 'isse',
      'a gente': stem + 'isse',
      'nós': stem + 'íssemos',
      'eles/elas/vocês': stem + 'issem'
    };
  } else if (tense === 'future-subjunctive') {
    return {
      'eu': stem + 'ir',
      'ele/ela/você': stem + 'ir',
      'a gente': stem + 'ir',
      'nós': stem + 'irmos',
      'eles/elas/vocês': stem + 'irem'
    };
  }
}

// Irregular verb conjugations (14 essential verbs)
const irregularVerbs = {
  'ser': {
    present: { 'eu': 'sou', 'ele/ela/você': 'é', 'a gente': 'é', 'nós': 'somos', 'eles/elas/vocês': 'são' },
    past: { 'eu': 'fui', 'ele/ela/você': 'foi', 'a gente': 'foi', 'nós': 'fomos', 'eles/elas/vocês': 'foram' }
  },
  'estar': {
    present: { 'eu': 'estou', 'ele/ela/você': 'está', 'a gente': 'está', 'nós': 'estamos', 'eles/elas/vocês': 'estão' },
    past: { 'eu': 'estive', 'ele/ela/você': 'esteve', 'a gente': 'esteve', 'nós': 'estivemos', 'eles/elas/vocês': 'estiveram' }
  },
  'ir': {
    present: { 'eu': 'vou', 'ele/ela/você': 'vai', 'a gente': 'vai', 'nós': 'vamos', 'eles/elas/vocês': 'vão' },
    past: { 'eu': 'fui', 'ele/ela/você': 'foi', 'a gente': 'foi', 'nós': 'fomos', 'eles/elas/vocês': 'foram' }
  },
  'ter': {
    present: { 'eu': 'tenho', 'ele/ela/você': 'tem', 'a gente': 'tem', 'nós': 'temos', 'eles/elas/vocês': 'têm' },
    past: { 'eu': 'tive', 'ele/ela/você': 'teve', 'a gente': 'teve', 'nós': 'tivemos', 'eles/elas/vocês': 'tiveram' }
  },
  'fazer': {
    present: { 'eu': 'faço', 'ele/ela/você': 'faz', 'a gente': 'faz', 'nós': 'fazemos', 'eles/elas/vocês': 'fazem' },
    past: { 'eu': 'fiz', 'ele/ela/você': 'fez', 'a gente': 'fez', 'nós': 'fizemos', 'eles/elas/vocês': 'fizeram' }
  },
  'dizer': {
    present: { 'eu': 'digo', 'ele/ela/você': 'diz', 'a gente': 'diz', 'nós': 'dizemos', 'eles/elas/vocês': 'dizem' },
    past: { 'eu': 'disse', 'ele/ela/você': 'disse', 'a gente': 'disse', 'nós': 'dissemos', 'eles/elas/vocês': 'disseram' }
  },
  'poder': {
    present: { 'eu': 'posso', 'ele/ela/você': 'pode', 'a gente': 'pode', 'nós': 'podemos', 'eles/elas/vocês': 'podem' },
    past: { 'eu': 'pude', 'ele/ela/você': 'pôde', 'a gente': 'pôde', 'nós': 'pudemos', 'eles/elas/vocês': 'puderam' }
  },
  'pôr': {
    present: { 'eu': 'ponho', 'ele/ela/você': 'põe', 'a gente': 'põe', 'nós': 'pomos', 'eles/elas/vocês': 'põem' },
    past: { 'eu': 'pus', 'ele/ela/você': 'pôs', 'a gente': 'pôs', 'nós': 'pusemos', 'eles/elas/vocês': 'puseram' }
  },
  'querer': {
    present: { 'eu': 'quero', 'ele/ela/você': 'quer', 'a gente': 'quer', 'nós': 'queremos', 'eles/elas/vocês': 'querem' },
    past: { 'eu': 'quis', 'ele/ela/você': 'quis', 'a gente': 'quis', 'nós': 'quisemos', 'eles/elas/vocês': 'quiseram' }
  },
  'saber': {
    present: { 'eu': 'sei', 'ele/ela/você': 'sabe', 'a gente': 'sabe', 'nós': 'sabemos', 'eles/elas/vocês': 'sabem' },
    past: { 'eu': 'soube', 'ele/ela/você': 'soube', 'a gente': 'soube', 'nós': 'soubemos', 'eles/elas/vocês': 'souberam' }
  },
  'ver': {
    present: { 'eu': 'vejo', 'ele/ela/você': 'vê', 'a gente': 'vê', 'nós': 'vemos', 'eles/elas/vocês': 'veem' },
    past: { 'eu': 'vi', 'ele/ela/você': 'viu', 'a gente': 'viu', 'nós': 'vimos', 'eles/elas/vocês': 'viram' }
  },
  'dar': {
    present: { 'eu': 'dou', 'ele/ela/você': 'dá', 'a gente': 'dá', 'nós': 'damos', 'eles/elas/vocês': 'dão' },
    past: { 'eu': 'dei', 'ele/ela/você': 'deu', 'a gente': 'deu', 'nós': 'demos', 'eles/elas/vocês': 'deram' }
  },
  'trazer': {
    present: { 'eu': 'trago', 'ele/ela/você': 'traz', 'a gente': 'traz', 'nós': 'trazemos', 'eles/elas/vocês': 'trazem' },
    past: { 'eu': 'trouxe', 'ele/ela/você': 'trouxe', 'a gente': 'trouxe', 'nós': 'trouxemos', 'eles/elas/vocês': 'trouxeram' }
  },
  'vir': {
    present: { 'eu': 'venho', 'ele/ela/você': 'vem', 'a gente': 'vem', 'nós': 'vimos', 'eles/elas/vocês': 'vêm' },
    past: { 'eu': 'vim', 'ele/ela/você': 'veio', 'a gente': 'veio', 'nós': 'viemos', 'eles/elas/vocês': 'vieram' }
  }
};

// Get all conjugations for a verb based on active drills
function getAllConjugations(infinitive, activeDrills = []) {
  const allForms = new Set();
  const verbType = getVerbType(infinitive);

  // Determine which tenses to include based on active drills
  const tenses = [];

  // Map drills to their respective tenses
  const drillToTense = {
    'imperfect-tense': 'imperfect',
    'future-tense': 'future',
    'conditional-tense': 'conditional',
    'present-subjunctive': 'present-subjunctive',
    'imperfect-subjunctive': 'imperfect-subjunctive',
    'future-subjunctive': 'future-subjunctive'
  };

  // Check if specific tense drill is active
  let hasSpecificTense = false;
  for (const drill of activeDrills) {
    if (drillToTense[drill]) {
      tenses.push(drillToTense[drill]);
      hasSpecificTense = true;
    }
  }

  // If no specific tense drill, or if present/past drills are active, include present and past
  if (!hasSpecificTense ||
      activeDrills.some(d => ['regular-ar', 'regular-er', 'regular-ir', 'irregular-verbs', 'ser-estar', 'reflexive-verbs'].includes(d))) {
    tenses.push('present', 'past');
  }

  // Get conjugations for each tense
  for (const tense of tenses) {
    let conjugation;

    // Check if it's an irregular verb (only for present/past)
    if ((tense === 'present' || tense === 'past') && irregularVerbs[infinitive]) {
      conjugation = irregularVerbs[infinitive][tense];
    } else {
      // Regular verb - conjugate based on type
      if (verbType === 'ar') {
        conjugation = conjugateArVerb(infinitive, tense);
      } else if (verbType === 'er') {
        conjugation = conjugateErVerb(infinitive, tense);
      } else if (verbType === 'ir') {
        conjugation = conjugateIrVerb(infinitive, tense);
      }
    }

    // Add all unique forms
    if (conjugation) {
      Object.values(conjugation).forEach(form => allForms.add(form));
    }
  }

  return Array.from(allForms);
}

// Add conjugation buttons to message container
function addConjugationButtons(messagesContainer, content, activeDrills = []) {
  // Check if this is a reflexive verbs drill (asking for pronouns, not verbs)
  if (activeDrills.includes('reflexive-verbs')) {
    addReflexivePronounButtons(messagesContainer, content);
    return;
  }

  const verb = extractVerbFromMessage(content);
  if (!verb) return;

  const conjugations = getAllConjugations(verb, activeDrills);
  const shuffled = shuffleArray(conjugations);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="flex flex-wrap gap-2 max-w-2xl">
      ${shuffled.map(conj => `
        <button
          onclick="sendConjugation('${conj.replace(/'/g, "\\'")}')"
          class="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded-full text-sm transition-colors"
        >
          ${escapeHtml(conj)}
        </button>
      `).join('')}
    </div>
  `;

  messagesContainer.appendChild(buttonContainer);
}

// Add reflexive pronoun buttons for reflexive verbs drill
function addReflexivePronounButtons(messagesContainer, content) {
  // Reflexive pronouns in Portuguese
  const pronouns = ['me', 'te', 'se', 'nos'];
  const shuffled = shuffleArray(pronouns);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="flex flex-wrap gap-2 max-w-2xl">
      ${shuffled.map(pronoun => `
        <button
          onclick="sendConjugation('${pronoun}')"
          class="bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium px-4 py-2 rounded-full text-sm transition-colors"
        >
          ${escapeHtml(pronoun)}
        </button>
      `).join('')}
    </div>
  `;

  messagesContainer.appendChild(buttonContainer);
}

// Send conjugation answer
function sendConjugation(conjugation) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = conjugation;
  sendChatMessage();
}
