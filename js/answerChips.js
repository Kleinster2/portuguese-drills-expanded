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

  // Check if message contains [CHIPS: ...] or [CHIPS-ROW1: ...] or [CHIPS-ROW2: ...] marker
  return /\[CHIPS(-ROW[123])?:\s*([^\]]+)\]/i.test(content);
}

// Extract answer options from message
function extractAnswerChips(content) {
  // Check for three-row format first: [CHIPS-ROW1: ...] [CHIPS-ROW2: ...] [CHIPS-ROW3: ...]
  const row1Match = content.match(/\[CHIPS-ROW1:\s*([^\]]+)\]/i);
  const row2Match = content.match(/\[CHIPS-ROW2:\s*([^\]]+)\]/i);
  const row3Match = content.match(/\[CHIPS-ROW3:\s*([^\]]+)\]/i);

  if (row1Match && row2Match && row3Match) {
    // Three-row format (for ser-estar)
    const row1Options = row1Match[1]
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    const row2Options = row2Match[1]
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    const row3Options = row3Match[1]
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    return {
      type: 'three-row',
      row1: row1Options,
      row2: row2Options,
      row3: row3Options
    };
  }

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
    .replace(/\[CHIPS-ROW[123]:\s*[^\]]+\]/gi, '')
    .trim();
}

// Add answer chips to message container
function addAnswerChips(messagesContainer, content) {
  const chipData = extractAnswerChips(content);
  if (!chipData) return;

  if (chipData.type === 'three-row') {
    // Three-row format for ser-estar
    addThreeRowSerEstarChips(messagesContainer, chipData.row1, chipData.row2, chipData.row3);
  } else if (chipData.type === 'two-row') {
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

  // Generate unique ID for this chip set
  const chipSetId = 'chipset-' + Date.now();

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.setAttribute('data-chipset-id', chipSetId);
  buttonContainer.setAttribute('data-click-count', '0');
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="flex flex-wrap gap-2 max-w-2xl">
      ${shuffled.map(option => `
        <button
          data-option="${escapeHtml(option)}"
          onclick="sendAnswerWithTracking('${chipSetId}', '${option.replace(/'/g, "\\'")}')"
          class="single-row-chip bg-green-100 hover:bg-green-200 text-green-800 font-medium px-4 py-2 rounded-full text-sm transition-colors"
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

  // Scramble row 2 options
  const shuffledRow2 = shuffleArray([...row2Options]);

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
        ${shuffledRow2.map(option => `
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

// Add three-row answer chips for ser-estar drill
function addThreeRowSerEstarChips(messagesContainer, row1Options, row2Options, row3Options) {
  // Generate unique ID for this chip set
  const chipSetId = 'chipset-' + Date.now();

  // Create button container with three rows
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start space-x-3 mb-4';
  buttonContainer.setAttribute('data-chipset-id', chipSetId);
  buttonContainer.innerHTML = `
    <div class="w-8 h-8 flex-shrink-0"></div>
    <div class="max-w-2xl">
      <!-- Row 1: Verb choice (ser/estar/both) -->
      <div class="flex flex-wrap gap-2 mb-3" data-row="1">
        ${row1Options.map(option => `
          <button
            data-option="${escapeHtml(option)}"
            data-row="1"
            onclick="selectSerEstarVerbType(this, '${chipSetId}')"
            class="ser-estar-verb-chip bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold px-5 py-2.5 rounded-full text-base transition-colors border-2 border-transparent"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      <!-- Row 2: Ser conjugations -->
      <div class="flex flex-wrap gap-2 mb-3" data-row="2" data-verb="ser">
        ${row2Options.map(option => `
          <button
            data-option="${escapeHtml(option)}"
            data-row="2"
            data-verb="ser"
            onclick="selectSerEstarConjugation(this, '${chipSetId}')"
            disabled
            class="ser-estar-conj-chip bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-full text-sm transition-colors border-2 border-transparent opacity-40 cursor-not-allowed"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      <!-- Row 3: Estar conjugations -->
      <div class="flex flex-wrap gap-2 mb-3" data-row="3" data-verb="estar">
        ${row3Options.map(option => `
          <button
            data-option="${escapeHtml(option)}"
            data-row="3"
            data-verb="estar"
            onclick="selectSerEstarConjugation(this, '${chipSetId}')"
            disabled
            class="ser-estar-conj-chip bg-green-100 text-green-700 font-medium px-4 py-2 rounded-full text-sm transition-colors border-2 border-transparent opacity-40 cursor-not-allowed"
          >
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  messagesContainer.appendChild(buttonContainer);
}

// Handle verb type selection (ser/estar/both) in row 1
function selectSerEstarVerbType(button, chipSetId) {
  const chipSet = document.querySelector(`[data-chipset-id="${chipSetId}"]`);
  const selectedVerb = button.getAttribute('data-option').toLowerCase();

  // Deselect all row 1 buttons
  chipSet.querySelectorAll('button[data-row="1"]').forEach(btn => {
    btn.classList.remove('border-purple-600', 'ring-2', 'ring-purple-300');
    btn.classList.add('border-transparent');
  });

  // Select this button
  button.classList.remove('border-transparent');
  button.classList.add('border-purple-600', 'ring-2', 'ring-purple-300');

  // Get all conjugation buttons
  const serButtons = chipSet.querySelectorAll('button[data-verb="ser"]');
  const estarButtons = chipSet.querySelectorAll('button[data-verb="estar"]');

  // Reset all conjugation selections
  chipSet.querySelectorAll('.ser-estar-conj-chip').forEach(btn => {
    btn.classList.remove('border-blue-600', 'border-green-600', 'ring-2', 'ring-blue-300', 'ring-green-300');
    btn.classList.add('border-transparent');
  });

  // Enable/disable conjugation rows based on selection
  if (selectedVerb === 'ser') {
    // Enable only ser conjugations
    serButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-40', 'cursor-not-allowed');
      btn.classList.add('hover:bg-blue-200');
    });
    estarButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-40', 'cursor-not-allowed');
      btn.classList.remove('hover:bg-green-200');
    });
  } else if (selectedVerb === 'estar') {
    // Enable only estar conjugations
    estarButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-40', 'cursor-not-allowed');
      btn.classList.add('hover:bg-green-200');
    });
    serButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-40', 'cursor-not-allowed');
      btn.classList.remove('hover:bg-blue-200');
    });
  } else if (selectedVerb === 'both') {
    // Enable all conjugations
    serButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-40', 'cursor-not-allowed');
      btn.classList.add('hover:bg-blue-200');
    });
    estarButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-40', 'cursor-not-allowed');
      btn.classList.add('hover:bg-green-200');
    });
  }
}

