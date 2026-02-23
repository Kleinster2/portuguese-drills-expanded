// Viseme Mapping System - Text-to-viseme conversion and scheduling for avatar lip-sync
// Supports Brazilian Portuguese (primary) and English (simplified)

// Viseme IDs: rest, ah, uh, oh, ee, oo, fv, mbp, sz, sh, td, eh, eh2, l, pal, oh2, w, kg, r
// Nasal flag: overlay indicator for nasal vowels (ã, õ)
const VISEME = {
  REST: 'rest', AH: 'ah', UH: 'uh', OH: 'oh', EE: 'ee', OO: 'oo', FV: 'fv', MBP: 'mbp',
  SZ: 'sz', SH: 'sh', TD: 'td',
  EH: 'eh', EH2: 'eh2', L: 'l', PAL: 'pal', OH2: 'oh2', W: 'w', KG: 'kg', R: 'r'
};

// ── Portuguese grapheme-to-viseme mapping ──

// Digraphs that should be consumed as pairs (order matters: check digraphs before single chars)
const PT_DIGRAPHS = {
  'lh': VISEME.PAL,   // palatal lateral [ʎ]
  'nh': VISEME.PAL,   // palatal nasal [ɲ]
  'ch': VISEME.SH,    // postalveolar [ʃ]
  'rr': VISEME.R,     // guttural/uvular [h]/[x]
  'ss': VISEME.SZ,    // voiceless sibilant [s]
  // qu/gu handled dynamically in textToVisemesPortuguese (u is pronounced [w] before a/o)
};

// Single character mappings for Portuguese
const PT_VOWELS = {
  'a': VISEME.AH, 'á': VISEME.AH, 'à': VISEME.AH, 'â': VISEME.UH, 'ã': VISEME.UH,
  'e': VISEME.EE, 'é': VISEME.EH, 'ê': VISEME.EH2,
  'i': VISEME.EE, 'í': VISEME.EE,
  'o': VISEME.OH, 'ó': VISEME.OH, 'ô': VISEME.OH2, 'õ': VISEME.OH2,
  'u': VISEME.OO, 'ú': VISEME.OO, 'ü': VISEME.OO,
};

// Nasal vowel characters (triggers nasal overlay)
const NASAL_VOWELS = new Set(['ã', 'õ']);

const PT_CONSONANTS = {
  // m is handled separately (word-final m nasalizes the vowel, no lip closure)
  'b': VISEME.MBP,
  'p': VISEME.MBP,
  'f': VISEME.FV,
  'v': VISEME.FV,
  's': VISEME.SZ,
  'z': VISEME.SZ,
  'ç': VISEME.SZ,
  'x': VISEME.SH,    // most common pronunciation [ʃ]
  'j': VISEME.SH,
  't': VISEME.TD,
  'd': VISEME.TD,
  'n': VISEME.TD,
  'k': VISEME.KG,
  'r': VISEME.R,
  'w': VISEME.W,
  // c, g: context-dependent, handled dynamically below
  // l is handled separately (syllable-final l → [u] vocalization)
  // All other consonants → EE (neutral open)
};

// Default consonant viseme
const DEFAULT_CONSONANT = VISEME.EE;

// Set of all vowel visemes (for duration adjustments)
const VOWEL_VISEMES = new Set([VISEME.AH, VISEME.UH, VISEME.OH, VISEME.OO, VISEME.EE, VISEME.EH, VISEME.EH2, VISEME.OH2]);

/**
 * Convert Portuguese text to a viseme sequence.
 * Rules-based grapheme-to-viseme for Brazilian Portuguese.
 * @param {string} text
 * @returns {Array<{viseme: string, charIndex: number, nasal: boolean}>}
 */
