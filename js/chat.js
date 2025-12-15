// Chat functionality
let currentChatSession = null;
let currentDrillId = null;
let activeDrills = []; // Array of drill IDs active in current session
let drillSessions = {}; // Store separate sessions for each drill type

// Function to reset all sessions - for debugging
function resetAllSessions() {
  console.log('Resetting all sessions');
  drillSessions = {};
  currentChatSession = null;
  currentDrillId = null;
  activeDrills = [];
}

// Function to start a new session for the current drill
async function startNewSession() {
  if (!currentDrillId) return;

  console.log('Starting new session for drill:', currentDrillId);
  console.log('Before clearing - drillSessions:', drillSessions);

  // Clear the current drill's session completely
  delete drillSessions[currentDrillId];
  currentChatSession = null;
  activeDrills = []; // Clear active drills array

  console.log('After clearing - drillSessions:', drillSessions);

  // Clear the UI immediately
  const messagesContainer = document.getElementById('chat-messages');
  messagesContainer.innerHTML = '<div class="flex items-start space-x-3"><div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-green-600 text-sm font-bold">AI</span></div><div class="bg-slate-100 rounded-2xl p-3 max-w-2xl"><div id="loading-message" class="text-slate-600">Starting fresh session...</div></div></div>';

  // Start completely new session
  setTimeout(() => {
    openDrillChat(currentDrillId);
  }, 500);
}

// A1 Simplifier Functions
function toggleSimplifier() {
  const content = document.getElementById('simplifier-content');
  const chevron = document.getElementById('simplifier-chevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    chevron.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    chevron.classList.remove('rotate-180');
  }
}

async function simplifyText() {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');
  const simplifyBtn = document.getElementById('simplify-btn');
  const copyBtn = document.getElementById('copy-btn');

  const inputText = input.value.trim();

  if (!inputText) {
    output.innerHTML = '<div class="text-red-600 p-4">Please enter some text to simplify.</div>';
    return;
  }

  // Get selected level
  const selectedLevel = document.querySelector('input[name="simplifier-level"]:checked').value;
  const levelUpper = selectedLevel.toUpperCase();
  const drillId = `${selectedLevel}-simplifier`;

  // Disable button and show loading
  simplifyBtn.disabled = true;
  const originalButtonText = simplifyBtn.textContent;
  simplifyBtn.textContent = 'Simplifying...';
  copyBtn.classList.add('hidden');

  output.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div><p class="text-slate-600">Simplifying text to ${levelUpper} level...</p></div></div>`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: null,
        drillId: drillId,
        message: inputText,
        isNewSession: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Display the simplified text with clickable sentences
    output.innerHTML = formatSimplifiedTextWithSentences(data.response);

    // Show copy, speak, clear buttons, and hint
    copyBtn.classList.remove('hidden');
    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) speakBtn.classList.remove('hidden');
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.classList.remove('hidden');
    const audioHint = document.getElementById('audio-hint');
    if (audioHint) audioHint.classList.remove('hidden');

  } catch (error) {
    console.error('Error simplifying text:', error);

    let errorMessage = 'Connection error. ';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. ';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Check your connection. ';
    } else if (error.message.includes('Server error')) {
      errorMessage = error.message + ' ';
    }

    output.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-red-800 text-sm mb-3">${errorMessage}</p><button onclick="simplifyText()" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">Retry</button></div>`;

  } finally {
    simplifyBtn.disabled = false;
    simplifyBtn.textContent = originalButtonText;
  }
}

function updateSimplifierLabels() {
  const selectedLevel = document.querySelector('input[name="simplifier-level"]:checked').value;
  const levelUpper = selectedLevel.toUpperCase();

  // Update button text
  const simplifyBtn = document.getElementById('simplify-btn');
  simplifyBtn.textContent = `Simplify to ${levelUpper}`;

  // Update output label
  const outputLabel = document.getElementById('simplifier-output-label');
  outputLabel.textContent = `Simplified ${levelUpper}-Level Portuguese`;

  // Update feature info box
  const featuresBox = document.getElementById('simplifier-features');
  if (selectedLevel === 'a1') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">A1 Features:</div>
        <div>✓ Present tense (presente)</div>
        <div>✓ Simple past (pretérito perfeito)</div>
        <div>✓ Immediate future (ir + infinitive)</div>
        <div>✓ Basic vocabulary only</div>
        <div>✓ Short, clear sentences (max 10-12 words)</div>
      </div>
    `;
  } else if (selectedLevel === 'a2') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">A2 Features:</div>
        <div>✓ Past tenses (Perfeito & Imperfeito)</div>
        <div>✓ Present Continuous (estar + gerúndio)</div>
        <div>✓ Immediate future (ir + infinitive)</div>
        <div>✓ Expanded vocabulary & cognates</div>
        <div>✓ Longer sentences (up to 15-20 words)</div>
        <div>✓ Relative clauses with 'que'</div>
      </div>
    `;
  } else if (selectedLevel === 'b1') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">B1 Features:</div>
        <div>✓ Future tense (simple future)</div>
        <div>✓ Conditional tense</div>
        <div>✓ Present subjunctive (basic use)</div>
        <div>✓ Passive voice constructions</div>
        <div>✓ More complex sentence structures</div>
        <div>✓ Expanded vocabulary</div>
      </div>
    `;
  } else if (selectedLevel === 'b2') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">B2 Features:</div>
        <div>✓ All verb tenses including subjunctive</div>
        <div>✓ Compound tenses (perfect, pluperfect)</div>
        <div>✓ Sophisticated vocabulary</div>
        <div>✓ Complex sentence structures</div>
        <div>✓ Idiomatic expressions</div>
        <div>✓ Passive voice</div>
      </div>
    `;
  }
}

function openSimplifierPage(event, level) {
  event.preventDefault();
  event.stopPropagation();

  const url = `/simplifier.html?level=${level}`;
  window.open(url, '_blank');
}