// Handle conjugation selection in rows 2 and 3
function selectSerEstarConjugation(button, chipSetId) {
  const chipSet = document.querySelector(`[data-chipset-id="${chipSetId}"]`);
  const verbType = button.getAttribute('data-verb'); // 'ser' or 'estar'
  const row1Selected = chipSet.querySelector('button[data-row="1"].border-purple-600');

  if (!row1Selected) return; // Shouldn't happen, but safety check

  const selectedMode = row1Selected.getAttribute('data-option').toLowerCase();

  if (selectedMode === 'both') {
    // In 'both' mode: Select this button and gray out other buttons of the same verb
    const sameVerbButtons = chipSet.querySelectorAll(`button[data-verb="${verbType}"]`);

    // Deselect and gray out all buttons of this verb
    sameVerbButtons.forEach(btn => {
      if (btn === button) {
        // This is the clicked button - select it
        btn.classList.remove('border-transparent', 'opacity-40');
        btn.classList.add(verbType === 'ser' ? 'border-blue-600' : 'border-green-600');
        btn.classList.add('ring-2', verbType === 'ser' ? 'ring-blue-300' : 'ring-green-300');
      } else {
        // Other buttons of same verb - gray them out
        btn.disabled = true;
        btn.classList.add('opacity-40', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-blue-200', 'hover:bg-green-200');
      }
    });

    // Check if both verbs have selections
    const serSelected = chipSet.querySelector('button[data-verb="ser"].ring-2');
    const estarSelected = chipSet.querySelector('button[data-verb="estar"].ring-2');

    if (serSelected && estarSelected) {
      // Both selected - send "both" answer
      const answer = 'both';
      chipSet.querySelectorAll('button').forEach(btn => btn.disabled = true);
      sendAnswer(answer);
    }

  } else {
    // In 'ser' or 'estar' mode: Just send the conjugation immediately
    const answer = button.getAttribute('data-option');
    chipSet.querySelectorAll('button').forEach(btn => btn.disabled = true);
    sendAnswer(answer);
  }
}

// Send answer when chip is clicked (with tracking for multi-click support)
function sendAnswerWithTracking(chipSetId, answer) {
  const chipSet = document.querySelector(`[data-chipset-id="${chipSetId}"]`);
  if (!chipSet) return;

  // Get current click count
  let clickCount = parseInt(chipSet.getAttribute('data-click-count') || '0');

  // Find the clicked button and gray it out
  const buttons = chipSet.querySelectorAll('button.single-row-chip');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-option') === answer) {
      btn.disabled = true;
      btn.classList.remove('bg-green-100', 'hover:bg-green-200', 'text-green-800');
      btn.classList.add('bg-gray-200', 'text-gray-500', 'cursor-not-allowed', 'opacity-60');
    }
  });

  // Increment click count
  clickCount++;
  chipSet.setAttribute('data-click-count', clickCount.toString());

  // If this is the second click, disable all remaining chips
  if (clickCount >= 2) {
    buttons.forEach(btn => {
      btn.disabled = true;
      if (!btn.classList.contains('opacity-60')) {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    });
  }

  // Send the answer
  sendAnswer(answer);
}

// Send answer when chip is clicked
function sendAnswer(answer) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = answer;
  sendChatMessage();
}