function textToVisemesPortuguese(text) {
  const result = [];
  const lower = text.toLowerCase();
  let i = 0;

  while (i < lower.length) {
    const ch = lower[i];
    const next = i + 1 < lower.length ? lower[i + 1] : '';
    const digraph = ch + next;

    // Spaces → REST
    if (ch === ' ') {
      result.push({ viseme: VISEME.REST, charIndex: i, nasal: false, grapheme: ' ' });
      i++;
      continue;
    }

    // Sentence punctuation → REST (longer pause handled in timing)
    if (/[.!?;:,\n\r]/.test(ch)) {
      result.push({ viseme: VISEME.REST, charIndex: i, nasal: false, grapheme: ch });
      i++;
      continue;
    }

    // Skip non-letter characters
    if (!/[\p{L}]/u.test(ch)) {
      i++;
      continue;
    }

    // Check digraphs first
    if (next && PT_DIGRAPHS[digraph] !== undefined) {
      result.push({ viseme: PT_DIGRAPHS[digraph], charIndex: i, nasal: false, grapheme: digraph });
      i += 2;
      continue;
    }

    // qu/gu digraphs: before a/o the u is pronounced [w] (rounded lips)
    if ((ch === 'q' || ch === 'g') && next === 'u') {
      const afterU = i + 2 < lower.length ? lower[i + 2] : '';
      if (afterU === 'a' || afterU === 'o' || afterU === 'á' || afterU === 'à' || afterU === 'â' || afterU === 'ã' || afterU === 'ó' || afterU === 'ô' || afterU === 'õ') {
        result.push({ viseme: VISEME.KG, charIndex: i, nasal: false, grapheme: ch });
        result.push({ viseme: VISEME.W, charIndex: i + 1, nasal: false, grapheme: 'u' });
        i += 2;
      } else {
        result.push({ viseme: VISEME.KG, charIndex: i, nasal: false, grapheme: ch + 'u' });
        i += 2;
      }
      continue;
    }

    // Vowels
    if (PT_VOWELS[ch] !== undefined) {
      let viseme = PT_VOWELS[ch];
      let grapheme = ch;
      const nasal = NASAL_VOWELS.has(ch);

      // Unstressed 'o' rules (BR Portuguese):
      if (ch === 'o' && !isAccented(ch)) {
        if (i === findWordEnd(lower, i)) {
          viseme = VISEME.OO;
          grapheme = 'o→u';  // show the reduction
        } else {
          viseme = VISEME.OH2;
          grapheme = 'o→ô';
        }
      }

      // Pre-nasal 'e' → EH2: unaccented 'e' before word-final m/n is [ẽ] (close-mid nasal)
      if (ch === 'e' && !isAccented(ch)) {
        const wordEnd = findWordEnd(lower, i);
        if (next && (next === 'm' || next === 'n') && (i + 1 === wordEnd)) {
          viseme = VISEME.EH2;
          grapheme = 'e→ẽ';
        }
      }

      // Pre-nasal 'a' → UH: unstressed 'a' before word-final m/n is [ɐ̃]
      if (ch === 'a' && !isAccented(ch)) {
        const wordEnd = findWordEnd(lower, i);
        if (next && (next === 'm' || next === 'n') && (i + 1 === wordEnd)) {
          viseme = VISEME.UH;
          grapheme = 'a→ɐ';
        }
      }

      result.push({ viseme, charIndex: i, nasal, grapheme });
      i++;
      continue;
    }

    // Syllable-final l → [u] vocalization (Rule 6): l before consonant or at word end
    if (ch === 'l') {
      const wordEnd = findWordEnd(lower, i);
      const isWordFinal = (i === wordEnd);
      const nextIsConsonant = next && /[\p{L}]/u.test(next) && !PT_VOWELS[next];
      if (isWordFinal || nextIsConsonant) {
        result.push({ viseme: VISEME.W, charIndex: i, nasal: false, grapheme: 'l→u' });
        i++;
        continue;
      }
      result.push({ viseme: VISEME.L, charIndex: i, nasal: false, grapheme: 'l' });
      i++;
      continue;
    }

    // Word-final nasal m/n: nasalizes the preceding vowel + adds diphthong glide
    if (ch === 'm' || ch === 'n') {
      const wordEnd = findWordEnd(lower, i);
      if (i === wordEnd) {
        // Nasalize the preceding vowel
        const prev = result.length > 0 ? result[result.length - 1] : null;
        if (prev && VOWEL_VISEMES.has(prev.viseme)) {
          prev.nasal = true;

          // Nasal diphthong glides:
          //   -em/-en [ẽj̃] → glide to EE
          //   -om/-on [õw̃] → glide to W
          //   -um/-un [ũw̃] → glide to W
          //   -am/-ãm [ɐ̃w̃] → glide to W
          //   -im/-in [ĩ]  → no glide (already front closed)
          const prevV = prev.viseme;
          if (prevV === VISEME.EH || prevV === VISEME.EH2) {
            // -em/-en: front glide [j̃]
            result.push({ viseme: VISEME.EE, charIndex: i, nasal: true, grapheme: '→j̃' });
          } else if (prevV === VISEME.OH || prevV === VISEME.OH2 || prevV === VISEME.OO || prevV === VISEME.AH || prevV === VISEME.UH) {
            // -om/-on, -um/-un, -am: back/round glide [w̃]
            result.push({ viseme: VISEME.W, charIndex: i, nasal: true, grapheme: '→w̃' });
          }
          // -im/-in: no glide needed (already EE)
        }
        i++;
        continue;
      }
      if (ch === 'm') {
        result.push({ viseme: VISEME.MBP, charIndex: i, nasal: false, grapheme: 'm' });
      } else {
        result.push({ viseme: VISEME.TD, charIndex: i, nasal: false, grapheme: 'n' });
      }
      i++;
      continue;
    }

    // Context-dependent consonants (Brazilian Portuguese)

    // c before e/i → [s] → SZ; otherwise [k] → KG
    if (ch === 'c') {
      if (next && /[eiéêí]/.test(next)) {
        result.push({ viseme: VISEME.SZ, charIndex: i, nasal: false, grapheme: 'c→s' });
      } else {
        result.push({ viseme: VISEME.KG, charIndex: i, nasal: false, grapheme: 'c' });
      }
      i++;
      continue;
    }

    // g before e/i → [ʒ] → SH; otherwise [g] → KG (gu handled above)
    if (ch === 'g') {
      if (next && /[eiéêí]/.test(next)) {
        result.push({ viseme: VISEME.SH, charIndex: i, nasal: false, grapheme: 'g→j' });
      } else {
        result.push({ viseme: VISEME.KG, charIndex: i, nasal: false, grapheme: 'g' });
      }
      i++;
      continue;
    }

    // t/d before i → [tʃ]/[dʒ] → SH (BR Portuguese palatalization)
    if ((ch === 't' || ch === 'd') && next && /[ií]/.test(next)) {
      result.push({ viseme: VISEME.SH, charIndex: i, nasal: false, grapheme: ch + '→' + (ch === 't' ? 'tch' : 'dj') });
      i++;
      continue;
    }

    // Consonants with specific visemes
    if (PT_CONSONANTS[ch] !== undefined) {
      result.push({ viseme: PT_CONSONANTS[ch], charIndex: i, nasal: false, grapheme: ch });
      i++;
      continue;
    }

    // All other consonants → EE (neutral open)
    result.push({ viseme: DEFAULT_CONSONANT, charIndex: i, nasal: false, grapheme: ch });
    i++;
  }

  return result;
}