function copySimplifiedText() {
  const output = document.getElementById('simplifier-output');
  const textContent = output.textContent.trim();

  if (textContent) {
    navigator.clipboard.writeText(textContent).then(() => {
      const copyBtn = document.getElementById('copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
      alert('Failed to copy text to clipboard');
    });
  }
}

// Format simplified text with clickable sentences
function formatSimplifiedTextWithSentences(text) {
  const escaped = escapeHtml(text);

  // Italicize content in parentheses (translations)
  const withItalics = escaped.replace(/\(([^)]+)\)/g, '<span class="text-slate-500 italic text-sm">($1)</span>');

  // Split by sentence-ending punctuation, keeping the punctuation
  const sentences = withItalics.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ])/);

  if (sentences.length <= 1) {
    // Single sentence or no clear sentence breaks
    return `<div class="prose prose-slate max-w-none whitespace-pre-wrap">
      <span class="simplifier-sentence cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors" onclick="speakSentence(this)">${withItalics}</span>
    </div>`;
  }

  const wrappedSentences = sentences
    .filter(s => s.trim())
    .map(sentence => `<span class="simplifier-sentence cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors" onclick="speakSentence(this)">${sentence.trim()}</span>`)
    .join(' ');

  return `<div class="prose prose-slate max-w-none whitespace-pre-wrap">${wrappedSentences}</div>`;
}

