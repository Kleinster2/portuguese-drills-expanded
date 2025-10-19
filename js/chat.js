/**
 * Chat Module
 * Handles all chat session management and messaging functionality
 */

// Open chat modal for a specific drill
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
    case 'subject-identification':
      drillTitle.textContent = 'Subject Identification';
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

  // Show loading message
  messagesContainer.innerHTML = '<div class="flex items-start space-x-3"><div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-green-600 text-sm font-bold">AI</span></div><div class="bg-slate-100 rounded-2xl p-3 max-w-2xl"><div id="loading-message" class="text-slate-600">Starting your drill session...</div></div></div>';

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
      throw new Error(`HTTP error! status: ${response.status}`);
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
    loadingMessage.textContent = 'Sorry, there was an error starting the session. Please try again later.';
  }
}

// Send message to chat API
async function sendChatMessage(retryMessage = null) {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send-btn');
  const message = retryMessage || chatInput.value.trim();

  if (!message || !currentChatSession) return;

  let userMessageDiv = null;

  // Only add user message if this is not a retry
  if (!retryMessage) {
    userMessageDiv = addMessageToChat('user', message);

    // Store user message in session history
    if (currentDrillId && drillSessions[currentDrillId]) {
      drillSessions[currentDrillId].messages.push({ role: 'user', content: message });
    }

    // Clear input and disable while processing
    chatInput.value = '';
  }

  chatInput.disabled = true;
  sendButton.disabled = true;

  // Show typing indicator
  const typingIndicator = addMessageToChat('ai', '...');

  try {
    // Randomly select a drill from activeDrills array
    const selectedDrill = activeDrills.length > 0
      ? activeDrills[Math.floor(Math.random() * activeDrills.length)]
      : currentDrillId;

    console.log('🎲 Randomly selected drill:', selectedDrill, 'from', activeDrills);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for mobile

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: currentChatSession,
        drillId: selectedDrill,
        message: message
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Remove typing indicator and add real response
    typingIndicator.remove();
    addMessageToChat('ai', data.response);

    // Store AI response in session history
    if (currentDrillId && drillSessions[currentDrillId]) {
      drillSessions[currentDrillId].messages.push({ role: 'assistant', content: data.response });
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
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  } finally {
    // Re-enable input
    chatInput.disabled = false;
    sendButton.disabled = false;
  }
}

// Retry sending a message
function retrySendMessage(message) {
  sendChatMessage(message);
}

// Add a message to the chat display
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
    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-green-600 text-sm font-bold">AI</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${formatAIMessage(content)}</div>
      </div>
    `;
  }

  messagesContainer.appendChild(messageDiv);

  // Add conjugation buttons if this is a question in verb drills
  if (sender === 'ai' && shouldShowConjugationButtons(content, activeDrills)) {
    addConjugationButtons(messagesContainer, content, activeDrills);
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  return messageDiv;
}

// Format AI messages with markdown-like syntax
function formatAIMessage(content) {
  // Convert line breaks to <br> and preserve formatting
  return escapeHtml(content)
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text
}

// Close the chat modal
function closeDrillChat() {
  const modal = document.getElementById('chat-modal');
  modal.classList.add('hidden');
  currentChatSession = null;
}
