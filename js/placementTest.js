/**
 * Placement Test Module - Adaptive Testing (v2.1)
 * Features:
 *   - Progressive Unlock: Tests phases sequentially (A1 → A2 → B1 → B2)
 *   - Three-Strikes Logic: Stops after 3 consecutive failures in a phase
 *   - Mercy Rule: Auto-pass phase after 15 consecutive correct answers
 *   - Smart Placement: 5-15 minute test instead of 90 minutes
 * Complete coverage: Units 1-89 (A1 Beginner → B2 Upper-Intermediate)
 * Assessment Types: Comprehension (PT→EN) + Production (EN→PT)
 */

// Detect test type from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const testType = urlParams.get('test') || 'grammar';

let questionBank = null;
let currentQuestionIndex = 0;
let testAnswers = [];

// Adaptive testing state
let currentPhase = 1; // Start with Phase 1 (A1)
let consecutiveFailures = 0; // Track consecutive failures in current phase
let consecutiveCorrect = 0; // Track consecutive correct answers (for mercy rule)
let phaseQuestions = []; // Questions for current phase only
let phaseAnswers = []; // Answers for current phase
let completedPhases = []; // Track completed phases with scores
let testStopped = false; // Flag for early termination

const PHASE_PASS_THRESHOLD = 0.80; // 80% to pass a phase
const THREE_STRIKES_LIMIT = 3; // Stop after 3 consecutive failures
const MERCY_RULE_THRESHOLD = 15; // Auto-pass phase after 15 consecutive correct

/**
 * Load question bank from JSON file based on test type
 */
async function loadQuestionBank() {
  try {
    const testFileMap = {
      'vocabulary': '/config/placement-test-questions-vocabulary-v1.0.json',
      'grammar-a': '/config/placement-test-questions-grammar-a-levels.json',
      'grammar-b': '/config/placement-test-questions-grammar-b-levels.json',
      'grammar': '/config/placement-test-questions-v8.0-streamlined.json',
      'verb-tenses': '/config/placement-test-questions-verb-tenses.json',
      'pronouns': '/config/placement-test-questions-pronouns.json',
      'prepositions': '/config/placement-test-questions-prepositions.json',
      'articles-determiners': '/config/placement-test-questions-articles-determiners.json'
    };

    const fileName = testFileMap[testType] || testFileMap['grammar'];

    const response = await fetch(fileName);
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status}`);
    }
    questionBank = await response.json();
    console.log(`✓ Loaded ${testType} test: ${questionBank.questions.length} questions (v${questionBank.metadata.version})`);
    return questionBank;
  } catch (error) {
    console.error('Error loading question bank:', error);
    throw error;
  }
}

/**
 * Initialize placement test with adaptive testing
 */
async function startPlacementTest() {
  const modal = document.getElementById('chat-modal');
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');
  const drillTitle = document.getElementById('chat-drill-title');

  // Reset state
  currentQuestionIndex = 0;
  testAnswers = [];
  currentPhase = 1;
  consecutiveFailures = 0;
  consecutiveCorrect = 0;
  phaseQuestions = [];
  phaseAnswers = [];
  completedPhases = [];
  testStopped = false;

  // Update title
  const testTitles = {
    'vocabulary': 'Portuguese Vocabulary Placement Test',
    'grammar': 'Portuguese Grammar Placement Test',
    'grammar-a': 'Portuguese Grammar Test - A Levels',
    'grammar-b': 'Portuguese Grammar Test - B Levels',
    'verb-tenses': 'Portuguese Verb Tenses Test',
    'pronouns': 'Portuguese Pronouns Test',
    'prepositions': 'Portuguese Prepositions Test',
    'articles-determiners': 'Portuguese Articles & Determiners Test'
  };
  drillTitle.textContent = testTitles[testType] || testTitles['grammar'];

  // Track with Plausible
  if (window.plausible) {
    plausible('Placement Test', { props: { type: testType || 'grammar', version: 'adaptive-v2.1' } });
  }

  modal.classList.remove('hidden');
  chatInput.style.display = 'none';
  sendButton.style.display = 'none';
  messagesContainer.innerHTML = '';

  try {
    if (!questionBank) {
      messagesContainer.innerHTML = `
        <div class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="ml-3 text-slate-600">Loading adaptive test...</span>
        </div>
      `;

      await loadQuestionBank();
      messagesContainer.innerHTML = '';
    }

    // Start with Phase 1
    startPhase(1);

  } catch (error) {
    messagesContainer.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-red-600 text-sm font-bold">!</span>
        </div>
        <div class="bg-red-50 rounded-2xl p-3 max-w-2xl">
          <p class="text-red-800">Error loading test: ${error.message}</p>
          <p class="text-sm mt-2">Please refresh and try again.</p>
        </div>
      </div>
    `;
  }
}

/**
 * Start testing a specific phase
 */
