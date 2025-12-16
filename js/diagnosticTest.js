/**
 * Diagnostic Test Module (v3.2)
 * Goal: Complete Proficiency Mapping
 * Logic: Full Diagnostic Mode (no gating)
 *
 * Key Features:
 * 1. Topic Tracking: Tracks correct/wrong/skipped per grammar topic
 * 2. Full Diagnostic: Tests ALL phases (A1→B2) for complete proficiency map
 * 3. Skip Support: Students can indicate "not sure" for honest gap identification
 * 4. Comprehensive Report: Raw data per topic in compressed hash
 */

// Detect test type from URL parameters and user ID from hash (like simplifier)
const urlParams = new URLSearchParams(window.location.search);
const testType = urlParams.get('test') || 'grammar';
const startingPhase = parseInt(urlParams.get('phase')) || 1; // Start at specific phase (1-4)
const userId = window.location.hash ? window.location.hash.substring(1) : null; // User hash from URL fragment

let questionBank = null;
let currentQuestionIndex = 0;
let testAnswers = [];

// Diagnostic State
let currentPhase = 1;
let topicState = {}; // { 'Unit Name': { total: 0, correct: 0, failures: 0, active: true } }
let phaseQuestions = [];
let phaseAnswers = [];
let completedPhases = [];
let testStopped = false;
let testStartTime = null;
let testSessionId = null;


/**
 * Load question bank
 */
