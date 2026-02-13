// Simplifier page logic — extracted from simplifier.html inline script
// Reuses hoverTranslations.js for dictionary loading, lookups, and tooltip generation

// Update dictionary status indicator (simplifier-specific UI)
function updateDictionaryStatus(status) {
  const indicator = document.getElementById('dict-status');
  if (!indicator) return;

  if (status === 'loading') {
    indicator.innerHTML = '<span class="text-slate-400">Loading dictionary...</span>';
    indicator.className = 'text-xs';
  } else if (status === 'loaded') {
    indicator.innerHTML = '<span class="text-green-600">✓ Dictionary ready</span>';
    indicator.className = 'text-xs';
    setTimeout(() => {
      indicator.style.transition = 'opacity 1s';
      indicator.style.opacity = '0';
    }, 3000);
  } else if (status === 'error') {
    indicator.innerHTML = '<span class="text-amber-600">⚠ Dictionary unavailable (using API fallback)</span>';
    indicator.className = 'text-xs';
  }
}

// Update hint text
function updateHintText() {
  const hintText = document.getElementById('usage-hint-text');
  if (hintText) {
    hintText.textContent = 'Hover/tap words for translation · Click/tap again to hear the sentence';
  }
}

// Load dictionary via hoverTranslations.js with status UI
updateDictionaryStatus('loading');
loadHoverDictionary().then(success => {
  updateDictionaryStatus(success ? 'loaded' : 'error');
});

// Adjust tooltip positions for elements near container edges
function adjustTooltipPositions() {
  const container = document.getElementById('simplifier-output');
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const tooltips = container.querySelectorAll('.word-tooltip, .phrase-tooltip');

  tooltips.forEach(tooltip => {
    tooltip.classList.remove('tooltip-left', 'tooltip-right');

    const rect = tooltip.getBoundingClientRect();
    const tooltipCenter = rect.left + rect.width / 2;
    const estimatedTooltipWidth = 150;
    const halfTooltip = estimatedTooltipWidth / 2;

    if (tooltipCenter - halfTooltip < containerRect.left + 10) {
      tooltip.classList.add('tooltip-left');
    } else if (tooltipCenter + halfTooltip > containerRect.right - 10) {
      tooltip.classList.add('tooltip-right');
    }
  });
}

