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

  // Populate hero avatar
  const heroContainer = document.getElementById('tutor-hero-avatar');
  if (heroContainer && !heroContainer.hasChildNodes() && window.avatarController) {
    heroContainer.innerHTML = window.avatarController.getInlineHtml('');
  }

  // Show loading
  messagesContainer.innerHTML = `
    <div class="flex justify-center">
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
          <div class="text-slate-600">Starting tutor session...</div>
        </div>
      </div>
    </div>
  `;
  updateTutorAvatarStatus('thinking');

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
    updateTutorAvatarStatus('idle');
    messagesContainer.innerHTML = '';

    // Add intro message from tutor (no autoplay, no listen buttons)
    addTutorMessage('ai', 'Welcome! Hover over Portuguese words to see translations. Click "Listen" to hear messages read aloud.', false, true);

    // Add tutor greeting (no autoplay, will play combined)
    addTutorMessage('ai', data.response, false);

    // Play intro then greeting (mouth animates only for Portuguese segments)
    if (window.portugueseSpeech) {
      const introText = 'Welcome! Hover over Portuguese words to see translations. Click Listen to hear messages read aloud.';
      const greetingText = data.response;

      const playWelcome = () => {
        window.portugueseSpeech.speakMixed(introText, {
          onEnd: () => {
            setTimeout(() => {
              window.portugueseSpeech.speakMixed(greetingText);
            }, 800);
          },
          onBlocked: () => {
            // Autoplay blocked by browser — retry after first user interaction
            const retryOnce = () => {
              document.removeEventListener('click', retryOnce);
              document.removeEventListener('keydown', retryOnce);
              setTimeout(playWelcome, 150);
            };
            document.addEventListener('click', retryOnce);
            document.addEventListener('keydown', retryOnce);
          }
        });
      };

      setTimeout(playWelcome, 300);
    }

    // Enable input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();

  } catch (error) {
    console.error('Error starting tutor session:', error);
    updateTutorAvatarStatus('idle');
    messagesContainer.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex justify-center';
    errorDiv.innerHTML = `
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
  if (window.avatarController) window.avatarController.setAllState('thinking');
  updateTutorAvatarStatus('thinking');

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
    if (window.avatarController) window.avatarController.setAllState('idle');
    updateTutorAvatarStatus('idle');
    typingDiv.remove();
    addTutorMessage('ai', data.response);

    // Store AI response
    tutorMessages.push({ role: 'assistant', content: data.response });

  } catch (error) {
    console.error('Error sending message:', error);
    if (window.avatarController) window.avatarController.setAllState('idle');
    updateTutorAvatarStatus('idle');
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

function addTutorMessage(sender, content, autoPlay = true, hideButtons = false) {
  const messagesContainer = document.getElementById('tutor-messages');
  const messageDiv = document.createElement('div');

  if (sender === 'user') {
    messageDiv.className = 'flex justify-end';
    messageDiv.innerHTML = `
      <div class="bg-teal-600 text-white rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${escapeHtmlTutor(content)}</div>
      </div>
    `;
  } else {
    const messageId = 'tutor-msg-' + Date.now();
    tutorMessageTexts[messageId] = content;

    messageDiv.className = 'flex';
    messageDiv.innerHTML = `
      <div class="bg-slate-100 rounded-2xl p-3 max-w-2xl">
        <div class="message-content">${formatTutorResponse(content)}</div>
        ${content !== '...' && !hideButtons ? `
        <div class="mt-2 flex items-center gap-3">
          <button
            onclick="speakTutorMessage('${messageId}')"
            class="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
            <span>Listen</span>
          </button>
          <button
            onclick="speakTutorMessage('${messageId}', 0.65)"
            class="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Slow</span>
          </button>
          <button
            onclick="speakTutorMessage('${messageId}', 0.45)"
            class="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Slower</span>
          </button>
          <button
            onclick="speakTutorMessage('${messageId}', 0.3)"
            class="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Slowest</span>
          </button>
        </div>
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

// Speak a specific tutor message (optional rate for slow playback)
function speakTutorMessage(messageId, rate) {
  const text = tutorMessageTexts[messageId];
  if (text && window.portugueseSpeech) {
    const options = rate ? { rate } : {};
    window.portugueseSpeech.speakMixed(text, options);
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

// Update tutor hero avatar status indicator
function updateTutorAvatarStatus(status) {
  const statusEl = document.getElementById('tutor-avatar-status');
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
