// Shared hover translation system for Portuguese words
// Used by simplifier and tutor chat

let hoverDictionary = { phrases: {}, words: {} };
let hoverDictionaryLoaded = false;
let normalizedWords = {};
let normalizedPhrases = {};

// Common cognates that don't need translation
const COGNATES_REGEX = /^(importante|problema|diferente|interessante|possível|impossível|normal|especial|original|natural|final|total|principal|central|federal|social|musical|hospital|hotel|animal|capital|canal|festival|global|local|real|legal|digital|virtual|visual|ideal|formal|informal)$/i;

// Normalize text by removing diacritics (accents) for fallback matching
function normalizeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Get cached translation from localStorage
function getCachedTranslation(word) {
  try {
    const cache = JSON.parse(localStorage.getItem('translationCache') || '{}');
    return cache[word.toLowerCase()];
  } catch {
    return null;
  }
}

// Cache a translation in localStorage
function cacheTranslation(word, translation) {
  try {
    const cache = JSON.parse(localStorage.getItem('translationCache') || '{}');
    cache[word.toLowerCase()] = translation;
    localStorage.setItem('translationCache', JSON.stringify(cache));
  } catch (error) {
    console.warn('[HoverTranslations] Failed to cache:', error);
  }
}

// Build normalized lookup maps for fallback matching
function buildNormalizedMaps() {
  normalizedWords = {};
  normalizedPhrases = {};

  for (const key of Object.keys(hoverDictionary.words)) {
    const normalized = normalizeAccents(key);
    if (!normalizedWords[normalized]) {
      normalizedWords[normalized] = key;
    }
  }
  for (const key of Object.keys(hoverDictionary.phrases)) {
    const normalized = normalizeAccents(key);
    if (!normalizedPhrases[normalized]) {
      normalizedPhrases[normalized] = key;
    }
  }
}

// Load dictionary from JSON file
async function loadHoverDictionary() {
  if (hoverDictionaryLoaded) return true;
  try {
    const response = await fetch('/config/dictionary.json');
    if (response.ok) {
      hoverDictionary = await response.json();
      hoverDictionaryLoaded = true;
      buildNormalizedMaps();
      console.log('[HoverTranslations] Dictionary loaded:',
        Object.keys(hoverDictionary.words).length, 'words,',
        Object.keys(hoverDictionary.phrases).length, 'phrases');
      return true;
    }
  } catch (error) {
    console.warn('[HoverTranslations] Failed to load dictionary:', error);
  }
  return false;
}

// Lookup word in dictionary (dictionary first, then normalized, then cache)
function lookupWord(word) {
  const lower = word.toLowerCase();

  // Exact match in dictionary
  if (hoverDictionary.words[lower]) {
    return hoverDictionary.words[lower];
  }

  // Normalized (accent-insensitive) lookup
  const normalized = normalizeAccents(lower);
  if (normalizedWords[normalized]) {
    const originalKey = normalizedWords[normalized];
    return hoverDictionary.words[originalKey];
  }

  // Check localStorage cache (from previous Claude translations)
  const cached = getCachedTranslation(lower);
  if (cached) {
    return cached;
  }

  return null;
}

// Lookup phrase in dictionary
function lookupPhrase(phrase) {
  const lower = phrase.toLowerCase();

  if (hoverDictionary.phrases[lower]) {
    return hoverDictionary.phrases[lower];
  }

  const normalized = normalizeAccents(lower);
  if (normalizedPhrases[normalized]) {
    const originalKey = normalizedPhrases[normalized];
    return hoverDictionary.phrases[originalKey];
  }

  return null;
}

