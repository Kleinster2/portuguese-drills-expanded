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
  messagesContainer.innerHTML = '<div class="flex justify-center"><div class="bg-slate-100 rounded-2xl p-3 max-w-2xl"><div id="loading-message" class="text-slate-600">Starting fresh session...</div></div></div>';
  updateAvatarStatus('thinking');

  // Start completely new session
  setTimeout(() => {
    openDrillChat(currentDrillId);
  }, 500);
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

  // Populate hero avatar (once per modal open)
  const heroContainer = document.getElementById('chat-hero-avatar');
  if (heroContainer && !heroContainer.hasChildNodes() && window.avatarController) {
    heroContainer.innerHTML = window.avatarController.getInlineHtml('');
  }

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

  // Populate hero avatar (once per modal open)
  const heroContainer = document.getElementById('chat-hero-avatar');
  if (heroContainer && !heroContainer.hasChildNodes() && window.avatarController) {
    heroContainer.innerHTML = window.avatarController.getInlineHtml('');
  }

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
    <div class="flex justify-center">
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <div id="loading-message" class="text-slate-600">Starting your drill session...</div>
        </div>
        <div class="text-xs text-slate-500 mt-2">This may take up to 30 seconds...</div>
      </div>
    </div>
  `;
  if (window.avatarController) window.avatarController.setAllState('thinking');
  updateAvatarStatus('thinking');

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
    if (window.avatarController) window.avatarController.setAllState('idle');
    updateAvatarStatus('idle');
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

    updateAvatarStatus('idle');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex justify-center';
    errorDiv.innerHTML = `
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
  if (window.avatarController) window.avatarController.setAllState('thinking');
  updateAvatarStatus('thinking');

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
    if (window.avatarController) window.avatarController.setAllState('idle');
    updateAvatarStatus('idle');
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
    if (window.avatarController) window.avatarController.setAllState('idle');
    updateAvatarStatus('idle');
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

  if (sender === 'user') {
    messageDiv.className = 'flex justify-end';
    messageDiv.innerHTML = `
      <div class="bg-green-600 text-white rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${escapeHtml(content)}</div>
      </div>
    `;
  } else {
    // Remove [CHIPS: ...] marker from displayed message (if answerChips.js is loaded)
    const displayContent = typeof removeChipsMarker === 'function'
      ? removeChipsMarker(content)
      : content.replace(/\[CHIPS(-ROW[12])?:\s*[^\]]+\]/gi, '').trim();

    const escapedText = escapeHtml(displayContent).replace(/"/g, '&quot;');
    const listenBtnHtml = (content !== '...' && window.portugueseSpeech)
      ? `<div class="mt-2 flex items-center gap-3"><button onclick="speakDrillMessage(this)" data-msg-text="${escapedText}" class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg><span>Listen</span></button><button onclick="speakDrillMessage(this, 0.65)" data-msg-text="${escapedText}" class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Slow</span></button><button onclick="speakDrillMessage(this, 0.45)" data-msg-text="${escapedText}" class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Slower</span></button><button onclick="speakDrillMessage(this, 0.3)" data-msg-text="${escapedText}" class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Slowest</span></button></div>`
      : '';

    messageDiv.className = 'flex';
    messageDiv.innerHTML = `
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${formatAIMessage(displayContent)}</div>
        ${listenBtnHtml}
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
    container.classList.add('max-w-full', 'h-full', 'rounded-none', 'chat-maximized');
    modal.classList.remove('p-2');
    modal.classList.add('p-0');

    // Swap icons
    maximizeIcon.classList.add('hidden');
    minimizeIcon.classList.remove('hidden');
  } else {
    // Minimize (restore to normal)
    container.classList.remove('max-w-full', 'h-full', 'rounded-none', 'chat-maximized');
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

// Update hero avatar status indicator (thinking, speaking, idle)
function updateAvatarStatus(status) {
  const statusEl = document.getElementById('chat-avatar-status');
  if (!statusEl) return;
  const dot = statusEl.querySelector('.avatar-status-dot');
  const label = statusEl.querySelector('span:last-child');
  if (!dot || !label) return;

  dot.className = 'avatar-status-dot';
  if (status === 'thinking') {
    dot.classList.add('thinking');
    label.textContent = 'Thinking...';
  } else if (status === 'speaking') {
    dot.classList.add('speaking');
    label.textContent = 'Speaking...';
  } else {
    label.textContent = 'Portuguese Tutor';
  }
}

// Speak a drill AI message when Listen/Slow button is clicked
function speakDrillMessage(buttonEl, rate) {
  const text = buttonEl.getAttribute('data-msg-text');
  if (text && window.portugueseSpeech) {
    const options = rate ? { rate } : {};
    window.portugueseSpeech.speakMixed(text, options);
  }
}