// Helper: find the index of the last letter of the word containing position `pos`
function findWordEnd(text, pos) {
  let end = pos;
  while (end + 1 < text.length && /[\p{L}]/u.test(text[end + 1])) {
    end++;
  }
  return end;
}

// Helper: check if a character is accented
function isAccented(ch) {
  return /[áàâãéêíóôõúü]/.test(ch);
}


// ── Timing estimation ──

/**
 * Estimate viseme timing based on sequence, speech rate, and language.
 * @param {Array<{viseme: string, charIndex: number, nasal: boolean}>} visemeSequence
 * @param {number} rate - Speech rate (1.0 = normal)
 * @param {string} lang - 'pt-BR' or 'en-US'
 * @returns {{timeline: Array<{viseme: string, time: number, duration: number, nasal: boolean}>, estimatedDuration: number}}
 */
function estimateVisemeTiming(visemeSequence, rate = 1.0, lang = 'pt-BR') {
  if (!visemeSequence || visemeSequence.length === 0) {
    return { timeline: [], estimatedDuration: 0 };
  }

  // Base characters per second (adjusted by speech rate)
  const baseCharsPerSec = lang.startsWith('pt') ? 12 : 13;
  const charsPerSec = baseCharsPerSec * rate;
  const baseVisemeDuration = 1.0 / charsPerSec; // seconds per viseme

  // Coalesce consecutive identical visemes and build timeline
  const timeline = [];
  let currentTime = 0;

  for (let i = 0; i < visemeSequence.length; i++) {
    const { viseme, nasal, grapheme } = visemeSequence[i];

    // Duration adjustments
    let duration = baseVisemeDuration;
    if (viseme === VISEME.REST) {
      duration = baseVisemeDuration * 1.5;
    } else if (VOWEL_VISEMES.has(viseme)) {
      duration = baseVisemeDuration * 1.2;
    } else {
      duration = baseVisemeDuration * 0.8;
    }

    // Coalesce with previous if same viseme and same nasal state
    const prev = timeline.length > 0 ? timeline[timeline.length - 1] : null;
    if (prev && prev.viseme === viseme && prev.nasal === nasal) {
      prev.duration += duration;
    } else {
      timeline.push({ viseme, time: currentTime, duration, nasal, grapheme: grapheme || '' });
    }

    currentTime += duration;
  }

  return {
    timeline,
    estimatedDuration: currentTime
  };
}