// Speak a single sentence when clicked
function speakSentence(element) {
  if (typeof portugueseSpeech === 'undefined') {
    console.warn('Speech not available');
    return;
  }

  // Stop any ongoing speech
  portugueseSpeech.stop();

  // Remove highlight from all sentences
  document.querySelectorAll('.simplifier-sentence').forEach(el => {
    el.classList.remove('bg-green-100');
  });

  // Get text without translations
  let text = element.textContent.trim();
  text = text.replace(/\s*\([^)]+\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  // Highlight current sentence
  element.classList.add('bg-green-100');

  portugueseSpeech.speak(text, {
    onEnd: () => {
      element.classList.remove('bg-green-100');
    },
    onError: () => {
      element.classList.remove('bg-green-100');
    }
  });
}

// Speak all text (Listen button)
function speakSimplifiedText() {
  const output = document.getElementById('simplifier-output');
  const speakBtn = document.getElementById('speak-btn');
  const sentences = output.querySelectorAll('.simplifier-sentence');

  if (sentences.length === 0) {
    console.warn('No sentences to speak');
    return;
  }

  if (typeof portugueseSpeech === 'undefined') {
    console.warn('Speech not available');
    return;
  }

  // Stop any ongoing speech
  portugueseSpeech.stop();

  const originalHTML = speakBtn.innerHTML;
  speakBtn.innerHTML = `
    <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
    </svg>
    Stop
  `;
  speakBtn.disabled = false;
  speakBtn.onclick = stopSimplifiedSpeech;

  let currentIndex = 0;

  function speakNext() {
    if (currentIndex >= sentences.length) {
      // Done speaking all sentences
      resetSpeakButton();
      return;
    }

    const sentence = sentences[currentIndex];

    // Remove highlight from all, add to current
    sentences.forEach(el => el.classList.remove('bg-green-100'));
    sentence.classList.add('bg-green-100');

    // Scroll sentence into view if needed
    sentence.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Get text without translations
    let text = sentence.textContent.trim();
    text = text.replace(/\s*\([^)]+\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

    portugueseSpeech.speak(text, {
      onEnd: () => {
        sentence.classList.remove('bg-green-100');
        currentIndex++;
        speakNext();
      },
      onError: () => {
        sentence.classList.remove('bg-green-100');
        resetSpeakButton();
      }
    });
  }

  function resetSpeakButton() {
    speakBtn.innerHTML = originalHTML;
    speakBtn.onclick = speakSimplifiedText;
    sentences.forEach(el => el.classList.remove('bg-green-100'));
  }

  // Store reset function for stop button
  window._resetSimplifierSpeakBtn = resetSpeakButton;

  speakNext();
}

function stopSimplifiedSpeech() {
  if (typeof portugueseSpeech !== 'undefined') {
    portugueseSpeech.stop();
  }
  if (typeof window._resetSimplifierSpeakBtn === 'function') {
    window._resetSimplifierSpeakBtn();
  }
}

function clearSimplifier() {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');
  const copyBtn = document.getElementById('copy-btn');
  const speakBtn = document.getElementById('speak-btn');
  const clearBtn = document.getElementById('clear-btn');
  const audioHint = document.getElementById('audio-hint');

  input.value = '';
  copyBtn.classList.add('hidden');
  if (speakBtn) speakBtn.classList.add('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (audioHint) audioHint.classList.add('hidden');

  // Stop any ongoing speech
  if (typeof portugueseSpeech !== 'undefined') {
    portugueseSpeech.stop();
  }

  output.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><div class="text-center"><svg class="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p class="text-sm">Simplified text will appear here</p></div></div>';
}

// Pronunciation Annotator Functions
function toggleAnnotator() {
  const content = document.getElementById('annotator-content');
  const chevron = document.getElementById('annotator-chevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    chevron.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    chevron.classList.remove('rotate-180');
  }
}

function formatBracketMode(annotated) {
  // Bracket mode: Show annotations in brackets [notation]
  return annotated
    .replace(/\/([^/]+)\//g, '<i class="text-blue-600">[$1]</i>')  // Italic annotations (blue)
    .replace(/~~([^~]+)~~/g, '<s class="text-gray-400">$1</s>')       // Strikethrough (gray)
    .replace(/\n/g, '<br>');                                            // Line breaks
}

function formatSubstitutionMode(annotated) {
  // Substitution mode: Replace original text with phonetic realization
  let result = annotated;

  // Use [^] instead of \w to match any character including Portuguese special chars (ã, õ, ç, etc.)

  // STEP 1: Handle compound transformations first (most specific patterns)

  // Final -te → tchi (more specific than -e → i)
  result = result.replace(/([^\s]+)te\/tchi\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">tchi</span>';
  });

  // Final -de → dji (more specific than -e → i, but not standalone "de")
  result = result.replace(/([^\s]+)de\/dji\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">dji</span>';
  });

  // Verb -am → ãwn
  result = result.replace(/([^\s]+)am\/ãwn\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">ãwn</span>';
  });

  // STEP 2: Handle nasal patterns

  // -em nasal patterns (tem, bem, etc.)
  result = result.replace(/\b(tem|quem|sem|bem|cem|nem|em)\/([^/]+)\//gi, (match, word, sound) => {
    return `<span class="text-blue-600 font-semibold">${sound}</span>`;
  });

  // também, alguém, ninguém (show full word with ending highlighted)
  result = result.replace(/([^\s]+ém)\/eyn\//gi, (match, word) => {
    const stem = word.slice(0, -2);
    return stem + '<span class="text-blue-600 font-semibold">eyn</span>';
  });

  // Short nasal words: com, som, bom
  result = result.replace(/\b(com|som|bom)\/([^/]+)\//gi, (match, word, sound) => {
    return `<span class="text-blue-600 font-semibold">${sound}</span>`;
  });

  // um/uma → ũm/ũma
  result = result.replace(/\b(um|uma|algum|alguma|nenhum|nenhuma)\/([^/]+)\//gi, (match, word, sound) => {
    return `<span class="text-blue-600 font-semibold">${sound}</span>`;
  });

  // STEP 3: Handle palatalization

  // de → dji (complete replacement)
  result = result.replace(/\bde\/dji\//gi, '<span class="text-blue-600 font-semibold">dji</span>');

  // STEP 4: Handle final vowel changes (must be after compound patterns)

  // Final -os → us (before -o to avoid conflicts)
  result = result.replace(/([^\s]+)os\/us\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">us</span>';
  });

  // Final -o → u (includes words with special chars like "ção")
  result = result.replace(/([^\s]+)o\/u\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">u</span>';
  });

  // Single letter 'o' (article) - special case
  result = result.replace(/\bo\/u\//gi, '<span class="text-blue-600 font-semibold">u</span>');

  // Final -es → is (before -e to avoid conflicts)
  result = result.replace(/([^\s]+)es\/is\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">is</span>';
  });

  // Final -e → i (includes words with special chars)
  result = result.replace(/([^\s]+)e\/i\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">i</span>';
  });

  // Single letter 'e' (conjunction) - special case
  result = result.replace(/\be\/i\//gi, '<span class="text-blue-600 font-semibold">i</span>');

  // Final -l → u (L vocalization - replace L with u)
  result = result.replace(/([^\s]+)l\/u\//gi, (match, stem) => {
    return stem + '<span class="text-blue-600 font-semibold">u</span>';
  });

  // STEP 5: Clean up any remaining annotations (fallback)
  result = result.replace(/\/([^/]+)\//g, '<span class="text-blue-600 font-semibold">$1</span>');
  result = result.replace(/~~([^~]+)~~/g, '$1');

  // Line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

function annotateText() {
  const input = document.getElementById('annotator-input');
  const output = document.getElementById('annotator-output');
  const copyBtn = document.getElementById('copy-annotated-btn');
  const substitutionMode = document.getElementById('substitution-mode').checked;

  const inputText = input.value.trim();

  if (!inputText) {
    output.innerHTML = '<div class="text-red-600 p-4">Please enter some Portuguese text to annotate.</div>';
    return;
  }

  // Annotate the text (instant, client-side)
  try {
    const annotated = annotatePronunciation(inputText, false);

    // Store the raw annotated text for copying (with underscores)
    output.dataset.rawText = annotated;

    // Format based on selected mode
    const formatted = substitutionMode ? formatSubstitutionMode(annotated) : formatBracketMode(annotated);
    output.innerHTML = `<div class="whitespace-pre-wrap">${formatted}</div>`;

    // Show copy button
    copyBtn.classList.remove('hidden');
  } catch (error) {
    console.error('Error annotating text:', error);
    output.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-red-800 text-sm">Error annotating text. Please try again.</p></div>`;
  }
}

function toggleAnnotationMode() {
  // Re-render the output if we have annotated text
  const output = document.getElementById('annotator-output');
  const rawText = output.dataset.rawText;

  if (rawText) {
    const substitutionMode = document.getElementById('substitution-mode').checked;
    const formatted = substitutionMode ? formatSubstitutionMode(rawText) : formatBracketMode(rawText);
    output.innerHTML = `<div class="whitespace-pre-wrap">${formatted}</div>`;
  }
}

function copyAnnotatedText() {
  const output = document.getElementById('annotator-output');

  // Copy the raw text with underscores (for pasting into syllabus files)
  // Not the HTML-formatted version shown on screen
  const textToCopy = output.dataset.rawText || output.textContent || output.innerText;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const copyBtn = document.getElementById('copy-annotated-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text:', err);
    alert('Failed to copy text to clipboard');
  });
}

function clearAnnotator() {
  const input = document.getElementById('annotator-input');
  const output = document.getElementById('annotator-output');
  const copyBtn = document.getElementById('copy-annotated-btn');

  input.value = '';
  copyBtn.classList.add('hidden');

  output.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><div class="text-center"><svg class="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg><p class="text-sm">Annotated text will appear here</p></div></div>';
}

