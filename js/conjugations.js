/**
 * Conjugations Module
 * Handles all verb conjugation logic for Portuguese drills
 */

// Check if conjugation buttons should be shown for current drill
function shouldShowConjugationButtons(content, activeDrills) {
  // List of verb drills that support conjugation buttons
  const verbDrills = ['regular-ar', 'regular-er', 'regular-ir', 'irregular-verbs'];

  // Check if any verb drill is active
  const hasVerbDrill = verbDrills.some(drill => activeDrills.includes(drill));
  if (!hasVerbDrill) {
    return false;
  }

  // Check if message contains a blank and a verb in parentheses
  return content.includes('______') && /\(([a-záàâãéêíóôõúç]+(?:ar|er|ir))\)/i.test(content);
}

// Extract verb infinitive from message
function extractVerbFromMessage(content) {
  // Extract verb from pattern: ______ (falar/comer/abrir)
  const match = content.match(/\(([a-záàâãéêíóôõúç]+(?:ar|er|ir))\)/i);
  return match ? match[1].toLowerCase() : null;
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

// Get all conjugations for a verb (present + past, all unique forms)
function getAllConjugations(infinitive) {
  let present, past;

  // Check if it's an irregular verb first
  if (irregularVerbs[infinitive]) {
    present = irregularVerbs[infinitive].present;
    past = irregularVerbs[infinitive].past;
  } else {
    // Regular verb - determine type and conjugate
    const verbType = getVerbType(infinitive);

    if (verbType === 'ar') {
      present = conjugateArVerb(infinitive, 'present');
      past = conjugateArVerb(infinitive, 'past');
    } else if (verbType === 'er') {
      present = conjugateErVerb(infinitive, 'present');
      past = conjugateErVerb(infinitive, 'past');
    } else if (verbType === 'ir') {
      present = conjugateIrVerb(infinitive, 'present');
      past = conjugateIrVerb(infinitive, 'past');
    } else {
      return [];
    }
  }

  // Combine all unique forms
  const allForms = new Set();
  if (present) Object.values(present).forEach(form => allForms.add(form));
  if (past) Object.values(past).forEach(form => allForms.add(form));

  return Array.from(allForms);
}

// Add conjugation buttons to message container
function addConjugationButtons(messagesContainer, content) {
  const verb = extractVerbFromMessage(content);
  if (!verb) return;

  const conjugations = getAllConjugations(verb);
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

// Send conjugation answer
function sendConjugation(conjugation) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = conjugation;
  sendChatMessage();
}