// ── Viseme Scheduler ──

class VisemeScheduler {
  constructor() {
    this._timeline = [];
    this._estimatedDuration = 0;
    this._audioElement = null;
    this._startTime = 0;
    this._rafId = null;
    this._running = false;
    this._currentViseme = VISEME.REST;
    this._currentNasal = false;
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Viseme label log: accumulates tags during speech
    this._lastLabelViseme = '';
    this._currentWordRow = null;
  }

  /**
   * Prepare a viseme timeline for playback.
   * @param {Array<{viseme: string, time: number, duration: number, nasal: boolean}>} timeline
   * @param {number} estimatedDuration
   */
  schedule(timeline, estimatedDuration) {
    this._timeline = timeline;
    this._estimatedDuration = estimatedDuration;
    this._nextIdx = 0; // sequential index for guaranteed tag display
  }

  /**
   * Start viseme playback synced to a Cloud TTS audio element.
   * Polls audio.currentTime via rAF, scales timeline to audio.duration.
   * @param {HTMLAudioElement} audioElement
   */
  startWithAudio(audioElement) {
    this.stop();
    this._audioElement = audioElement;
    this._running = true;
    this._nextIdx = 0;

    if (this._reducedMotion) {
      // Static open mouth for reduced motion
      this._setViseme(VISEME.AH, false);
      return;
    }

    this._tick = this._tickAudio.bind(this);
    this._rafId = requestAnimationFrame(this._tick);
  }

  /**
   * Start viseme playback using estimated timing (for Web Speech API).
   * Uses performance.now() elapsed time.
   */
  startEstimated() {
    this.stop();
    this._audioElement = null;
    this._startTime = performance.now();
    this._running = true;
    this._nextIdx = 0;

    if (this._reducedMotion) {
      this._setViseme(VISEME.AH, false);
      return;
    }

    this._tick = this._tickEstimated.bind(this);
    this._rafId = requestAnimationFrame(this._tick);
  }

  /**
   * Correct timeline position from a Web Speech API onboundary event.
   * @param {number} charIndex - Character index from the boundary event
   */
  correctAtChar(charIndex) {
    if (!this._running || this._audioElement) return; // Only for estimated mode

    // Find the timeline entry closest to this charIndex
    // This would require charIndex mapping in the timeline, which we don't store directly.
    // For now this is a no-op placeholder; the estimated timing is sufficient.
  }