function startPhase(phaseNum) {
  currentPhase = phaseNum;
  currentQuestionIndex = 0;
  phaseAnswers = [];
  consecutiveFailures = 0;
  consecutiveCorrect = 0;

  // Get questions for this phase only
  phaseQuestions = questionBank.questions.filter(q => q.phase === phaseNum);

  // Shuffle questions within the phase
  phaseQuestions = shuffleArray(phaseQuestions);

  console.log(`Starting Phase ${phaseNum}: ${phaseQuestions.length} questions`);

  // Display phase intro message
  const phaseInfo = questionBank.phases?.find(p => p.num === phaseNum);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${phaseNum}`;

  const messagesContainer = document.getElementById('chat-messages');
  const phaseIntroHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-purple-600 text-sm font-bold">${phaseNum}</span>
      </div>
      <div class="bg-purple-50 rounded-2xl p-4 max-w-2xl">
        <h3 class="font-bold text-purple-900 mb-2">${phaseName}</h3>
        <p class="text-sm text-purple-700">${phaseInfo?.description || ''}</p>
        <p class="text-xs text-purple-600 mt-2">Pass with 80% to unlock the next level</p>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', phaseIntroHTML);

  // Display first question
  if (phaseQuestions.length > 0) {
    displayQuestion(0);
  }
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Display a multi-step question
 */
function displayMultiStepQuestion(index, question) {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name.split(' ')[0] : `Phase ${currentPhase}`;
  const progress = Math.round(((index + 1) / phaseQuestions.length) * 100);

  // Initialize multi-step state if not exists
  if (!window.multiStepState) {
    window.multiStepState = {};
  }
  if (!window.multiStepState[question.id]) {
    window.multiStepState[question.id] = {
      currentStep: 0,
      answers: []
    };
  }

  const state = window.multiStepState[question.id];
  const currentStepData = question.steps[state.currentStep];
  const totalSteps = question.steps.length;

  // Scenario (shown once at the beginning)
  const scenarioHTML = state.currentStep === 0 && question.scenario ? `
    <div class="mb-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
      <p class="text-sm text-amber-900"><span class="font-semibold">Scenario:</span> ${question.scenario}</p>
    </div>
  ` : '';

  // Build template with previously answered steps
  let template = currentStepData.template;
  for (let i = 0; i < state.currentStep; i++) {
    const prevAnswer = state.answers[i];
    template = template.replace('__', `<span class="text-green-600 font-bold">${prevAnswer}</span>`);
  }

  // Add blank for current step
  const templateParts = template.split('__');
  let templateHTML = '';
  for (let i = 0; i < templateParts.length; i++) {
    templateHTML += templateParts[i];
    if (i < templateParts.length - 1) {
      templateHTML += `<span class="inline-block min-w-[80px] px-3 py-1 mx-1 border-2 border-green-400 border-dashed rounded bg-white text-center" id="blank-${question.id}-${i}" data-blank-index="${i}">___</span>`;
    }
  }

  const shuffledChips = shuffleArray(currentStepData.chips);
  const hintLine = currentStepData.hint ? `<p class="text-xs text-slate-500 mt-2 italic">💡 ${currentStepData.hint}</p>` : '';

  const questionHTML = `
    <div class="flex items-start space-x-3 mb-4" data-question-id="${question.id}" data-step="${state.currentStep}">
      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-purple-600 text-sm font-bold">${index + 1}</span>
      </div>
      <div class="bg-purple-50 rounded-2xl p-4 max-w-2xl w-full">
        <p class="text-xs text-slate-500 mb-2">
          <span class="font-semibold text-purple-600">${phaseName}</span> •
          Question ${index + 1}/${phaseQuestions.length} (${progress}%) •
          <span class="text-purple-600 font-semibold">[MULTI-STEP ${state.currentStep + 1}/${totalSteps}]</span>
        </p>
        ${scenarioHTML}
        <p class="font-mono mb-3 text-lg text-purple-700">${currentStepData.en}</p>
        <p class="mb-3 font-semibold text-slate-800">${currentStepData.question}</p>

        <div class="mb-4 p-4 bg-white rounded-lg border-2 border-purple-300">
          <p class="text-lg font-mono leading-relaxed" id="template-${question.id}">
            ${templateHTML}
          </p>
        </div>

        ${hintLine}

        <div class="flex flex-wrap gap-2 mb-3" id="chips-${question.id}">
          ${shuffledChips.map((chip, idx) => `
            <button
              onclick="selectMultiStepChip(${question.id}, '${chip.replace(/'/g, "\\'")}', ${idx}, ${state.currentStep})"
              id="chip-${question.id}-${idx}"
              class="px-4 py-2 bg-white border-2 border-purple-400 rounded-lg hover:border-purple-600 hover:bg-purple-100 transition-all text-sm font-medium"
            >
              ${chip}
            </button>
          `).join('')}
        </div>

        <button
          onclick="handleMultiStepAnswer(${question.id}, ${state.currentStep})"
          id="submit-${question.id}"
          disabled
          class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ${state.currentStep < totalSteps - 1 ? 'Next Step' : 'Submit Answer'}
        </button>
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', questionHTML);
}

