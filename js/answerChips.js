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

  // Check if message contains [CHIPS: ...] or [CHIPS-ROW1: ...] marker
  return /\[CHIPS(-ROW[12])?:\s*([^\]]+)\]/i.test(content);
}

// Extract answer options from message
function extractAnswerChips(content) {
  // Check for two-row format first: [CHIPS-ROW1: ...] [CHIPS-ROW2: ...]
  const row1Match = content.match(/\[CHIPS-ROW1:\s*([^\]]+)\]/i);
  const row2Match = content.match(/\[CHIPS-ROW2:\s*([^\]]+)\]/i);

  if (row1Match && row2Match) {
    // Two-row format (for por-vs-para)
    const row1Options = row1Match[1]
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    const row2Options = row2Match[1]
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    return {
      type: 'two-row',
      row1: row1Options,
      row2: row2Options
    };
  }

  // Standard single-row format: [CHIPS: option1, option2, option3]
  const match = content.match(/\[CHIPS:\s*([^\]]+)\]/i);

  if (!match) return null;

  // Split by comma and trim each option
  const options = match[1]
    .split(',')
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);

  return options.length > 0 ? { type: 'single-row', options } : null;
}

// Remove [CHIPS: ...] marker from displayed message
function removeChipsMarker(content) {
  return content
    .replace(/\[CHIPS:\s*[^\]]+\]/gi, '')
    .replace(/\[CHIPS-ROW[12]:\s*[^\]]+\]/gi, '')
    .trim();
}

// Add answer chips to message container
function addAnswerChips(messagesContainer, content) {
  const chipData = extractAnswerChips(content);
  if (!chipData) return;

  if (chipData.type === 'two-row') {
    // Two-row format for por-vs-para
    addTwoRowChips(messagesContainer, chipData.row1, chipData.row2);
  } else {
    // Standard single-row format
    addSingleRowChips(messagesContainer, chipData.options);
  }
}

// Add single-row answer chips
function addSingleRowChips(messagesContainer, options) {
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

// Add two-row answer chips for por-vs-para drill
function addTwoRowChips(messagesContainer, row1Options, row2Options) {
  // Create button container with two rows
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="max-w-2xl">
      <div class="text-xs font-semibold text-slate-600 mb-1.5">Preposition:</div>
      <div class="flex flex-wrap gap-2 mb-3">
        ${row1Options.map(option => `
          <button
            onclick="sendAnswer('${option.replace(/'/g, "\\'")}')"
            class="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-5 py-2.5 rounded-full text-base transition-colors"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      <div class="text-xs font-semibold text-slate-600 mb-1.5">Usage category:</div>
      <div class="flex flex-wrap gap-2">
        ${row2Options.map(option => `
          <button
            onclick="sendAnswer('${option.replace(/'/g, "\\'")}')"
            class="bg-green-100 hover:bg-green-200 text-green-700 font-medium px-4 py-2 rounded-full text-sm transition-colors"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
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