  /**
   * Stop the scheduler and reset to REST viseme.
   */
  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._audioElement = null;
    this._setViseme(VISEME.REST, false);
    // Don't clear viseme log here — it persists until next message
  }

  /**
   * Flush any remaining unvisited timeline entries (so tags are never lost),
   * then stop the scheduler.
   */
  _flushAndStop() {
    // Emit tags for any timeline entries not yet visited
    if (this._timeline && this._nextIdx !== undefined) {
      while (this._nextIdx < this._timeline.length) {
        const entry = this._timeline[this._nextIdx];
        this._logVisemeTag(entry.viseme, entry.nasal, entry.grapheme);
        this._nextIdx++;
      }
    }
    this.stop();
  }

  // Clear the accumulated viseme label log
  clearLog() {
    this._lastLabelViseme = '';
    this._currentWordRow = null;
    const labelEl = document.getElementById('viseme-label');
    if (labelEl) labelEl.innerHTML = '';
  }

  // ── Internal tick loops ──

  _tickAudio() {
    if (!this._running) return;

    const audio = this._audioElement;
    if (!audio || audio.paused || audio.ended) {
      this._rafId = requestAnimationFrame(this._tickAudio.bind(this));
      return;
    }

    const elapsed = audio.currentTime;
    const totalDuration = audio.duration || this._estimatedDuration;
    const scale = this._estimatedDuration > 0 ? totalDuration / this._estimatedDuration : 1;

    // Advance sequentially — never skip timeline entries
    this._advanceTo(elapsed, scale);
    this._rafId = requestAnimationFrame(this._tickAudio.bind(this));
  }

  _tickEstimated() {
    if (!this._running) return;

    const elapsed = (performance.now() - this._startTime) / 1000;

    if (elapsed > this._estimatedDuration + 0.5) {
      // Past the end — flush remaining entries then stop
      this._flushAndStop();
      return;
    }

    // Advance sequentially — never skip timeline entries
    this._advanceTo(elapsed, 1);
    this._rafId = requestAnimationFrame(this._tickEstimated.bind(this));
  }

  /**
   * Advance through timeline entries up to the given elapsed time.
   * Processes entries one by one so no viseme is ever skipped.
   * @param {number} elapsed - seconds
   * @param {number} scale - time scale factor (for audio sync)
   */
  _advanceTo(elapsed, scale) {
    while (this._nextIdx < this._timeline.length) {
      const entry = this._timeline[this._nextIdx];
      const entryTime = entry.time * scale;
      if (elapsed >= entryTime) {
        this._setViseme(entry.viseme, entry.nasal, entry.grapheme);
        this._nextIdx++;
      } else {
        break;
      }
    }
  }

  /**
   * Set the current viseme on all avatars and log the tag, only if changed.
   * @param {string} visemeId
   * @param {boolean} nasal - whether to show nasal overlay
   * @param {string} grapheme - source grapheme for click playback
   */
  _setViseme(visemeId, nasal, grapheme) {
    if (visemeId === this._currentViseme && nasal === this._currentNasal) return;
    this._currentViseme = visemeId;
    this._currentNasal = nasal;

    if (window.avatarController && typeof window.avatarController.setAllViseme === 'function') {
      window.avatarController.setAllViseme(visemeId, nasal);
    }

    this._logVisemeTag(visemeId, nasal, grapheme);
  }

  /**
   * Append a viseme tag to the running log (skip rest and consecutive duplicates).
   * Separated from _setViseme so _flushAndStop can log without moving the avatar mouth.
   */
  _logVisemeTag(visemeId, nasal, grapheme) {
    const labelEl = document.getElementById('viseme-label');
    if (!labelEl) return;

    // REST → start a new word row
    if (visemeId === VISEME.REST) {
      this._lastLabelViseme = '';
      this._currentWordRow = null;
      return;
    }

    // Skip consecutive duplicate visemes
    if (visemeId === this._lastLabelViseme) return;
    this._lastLabelViseme = visemeId;

    // Create a word row if we don't have one
    if (!this._currentWordRow) {
      // Remove highlight from previous last tag
      const prevTag = labelEl.querySelector('.viseme-tag:last-child');
      if (prevTag) prevTag.style.background = '';

      const row = document.createElement('div');
      row.className = 'viseme-word-row';
      labelEl.appendChild(row);
      this._currentWordRow = row;
    }

    const tag = document.createElement('span');
    tag.className = 'viseme-tag' + (nasal ? ' nasal' : '');
    tag.textContent = VISEME_LABELS[visemeId] || visemeId;
    if (nasal) tag.textContent += ' ~nasal';
    tag.dataset.viseme = visemeId;
    tag.dataset.nasal = nasal ? '1' : '';
    tag.dataset.grapheme = grapheme || '';
    tag.onclick = function() { playViseme(this.dataset.viseme, !!this.dataset.nasal, this.dataset.grapheme); };
    this._currentWordRow.appendChild(tag);
    // Auto-scroll to latest
    labelEl.scrollTop = labelEl.scrollHeight;
  }
}