/**
 * Display a question
 */
function displayQuestion(index) {
  if (testStopped) return;

  const messagesContainer = document.getElementById('chat-messages');
  const question = phaseQuestions[index];

  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name.split(' ')[0] : `Phase ${currentPhase}`;

  // Calculate progress within current phase
  const progress = Math.round(((index + 1) / phaseQuestions.length) * 100);

  // Check question type
  if (question.type === 'multiStep') {
    displayMultiStepQuestion(index, question);
    return;
  }

  const isProduction = question.type === 'production' || question.type === 'contextualizedProduction' || question.type === 'quickCheck';

  if (isProduction) {
    // PRODUCTION QUESTION (includes contextualizedProduction and quickCheck)
    const scenarioLine = question.scenario ? `<div class="mb-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded"><p class="text-sm text-amber-900"><span class="font-semibold">Scenario:</span> ${question.scenario}</p></div>` : '';
    const englishLine = question.en ? `<p class="font-mono mb-3 text-lg text-green-700">${question.en}</p>` : '';
    const hintLine = question.hint ? `<p class="text-xs text-slate-500 mt-2 italic">💡 ${question.hint}</p>` : '';

    const numBlanks = Array.isArray(question.correct) ? question.correct.length : 1;

    const templateParts = question.template.split('__');
    let templateHTML = '';
    for (let i = 0; i < templateParts.length; i++) {
      templateHTML += `<span>${templateParts[i]}</span>`;
      if (i < templateParts.length - 1) {
        templateHTML += `<span class="inline-block min-w-[80px] px-3 py-1 mx-1 border-2 border-green-400 border-dashed rounded bg-white text-center" id="blank-${question.id}-${i}" data-blank-index="${i}">___</span>`;
      }
    }

    const shuffledChips = shuffleArray(question.chips);

    const questionHTML = `
      <div class="flex items-start space-x-3 mb-4" data-question-id="${question.id}">
        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-green-600 text-sm font-bold">${index + 1}</span>
        </div>
        <div class="bg-green-50 rounded-2xl p-4 max-w-2xl w-full">
          <p class="text-xs text-slate-500 mb-2">
            <span class="font-semibold text-purple-600">${phaseName}</span> •
            Question ${index + 1}/${phaseQuestions.length} (${progress}%) •
            <span class="text-green-600 font-semibold">[PRODUCTION]</span>
          </p>
          ${scenarioLine}
          ${englishLine}
          <p class="mb-3 font-semibold text-slate-800">${question.question}</p>

          <div class="mb-4 p-4 bg-white rounded-lg border-2 border-green-300">
            <p class="text-lg font-mono leading-relaxed" id="template-${question.id}">
              ${templateHTML}
            </p>
          </div>

          ${hintLine}

          <div class="flex flex-wrap gap-2 mb-3" id="chips-${question.id}">
            ${shuffledChips.map((chip, idx) => `
              <button
                onclick="selectChip(${question.id}, '${chip.replace(/'/g, "\\'")}', ${idx})"
                id="chip-${question.id}-${idx}"
                class="px-4 py-2 bg-white border-2 border-green-400 rounded-lg hover:border-green-600 hover:bg-green-100 transition-all text-sm font-medium"
              >
                ${chip}
              </button>
            `).join('')}
            <button
              onclick="skipProductionQuestion(${question.id})"
              id="skip-${question.id}"
              class="px-4 py-2 bg-white border-2 border-green-400 rounded-lg hover:border-green-600 hover:bg-green-100 transition-all text-sm font-medium"
            >
              I don't know
            </button>
          </div>

          <button
            onclick="handleProductionAnswer(${question.id})"
            id="submit-${question.id}"
            disabled
            class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', questionHTML);

  } else {
    // COMPREHENSION QUESTION
    const shuffledOptions = shuffleArray(question.options);
    const portugueseLine = question.pt ? `<p class="font-mono mb-3 text-lg text-blue-700">${question.pt}</p>` : '';

    const questionHTML = `
      <div class="flex items-start space-x-3 mb-4" data-question-id="${question.id}">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-blue-600 text-sm font-bold">${index + 1}</span>
        </div>
        <div class="bg-slate-100 rounded-2xl p-4 max-w-2xl w-full">
          <p class="text-xs text-slate-500 mb-2">
            <span class="font-semibold text-purple-600">${phaseName}</span> •
            Question ${index + 1}/${phaseQuestions.length} (${progress}%) •
            <span class="text-blue-600 font-semibold">[COMPREHENSION]</span>
          </p>
          ${portugueseLine}
          <p class="mb-3 font-semibold text-slate-800">${question.question}</p>
          <div class="flex flex-wrap gap-2" id="question-${question.id}-options">
            ${shuffledOptions.map(opt => `
              <button
                onclick="handlePlacementAnswer(${question.id}, '${opt.replace(/'/g, "\\'")}')"
                class="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', questionHTML);
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Handle answer selection with adaptive logic
 */
window.handlePlacementAnswer = function(questionId, selectedAnswer) {
  if (testStopped) return;

  const question = phaseQuestions.find(q => q.id === questionId);
  const correctAnswers = Array.isArray(question.correct) ? question.correct : [question.correct];
  const isCorrect = correctAnswers.includes(selectedAnswer);

  // Visual acknowledgment
  const optionsContainer = document.getElementById(`question-${questionId}-options`);
  const buttons = optionsContainer.querySelectorAll('button');
  const clickedButton = Array.from(buttons).find(btn => btn.textContent.trim() === selectedAnswer);

  if (clickedButton) {
    clickedButton.classList.add('scale-105', 'bg-blue-100', 'border-blue-400');
    setTimeout(() => clickedButton.classList.remove('scale-105'), 300);
  }

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('hover:border-blue-500', 'hover:bg-blue-50');
    btn.classList.add('opacity-50', 'cursor-not-allowed');
  });

  // Store answer for current phase
  const answerRecord = {
    q: questionId,
    s: selectedAnswer,
    c: isCorrect,
    phase: currentPhase,
    unit: question.unit
  };

  phaseAnswers.push(answerRecord);
  testAnswers.push(answerRecord);

  // ADAPTIVE LOGIC: Track consecutive failures and successes
  if (!isCorrect) {
    consecutiveFailures++;
    consecutiveCorrect = 0; // Reset mercy rule counter
    console.log(`❌ Wrong answer. Consecutive failures: ${consecutiveFailures}/${THREE_STRIKES_LIMIT}`);

    if (consecutiveFailures >= THREE_STRIKES_LIMIT) {
      console.log(`🛑 Three strikes! Stopping test at Phase ${currentPhase}`);
      testStopped = true;
      setTimeout(() => showThreeStrikesMessage(), 800);
      return;
    }
  } else {
    consecutiveFailures = 0; // Reset three-strikes counter
    consecutiveCorrect++;
    console.log(`✓ Correct answer. Consecutive correct: ${consecutiveCorrect}/${MERCY_RULE_THRESHOLD}`);

    // MERCY RULE: Auto-pass phase after consistent excellence
    if (consecutiveCorrect >= MERCY_RULE_THRESHOLD) {
      console.log(`🎯 Mercy rule! Auto-passing Phase ${currentPhase} after ${MERCY_RULE_THRESHOLD} consecutive correct`);
      testStopped = true; // Stop current phase
      setTimeout(() => showMercyRuleMessage(), 800);
      return;
    }
  }

  // Show processing indicator
  const messagesContainer = document.getElementById('chat-messages');
  const processingHTML = `
    <div class="flex items-center justify-center py-3" id="processing-indicator-${questionId}">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', processingHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Move to next question
  currentQuestionIndex++;

  setTimeout(() => {
    document.getElementById(`processing-indicator-${questionId}`)?.remove();

    if (currentQuestionIndex < phaseQuestions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      // Phase completed - check if user passes
      evaluatePhaseCompletion();
    }
  }, 800);
};

/**
 * State management for chip selection
 */
const chipSelectionState = {};

/**
 * Handle chip selection
 */
window.selectChip = function(questionId, chipValue, chipIndex) {
  const question = phaseQuestions.find(q => q.id === questionId);
  const numBlanks = Array.isArray(question.correct) ? question.correct.length : 1;

  if (!chipSelectionState[questionId]) {
    chipSelectionState[questionId] = {
      selectedChips: new Array(numBlanks).fill(null),
      currentBlankIndex: 0
    };
  }

  const state = chipSelectionState[questionId];
  const blankToFill = state.currentBlankIndex % numBlanks;

  const blankElement = document.getElementById(`blank-${questionId}-${blankToFill}`);
  if (blankElement) {
    blankElement.textContent = chipValue;
    blankElement.classList.remove('border-dashed');
    blankElement.classList.add('border-solid', 'bg-green-100', 'font-semibold');
  }

  state.selectedChips[blankToFill] = chipValue;
  state.currentBlankIndex++;

  const allBlanksFilled = state.selectedChips.every(chip => chip !== null);
  if (allBlanksFilled) {
    const submitButton = document.getElementById(`submit-${questionId}`);
    if (submitButton) submitButton.disabled = false;
  }
};

/**
 * Handle multi-step chip selection
 */
window.selectMultiStepChip = function(questionId, chipValue, chipIndex, stepIndex) {
  const blankElement = document.getElementById(`blank-${questionId}-0`);
  if (blankElement) {
    blankElement.textContent = chipValue;
    blankElement.classList.remove('border-dashed');
    blankElement.classList.add('border-solid', 'bg-purple-100', 'font-semibold');
  }

  // Store the selected answer for this step
  if (!window.multiStepState[questionId].selectedAnswer) {
    window.multiStepState[questionId].selectedAnswer = chipValue;
  } else {
    window.multiStepState[questionId].selectedAnswer = chipValue;
  }

  // Enable submit button
  const submitButton = document.getElementById(`submit-${questionId}`);
  if (submitButton) submitButton.disabled = false;
};

/**
 * Handle multi-step answer submission
 */
window.handleMultiStepAnswer = function(questionId, stepIndex) {
  if (testStopped) return;

  const question = phaseQuestions.find(q => q.id === questionId);
  const state = window.multiStepState[questionId];

  if (!state.selectedAnswer) return;

  const currentStepData = question.steps[stepIndex];
  const isCorrect = state.selectedAnswer === currentStepData.correct;

  // Store answer for this step
  state.answers.push(state.selectedAnswer);

  // Disable UI
  const chipsContainer = document.getElementById(`chips-${questionId}`);
  if (chipsContainer) {
    const allChips = chipsContainer.querySelectorAll('button');
    allChips.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    });
  }

  const submitButton = document.getElementById(`submit-${questionId}`);
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50');
  }

  // Check if this is the last step
  if (stepIndex === question.steps.length - 1) {
    // Last step - evaluate entire multi-step question
    const allCorrect = state.answers.every((ans, idx) => ans === question.steps[idx].correct);

    // Store complete answer record
    const answerRecord = {
      q: questionId,
      s: state.answers.join(' → '),
      c: allCorrect,
      type: 'multiStep',
      phase: currentPhase,
      unit: question.unit,
      steps: state.answers
    };

    phaseAnswers.push(answerRecord);
    testAnswers.push(answerRecord);

    // ADAPTIVE LOGIC
    if (!allCorrect) {
      consecutiveFailures++;
      consecutiveCorrect = 0;
      console.log(`❌ Wrong answer. Consecutive failures: ${consecutiveFailures}/${THREE_STRIKES_LIMIT}`);

      if (consecutiveFailures >= THREE_STRIKES_LIMIT) {
        console.log(`🛑 Three strikes! Stopping test at Phase ${currentPhase}`);
        testStopped = true;
        delete window.multiStepState[questionId];
        setTimeout(() => showThreeStrikesMessage(), 800);
        return;
      }
    } else {
      consecutiveFailures = 0;
      consecutiveCorrect++;
      console.log(`✓ Correct answer. Consecutive correct: ${consecutiveCorrect}/${MERCY_RULE_THRESHOLD}`);

      if (consecutiveCorrect >= MERCY_RULE_THRESHOLD) {
        console.log(`🎯 Mercy rule! Auto-passing Phase ${currentPhase} after ${MERCY_RULE_THRESHOLD} consecutive correct`);
        testStopped = true;
        delete window.multiStepState[questionId];
        setTimeout(() => showMercyRuleMessage(), 800);
        return;
      }
    }

    // Show processing and move to next question
    const messagesContainer = document.getElementById('chat-messages');
    const processingHTML = `
      <div class="flex items-center justify-center py-3" id="processing-indicator-${questionId}">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', processingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    delete window.multiStepState[questionId];
    currentQuestionIndex++;

    setTimeout(() => {
      document.getElementById(`processing-indicator-${questionId}`)?.remove();

      if (currentQuestionIndex < phaseQuestions.length) {
        displayQuestion(currentQuestionIndex);
      } else {
        evaluatePhaseCompletion();
      }
    }, 800);

  } else {
    // Not the last step - move to next step
    state.currentStep++;
    state.selectedAnswer = null;

    // Show brief processing
    const messagesContainer = document.getElementById('chat-messages');
    const processingHTML = `
      <div class="flex items-center justify-center py-3" id="processing-step-${questionId}">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', processingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Display next step
    setTimeout(() => {
      document.getElementById(`processing-step-${questionId}`)?.remove();
      displayMultiStepQuestion(currentQuestionIndex, question);
    }, 600);
  }
};