// Function to start an empty session with no drills
function startEmptySession() {
  // Create a unique session ID for empty sessions
  const emptySessionId = 'empty-' + Date.now();

  // Reset all session data
  currentChatSession = null;
  currentDrillId = emptySessionId;
  activeDrills = [];

  // Store empty session
  drillSessions[emptySessionId] = {
    sessionId: null,
    drillType: emptySessionId,
    activeDrills: [],
    messages: []
  };

  // Open the chat modal
  const modal = document.getElementById('chat-modal');
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');

  // Show modal
  modal.classList.remove('hidden');

  // Update title
  updateChatTitle();

  // Update badges
  updateActiveDrillsBadges();

  // Clear messages and show welcome
  messagesContainer.innerHTML = '';
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'flex justify-center my-8';
  welcomeMessage.innerHTML = `
    <div class="text-center p-6 bg-slate-50 rounded-lg max-w-md">
      <h3 class="text-xl font-semibold text-slate-900 mb-3">Empty Session Started</h3>
      <p class="text-slate-600 mb-4">No drills are currently active. Click the "+ Add Drill" button above to add drills and start practicing.</p>
      <p class="text-sm text-slate-500">You can add multiple drills to practice them together with random alternation.</p>
    </div>
  `;
  messagesContainer.appendChild(welcomeMessage);

  // Disable input until a drill is added
  chatInput.disabled = true;
  sendButton.disabled = true;
  chatInput.placeholder = 'Add a drill to continue...';

  // Add enter key handler
  chatInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };
}

