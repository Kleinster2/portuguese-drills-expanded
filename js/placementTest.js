/**
 * Placement Test Module - Diagnostic Mode (v3.0)
 * Goal: Detailed Granular Profiling (not just placement)
 * Logic: Topic-Based Adaptive Testing
 * 
 * Key Features:
 * 1. Topic Tracking: Tracks performance per grammar topic (e.g., "Preterite", "Ser/Estar")
 * 2. Soft Failures: If a topic fails (2 wrong), skip remaining questions in THAT topic, but continue the Phase.
 * 3. Phase Promotion: Must pass >70% of topics to unlock next Phase.
 * 4. Comprehensive Report: Generates a detailed skills matrix in the hash.
 */

// Detect test type from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const testType = urlParams.get('test') || 'grammar';

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

// Thresholds
const TOPIC_FAILURE_LIMIT = 2; // 2 wrong answers kills a topic
const PHASE_PASS_RATIO = 0.70; // Must pass 70% of topics to advance phase

/**
 * Load question bank
 */
async function loadQuestionBank() {
  try {
    const testFileMap = {
      'vocabulary': '/config/placement-test-questions-vocabulary-v1.0.json',
      'grammar': '/config/placement-test-questions-v10.9-no-hints.json', // Using the latest refined bank
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
async function startPlacementTest() {
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
    startPhase(1);
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
      topicState[q.unitName] = { total: 0, correct: 0, failures: 0, active: true };
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

  // 1. Find the next valid question (skipping "dead" topics) -> DISABLED for Pure Diagnostic Mode
  let validIndex = index;
  let question = phaseQuestions[validIndex];

  // PURE DIAGNOSTIC MODE: Do not skip topics. Ask everything in the phase.
  // while (question) {
  //   const topic = topicState[question.unitName];
  //   if (topic && topic.active) {
  //     break; // Found a valid question
  //   }
  //   // Topic is dead (failed too many times), skip this question
  //   validIndex++;
  //   question = phaseQuestions[validIndex];
  // }

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
            class="px-3 py-2 glass-chip rounded hover:bg-blue-50 hover:border-blue-500 transition text-sm shadow-sm">
      ${chip}
    </button>
  `).join('');

  const html = `
    <div class="flex items-start space-x-3 mb-6" id="q-container-${question.id}">
      <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">${index + 1}</div>
      <div class="glass-panel rounded-2xl p-5 shadow-md w-full max-w-2xl">
        <div class="flex justify-between mb-2">
          <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">${phaseName} • ${question.unitName}</span>
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
           <button onclick="skipDiagnosticQuestion(${question.id})" class="glass-chip px-3 py-2 text-sm">I'm not totally sure / Skip</button>
           <button id="submit-${question.id}" onclick="submitDiagnosticAnswer(${question.id})" disabled
                   class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition">
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
  processAnswer(qid, null); // null = skipped/wrong
};

function processAnswer(qid, answer) {
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
  } else {
    topic.failures++;
    // Diagnostic Logic: Soft Fail -> DISABLED for Pure Diagnostic Mode
    if (topic.failures >= TOPIC_FAILURE_LIMIT) {
      // topic.active = false; 
      console.log(`🚫 Topic Failed: ${question.unitName}. (Continuing phase for full diagnostic)`);
    }
  }

  // Record
  phaseAnswers.push({
    q: qid,
    unit: question.unitName,
    correct: isCorrect
  });

  testAnswers.push({
    q: qid,
    u: question.unitName,
    c: isCorrect,
    p: currentPhase
  });

  // Next
  currentSelection = null;
  displayQuestion(currentQuestionIndex + 1);
}

function evaluatePhaseCompletion() {
  // Calculate Topic Pass Rate
  let topicsPassed = 0;
  let totalTopics = 0;

  for (const [name, stats] of Object.entries(topicState)) {
    if (stats.total > 0) { // Only count topics we actually tested
      totalTopics++;
      // Definition of "Pass Topic": >50% correct or didn't fail out
      const rate = stats.correct / stats.total;
      if (stats.active && rate >= 0.5) {
        topicsPassed++;
      }
    }
  }

  const phasePassRate = totalTopics === 0 ? 0 : topicsPassed / totalTopics;
  console.log(`Phase ${currentPhase} Result: Passed ${topicsPassed}/${totalTopics} topics (${(phasePassRate*100).toFixed(1)}%)`);

  completedPhases.push({
    phase: currentPhase,
    topics: topicState,
    passRate: phasePassRate
  });

  if (phasePassRate >= PHASE_PASS_RATIO && currentPhase < 4) {
    // Promotion
    showPhaseSuccess(currentPhase + 1);
  } else {
    // End of Line
    finishTest();
  }
}

function showPhaseSuccess(nextPhase) {
  const container = document.getElementById('chat-messages');
  container.insertAdjacentHTML('beforeend', `
    <div class="my-4 p-4 glass-success text-green-800 rounded-xl text-center font-bold animate-pulse">
      Phase Complete! Unlocking Level ${nextPhase}...
    </div>
  `);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => startPhase(nextPhase), 1500);
}

function finishTest() {
  const container = document.getElementById('chat-messages');
  const hash = generateDiagnosticHash();
  
  // Count total topics mastered
  let mastered = 0;
  let needsWork = 0;
  completedPhases.forEach(p => {
    for (const [t, s] of Object.entries(p.topics)) {
      if (s.total > 0) {
        if (s.active && (s.correct/s.total) >= 0.5) mastered++;
        else needsWork++;
      }
    }
  });

  const html = `
    <div class="mt-8 bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl">
      <h2 class="text-3xl font-bold mb-4">Diagnostic Complete 📊</h2>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-slate-800 p-4 rounded-xl">
          <div class="text-2xl font-bold text-green-400">${mastered}</div>
          <div class="text-slate-400 text-sm">Topics Mastered</div>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl">
          <div class="text-2xl font-bold text-orange-400">${needsWork}</div>
          <div class="text-slate-400 text-sm">Focus Areas</div>
        </div>
      </div>
      
      <div class="glass-panel text-slate-900 p-4 rounded-xl mb-4">
        <p class="font-bold text-sm mb-2 uppercase tracking-wide text-slate-500">Instructor Code</p>
        <code id="hash-code" class="block p-3 bg-slate-100 rounded text-blue-600 font-mono break-all select-all">${hash}</code>
      </div>
      
      <button onclick="copyDiagnosticHash()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
        Copy Results
      </button>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
}

function generateDiagnosticHash() {
  const data = {
    v: "3.0-diag",
    date: new Date().toISOString().split('T')[0],
    phases: completedPhases
  };
  return "PT-DIAG-" + LZString.compressToBase64(JSON.stringify(data));
}

window.copyDiagnosticHash = function() {
  const code = document.getElementById('hash-code').innerText;
  navigator.clipboard.writeText(code);
  alert("Copied to clipboard!");
};

// Utilities
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

window.startPlacementTest = startPlacementTest;
if (typeof module !== 'undefined') module.exports = { startPlacementTest };