/**
 * Handle production answer submission with adaptive logic
 */
window.handleProductionAnswer = function(questionId) {
  if (testStopped) return;

  const question = phaseQuestions.find(q => q.id === questionId);
  const state = chipSelectionState[questionId];

  if (!state || !state.selectedChips || state.selectedChips.every(chip => chip === null)) {
    return;
  }

  const userAnswer = state.selectedChips.filter(chip => chip !== null);
  const correctAnswer = Array.isArray(question.correct) ? question.correct : [question.correct];

  const isCorrect = userAnswer.length === correctAnswer.length &&
                   userAnswer.every((chip, idx) => chip === correctAnswer[idx]);

  // Disable UI
  const chipsContainer = document.getElementById(`chips-${questionId}`);
  if (chipsContainer) {
    const allChips = chipsContainer.querySelectorAll('button');
    allChips.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    });
  }

  const submitButton = document.getElementById(`submit-${questionId}`);
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50');
  }

  // Store answer
  const answerRecord = {
    q: questionId,
    s: userAnswer.join(' '),
    c: isCorrect,
    type: 'production',
    phase: currentPhase,
    unit: question.unit
  };

  phaseAnswers.push(answerRecord);
  testAnswers.push(answerRecord);

  // ADAPTIVE LOGIC: Track consecutive failures and successes
  if (!isCorrect) {
    consecutiveFailures++;
    consecutiveCorrect = 0; // Reset mercy rule counter
    console.log(`❌ Wrong answer. Consecutive failures: ${consecutiveFailures}/${THREE_STRIKES_LIMIT}`);

    if (consecutiveFailures >= THREE_STRIKES_LIMIT) {
      console.log(`🛑 Three strikes! Stopping test at Phase ${currentPhase}`);
      testStopped = true;
      delete chipSelectionState[questionId];
      setTimeout(() => showThreeStrikesMessage(), 800);
      return;
    }
  } else {
    consecutiveFailures = 0; // Reset three-strikes counter
    consecutiveCorrect++;
    console.log(`✓ Correct answer. Consecutive correct: ${consecutiveCorrect}/${MERCY_RULE_THRESHOLD}`);

    // MERCY RULE: Auto-pass phase after consistent excellence
    if (consecutiveCorrect >= MERCY_RULE_THRESHOLD) {
      console.log(`🎯 Mercy rule! Auto-passing Phase ${currentPhase} after ${MERCY_RULE_THRESHOLD} consecutive correct`);
      testStopped = true; // Stop current phase
      delete chipSelectionState[questionId];
      setTimeout(() => showMercyRuleMessage(), 800);
      return;
    }
  }

  // Show processing
  const messagesContainer = document.getElementById('chat-messages');
  const processingHTML = `
    <div class="flex items-center justify-center py-3" id="processing-indicator-${questionId}">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', processingHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  delete chipSelectionState[questionId];
  currentQuestionIndex++;

  setTimeout(() => {
    document.getElementById(`processing-indicator-${questionId}`)?.remove();

    if (currentQuestionIndex < phaseQuestions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      evaluatePhaseCompletion();
    }
  }, 800);
};

/**
 * Handle skipping a production question
 */
window.skipProductionQuestion = function(questionId) {
  if (testStopped) return;

  const question = phaseQuestions.find(q => q.id === questionId);

  // Disable UI
  const chipsContainer = document.getElementById(`chips-${questionId}`);
  if (chipsContainer) {
    const allChips = chipsContainer.querySelectorAll('button');
    allChips.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    });
  }

  const submitButton = document.getElementById(`submit-${questionId}`);
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50');
  }

  // Store as skipped
  const answerRecord = {
    q: questionId,
    s: null,
    c: false,
    skipped: true,
    type: 'production',
    phase: currentPhase,
    unit: question.unit
  };

  phaseAnswers.push(answerRecord);
  testAnswers.push(answerRecord);

  // Skipped counts as wrong for adaptive logic
  consecutiveFailures++;
  consecutiveCorrect = 0; // Reset mercy rule counter
  console.log(`⏭️  Skipped. Consecutive failures: ${consecutiveFailures}/${THREE_STRIKES_LIMIT}`);

  if (consecutiveFailures >= THREE_STRIKES_LIMIT) {
    console.log(`🛑 Three strikes! Stopping test at Phase ${currentPhase}`);
    testStopped = true;
    delete chipSelectionState[questionId];
    setTimeout(() => showThreeStrikesMessage(), 600);
    return;
  }

  // Show processing
  const messagesContainer = document.getElementById('chat-messages');
  const processingHTML = `
    <div class="flex items-center justify-center py-3" id="processing-indicator-${questionId}">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', processingHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  delete chipSelectionState[questionId];
  currentQuestionIndex++;

  setTimeout(() => {
    document.getElementById(`processing-indicator-${questionId}`)?.remove();

    if (currentQuestionIndex < phaseQuestions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      evaluatePhaseCompletion();
    }
  }, 600);
};

