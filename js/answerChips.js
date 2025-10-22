/**
 * Answer Chips Module
 * Provides clickable answer options for non-verb drills
 * Detects [CHIPS: option1, option2, option3] format in AI responses
 */

// Check if answer chips should be shown
function shouldShowAnswerChips(content, activeDrills) {
  // Don't show answer chips if conjugation buttons are already shown
  if (shouldShowConjugationButtons(content, activeDrills)) {
    return false;
  }

  // Check if message contains [CHIPS: ...] marker
  return /\[CHIPS:\s*([^\]]+)\]/i.test(content);
}

// Extract answer options from message
function extractAnswerChips(content) {
  // Match [CHIPS: option1, option2, option3] format
  const match = content.match(/\[CHIPS:\s*([^\]]+)\]/i);

  if (!match) return null;

  // Split by comma and trim each option
  const options = match[1]
    .split(',')
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);

  return options.length > 0 ? options : null;
}

// Remove [CHIPS: ...] marker from displayed message
function removeChipsMarker(content) {
  return content.replace(/\[CHIPS:\s*[^\]]+\]/gi, '').trim();
}

// Add answer chips to message container
function addAnswerChips(messagesContainer, content) {
  const options = extractAnswerChips(content);
  if (!options) return;

  // Shuffle options for variety
  const shuffled = shuffleArray(options);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="flex flex-wrap gap-2 max-w-2xl">
      ${shuffled.map(option => `
        <button
          onclick="sendAnswer('${option.replace(/'/g, "\\'")}')"
          class="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-4 py-2 rounded-full text-sm transition-colors"
        >
          ${escapeHtml(option)}
        </button>
      `).join('')}
    </div>
  `;

  messagesContainer.appendChild(buttonContainer);
}

// Send answer when chip is clicked
function sendAnswer(answer) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = answer;
  sendChatMessage();
}