async function openDrillChat(drillId) {

  // Detect if we're switching drill types BEFORE updating currentDrillId
  const previousDrillId = currentDrillId;
  const isSwitchingDrillTypes = previousDrillId && previousDrillId !== drillId;

  // If switching to different drill type, reset current session
  if (isSwitchingDrillTypes) {
    currentChatSession = null;
  }

  const modal = document.getElementById('chat-modal');
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');
  const loadingMessage = document.getElementById('loading-message');

  // Show modal
  modal.classList.remove('hidden');

  // Update current drill and set title
  currentDrillId = drillId;

  // Track drill usage with Plausible
  if (window.plausible) {
    plausible('Drill', { props: { drill: drillId } });
  }

  const drillTitle = document.getElementById('chat-drill-title');

  // Set appropriate title based on drill ID
  switch(drillId) {
    case 'regular-ar':
      drillTitle.textContent = 'Regular -ar Verb Drill';
      break;
    case 'regular-er':
      drillTitle.textContent = 'Regular -er Verb Drill';
      break;
    case 'regular-ir':
      drillTitle.textContent = 'Regular -ir Verb Drill';
      break;
    case 'irregular-verbs':
      drillTitle.textContent = 'Irregular Verbs Drill';
      break;
    case 'ser-estar':
      drillTitle.textContent = 'Ser vs. Estar Drill';
      break;
    case 'ir-transportation':
      drillTitle.textContent = 'Ir + Transportation Drill';
      break;
    case 'contractions-articles':
      drillTitle.textContent = 'Contractions with Articles (de/em)';
      break;
    case 'reflexive-verbs':
      drillTitle.textContent = 'Reflexive Verbs Drill';
      break;
    case 'immediate-future':
      drillTitle.textContent = 'Immediate Future Drill';
      break;
    case 'present-continuous':
      drillTitle.textContent = 'Present Continuous Tense Drill';
      break;
    case 'imperfect-tense':
      drillTitle.textContent = 'Imperfect Tense Drill';
      break;
    case 'future-tense':
      drillTitle.textContent = 'Future Tense Drill';
      break;
    case 'conditional-tense':
      drillTitle.textContent = 'Conditional Tense Drill';
      break;
    case 'present-subjunctive':
      drillTitle.textContent = 'Present Subjunctive Drill';
      break;
    case 'imperfect-subjunctive':
      drillTitle.textContent = 'Imperfect Subjunctive Drill';
      break;
    case 'future-subjunctive':
      drillTitle.textContent = 'Future Subjunctive Drill';
      break;
    case 'imperative':
      drillTitle.textContent = 'Imperative Drill';
      break;
    case 'noun-plurals':
      drillTitle.textContent = 'Noun Plural Tutor';
      break;
    case 'adjective-agreement':
      drillTitle.textContent = 'Adjective Gender & Number Agreement';
      break;
    case 'demonstratives':
      drillTitle.textContent = 'Demonstrative Pronouns Drill';
      break;
    case 'advanced-demonstratives':
      drillTitle.textContent = 'Advanced Demonstratives Drill';
      break;
    case 'crase':
      drillTitle.textContent = 'Crase (à) Tutor';
      break;
    case 'contractions-de':
      drillTitle.textContent = 'Contraction Trainer (dele/dela)';
      break;
    case 'contractions-em':
      drillTitle.textContent = 'Contraction Trainer (nele/nela)';
      break;
    case 'syllable-stress':
      drillTitle.textContent = 'Syllable Stress Drill';
      break;
    case 'phonetics-br':
      drillTitle.textContent = 'Brazilian Portuguese Phonetics Tutor';
      break;
    case 'colloquial-speech':
      drillTitle.textContent = 'Colloquial Speech Drill';
      break;
    case 'conversational-answers':
      drillTitle.textContent = 'Conversational Answers Drill';
      break;
    case 'self-introduction':
      drillTitle.textContent = 'Self-Introduction Drill';
      break;
    case 'portuguese-for-spanish':
      drillTitle.textContent = 'Portuguese for Spanish Speakers';
      break;
    case 'por-vs-para':
      drillTitle.textContent = 'Por vs Para';
      break;
    case 'diagnostic-test':
      drillTitle.textContent = 'Portuguese Diagnostic Test';
      break;
    default:
      drillTitle.textContent = 'Portuguese Drill';
  }

  console.log('🔥 After setting currentDrillId to:', currentDrillId);
  console.log('🔥 Looking for existing session with key:', drillId);
  console.log('🔥 drillSessions[drillId]:', drillSessions[drillId]);
  console.log('🔥 All drillSessions keys:', Object.keys(drillSessions));

  // Safety check: If stored session doesn't match drill type, clear it
  if (drillSessions[drillId] && drillSessions[drillId].drillType !== drillId) {
    console.log('🔥 WARNING: Session drill type mismatch! Clearing corrupted session.');
    console.log('🔥 Expected:', drillId, 'but found:', drillSessions[drillId].drillType);
    delete drillSessions[drillId];
  }

  // IMPORTANT: Only restore session if it's for the EXACT same drill type
  // and the stored session actually has the correct drill type
  // AND we're not switching from a different drill type
  console.log('🔥 isSwitchingDrillTypes:', isSwitchingDrillTypes);

  // Only create fresh session if we're switching to a DIFFERENT drill type
  // If we're returning to the same drill type, restore the session
  const shouldRestoreSession = drillSessions[drillId] && drillSessions[drillId].drillType === drillId;
  console.log('🔥 shouldRestoreSession:', shouldRestoreSession);

  if (shouldRestoreSession) {
    console.log('🔥 Found existing session for:', drillId);
    console.log('🔥 Session details:', drillSessions[drillId]);
    console.log('🔥 Restoring session...');
    // Restore existing session
    currentChatSession = drillSessions[drillId].sessionId;
    activeDrills = drillSessions[drillId].activeDrills || [drillId]; // Restore activeDrills
    messagesContainer.innerHTML = '';

    // Restore all messages from this session
    drillSessions[drillId].messages.forEach(msg => {
      addMessageToChat(msg.role === 'user' ? 'user' : 'ai', msg.content);
    });

    // Update drill badges display
    updateActiveDrillsBadges();

    // Update the chat title
    updateChatTitle();

    // Enable input
    chatInput.disabled = false;
    sendButton.disabled = false;

    // Add enter key handler
    chatInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    };

    return;
  } else {
    console.log('🔥 No existing session found for:', drillId, 'or switching drill types');
    console.log('🔥 Creating new session...');
  }

  // Disable input while starting new session
  chatInput.disabled = true;
  sendButton.disabled = true;

  // Show loading message with spinner
  messagesContainer.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-green-600 text-sm font-bold">AI</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <div id="loading-message" class="text-slate-600">Starting your drill session...</div>
        </div>
        <div class="text-xs text-slate-500 mt-2">This may take up to 30 seconds...</div>
      </div>
    </div>
  `;

  console.log('🔥 Set loading message and disabled input');

  try {
    // Start new chat session with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        drillId: drillId,
        isNewSession: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    currentChatSession = data.sessionId;

    // Initialize activeDrills array with the first drill
    activeDrills = [drillId];

    // Store new session data
    drillSessions[drillId] = {
      sessionId: data.sessionId,
      drillType: drillId, // Explicitly store the drill type
      activeDrills: [drillId], // Track active drills
      messages: [{ role: 'assistant', content: data.response }]
    };

    console.log('🔥 Created new session for drillId:', drillId);
    console.log('🔥 Session data:', drillSessions[drillId]);
    console.log('🔥 All sessions now:', JSON.stringify(drillSessions, null, 2));

    // Clear loading and show AI response
    messagesContainer.innerHTML = '';
    addMessageToChat('ai', data.response);

    // Update drill badges display
    updateActiveDrillsBadges();

    // Update the chat title
    updateChatTitle();

    // Enable input
    chatInput.disabled = false;
    sendButton.disabled = false;

    // Add enter key handler
    chatInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    };

  } catch (error) {
    console.error('Error starting chat session:', error);

    // Clear loading and show error
    messagesContainer.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex items-start space-x-3';
    errorDiv.innerHTML = `
      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-red-600 text-sm font-bold">⚠️</span>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-2xl">
        <div class="text-red-800 font-semibold mb-2">Failed to Start Session</div>
        <div class="text-red-700 text-sm mb-3">
          ${error.name === 'AbortError'
            ? 'The request timed out after 30 seconds. The AI service might be experiencing heavy load.'
            : error.message.includes('Failed to fetch')
            ? 'Network error: Could not connect to the server. Please check your internet connection.'
            : 'Sorry, there was an error starting the session: ' + error.message}
        </div>
        <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          Reload Page
        </button>
      </div>
    `;
    messagesContainer.appendChild(errorDiv);

    // Re-enable input in case user wants to try again
    chatInput.disabled = false;
    sendButton.disabled = false;
  }
}

// Filter out completion messages from AI responses
function filterCompletionMessages(response) {
  if (!response) return { text: response, needsNextQuestion: false };

  // Patterns that indicate completion/summary messages
  const completionPatterns = [
    /🎉\s*Congratulations!/i,
    /🎊\s*Congratulations!/i,
    /You've completed/i,
    /You've finished/i,
    /Great job! You've/i,
    /\n\s*Summary:/i,
    /Here's a quick summary:/i,
    /You got all the answers correct!/i,
    /Would you like to:/i,
    /Would you like to practice more/i,
    /move on to another topic/i,
    /practice more or move on/i,
  ];

  // Check if response contains completion patterns
  let hasCompletionMessage = false;
  let cutoffIndex = -1;

  for (const pattern of completionPatterns) {
    const match = response.match(pattern);
    if (match) {
      hasCompletionMessage = true;
      // Find the earliest cutoff point
      if (cutoffIndex === -1 || match.index < cutoffIndex) {
        cutoffIndex = match.index;
      }
    }
  }

  // If completion message detected, cut it off
  if (hasCompletionMessage && cutoffIndex > 0) {
    // Keep everything before the completion message
    let filtered = response.substring(0, cutoffIndex).trim();

    // Remove trailing separators
    filtered = filtered.replace(/---\s*$/m, '').trim();

    console.log('🚫 Filtered out completion message');

    // Check if the filtered response contains a question
    const hasQuestion = /\?/.test(filtered) || /\[CHIPS/.test(filtered) || /____/.test(filtered);

    return {
      text: filtered,
      needsNextQuestion: !hasQuestion
    };
  }

  return { text: response, needsNextQuestion: false };
}

async function sendChatMessage(retryMessage = null, silent = false) {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');
  const message = retryMessage || chatInput.value.trim();

  if (!message || !currentChatSession) return;

  let userMessageDiv = null;

  // Randomly select drill FIRST (before storing any messages)
  // This ensures we use consistent drill for: user message storage, history fetch, AI response storage
  const selectedDrill = activeDrills.length > 0
      ? activeDrills[Math.floor(Math.random() * activeDrills.length)]
      : currentDrillId;

  console.log('🎲 Randomly selected drill:', selectedDrill, 'from', activeDrills);


  // Only add user message if this is not a retry and not silent
  if (!retryMessage && !silent) {
    userMessageDiv = addMessageToChat('user', message);

    // Store user message in session history
    if (selectedDrill && drillSessions[selectedDrill]) {
      drillSessions[selectedDrill].messages.push({ role: 'user', content: message });
    }

    // Clear input and disable while processing
    chatInput.value = '';
  } else if (silent) {
    // For silent messages, still store in history but don't display
    if (selectedDrill && drillSessions[selectedDrill]) {
      drillSessions[selectedDrill].messages.push({ role: 'user', content: message });
    }
  }

  chatInput.disabled = true;
  sendButton.disabled = true;

  // Show typing indicator
  const typingIndicator = addMessageToChat('ai', '...');

  try {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for mobile

    // Get message history for stateless fallback
    const messageHistory = drillSessions[selectedDrill]?.messages || [];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: currentChatSession,
        drillId: selectedDrill,
        message: message,
        messages: messageHistory
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Filter out completion messages before displaying
    const filterResult = filterCompletionMessages(data.response);

    // Remove typing indicator and add real response
    typingIndicator.remove();
    addMessageToChat('ai', filterResult.text);

    // Store AI response in session history
    if (selectedDrill && drillSessions[selectedDrill]) {
      drillSessions[selectedDrill].messages.push({ role: 'assistant', content: filterResult.text });
    }

    // If we filtered out a completion and there's no question, request the next question
    if (filterResult.needsNextQuestion) {
      console.log('🔄 Requesting next question after completion filter');
      // Send a silent message to request the next question
      setTimeout(() => {
        sendChatMessage('Please give me the next question.', true);
      }, 500);
    }

  } catch (error) {
    console.error('Error sending message:', error);

    // Remove typing indicator
    typingIndicator.remove();

    // Determine error type
    let errorMessage = 'Connection error. ';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. ';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Check your connection. ';
    } else if (error.message.includes('Server error')) {
      errorMessage = error.message + ' ';
    }

    // Show error with retry button
    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex justify-center my-4';
    errorDiv.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
        <p class="text-red-800 text-sm mb-3">${errorMessage}</p>
        <button
          onclick="retrySendMessage('${escapeForJs(message)}')"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Retry Message
        </button>
      </div>
    `;

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.appendChild(errorDiv);
    smartScrollToBottom(messagesContainer, true); // Force scroll for error messages

  } finally {
    // Re-enable input
    chatInput.disabled = false;
    sendButton.disabled = false;
  }
}