async function loadQuestionBank() {
  try {
    const testFileMap = {
      'vocabulary': '/config/diagnostic-test-questions-vocabulary-v1.0.json',
      'grammar': '/config/diagnostic-test-questions-v10.9-no-hints.json', // Using the latest refined bank
    };

    const fileName = testFileMap[testType] || testFileMap['grammar'];
    const cacheBuster = `?v=${Date.now()}`;
    
    const response = await fetch(fileName + cacheBuster);
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    
    questionBank = await response.json();
    console.log(`✓ Loaded Diagnostic Test: ${questionBank.questions.length} items`);
    return questionBank;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Start Diagnostic Test
 */
async function startDiagnosticTest() {
  const modal = document.getElementById('chat-modal');
  const messagesContainer = document.getElementById('chat-messages');
  const drillTitle = document.getElementById('chat-drill-title');

  // Reset
  currentQuestionIndex = 0;
  testAnswers = [];
  currentPhase = 1;
  topicState = {};
  completedPhases = [];
  testStopped = false;
  testStartTime = Date.now();
  testSessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

  drillTitle.textContent = "Portuguese Diagnostic Assessment";
  
  if (window.plausible) {
    plausible('Placement Test', { props: { type: 'diagnostic-v3', mode: 'granular' } });
  }

  modal.classList.remove('hidden');
  document.getElementById('chat-input').style.display = 'none';
  document.getElementById('chat-send-btn').style.display = 'none';
  messagesContainer.innerHTML = '';

  try {
    if (!questionBank) {
      messagesContainer.innerHTML = `<div class="flex justify-center py-8"><span class="text-slate-600">Loading diagnostic engine...</span></div>`;
      await loadQuestionBank();
      messagesContainer.innerHTML = '';
    }
    // Start at specified phase (default 1, or use ?phase=3 for B1, ?phase=4 for B2)
    const validPhase = Math.max(1, Math.min(4, startingPhase));
    startPhase(validPhase);
  } catch (e) {
    messagesContainer.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
  }
}

/**
 * Start a Phase (A1, A2, etc.)
 */
function startPhase(phaseNum) {
  currentPhase = phaseNum;
  currentQuestionIndex = 0;
  phaseAnswers = [];
  topicState = {}; // Reset topic tracking for this phase

  // 1. Get all questions for this phase
  let rawQuestions = questionBank.questions.filter(q => q.phase === phaseNum);
  
  // 2. Initialize Topic State
  rawQuestions.forEach(q => {
    if (!topicState[q.unitName]) {
      topicState[q.unitName] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    }
  });

  // 3. Group by Topic to ensure we don't scatter them too wildly (optional, but better for flow)
  // For now, random shuffle is fine, the engine handles skipping.
  phaseQuestions = shuffleArray(rawQuestions);

  console.log(`Starting Phase ${phaseNum} with ${phaseQuestions.length} questions across ${Object.keys(topicState).length} topics.`);

  const phaseInfo = questionBank.phases?.find(p => p.num === phaseNum);
  const messagesContainer = document.getElementById('chat-messages');
  
  const introHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-blue-100/60 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 font-bold glassmorphic-card">${phaseNum}</div>
      <div class="bg-blue-50/60 backdrop-blur-sm rounded-2xl p-4 glassmorphic-card">
        <h3 class="font-bold text-blue-900">${phaseInfo?.name || 'Phase ' + phaseNum}</h3>
        <p class="text-sm text-blue-700">Diagnostic Mode: We will analyze specific skills.</p>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', introHTML);

  displayQuestion(0);
}

/**
 * Display Logic - SKIPS Dead Topics
 */
function displayQuestion(index) {
  if (testStopped) return;

  // Full diagnostic mode: ask all questions in the phase
  let validIndex = index;
  let question = phaseQuestions[validIndex];

  // If we ran out of questions in this phase
  if (!question) {
    evaluatePhaseCompletion();
    return;
  }

  // Update global index to match valid found index
  currentQuestionIndex = validIndex;

  // Render Question (Production Only for v10.2)
  renderProductionQuestion(question, validIndex);
}

function renderProductionQuestion(question, index) {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name.split(' ')[0] : `Phase ${currentPhase}`;
  
  // Scenario
  const scenarioHTML = question.scenario ? 
    `<div class="mb-3 p-3 glass-info border-l-4 border-amber-400 rounded text-sm text-amber-900 italic">${question.scenario}</div>` : '';

  // Template
  let templateHTML = question.template.replace('__',
    `<span class="inline-block min-w-[80px] px-3 py-1 border border-slate-300 rounded text-center bg-slate-50" id="blank-${question.id}">&nbsp;</span>`
  );

  // Chips
  const shuffledChips = shuffleArray(question.chips);
  const chipsHTML = shuffledChips.map((chip, idx) => `
    <button onclick="selectDiagnosticChip(${question.id}, '${chip.replace(/'/g, "\'")}')" 
            id="chip-${question.id}-${idx}"
            class="px-5 py-3 glass-chip rounded-lg hover:bg-blue-50 hover:border-blue-500 transition text-base shadow-sm">
      ${chip}
    </button>
  `).join('');

  const html = `
    <div class="flex items-start space-x-3 mb-6" id="q-container-${question.id}">
      <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">${index + 1}</div>
      <div class="glass-panel rounded-2xl p-5 shadow-md w-full max-w-2xl">
        <div class="flex justify-between mb-2">
          <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">${phaseName}</span>
        </div>
        ${scenarioHTML}
        <p class="text-lg font-medium text-slate-800 mb-4">${question.en}</p>
        <div class="text-xl font-mono text-slate-700 mb-6 glass-panel p-4 rounded-lg border border-slate-200 shadow-inner">
          ${templateHTML}
        </div>
        <div class="flex flex-wrap gap-2 mb-4" id="chips-container-${question.id}">
          ${chipsHTML}
        </div>
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
           <button onclick="skipDiagnosticQuestion(${question.id})" class="glass-chip px-5 py-3 text-base rounded-lg">I'm not totally sure / Skip</button>
           <button id="submit-${question.id}" onclick="submitDiagnosticAnswer(${question.id})" disabled
                   class="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition">
             Submit
           </button>
        </div>
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Global selection state
let currentSelection = null;

window.selectDiagnosticChip = function(qid, chip) {
  currentSelection = chip;
  const blank = document.getElementById(`blank-${qid}`);
  blank.textContent = chip;
  blank.classList.remove('bg-slate-50');
  blank.classList.add('bg-blue-50', 'text-blue-700', 'font-bold', 'border-blue-400');
  document.getElementById(`submit-${qid}`).disabled = false;
  
  // Visual selection state
  const container = document.getElementById(`chips-container-${qid}`);
  Array.from(container.children).forEach(btn => {
    if (btn.textContent.trim() === chip) {
      btn.classList.add('bg-blue-100/70', 'border-blue-500', 'ring-2', 'ring-blue-200');
    } else {
      btn.classList.remove('bg-blue-100', 'border-blue-500', 'ring-2', 'ring-blue-200');
    }
  });
};

window.submitDiagnosticAnswer = function(qid) {
  if (!currentSelection) return;
  processAnswer(qid, currentSelection);
};

window.skipDiagnosticQuestion = function(qid) {
  processAnswer(qid, null, true); // null answer, skipped=true
};

function processAnswer(qid, answer, wasSkipped = false) {
  const question = phaseQuestions.find(q => q.id === qid);
  const isCorrect = answer === question.correct;

  // Disable UI
  document.getElementById(`submit-${qid}`).disabled = true;
  document.getElementById(`chips-container-${qid}`).style.pointerEvents = 'none';
  document.getElementById(`chips-container-${qid}`).classList.add('opacity-50');

  // Update State
  const topic = topicState[question.unitName];
  topic.total++;

  if (isCorrect) {
    topic.correct++;
    // Visual Feedback (Subtle)
    const container = document.getElementById(`q-container-${qid}`).querySelector('.glass-panel');
    if (container) container.classList.add('border-green-200');
  } else if (wasSkipped) {
    topic.skipped++;
  } else {
    topic.wrong++;
  }

  // Record answer with result type: 'correct', 'wrong', or 'skipped'
  const result = isCorrect ? 'correct' : (wasSkipped ? 'skipped' : 'wrong');

  phaseAnswers.push({
    q: qid,
    unit: question.unitName,
    result: result
  });

  testAnswers.push({
    q: qid,
    u: question.unitName,
    r: result,
    p: currentPhase
  });

  // Next
  currentSelection = null;
  displayQuestion(currentQuestionIndex + 1);
}

/**
 * Log test progress to server (tracks partial completions and dropouts)
 */
async function logTestProgress(isComplete = false) {
  try {
    await fetch('/api/diagnostic-test/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: testAnswers,
        completedPhases: completedPhases,
        startTime: testStartTime,
        sessionId: testSessionId,
        userId: userId,
        isComplete: isComplete
      })
    });
  } catch (error) {
    console.error('Failed to log diagnostic test progress:', error);
    // Silently fail - don't interrupt user experience
  }
}

function evaluatePhaseCompletion() {
  // Record phase results (no pass/fail - pure diagnostic)
  console.log(`Phase ${currentPhase} complete: ${Object.keys(topicState).length} topics tested`);

  completedPhases.push({
    phase: currentPhase,
    topics: { ...topicState } // Clone to preserve state
  });

  // Log progress after each phase (tracks dropouts)
  logTestProgress(false);

  // Always continue to next phase (no gating)
  if (currentPhase < 4) {
    showPhaseTransition(currentPhase + 1);
  } else {
    finishTest();
  }
}

function showPhaseTransition(nextPhase) {
  const container = document.getElementById('chat-messages');
  const phaseNames = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2' };
  container.insertAdjacentHTML('beforeend', `
    <div class="my-4 p-4 glass-info text-blue-800 rounded-xl text-center font-bold">
      Phase complete. Moving to ${phaseNames[nextPhase]}...
    </div>
  `);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => startPhase(nextPhase), 1200);
}

async function finishTest() {
  const container = document.getElementById('chat-messages');

  // Log final complete results to server (teacher monitors via D1 dashboard)
  await logTestProgress(true);

  // Generate a simple hash for the student to "share" (maintains UX illusion)
  const hash = generateResultsCode();

  const html = `
    <div class="mt-8 bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl text-center">
      <h2 class="text-3xl font-bold mb-4">Diagnostic Complete</h2>
      <p class="text-slate-300 mb-6">Share this code with your instructor:</p>

      <div class="bg-slate-800 rounded-xl p-4 mb-4">
        <code id="results-code" class="text-blue-400 font-mono text-sm break-all select-all">${hash}</code>
      </div>

      <button onclick="copyResultsCode()" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
        Copy Code
      </button>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
}

function generateResultsCode() {
  // Simple hash based on session - teacher uses D1 for real data
  const sessionPart = testSessionId ? testSessionId.split('-')[1] || testSessionId.slice(-8) : Date.now().toString(36);
  return 'PT-' + sessionPart.toUpperCase();
}

window.copyResultsCode = function() {
  const code = document.getElementById('results-code').innerText;
  navigator.clipboard.writeText(code);
  alert('Code copied!');
};

// Utilities - Fisher-Yates shuffle (unbiased)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

window.startDiagnosticTest = startDiagnosticTest;
// Keep legacy name for backwards compatibility during transition
window.startPlacementTest = startDiagnosticTest;
if (typeof module !== 'undefined') module.exports = { startDiagnosticTest };