// Add hover tooltips to text (main function)
function addHoverTooltips(text) {
  if (!hoverDictionaryLoaded) return text;

  let withTooltips = text;

  // Get all phrases from dictionary, sorted by length (longest first)
  const phrases = Object.entries(hoverDictionary.phrases || {})
    .sort((a, b) => b[0].length - a[0].length);

  // Process multi-word phrases FIRST
  for (const [phrase, translation] of phrases) {
    const safeTranslation = translation.replace(/"/g, '&quot;');
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match phrase not preceded or followed by letters (including accented)
    const phraseRegex = new RegExp(`(?<![A-Za-zÀ-ÿ])(${escapedPhrase})(?![A-Za-zÀ-ÿ])`, 'gi');
    withTooltips = withTooltips.replace(phraseRegex, function(match) {
      return `<span class="phrase-tooltip" data-translation="${safeTranslation}">${match}</span>`;
    });
  }

  // DYNAMIC PATTERN: ir + infinitive (vai falar = "is going to speak")
  const irInfinitiveRegex = /(?<![A-Za-zÀ-ÿ<])(vou|vai|vamos|vão|vais)\s+([A-Za-zÀ-ÿ]*(?:ar|er|ir))(?![A-Za-zÀ-ÿ])/gi;
  withTooltips = withTooltips.replace(irInfinitiveRegex, function(match, irForm, infinitive) {
    const verbTranslation = lookupWord(infinitive);
    let baseVerb;
    if (verbTranslation) {
      baseVerb = verbTranslation
        .split(/;\s*/)
        .map(part => part.replace(/^to\s+/i, '').trim())
        .join('/');
    } else {
      baseVerb = infinitive;
    }
    const goingTo = irForm.toLowerCase() === 'vou' ? 'am going to' :
                    irForm.toLowerCase() === 'vai' ? 'is going to' : 'are going to';
    const translation = `${goingTo} ${baseVerb}`;
    const safeTranslation = translation.replace(/"/g, '&quot;');
    return `<span class="phrase-tooltip" data-translation="${safeTranslation}">${match}</span>`;
  });

  // Process single words (skip words already inside spans)
  withTooltips = withTooltips.replace(/(<span[^>]*>.*?<\/span>)|([A-Za-zÀ-ÿ]+)/g, function(match, spanGroup, wordGroup) {
    if (spanGroup) {
      return spanGroup;
    }

    const translation = lookupWord(wordGroup);
    if (translation) {
      const safeTranslation = translation.replace(/"/g, '&quot;');
      return `<span class="word-tooltip" data-translation="${safeTranslation}">${wordGroup}</span>`;
    }

    return wordGroup;
  });

  return withTooltips;
}

// Check if dictionary is loaded
function isHoverDictionaryLoaded() {
  return hoverDictionaryLoaded;
}

// Extract unknown words from text (not in dictionary or cache)
function extractUnknownWords(text) {
  const words = text.match(/[A-Za-zÀ-ÿ]+/g) || [];
  const unknownWords = new Set();

  for (const word of words) {
    const lower = word.toLowerCase();
    // Skip short words
    if (lower.length < 3) continue;
    // Skip if in dictionary
    if (hoverDictionary.words[lower]) continue;
    const normalized = normalizeAccents(lower);
    if (normalizedWords[normalized]) continue;
    // Skip if cached
    if (getCachedTranslation(lower)) continue;
    // Skip cognates
    if (COGNATES_REGEX.test(lower)) continue;
    unknownWords.add(lower);
  }

  return Array.from(unknownWords);
}

// Fetch translations for unknown words from Claude API
async function fetchUnknownTranslations(words) {
  if (words.length === 0) return;

  const batch = words.slice(0, 30);
  console.log('[HoverTranslations] Fetching translations for:', batch);

  try {
    const response = await fetch('/api/translate-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: batch })
    });

    if (!response.ok) {
      console.warn('[HoverTranslations] API failed:', response.status);
      return;
    }

    const data = await response.json();

    if (data.translations) {
      for (const [word, translation] of Object.entries(data.translations)) {
        if (translation) {
          cacheTranslation(word, translation);
        }
      }
      console.log('[HoverTranslations] Cached', Object.keys(data.translations).length, 'translations');
    }
  } catch (error) {
    console.warn('[HoverTranslations] Failed to fetch:', error);
  }
}

// Add tooltips with automatic unknown word fetching
async function addHoverTooltipsWithFetch(text) {
  // First, fetch any unknown words
  const unknownWords = extractUnknownWords(text);
  if (unknownWords.length > 0) {
    await fetchUnknownTranslations(unknownWords);
  }
  // Then add tooltips (now including newly cached words)
  return addHoverTooltips(text);
}

// Make functions available globally
window.loadHoverDictionary = loadHoverDictionary;
window.addHoverTooltips = addHoverTooltips;
window.addHoverTooltipsWithFetch = addHoverTooltipsWithFetch;
window.isHoverDictionaryLoaded = isHoverDictionaryLoaded;
window.lookupWord = lookupWord;
window.lookupPhrase = lookupPhrase;
window.extractUnknownWords = extractUnknownWords;
window.fetchUnknownTranslations = fetchUnknownTranslations;
