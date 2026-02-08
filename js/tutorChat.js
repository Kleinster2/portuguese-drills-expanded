// Tutor Chat - freeform conversation with AI Portuguese tutor
// Lightweight chat module without drill coupling

let tutorSessionId = null;
let tutorMessages = [];
let tutorAutoPlayEnabled = true;
let tutorMessageTexts = {}; // Store message texts for speech

async function initTutorChat() {
  // Load dictionary first (needed for hover tooltips)
  await loadHoverDictionary();

  const input = document.getElementById('tutor-input');
  const sendBtn = document.getElementById('tutor-send-btn');
  const messagesContainer = document.getElementById('tutor-messages');

  // Send on button click
  sendBtn.addEventListener('click', sendTutorMessage);

  // Send on Enter key
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendTutorMessage();
    }
  });

  // Mobile tap support for tooltips
  messagesContainer.addEventListener('click', function(e) {
    const tooltip = e.target.closest('.word-tooltip, .phrase-tooltip');
    // Remove active from all other tooltips
    document.querySelectorAll('.word-tooltip.active, .phrase-tooltip.active').forEach(el => {
      if (el !== tooltip) el.classList.remove('active');
    });
    if (tooltip) {
      tooltip.classList.toggle('active');
    }
  });

  // Track with Plausible
  if (window.plausible) {
    plausible('Drill', { props: { drill: 'tutor-chat' } });
  }

  // Auto-start session
  startTutorSession();
}

async function startTutorSession() {
  const messagesContainer = document.getElementById('tutor-messages');
  const input = document.getElementById('tutor-input');
  const sendBtn = document.getElementById('tutor-send-btn');

  // Show loading
  messagesContainer.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-teal-600 text-sm font-bold">AI</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
          <div class="text-slate-600">Starting tutor session...</div>
        </div>
      </div>
    </div>
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        drillId: 'tutor-chat',
        isNewSession: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    tutorSessionId = data.sessionId;
    tutorMessages = [{ role: 'assistant', content: data.response }];

    // Show welcome message
    messagesContainer.innerHTML = '';

    // Add intro message from tutor (no autoplay, will play combined)
    addTutorMessage('ai', 'Welcome! Hover over Portuguese words to see translations. Click "Listen" to hear messages read aloud.', false);

    // Add tutor greeting (no autoplay, will play combined)
    addTutorMessage('ai', data.response, false);

    // Play both messages with a pause between them
    if (window.portugueseSpeech) {
      const introText = 'Welcome! Hover over Portuguese words to see translations. Click Listen to hear messages read aloud.';
      setTimeout(() => {
        window.portugueseSpeech.speakMixed(introText, {
          onEnd: () => {
            // Pause before greeting
            setTimeout(() => {
              window.portugueseSpeech.speakMixed(data.response);
            }, 800);
          }
        });
      }, 300);
    }

    // Enable input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();

  } catch (error) {
    console.error('Error starting tutor session:', error);
    messagesContainer.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex items-start space-x-3';
    errorDiv.innerHTML = `
      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-red-600 text-sm font-bold">!</span>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-2xl">
        <div class="text-red-800 font-semibold mb-2">Failed to Start Session</div>
        <div class="text-red-700 text-sm mb-3">
          ${error.name === 'AbortError'
            ? 'The request timed out. The AI service might be busy.'
            : error.message.includes('Failed to fetch')
            ? 'Network error. Please check your connection.'
            : error.message}
        </div>
        <button onclick="startTutorSession()" class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          Try Again
        </button>
      </div>
    `;
    messagesContainer.appendChild(errorDiv);
  }
}