// Retry function
function retrySendMessage(message) {
  sendChatMessage(message);
}

// Smart scroll function - only scrolls if user is near the bottom
function smartScrollToBottom(container, force = false) {
  if (!container) return;

  const threshold = 150; // pixels from bottom
  const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

  // Always scroll for user messages, or if user is already near bottom, or if forced
  if (force || isNearBottom) {
    container.scrollTop = container.scrollHeight;
  }
}

function addMessageToChat(sender, content) {
  const messagesContainer = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-3';

  if (sender === 'user') {
    messageDiv.className += ' justify-end';
    messageDiv.innerHTML = `
      <div class="bg-green-600 text-white rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${escapeHtml(content)}</div>
      </div>
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-blue-600 text-sm font-bold">You</span>
      </div>
    `;
  } else {
    // Remove [CHIPS: ...] marker from displayed message (if answerChips.js is loaded)
    const displayContent = typeof removeChipsMarker === 'function'
      ? removeChipsMarker(content)
      : content.replace(/\[CHIPS(-ROW[12])?:\s*[^\]]+\]/gi, '').trim();

    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-green-600 text-sm font-bold">AI</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${formatAIMessage(displayContent)}</div>
      </div>
    `;
  }

  messagesContainer.appendChild(messageDiv);

  // Add conjugation buttons if this is a question in verb drills
  if (sender === 'ai' && shouldShowConjugationButtons(content, activeDrills)) {
    addConjugationButtons(messagesContainer, content, activeDrills);
  }
  // Add answer chips if the message contains answer options
  else if (sender === 'ai' && shouldShowAnswerChips(content, activeDrills)) {
    addAnswerChips(messagesContainer, content);
  }

  // Smart scroll: force scroll for user messages, conditional for AI messages
  smartScrollToBottom(messagesContainer, sender === 'user');

  return messageDiv;
}

function formatAIMessage(content) {
  // Convert line breaks to <br> and preserve formatting
  return escapeHtml(content)
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text
}

function closeDrillChat() {
  const modal = document.getElementById('chat-modal');
  modal.classList.add('hidden');
  currentChatSession = null;

  // Reset maximize state when closing
  const container = document.getElementById('chat-container');
  if (container.classList.contains('max-w-full')) {
    toggleMaximizeChat();
  }
}

function toggleMaximizeChat() {
  const container = document.getElementById('chat-container');
  const maximizeIcon = document.getElementById('maximize-icon');
  const minimizeIcon = document.getElementById('minimize-icon');
  const modal = document.getElementById('chat-modal');

  // Toggle between normal and maximized states
  if (container.classList.contains('max-w-3xl')) {
    // Maximize
    container.classList.remove('max-w-3xl', 'h-[90vh]', 'rounded-2xl');
    container.classList.add('max-w-full', 'h-full', 'rounded-none');
    modal.classList.remove('p-2');
    modal.classList.add('p-0');

    // Swap icons
    maximizeIcon.classList.add('hidden');
    minimizeIcon.classList.remove('hidden');
  } else {
    // Minimize (restore to normal)
    container.classList.remove('max-w-full', 'h-full', 'rounded-none');
    container.classList.add('max-w-3xl', 'h-[90vh]', 'rounded-2xl');
    modal.classList.remove('p-0');
    modal.classList.add('p-2');

    // Swap icons
    maximizeIcon.classList.remove('hidden');
    minimizeIcon.classList.add('hidden');
  }
}

// Copy shareable link for a specific drill
async function copyDrillLink(drillId, buttonElement) {
  const baseUrl = window.location.origin + window.location.pathname;
  const shareableUrl = `${baseUrl}?drill=${drillId}`;

  try {
    await navigator.clipboard.writeText(shareableUrl);

    // Visual feedback
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = '✓ Copied!';
    buttonElement.classList.add('bg-purple-600');
    buttonElement.classList.remove('bg-slate-200', 'text-slate-700', 'hover:bg-slate-300');

    // Reset after 2 seconds
    setTimeout(() => {
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('bg-purple-600');
      buttonElement.classList.add('bg-slate-200', 'text-slate-700', 'hover:bg-slate-300');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
    // Fallback: show the URL in an alert
    alert(`Copy this link:\n${shareableUrl}`);
  }
}

// Share current chat state with all active drills
async function shareChatState(buttonElement) {
  const baseUrl = window.location.origin + window.location.pathname;

  // Get all active drills from the current session
  if (!activeDrills || activeDrills.length === 0) {
    alert('No active drills to share. Please add a drill first.');
    return;
  }

  // Create URL with comma-separated drill IDs
  const drillsParam = activeDrills.join(',');
  const shareableUrl = `${baseUrl}?drills=${drillsParam}`;

  try {
    await navigator.clipboard.writeText(shareableUrl);

    // Visual feedback
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = '✓ Copied!';
    buttonElement.classList.add('bg-purple-800', 'text-white');
    buttonElement.classList.remove('text-purple-600', 'hover:text-purple-700');

    // Reset after 2 seconds
    setTimeout(() => {
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('bg-purple-800', 'text-white');
      buttonElement.classList.add('text-purple-600', 'hover:text-purple-700');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy chat link:', err);
    // Fallback: show the URL in an alert
    alert(`Copy this link:\n${shareableUrl}`);
  }
}

// Drill selector functions
function openDrillSelector() {
  const modal = document.getElementById('drill-selector-modal');
  const listContainer = document.getElementById('drill-selector-list');

  // Get all drill cards that have integrated chat support
  const drillCards = document.querySelectorAll('.drill-card');
  const drillsWithIntegration = [];

  drillCards.forEach(card => {
    const integratedButton = card.querySelector('button[onclick^="openDrillChat"]');
    if (integratedButton) {
      const drillId = card.id.replace('drill-', '');
      const titleElement = card.querySelector('h2');
      const descriptionElement = card.querySelector('p.text-slate-600');
      const categoryElement = card.querySelector('span.inline-block');

      if (titleElement && !activeDrills.includes(drillId)) {
        drillsWithIntegration.push({
          id: drillId,
          title: titleElement.textContent.trim(),
          description: descriptionElement ? descriptionElement.textContent.trim() : '',
          category: categoryElement ? categoryElement.textContent.trim() : ''
        });
      }
    }
  });

  // Build the drill list HTML
  if (drillsWithIntegration.length === 0) {
    listContainer.innerHTML = '<p class="text-slate-500 text-center py-8">No other drills available to add.</p>';
  } else {
    listContainer.innerHTML = drillsWithIntegration.map(drill => `
      <button onclick="addDrillToChat('${drill.id}')" class="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-slate-900 mb-1">${escapeHtml(drill.title)}</h3>
            ${drill.category ? `<span class="inline-block text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 mb-2">${escapeHtml(drill.category)}</span>` : ''}
            <p class="text-sm text-slate-600">${escapeHtml(drill.description)}</p>
          </div>
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
      </button>
    `).join('');
  }

  modal.classList.remove('hidden');
}

function closeDrillSelector() {
  const modal = document.getElementById('drill-selector-modal');
  modal.classList.add('hidden');
}

async function addDrillToChat(drillId) {
  // Check if drill is already active
  if (activeDrills.includes(drillId)) {
    alert('This drill is already active in the current session.');
    closeDrillSelector();
    return;
  }

  closeDrillSelector();

  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');

  // Disable input while adding drill
  chatInput.disabled = true;
  sendButton.disabled = true;

  // Add a system message
  const systemMessage = document.createElement('div');
  systemMessage.className = 'flex justify-center my-2';
  systemMessage.innerHTML = `
    <div class="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full">
      Adding drill to session...
    </div>
  `;
  messagesContainer.appendChild(systemMessage);
  smartScrollToBottom(messagesContainer, false); // Don't force scroll for system messages

  try {
    // If this is an empty session (no currentChatSession), start a new session with this drill
    if (!currentChatSession) {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drillId: drillId,
          isNewSession: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      currentChatSession = data.sessionId;

      // Add the drill to activeDrills array
      activeDrills.push(drillId);

      // Update the session's active drills
      if (drillSessions[currentDrillId]) {
        drillSessions[currentDrillId].sessionId = data.sessionId;
        drillSessions[currentDrillId].activeDrills = [...activeDrills];
        drillSessions[currentDrillId].messages.push(
          { role: 'assistant', content: data.response }
        );
      }

      // Update the badges display
      updateActiveDrillsBadges();

      // Update the chat title
      updateChatTitle();

      // Remove system message and add AI response
      systemMessage.remove();
      addMessageToChat('ai', data.response);

      // Enable input and restore placeholder
      chatInput.disabled = false;
      sendButton.disabled = false;
      chatInput.placeholder = 'Type your answer...';

      return;
    }

    // Send a message to add the drill to existing session
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: currentChatSession,
        message: `[SYSTEM: User wants to add the "${drillId}" drill to this conversation. From now on, alternate between the active drills. Acknowledge this briefly and provide the first exercise for this new drill.]`,
        drillType: drillId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Add the drill to activeDrills array
    activeDrills.push(drillId);

    // Update the session's active drills
    if (drillSessions[currentDrillId]) {
      drillSessions[currentDrillId].activeDrills = [...activeDrills];
      drillSessions[currentDrillId].messages.push(
        { role: 'user', content: `[Added drill: ${drillId}]` },
        { role: 'assistant', content: data.response }
      );
    }

    // Update the badges display
    updateActiveDrillsBadges();

    // Update the chat title
    updateChatTitle();

    // Remove system message and add AI response
    systemMessage.remove();
    addMessageToChat('ai', data.response);

    // Enable input and restore placeholder
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.placeholder = 'Type your answer...';

  } catch (error) {
    console.error('Error adding drill:', error);
    systemMessage.innerHTML = `
      <div class="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full">
        Failed to add drill. Please try again.
      </div>
    `;
    chatInput.disabled = false;
    sendButton.disabled = false;
  }
}

async function removeDrillFromChat(drillId) {
  if (!currentChatSession) {
    return;
  }

  // Remove drill from activeDrills array
  const index = activeDrills.indexOf(drillId);
  if (index === -1) {
    return; // Drill not found
  }

  activeDrills.splice(index, 1);

  // Update the session's active drills
  if (drillSessions[currentDrillId]) {
    drillSessions[currentDrillId].activeDrills = [...activeDrills];
  }

  // Update the badges display
  updateActiveDrillsBadges();

  // Update the chat title
  updateChatTitle();

  // Add a system message to the chat
  const messagesContainer = document.getElementById('chat-messages');
  const systemMessage = document.createElement('div');
  systemMessage.className = 'flex justify-center my-2';
  systemMessage.innerHTML = `
    <div class="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full">
      Removed "${getDrillName(drillId)}" from active drills
    </div>
  `;
  messagesContainer.appendChild(systemMessage);
  smartScrollToBottom(messagesContainer, false); // Don't force scroll for system messages

  // If no drills remain, disable input and show message
  if (activeDrills.length === 0) {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send-btn');
    chatInput.disabled = true;
    sendButton.disabled = true;
    chatInput.placeholder = 'Add a drill to continue...';

    // Add empty state message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'flex justify-center my-4';
    emptyMessage.innerHTML = `
      <div class="text-center p-4 bg-slate-50 rounded-lg max-w-md">
        <p class="text-slate-600 mb-2">All drills have been removed.</p>
        <p class="text-sm text-slate-500">Click the "+ Add Drill" button to add drills and continue practicing.</p>
      </div>
    `;
    messagesContainer.appendChild(emptyMessage);
    smartScrollToBottom(messagesContainer, false); // Don't force scroll for system messages
  }
}

function updateActiveDrillsBadges() {
  const container = document.getElementById('active-drills-container');
  const badgesContainer = document.getElementById('active-drills-badges');

  if (activeDrills.length === 0) {
    // Show empty state message
    container.classList.remove('hidden');
    badgesContainer.innerHTML = `
      <span class="text-xs text-slate-500 italic">No drills loaded. Click "+ Add Drill" to start practicing.</span>
    `;
    return;
  }

  // Show container and populate badges with remove buttons
  container.classList.remove('hidden');
  badgesContainer.innerHTML = activeDrills.map(drillId => {
    const drillName = getDrillName(drillId);
    return `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        ${escapeHtml(drillName)}
        <button
          onclick="removeDrillFromChat('${drillId}')"
          class="hover:bg-green-200 rounded-full p-0.5 transition-colors"
          title="Remove this drill"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    `;
  }).join('');
}

function getDrillName(drillId) {
  const names = {
    'ar-verbs': 'Regular -ar Verbs',
    'er-verbs': 'Regular -er Verbs',
    'ir-verbs': 'Regular -ir Verbs',
    'irregular-verbs': 'Irregular Verbs',
    'ser-estar': 'Ser vs. Estar',
    'reflexive-verbs': 'Reflexive Verbs',
    'immediate-future': 'Immediate Future',
    'present-continuous': 'Present Continuous',
    'imperfect-tense': 'Imperfect Tense',
    'future-tense': 'Future Tense',
    'conditional-tense': 'Conditional Tense',
    'present-subjunctive': 'Present Subjunctive',
    'imperfect-subjunctive': 'Imperfect Subjunctive',
    'future-subjunctive': 'Future Subjunctive',
    'imperative': 'Imperative',
    'noun-plurals': 'Noun Plurals',
    'adjective-agreement': 'Adjective Agreement',
    'demonstratives': 'Demonstratives',
    'ir-transportation': 'Ir + Transportation',
    'advanced-demonstratives': 'Advanced Demonstratives',
    'crase': 'Crase (à)',
    'contractions-de': 'Contractions (de)',
    'contractions-em': 'Contractions (em)',
    'contractions-articles': 'Contractions with Articles',
    'syllable-stress': 'Syllable Stress',
    'phonetics-br': 'Phonetics',
    'colloquial-speech': 'Colloquial Speech',
    'conversational-answers': 'Conversational Answers',
    'self-introduction': 'Self-Introduction',
    'portuguese-for-spanish': 'PT for Spanish'
  };
  return names[drillId] || drillId;
}

function updateChatTitle() {
  const drillTitleContainer = document.getElementById('chat-drill-title');

  if (activeDrills.length === 0) {
    drillTitleContainer.textContent = 'No drills active';
    return;
  }

  if (activeDrills.length === 1) {
    drillTitleContainer.textContent = getDrillName(activeDrills[0]);
    return;
  }

  // Multiple drills - show as a list
  const drillNames = activeDrills.map(id => getDrillName(id));
  drillTitleContainer.textContent = drillNames.join(' • ');
}
