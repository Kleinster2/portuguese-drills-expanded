/**
 * Placement Test Module - Incognito Mode (No Feedback)
 * 75-question curriculum-aligned diagnostic test
 */

let questionBank = null;
let currentQuestionIndex = 0;
let testAnswers = [];

/**
 * Load question bank from JSON file
 */
async function loadQuestionBank() {
  try {
    const response = await fetch('/config/placement-test-questions-v3.json');
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status}`);
    }
    questionBank = await response.json();
    console.log(`✓ Loaded ${questionBank.questions.length} questions`);
    return questionBank;
  } catch (error) {
    console.error('Error loading question bank:', error);
    throw error;
  }
}

/**
 * Initialize placement test (auto-start, no welcome)
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

  // Update title
  drillTitle.textContent = 'Portuguese Placement Test';

  // Show modal
  modal.classList.remove('hidden');

  // Hide input field and send button
  chatInput.style.display = 'none';
  sendButton.style.display = 'none';

  // Clear messages
  messagesContainer.innerHTML = '';

  try {
    // Load question bank if not already loaded
    if (!questionBank) {
      // Show loading
      messagesContainer.innerHTML = `
        <div class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="ml-3 text-slate-600">Loading test...</span>
        </div>
      `;

      await loadQuestionBank();
      messagesContainer.innerHTML = '';
    }

    // Display first question immediately (no welcome message)
    displayQuestion(0);

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
 * Display a question (incognito - no topic labels)
 */
function displayQuestion(index) {
  const messagesContainer = document.getElementById('chat-messages');
  const question = questionBank.questions[index];

  // Shuffle options to randomize answer positions
  const shuffledOptions = shuffleArray(question.options);

  const questionHTML = `
    <div class="flex items-start space-x-3 mb-4" data-question-id="${question.id}">
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-blue-600 text-sm font-bold">${index + 1}</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-4 max-w-2xl w-full">
        <p class="text-xs text-slate-500 mb-2">Question ${index + 1} of 75</p>
        <p class="mb-2">"${question.en}"</p>
        <p class="font-mono mb-3 text-lg">${question.pt}</p>
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
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Handle answer selection (INCOGNITO MODE - NO FEEDBACK)
 */
window.handlePlacementAnswer = function(questionId, selectedAnswer) {
  const question = questionBank.questions.find(q => q.id === questionId);
  const isCorrect = selectedAnswer === question.correct;

  // 1. Visual acknowledgment only (no correctness indication)
  const optionsContainer = document.getElementById(`question-${questionId}-options`);
  const buttons = optionsContainer.querySelectorAll('button');
  const clickedButton = Array.from(buttons).find(btn => btn.textContent.trim() === selectedAnswer);

  // Brief pulse animation on clicked button
  if (clickedButton) {
    clickedButton.classList.add('scale-105', 'bg-blue-100', 'border-blue-400');
    setTimeout(() => {
      clickedButton.classList.remove('scale-105');
    }, 300);
  }

  // Disable all buttons (no green/red highlighting)
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('hover:border-blue-500', 'hover:bg-blue-50');
    btn.classList.add('opacity-50', 'cursor-not-allowed');
  });

  // 2. Store answer silently
  testAnswers.push({
    q: questionId,
    s: selectedAnswer,
    c: isCorrect,
    lesson: question.lesson
  });

  // 3. Show brief "processing" indicator
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

  // 4. Move to next question after brief delay (NO FEEDBACK SHOWN)
  currentQuestionIndex++;

  setTimeout(() => {
    document.getElementById(`processing-indicator-${questionId}`)?.remove();

    if (currentQuestionIndex < questionBank.questions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      showCompletionScreen();
    }
  }, 800);
};

/**
 * Show completion screen with hash (NO SCORE SHOWN)
 */
function showCompletionScreen() {
  const messagesContainer = document.getElementById('chat-messages');

  // Generate hash
  const hash = generateHash();

  const completionHTML = `
    <div class="flex items-start space-x-3 mb-4">
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-green-600 text-xl">✓</span>
      </div>
      <div class="bg-white border-2 border-green-200 rounded-2xl p-6 max-w-2xl w-full">
        <h3 class="text-xl font-bold mb-4 text-slate-800">Test Complete</h3>
        <p class="mb-4 text-slate-600">Thank you for completing the placement test.</p>

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
          You can send this code via WhatsApp, email, or any messaging app.
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
  const testData = {
    v: "3.0.0",
    t: Math.floor(Date.now() / 1000),
    a: testAnswers
  };

  const json = JSON.stringify(testData);
  const compressed = LZString.compressToBase64(json);
  return `PT-BR-${compressed}`;
}

/**
 * Copy hash to clipboard
 */
window.copyHash = function() {
  const hashElement = document.getElementById('placement-hash');
  const hash = hashElement.textContent;

  navigator.clipboard.writeText(hash).then(() => {
    // Visual feedback
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

// Expose to global scope for route detection
window.startPlacementTest = startPlacementTest;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { startPlacementTest, loadQuestionBank };
}