async function sendTutorMessage() {
  const input = document.getElementById('tutor-input');
  const sendBtn = document.getElementById('tutor-send-btn');
  const messagesContainer = document.getElementById('tutor-messages');
  const message = input.value.trim();

  if (!message || !tutorSessionId) return;

  // Add user message to UI
  addTutorMessage('user', message);

  // Store in history
  tutorMessages.push({ role: 'user', content: message });

  // Clear input and disable
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  // Show typing indicator
  const typingDiv = addTutorMessage('ai', '...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: tutorSessionId,
        drillId: 'tutor-chat',
        message: message,
        messages: tutorMessages
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Remove typing indicator and show response
    typingDiv.remove();
    addTutorMessage('ai', data.response);

    // Store AI response
    tutorMessages.push({ role: 'assistant', content: data.response });

  } catch (error) {
    console.error('Error sending message:', error);
    typingDiv.remove();

    let errorMessage = 'Connection error. ';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. ';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Check your connection. ';
    } else if (error.message.includes('Server error')) {
      errorMessage = error.message + ' ';
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex justify-center my-4';
    errorDiv.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
        <p class="text-red-800 text-sm mb-3">${errorMessage}</p>
        <button
          onclick="retryTutorMessage()"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Retry Message
        </button>
      </div>
    `;
    messagesContainer.appendChild(errorDiv);
    scrollTutorToBottom(messagesContainer);

  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

function retryTutorMessage() {
  // Re-send the last user message
  if (tutorMessages.length > 0) {
    const lastUserMsg = [...tutorMessages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove the last user message from history (sendTutorMessage will re-add it)
      const idx = tutorMessages.lastIndexOf(lastUserMsg);
      tutorMessages.splice(idx, 1);

      // Set it in the input and send
      document.getElementById('tutor-input').value = lastUserMsg.content;
      sendTutorMessage();
    }
  }
}

function addTutorMessage(sender, content, autoPlay = true) {
  const messagesContainer = document.getElementById('tutor-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-3';

  if (sender === 'user') {
    messageDiv.className += ' justify-end';
    messageDiv.innerHTML = `
      <div class="bg-teal-600 text-white rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${escapeHtmlTutor(content)}</div>
      </div>
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-blue-600 text-sm font-bold">You</span>
      </div>
    `;
  } else {
    const messageId = 'tutor-msg-' + Date.now();
    tutorMessageTexts[messageId] = content;

    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-teal-600 text-sm font-bold">AI</span>
      </div>
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${formatTutorResponse(content)}</div>
        ${content !== '...' ? `
        <button
          onclick="speakTutorMessage('${messageId}')"
          class="mt-2 text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
          </svg>
          <span>Listen</span>
        </button>
        ` : ''}
      </div>
    `;

    // Auto-play if enabled and not a typing indicator
    if (autoPlay && tutorAutoPlayEnabled && content !== '...' && window.portugueseSpeech) {
      setTimeout(() => {
        window.portugueseSpeech.speakMixed(content);
      }, 300);
    }

    // Fetch translations for unknown words in background, then update tooltips
    if (content !== '...' && typeof extractUnknownWords === 'function') {
      const unknownWords = extractUnknownWords(content);
      if (unknownWords.length > 0) {
        // Pass the message content as context for better translations
        fetchUnknownTranslations(unknownWords, content).then(() => {
          // Re-render message content with newly cached translations
          const contentDiv = messageDiv.querySelector('.message-content');
          if (contentDiv) {
            contentDiv.innerHTML = formatTutorResponse(content);
          }
        });
      }
    }
  }

  messagesContainer.appendChild(messageDiv);
  scrollTutorToBottom(messagesContainer);
  return messageDiv;
}

// Speak a specific tutor message
function speakTutorMessage(messageId) {
  const text = tutorMessageTexts[messageId];
  if (text && window.portugueseSpeech) {
    window.portugueseSpeech.speakMixed(text);
  }
}

function formatTutorResponse(content) {
  let html = escapeHtmlTutor(content)
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Add hover tooltips for Portuguese words using shared module
  if (isHoverDictionaryLoaded()) {
    html = addHoverTooltips(html);
  }

  return html;
}

function escapeHtmlTutor(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function scrollTutorToBottom(container) {
  if (!container) return;
  const threshold = 150;
  const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  if (isNearBottom) {
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }
}