/**
 * Evaluate phase completion - PROGRESSIVE UNLOCK logic
 */
function evaluatePhaseCompletion() {
  const correctCount = phaseAnswers.filter(a => a.c).length;
  const totalCount = phaseAnswers.length;
  const successRate = totalCount > 0 ? correctCount / totalCount : 0;

  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${currentPhase}`;

  // Store phase result
  completedPhases.push({
    phase: currentPhase,
    name: phaseName,
    correct: correctCount,
    total: totalCount,
    rate: successRate,
    passed: successRate >= PHASE_PASS_THRESHOLD
  });

  console.log(`Phase ${currentPhase} complete: ${correctCount}/${totalCount} = ${(successRate * 100).toFixed(1)}%`);

  if (successRate >= PHASE_PASS_THRESHOLD) {
    // PASSED - Check if there's a next phase
    const hasNextPhase = currentPhase < 4; // Phases 1-4 (A1, A2, B1, B2)

    if (hasNextPhase) {
      // Show success message and move to next phase
      showPhaseSuccessMessage(currentPhase, successRate, true);
    } else {
      // Completed all phases!
      showCompletionScreen();
    }
  } else {
    // FAILED - Stop test, place at this phase
    console.log(`❌ Failed Phase ${currentPhase}. Placing at ${phaseName}`);
    showPhaseFailureMessage(currentPhase, successRate);
  }
}

/**
 * Show three-strikes message
 */
function showThreeStrikesMessage() {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${currentPhase}`;

  const correctCount = phaseAnswers.filter(a => a.c).length;
  const totalCount = phaseAnswers.length;

  const threeStrikesHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-orange-600 text-xl">⚠️</span>
      </div>
      <div class="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-2 text-orange-900">Test Stopped - Three Strikes</h3>
        <p class="text-orange-800 mb-4">You've missed 3 questions in a row. This helps us place you accurately.</p>
        <div class="bg-white rounded-lg p-4 mb-4">
          <p class="font-semibold text-slate-800 mb-2">Your Placement:</p>
          <p class="text-2xl font-bold text-purple-600">${phaseName}</p>
          <p class="text-sm text-slate-600 mt-2">Score in this phase: ${correctCount}/${totalCount} correct</p>
        </div>
        <p class="text-sm text-orange-700">This is normal! We've found your current level.</p>
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', threeStrikesHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show completion screen after brief delay
  setTimeout(() => showCompletionScreen(), 2000);
}