// Auto-resize textarea based on content
function autoResizeTextarea(textarea) {
  const computedStyle = window.getComputedStyle(textarea);
  const maxHeight = parseInt(computedStyle.maxHeight) || 500;

  textarea.style.height = 'auto';
  const newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = newHeight + 'px';
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

// Detect if text is likely English (to filter from audio)
function isLikelyEnglish(text) {
  const englishPatterns = [
    /^I\s+(see|would|can|will|have|am|think|notice)/i,
    /^(If you|You've|You can|You may|Feel free|This is|That is|Here is)/i,
    /^(The text|Your text|This text|That text)/i,
    /\b(you'd like|you would|I'll help|I can help|paste it|already at)\b/i,
    /\b(simplif|translat|Portuguese|English|level|greeting)/i,
    /\b(here and|just paste|any text)\b/i
  ];
  return englishPatterns.some(pattern => pattern.test(text));
}

// Check if text contains emoji
function containsEmoji(text) {
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiPattern.test(text);
}

async function simplifyText() {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');
  const simplifyBtn = document.getElementById('simplify-btn');
  const copyBtn = document.getElementById('copy-btn');

  const inputText = input.value.trim();

  if (!inputText) {
    output.innerHTML = '<div class="text-red-600 p-4">Please enter some text to simplify.</div>';
    return;
  }

  const selectedLevel = document.querySelector('input[name="simplifier-level"]:checked').value;
  const levelUpper = selectedLevel.toUpperCase();
  const drillId = `${selectedLevel}-simplifier`;

  // Track simplifier usage with Plausible
  if (window.plausible) {
    plausible('Simplifier', { props: {
      level: levelUpper,
      text: inputText.substring(0, 500)
    }});
  }

  simplifyBtn.disabled = true;
  const originalButtonText = simplifyBtn.textContent;
  simplifyBtn.textContent = 'Simplifying...';
  copyBtn.classList.add('hidden');

  output.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div><p class="text-slate-600">Simplifying text to ${levelUpper} level...</p></div></div>`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: null,
        drillId: drillId,
        message: inputText,
        isNewSession: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Pre-fetch translations for unknown words before rendering
    const unknownWords = extractUnknownWords(data.response);
    if (unknownWords.length > 0) {
      output.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div><p class="text-slate-600">Loading translations for ${unknownWords.length} words...</p></div></div>`;
      await fetchUnknownTranslations(unknownWords);
    }

    // Display the simplified text with clickable sentences
    output.innerHTML = formatSimplifiedTextWithSentences(data.response);

    // Adjust tooltip positions for edge words
    adjustTooltipPositions();

    // Log to D1 database (async, don't wait)
    const userId = window.location.hash ? window.location.hash.substring(1) : null;
    fetch('/api/simplifier-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: levelUpper,
        input_text: inputText,
        output_text: data.response,
        user_id: userId
      })
    }).catch(err => console.log('Log error:', err));

    // Show floating avatar
    const floatingAvatar = document.getElementById('simplifier-avatar');
    if (floatingAvatar && window.avatarController) {
      floatingAvatar.innerHTML = window.avatarController.getInlineHtml('w-20 h-20');
      floatingAvatar.classList.remove('hidden');
    }

    // Show copy, speak, share, clear buttons, and hints
    copyBtn.classList.remove('hidden');
    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) speakBtn.classList.remove('hidden');
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.classList.remove('hidden');
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.classList.remove('hidden');
    const usageHint = document.getElementById('usage-hint');
    if (usageHint) {
      usageHint.classList.remove('opacity-0');
      usageHint.classList.add('opacity-100');
      updateHintText();
    }

  } catch (error) {
    console.error('Error simplifying text:', error);

    let errorMessage = 'Connection error. ';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. ';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Check your connection. ';
    } else if (error.message.includes('Server error')) {
      errorMessage = error.message + ' ';
    }

    output.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-red-800 text-sm mb-3">${errorMessage}</p><button onclick="simplifyText()" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">Retry</button></div>`;

  } finally {
    simplifyBtn.disabled = false;
    simplifyBtn.textContent = originalButtonText;
  }
}

function updateSimplifierLabels() {
  const selectedLevel = document.querySelector('input[name="simplifier-level"]:checked').value;
  const levelUpper = selectedLevel.toUpperCase();

  const simplifyBtn = document.getElementById('simplify-btn');
  simplifyBtn.textContent = `Simplify to ${levelUpper}`;

  const outputLabel = document.getElementById('simplifier-output-label');
  outputLabel.textContent = `Simplified ${levelUpper}-Level Portuguese`;

  const featuresBox = document.getElementById('simplifier-features');
  if (selectedLevel === 'a1') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">A1 Features:</div>
        <div>✓ Present tense (presente)</div>
        <div>✓ Simple past (pretérito perfeito)</div>
        <div>✓ Immediate future (ir + infinitive)</div>
        <div>✓ Basic vocabulary only</div>
        <div>✓ Short, clear sentences (max 10-12 words)</div>
      </div>
    `;
  } else if (selectedLevel === 'a2') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">A2 Features:</div>
        <div>✓ Past tenses (Perfeito & Imperfeito)</div>
        <div>✓ Present Continuous (estar + gerúndio)</div>
        <div>✓ Immediate future (ir + infinitive)</div>
        <div>✓ Expanded vocabulary & cognates</div>
        <div>✓ Longer sentences (up to 15-20 words)</div>
        <div>✓ Relative clauses with 'que'</div>
      </div>
    `;
  } else if (selectedLevel === 'b1') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">B1 Features:</div>
        <div>✓ Future tense (simple future)</div>
        <div>✓ Conditional tense</div>
        <div>✓ Present subjunctive (basic use)</div>
        <div>✓ Passive voice constructions</div>
        <div>✓ More complex sentence structures</div>
        <div>✓ Expanded vocabulary</div>
      </div>
    `;
  } else if (selectedLevel === 'b2') {
    featuresBox.innerHTML = `
      <div class="text-xs text-blue-900 space-y-1">
        <div class="font-semibold mb-1">B2 Features:</div>
        <div>✓ All verb tenses including subjunctive</div>
        <div>✓ Compound tenses (perfect, pluperfect)</div>
        <div>✓ Sophisticated vocabulary</div>
        <div>✓ Complex sentence structures</div>
        <div>✓ Idiomatic expressions</div>
        <div>✓ Passive voice</div>
      </div>
    `;
  }
}