// ── Exports ──

// Human-readable viseme labels for student display
const VISEME_LABELS = {
  rest: '',
  ah:  'ah  (a, á)',
  uh:  'uh  (â, ã, -am)',
  eh:  'eh  (é)',
  eh2: 'ê   (closed e)',
  oh:  'oh  (ó)',
  oh2: 'ô   (closed o)',
  ee:  'ee  (i)',
  oo:  'oo  (u, ú)',
  w:   'w   (u glide)',
  fv:  'f/v (lip bite)',
  mbp: 'm/b/p (lips shut)',
  sz:  's/z (teeth close)',
  sh:  'sh  (ch, j)',
  td:  't/d/n (tongue tip)',
  l:   'l   (tongue lateral)',
  pal: 'lh/nh (palatal)',
  kg:  'k/g (velar)',
  r:   'r   (tap/guttural)',
};

// Sample sounds for each viseme (short PT syllables for demo)
const VISEME_SAMPLES = {
  ah:  'á',   uh:  'â',   eh:  'é',   eh2: 'ê',   oh:  'ó',   oh2: 'ô',
  ee:  'i',   oo:  'u',   w:   'ua',
  fv:  'fa',  mbp: 'ba',  sz:  'sa',  sh:  'cha',
  td:  'da',  l:   'la',  pal: 'lha', kg:  'ca',
  r:   'ra',
};

// Phonetic symbols → speakable Portuguese equivalents (for TTS)
const PHONETIC_TO_SPEAKABLE = { 'ẽ': 'ê', 'ɐ': 'â', 'j̃': 'i', 'w̃': 'u' };

// Build a speakable sample from a grapheme
function graphemeToSample(grapheme, visemeId) {
  if (!grapheme) return VISEME_SAMPLES[visemeId] || '';

  // Strip reduction arrows for speech (o→u → u, o→ô → ô, l→u → u, etc.)
  const clean = grapheme.includes('→') ? grapheme.split('→').pop() : grapheme;

  // Phonetic symbols that TTS can't handle → speakable equivalents
  if (PHONETIC_TO_SPEAKABLE[clean]) return PHONETIC_TO_SPEAKABLE[clean];

  // Vowels: speak the character itself
  if (PT_VOWELS[clean] !== undefined || /^[aáàâãeéêiíoóôõuúü]$/i.test(clean)) {
    return clean;
  }

  // Digraphs and multi-char: add vowel
  if (clean.length > 1) return clean + 'a';

  // Single consonants: add 'a' to make speakable
  return clean + 'a';
}

// Play a single viseme: show mouth shape + speak the actual phoneme
function playViseme(visemeId, nasal, grapheme) {
  const avatar = window.avatarController;
  const speech = window.portugueseSpeech;
  if (!avatar || !speech) return;

  // Show the mouth shape
  avatar.setAllState('speaking');
  avatar.setAllViseme(visemeId, nasal);

  // Speak the actual phoneme
  const sample = graphemeToSample(grapheme, visemeId);
  if (sample) {
    const origSpeak = speech._originalSpeak || speech.speak.bind(speech);
    origSpeak(sample, {
      lang: 'pt-BR',
      rate: 0.6,
      onEnd: () => {
        avatar.setAllViseme('rest', false);
        avatar.setAllState('idle');
      },
      onError: () => {
        avatar.setAllViseme('rest', false);
        avatar.setAllState('idle');
      }
    });
  } else {
    setTimeout(() => {
      avatar.setAllViseme('rest', false);
      avatar.setAllState('idle');
    }, 500);
  }
}

window.VISEME = VISEME;
window.VISEME_LABELS = VISEME_LABELS;
window.playViseme = playViseme;
window.textToVisemesPortuguese = textToVisemesPortuguese;
window.estimateVisemeTiming = estimateVisemeTiming;
window.VisemeScheduler = VisemeScheduler;

console.log('[Visemes] Viseme mapping system loaded (19 visemes + nasal overlay)');