/**
 * Show mercy rule message (auto-pass after 15 consecutive correct)
 */
function showMercyRuleMessage() {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === currentPhase);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${currentPhase}`;

  const correctCount = phaseAnswers.filter(a => a.c).length;
  const totalCount = phaseAnswers.length;
  const successRate = totalCount > 0 ? correctCount / totalCount : 0;

  // Store phase result as passed
  completedPhases.push({
    phase: currentPhase,
    name: phaseName,
    correct: correctCount,
    total: totalCount,
    rate: successRate,
    passed: true,
    mercyRule: true
  });

  const hasNextPhase = currentPhase < 4;
  const nextPhaseInfo = questionBank.phases?.find(p => p.num === currentPhase + 1);
  const nextPhaseName = nextPhaseInfo ? nextPhaseInfo.name : `Phase ${currentPhase + 1}`;

  const mercyRuleHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-yellow-600 text-xl">🎯</span>
      </div>
      <div class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-2 text-yellow-900">Excellence Detected!</h3>
        <p class="text-yellow-800 mb-4">${MERCY_RULE_THRESHOLD} correct answers in a row - you've mastered this level!</p>
        <div class="bg-white rounded-lg p-4 mb-4">
          <p class="font-semibold text-slate-800 mb-2">Auto-Passed:</p>
          <p class="text-2xl font-bold text-green-600">${phaseName} ✓</p>
          <p class="text-sm text-slate-600 mt-2">Perfect streak: ${MERCY_RULE_THRESHOLD}/${totalCount} questions</p>
        </div>
        ${hasNextPhase ? `
          <div class="bg-white rounded-lg p-4">
            <p class="font-semibold text-slate-800 mb-2">🎯 Unlocking:</p>
            <p class="text-lg font-bold text-purple-600">${nextPhaseName}</p>
          </div>
        ` : `
          <p class="text-sm text-yellow-700 font-semibold">🏆 All phases completed!</p>
        `}
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', mercyRuleHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Reset testStopped flag for next phase
  testStopped = false;

  // Move to next phase or show completion
  if (hasNextPhase) {
    setTimeout(() => startPhase(currentPhase + 1), 2500);
  } else {
    setTimeout(() => showCompletionScreen(), 2500);
  }
}

/**
 * Show phase success message and continue
 */
function showPhaseSuccessMessage(phaseNum, successRate, hasNextPhase) {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === phaseNum);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${phaseNum}`;
  const nextPhaseInfo = questionBank.phases?.find(p => p.num === phaseNum + 1);
  const nextPhaseName = nextPhaseInfo ? nextPhaseInfo.name : `Phase ${phaseNum + 1}`;

  const successHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-green-600 text-xl">✓</span>
      </div>
      <div class="bg-green-50 border-2 border-green-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-2 text-green-900">${phaseName} Complete!</h3>
        <p class="text-green-800 mb-4">You passed with ${(successRate * 100).toFixed(0)}%</p>
        ${hasNextPhase ? `
          <div class="bg-white rounded-lg p-4">
            <p class="font-semibold text-slate-800 mb-2">🎯 Unlocking:</p>
            <p class="text-lg font-bold text-purple-600">${nextPhaseName}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', successHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Move to next phase after brief celebration
  if (hasNextPhase) {
    setTimeout(() => startPhase(phaseNum + 1), 2000);
  }
}

/**
 * Show phase failure message and stop
 */
function showPhaseFailureMessage(phaseNum, successRate) {
  const messagesContainer = document.getElementById('chat-messages');
  const phaseInfo = questionBank.phases?.find(p => p.num === phaseNum);
  const phaseName = phaseInfo ? phaseInfo.name : `Phase ${phaseNum}`;

  const correctCount = phaseAnswers.filter(a => a.c).length;
  const totalCount = phaseAnswers.length;

  const failureHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-blue-600 text-xl">📍</span>
      </div>
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-2 text-blue-900">Placement Found!</h3>
        <p class="text-blue-800 mb-4">We've identified your current level.</p>
        <div class="bg-white rounded-lg p-4 mb-4">
          <p class="font-semibold text-slate-800 mb-2">Your Level:</p>
          <p class="text-2xl font-bold text-purple-600">${phaseName}</p>
          <p class="text-sm text-slate-600 mt-2">Score: ${correctCount}/${totalCount} (${(successRate * 100).toFixed(0)}%)</p>
        </div>
        <p class="text-sm text-blue-700">This is your starting point. You'll build from here!</p>
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', failureHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show completion screen
  setTimeout(() => showCompletionScreen(), 2000);
}

/**
 * Show completion screen with results
 */
function showCompletionScreen() {
  const messagesContainer = document.getElementById('chat-messages');

  // Determine final placement
  let placementPhase = completedPhases.length > 0 ?
    completedPhases[completedPhases.length - 1] :
    { phase: 1, name: 'Foundation (A1)', correct: 0, total: 0, rate: 0 };

  // If stopped by three-strikes, use current phase
  if (testStopped && consecutiveFailures >= THREE_STRIKES_LIMIT) {
    placementPhase = {
      phase: currentPhase,
      name: questionBank.phases?.find(p => p.num === currentPhase)?.name || `Phase ${currentPhase}`,
      correct: phaseAnswers.filter(a => a.c).length,
      total: phaseAnswers.length,
      rate: phaseAnswers.length > 0 ? phaseAnswers.filter(a => a.c).length / phaseAnswers.length : 0
    };
  }

  // Generate hash
  const hash = generateHash();

  // Calculate total time saved
  const totalQuestionsAnswered = testAnswers.length;
  const totalQuestionsInBank = questionBank.questions.length;
  const timeSaved = Math.round((totalQuestionsInBank - totalQuestionsAnswered) * 0.3); // ~0.3 min per question

  const completionHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-purple-600 text-xl">🎓</span>
      </div>
      <div class="bg-white border-2 border-purple-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-4 text-slate-800">Placement Test Complete</h3>

        <div class="bg-purple-50 rounded-lg p-4 mb-4">
          <p class="font-semibold text-sm text-purple-700 mb-2">YOUR PLACEMENT:</p>
          <p class="text-2xl font-bold text-purple-600">${placementPhase.name}</p>
          <p class="text-sm text-slate-600 mt-2">
            Answered: ${totalQuestionsAnswered} questions •
            Saved: ~${timeSaved} minutes
          </p>
        </div>

        <div class="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2 text-sm text-slate-700">Send this code to your instructor:</p>
          <div class="bg-white border border-slate-300 rounded p-3 mb-3">
            <code id="placement-hash" class="text-sm font-mono text-blue-600 select-all break-all">${hash}</code>
          </div>
          <button
            onclick="copyHash()"
            id="copy-button"
            class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📋 Copy Code
          </button>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed">
          🚀 Adaptive testing saved you time by stopping when we found your level!
        </p>
      </div>
    </div>
  `;

  messagesContainer.insertAdjacentHTML('beforeend', completionHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Generate compressed hash of test results
 */
function generateHash() {
  // Determine termination reason
  let reason = 'phase-completion';
  if (consecutiveFailures >= THREE_STRIKES_LIMIT) {
    reason = 'three-strikes';
  } else if (completedPhases.some(p => p.mercyRule)) {
    reason = 'mercy-rule';
  }

  const testData = {
    v: "2.1.0-adaptive",
    type: testType,
    t: Math.floor(Date.now() / 1000),
    a: testAnswers,
    adaptive: {
      stopped: testStopped,
      reason: reason,
      phases: completedPhases
    }
  };

  const json = JSON.stringify(testData);
  const compressed = LZString.compressToBase64(json);

  const prefixMap = {
    'vocabulary': 'PT-BR-V-',
    'grammar': 'PT-BR-G-',
    'grammar-a': 'PT-BR-GA-',
    'grammar-b': 'PT-BR-GB-',
    'verb-tenses': 'PT-BR-VT-',
    'pronouns': 'PT-BR-PR-',
    'prepositions': 'PT-BR-PP-',
    'articles-determiners': 'PT-BR-AD-'
  };
  const prefix = prefixMap[testType] || 'PT-BR-G-';
  return `${prefix}${compressed}`;
}

/**
 * Copy hash to clipboard
 */
window.copyHash = function() {
  const hashElement = document.getElementById('placement-hash');
  const hash = hashElement.textContent;

  navigator.clipboard.writeText(hash).then(() => {
    const button = document.getElementById('copy-button');
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Copied!';
    button.classList.remove('bg-green-600', 'hover:bg-green-700');
    button.classList.add('bg-green-800');

    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('bg-green-800');
      button.classList.add('bg-green-600', 'hover:bg-green-700');
    }, 2000);
  }).catch(err => {
    alert('Failed to copy. Please manually select and copy the code.');
  });
};

// Expose to global scope
window.startPlacementTest = startPlacementTest;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { startPlacementTest, loadQuestionBank };
}