function openSimplifierPage(event, level) {
  event.preventDefault();
  event.stopPropagation();

  const url = `/simplifier.html?level=${level}`;
  window.open(url, '_blank');
}

function copySimplifiedText() {
  const output = document.getElementById('simplifier-output');
  const textContent = output.textContent.trim();

  if (textContent) {
    navigator.clipboard.writeText(textContent).then(() => {
      const copyBtn = document.getElementById('copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
      alert('Failed to copy text to clipboard');
    });
  }
}

function clearSimplifier() {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');
  const copyBtn = document.getElementById('copy-btn');
  const speakBtn = document.getElementById('speak-btn');
  const shareBtn = document.getElementById('share-btn');
  const clearBtn = document.getElementById('clear-btn');
  const usageHint = document.getElementById('usage-hint');

  input.value = '';
  copyBtn.classList.add('hidden');
  if (speakBtn) speakBtn.classList.add('hidden');
  if (shareBtn) shareBtn.classList.add('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (usageHint) {
    usageHint.classList.remove('opacity-100');
    usageHint.classList.add('opacity-0');
  }

  // Hide floating avatar
  const floatingAvatar = document.getElementById('simplifier-avatar');
  if (floatingAvatar) floatingAvatar.classList.add('hidden');

  // Stop any ongoing speech
  if (typeof portugueseSpeech !== 'undefined') {
    portugueseSpeech.stop();
  }

  output.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><div class="text-center"><svg class="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p class="text-sm">Simplified text will appear here</p></div></div>';
}

async function shareSimplification() {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');
  const shareBtn = document.getElementById('share-btn');

  const inputText = input.value.trim();
  const outputText = output.textContent.trim();
  const selectedLevel = document.querySelector('input[name="simplifier-level"]:checked').value.toUpperCase();

  if (!inputText || !outputText) {
    alert('Nothing to share. Please simplify some text first.');
    return;
  }

  const originalButtonText = shareBtn.textContent;
  shareBtn.disabled = true;
  shareBtn.textContent = 'Sharing...';

  try {
    const response = await fetch('/api/simplifier-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: selectedLevel,
        input_text: inputText,
        output_text: outputText
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create share link');
    }

    const data = await response.json();
    const shareUrl = window.location.origin + data.url;

    await navigator.clipboard.writeText(shareUrl);

    shareBtn.textContent = 'Link Copied!';
    shareBtn.classList.remove('bg-blue-100', 'hover:bg-blue-200', 'text-blue-700');
    shareBtn.classList.add('bg-green-100', 'text-green-700');

    setTimeout(() => {
      shareBtn.textContent = originalButtonText;
      shareBtn.classList.remove('bg-green-100', 'text-green-700');
      shareBtn.classList.add('bg-blue-100', 'hover:bg-blue-200', 'text-blue-700');
      shareBtn.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Error sharing:', error);
    alert('Failed to create share link. Please try again.');
    shareBtn.textContent = originalButtonText;
    shareBtn.disabled = false;
  }
}

// Format simplified text with clickable sentences and hover tooltips
function formatSimplifiedTextWithSentences(text) {
  // Strip any vocab section if Claude still includes it
  const vocabSeparator = '---VOCAB---';
  let mainText = text;
  if (text.includes(vocabSeparator)) {
    mainText = text.split(vocabSeparator)[0].trim();
  }

  const escaped = escapeHtml(mainText);

  // Split into sentences FIRST (before adding tooltip spans)
  const sentences = escaped.split(/(?<=[.!?])\s+(?=[A-Za-zÀ-ÿ])/);

  if (sentences.length <= 1) {
    const withTooltips = addHoverTooltips(escaped);
    return `<div class="prose prose-slate max-w-none whitespace-pre-wrap" style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;">
      <span class="simplifier-sentence cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors">${withTooltips}</span>
    </div>`;
  }

  const wrappedSentences = sentences
    .filter(s => s.trim())
    .map(sentence => {
      const withTooltips = addHoverTooltips(sentence.trim());
      return `<span class="simplifier-sentence cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors">${withTooltips}</span>`;
    })
    .join(' ');

  return `<div class="prose prose-slate max-w-none whitespace-pre-wrap" style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;">${wrappedSentences}</div>`;
}

// Speak a single sentence when clicked
function speakSentence(element) {
  if (typeof portugueseSpeech === 'undefined') {
    console.warn('Speech not available');
    return;
  }

  portugueseSpeech.stop();

  document.querySelectorAll('.simplifier-sentence').forEach(el => {
    el.classList.remove('bg-green-100');
  });

  let text = element.textContent.trim();
  text = text.replace(/\s*\([^)]+\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  // Skip if text is English or contains emoji
  if (isLikelyEnglish(text) || containsEmoji(text)) {
    console.log('Skipping English/emoji text:', text);
    return;
  }

  element.classList.add('bg-green-100');

  portugueseSpeech.speak(text, {
    onEnd: () => {
      element.classList.remove('bg-green-100');
    },
    onError: () => {
      element.classList.remove('bg-green-100');
    }
  });
}

// Speak all text (Listen button)
function speakSimplifiedText() {
  const output = document.getElementById('simplifier-output');
  const speakBtn = document.getElementById('speak-btn');
  const sentences = output.querySelectorAll('.simplifier-sentence');

  if (sentences.length === 0) {
    console.warn('No sentences to speak');
    return;
  }

  if (typeof portugueseSpeech === 'undefined') {
    console.warn('Speech not available');
    return;
  }

  portugueseSpeech.stop();

  const originalHTML = speakBtn.innerHTML;
  speakBtn.innerHTML = `
    <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
    </svg>
    Stop
  `;
  speakBtn.disabled = false;
  speakBtn.onclick = stopSimplifiedSpeech;

  let currentIndex = 0;

  function speakNext() {
    if (currentIndex >= sentences.length) {
      resetSpeakButton();
      return;
    }

    const sentence = sentences[currentIndex];

    let text = sentence.textContent.trim();
    text = text.replace(/\s*\([^)]+\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

    // Skip English/emoji sentences
    if (isLikelyEnglish(text) || containsEmoji(text)) {
      console.log('Skipping English/emoji in Listen All:', text);
      currentIndex++;
      speakNext();
      return;
    }

    sentences.forEach(el => el.classList.remove('bg-green-100'));
    sentence.classList.add('bg-green-100');
    sentence.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    portugueseSpeech.speak(text, {
      onEnd: () => {
        sentence.classList.remove('bg-green-100');
        currentIndex++;
        speakNext();
      },
      onError: () => {
        sentence.classList.remove('bg-green-100');
        resetSpeakButton();
      }
    });
  }

  function resetSpeakButton() {
    speakBtn.innerHTML = originalHTML;
    speakBtn.onclick = speakSimplifiedText;
    sentences.forEach(el => el.classList.remove('bg-green-100'));
  }

  window._resetSimplifierSpeakBtn = resetSpeakButton;

  speakNext();
}

function stopSimplifiedSpeech() {
  if (typeof portugueseSpeech !== 'undefined') {
    portugueseSpeech.stop();
  }
  if (typeof window._resetSimplifierSpeakBtn === 'function') {
    window._resetSimplifierSpeakBtn();
  }
}

// Load shared simplification
async function loadSharedSimplification(shareId) {
  const input = document.getElementById('simplifier-input');
  const output = document.getElementById('simplifier-output');

  try {
    output.innerHTML = '<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div><p class="text-slate-600">Loading shared simplification...</p></div></div>';

    const response = await fetch(`/api/simplifier-share?id=${shareId}`);

    if (!response.ok) {
      throw new Error('Failed to load shared simplification');
    }

    const data = await response.json();

    const levelRadio = document.querySelector(`input[name="simplifier-level"][value="${data.level.toLowerCase()}"]`);
    if (levelRadio) {
      levelRadio.checked = true;
      updateSimplifierLabels();
    }

    input.value = data.input_text;
    autoResizeTextarea(input);

    // Pre-fetch translations for unknown words before rendering
    const unknownWords = extractUnknownWords(data.output_text);
    if (unknownWords.length > 0) {
      output.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div><p class="text-slate-600">Loading translations for ${unknownWords.length} words...</p></div></div>`;
      await fetchUnknownTranslations(unknownWords);
    }

    output.innerHTML = formatSimplifiedTextWithSentences(data.output_text);
    adjustTooltipPositions();

    // Show buttons
    const copyBtn = document.getElementById('copy-btn');
    const speakBtn = document.getElementById('speak-btn');
    const shareBtn = document.getElementById('share-btn');
    const clearBtn = document.getElementById('clear-btn');
    const usageHint = document.getElementById('usage-hint');

    if (copyBtn) copyBtn.classList.remove('hidden');
    if (speakBtn) speakBtn.classList.remove('hidden');
    if (shareBtn) shareBtn.classList.remove('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
    if (usageHint) {
      usageHint.classList.remove('opacity-0');
      usageHint.classList.add('opacity-100');
      updateHintText();
    }

  } catch (error) {
    console.error('Error loading shared simplification:', error);
    output.innerHTML = '<div class="bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-red-800 text-sm">Failed to load shared simplification. The link may be invalid or expired.</p></div>';
  }
}

// Check for level URL parameter and shared content on page load
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const levelParam = urlParams.get('level');
  const shareId = urlParams.get('share');

  if (levelParam && ['a1', 'a2', 'b1', 'b2'].includes(levelParam)) {
    const radioButton = document.querySelector(`input[name="simplifier-level"][value="${levelParam}"]`);
    if (radioButton) {
      radioButton.checked = true;
      updateSimplifierLabels();
    }
  }

  if (shareId) {
    await loadSharedSimplification(shareId);
  }

  // Readjust tooltip positions on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustTooltipPositions, 100);
  });

  // Handle clicks for tooltips and sentence audio (two-tap on mobile)
  document.addEventListener('click', (e) => {
    const tooltip = e.target.closest('.word-tooltip, .phrase-tooltip');
    const sentence = e.target.closest('.simplifier-sentence');

    document.querySelectorAll('.word-tooltip.active, .phrase-tooltip.active').forEach(el => {
      if (el !== tooltip) el.classList.remove('active');
    });

    if (tooltip) {
      if (tooltip.classList.contains('active')) {
        tooltip.classList.remove('active');
        if (sentence) {
          speakSentence(sentence);
        }
      } else {
        tooltip.classList.add('active');
      }
    } else if (sentence) {
      speakSentence(sentence);
    }
  });
});
