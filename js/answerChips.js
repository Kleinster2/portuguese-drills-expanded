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

// Add two-row answer chips for por-vs-para drill with multi-select
function addTwoRowChips(messagesContainer, row1Options, row2Options) {
  // Generate unique ID for this chip set
  const chipSetId = 'chipset-' + Date.now();

  // Create button container with two rows
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.setAttribute('data-chipset-id', chipSetId);
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="max-w-2xl">
      <div class="flex flex-wrap gap-2 mb-3" data-row="1">
        ${row1Options.map(option => `
          <button
            data-option="${escapeHtml(option)}"
            data-row="1"
            onclick="selectTwoRowChip(this, '${chipSetId}')"
            class="two-row-chip bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-5 py-2.5 rounded-full text-base transition-colors border-2 border-transparent"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      <div class="flex flex-wrap gap-2 mb-3" data-row="2">
        ${row2Options.map(option => `
          <button
            data-option="${escapeHtml(option)}"
            data-row="2"
            onclick="selectTwoRowChip(this, '${chipSetId}')"
            class="two-row-chip bg-green-100 hover:bg-green-200 text-green-700 font-medium px-4 py-2 rounded-full text-sm transition-colors border-2 border-transparent"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      <div class="flex justify-end">
        <button
          id="submit-${chipSetId}"
          onclick="submitTwoRowAnswer('${chipSetId}')"
          disabled
          class="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 disabled:hover:bg-gray-300"
        >
          Submit Answer
        </button>
      </div>
    </div>
  `;

  messagesContainer.appendChild(buttonContainer);
}

// Handle selection in two-row chips (one from each row)
function selectTwoRowChip(button, chipSetId) {
  const row = button.getAttribute('data-row');
  const chipSet = document.querySelector(`[data-chipset-id="${chipSetId}"]`);

  // Deselect other buttons in the same row
  const rowButtons = chipSet.querySelectorAll(`button[data-row="${row}"].two-row-chip`);
  rowButtons.forEach(btn => {
    btn.classList.remove('border-blue-600', 'border-green-600', 'ring-2', 'ring-blue-300', 'ring-green-300');
    btn.classList.add('border-transparent');
  });

  // Select this button
  if (row === '1') {
    button.classList.remove('border-transparent');
    button.classList.add('border-blue-600', 'ring-2', 'ring-blue-300');
  } else {
    button.classList.remove('border-transparent');
    button.classList.add('border-green-600', 'ring-2', 'ring-green-300');
  }

  // Check if both rows have selections
  const row1Selected = chipSet.querySelector('button[data-row="1"].border-blue-600');
  const row2Selected = chipSet.querySelector('button[data-row="2"].border-green-600');
  const submitButton = document.getElementById(`submit-${chipSetId}`);

  if (row1Selected && row2Selected) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

// Submit the selected answers from both rows
function submitTwoRowAnswer(chipSetId) {
  const chipSet = document.querySelector(`[data-chipset-id="${chipSetId}"]`);
  const row1Selected = chipSet.querySelector('button[data-row="1"].border-blue-600');
  const row2Selected = chipSet.querySelector('button[data-row="2"].border-green-600');

  if (row1Selected && row2Selected) {
    const answer = row1Selected.getAttribute('data-option') + ' - ' + row2Selected.getAttribute('data-option');

    // Disable all chips and submit button after submission
    chipSet.querySelectorAll('button').forEach(btn => btn.disabled = true);

    sendAnswer(answer);
  }
}

// Send answer when chip is clicked
function sendAnswer(answer) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = answer;
  sendChatMessage();
}
