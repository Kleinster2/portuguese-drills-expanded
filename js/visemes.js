// Viseme Mapping System - Text-to-viseme conversion and scheduling for avatar lip-sync
// Supports Brazilian Portuguese (primary) and English (simplified)

// Viseme IDs: rest, ah, oh, ee, oo, fv, mbp
const VISEME = { REST: 'rest', AH: 'ah', OH: 'oh', EE: 'ee', OO: 'oo', FV: 'fv', MBP: 'mbp' };

// ── Portuguese grapheme-to-viseme mapping ──

// Digraphs that should be consumed as pairs (order matters: check digraphs before single chars)
const PT_DIGRAPHS = {
  'lh': VISEME.EE,
  'nh': VISEME.EE,
  'ch': VISEME.EE,
  'rr': VISEME.EE,
  'ss': VISEME.EE,
  // qu/gu handled dynamically in textToVisemesPortuguese (u is pronounced [w] before a/o)
};

// Single character mappings for Portuguese
const PT_VOWELS = {
  'a': VISEME.AH, 'á': VISEME.AH, 'à': VISEME.AH, 'â': VISEME.AH, 'ã': VISEME.AH,
  'e': VISEME.EE, 'é': VISEME.AH, 'ê': VISEME.EE,
  'i': VISEME.EE, 'í': VISEME.EE,
  'o': VISEME.OH, 'ó': VISEME.OH, 'ô': VISEME.OH, 'õ': VISEME.OH,
  'u': VISEME.OO, 'ú': VISEME.OO, 'ü': VISEME.OO,
};

const PT_CONSONANTS = {
  // m is handled separately (word-final m nasalizes the vowel, no lip closure)
  'b': VISEME.MBP,
  'p': VISEME.MBP,
  'f': VISEME.FV,
  'v': VISEME.FV,
  // l is handled separately (syllable-final l → [u] vocalization)
  // All other consonants → EE (neutral open)
};

// Default consonant viseme
const DEFAULT_CONSONANT = VISEME.EE;

/**
 * Convert Portuguese text to a viseme sequence.
 * Rules-based grapheme-to-viseme for Brazilian Portuguese.
 * @param {string} text
 * @returns {Array<{viseme: string, charIndex: number}>}
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
      result.push({ viseme: VISEME.REST, charIndex: i });
      i++;
      continue;
    }

    // Sentence punctuation → REST (longer pause handled in timing)
    if (/[.!?;:,\n\r]/.test(ch)) {
      result.push({ viseme: VISEME.REST, charIndex: i });
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
      result.push({ viseme: PT_DIGRAPHS[digraph], charIndex: i });
      i += 2;
      continue;
    }

    // qu/gu digraphs: before a/o the u is pronounced [w] (rounded lips)
    if ((ch === 'q' || ch === 'g') && next === 'u') {
      const afterU = i + 2 < lower.length ? lower[i + 2] : '';
      if (afterU === 'a' || afterU === 'o' || afterU === 'á' || afterU === 'à' || afterU === 'â' || afterU === 'ã' || afterU === 'ó' || afterU === 'ô' || afterU === 'õ') {
        // u is pronounced [w] → EE for q/g, then OO for the rounded [w]
        result.push({ viseme: VISEME.EE, charIndex: i });
        result.push({ viseme: VISEME.OO, charIndex: i + 1 });
        i += 2;
      } else {
        // qu/gu before e/i: u is silent → consume as single EE
        result.push({ viseme: VISEME.EE, charIndex: i });
        i += 2;
      }
      continue;
    }

    // Vowels
    if (PT_VOWELS[ch] !== undefined) {
      let viseme = PT_VOWELS[ch];

      // Final unstressed -o → OO (common in BR Portuguese)
      if (ch === 'o' && i === findWordEnd(lower, i) && !isAccented(ch)) {
        viseme = VISEME.OO;
      }
      // Final unstressed -e → EE (already EE, but explicit for clarity)

      result.push({ viseme, charIndex: i });
      i++;
      continue;
    }

    // Syllable-final l → [u] vocalization (Rule 6): l before consonant or at word end
    if (ch === 'l') {
      const wordEnd = findWordEnd(lower, i);
      const isWordFinal = (i === wordEnd);
      const nextIsConsonant = next && /[\p{L}]/u.test(next) && !PT_VOWELS[next];
      if (isWordFinal || nextIsConsonant) {
        // Syllable-final l vocalizes to [u] → OO viseme
        result.push({ viseme: VISEME.OO, charIndex: i });
        i++;
        continue;
      }
      // Syllable-initial l stays [l] → EE (default consonant)
      result.push({ viseme: DEFAULT_CONSONANT, charIndex: i });
      i++;
      continue;
    }

    // Word-final nasal m: nasalizes the vowel, lips don't close (Rule 5)
    if (ch === 'm') {
      const wordEnd = findWordEnd(lower, i);
      if (i === wordEnd) {
        // Word-final m: skip the MBP viseme — the nasal is absorbed into the vowel
        // Don't produce any mouth movement (the preceding vowel shape holds)
        i++;
        continue;
      }
      // Non-final m: normal bilabial closure
      result.push({ viseme: VISEME.MBP, charIndex: i });
      i++;
      continue;
    }

    // Consonants with specific visemes
    if (PT_CONSONANTS[ch] !== undefined) {
      result.push({ viseme: PT_CONSONANTS[ch], charIndex: i });
      i++;
      continue;
    }

    // All other consonants → EE (neutral open)
    result.push({ viseme: DEFAULT_CONSONANT, charIndex: i });
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
 * @param {Array<{viseme: string, charIndex: number}>} visemeSequence
 * @param {number} rate - Speech rate (1.0 = normal)
 * @param {string} lang - 'pt-BR' or 'en-US'
 * @returns {{timeline: Array<{viseme: string, time: number, duration: number}>, estimatedDuration: number}}
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
    const { viseme } = visemeSequence[i];

    // Duration adjustments
    let duration = baseVisemeDuration;
    if (viseme === VISEME.REST) {
      // Check if this is punctuation (longer pause) vs space (short pause)
      duration = baseVisemeDuration * 1.5;
    } else if (viseme === VISEME.AH || viseme === VISEME.OH || viseme === VISEME.OO || viseme === VISEME.EE) {
      // Vowels slightly longer
      duration = baseVisemeDuration * 1.2;
    } else {
      // Consonants slightly shorter
      duration = baseVisemeDuration * 0.8;
    }

    // Coalesce with previous if same viseme
    if (timeline.length > 0 && timeline[timeline.length - 1].viseme === viseme) {
      timeline[timeline.length - 1].duration += duration;
    } else {
      timeline.push({ viseme, time: currentTime, duration });
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
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Prepare a viseme timeline for playback.
   * @param {Array<{viseme: string, time: number, duration: number}>} timeline
   * @param {number} estimatedDuration
   */
  schedule(timeline, estimatedDuration) {
    this._timeline = timeline;
    this._estimatedDuration = estimatedDuration;
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

    if (this._reducedMotion) {
      // Static open mouth for reduced motion
      this._setViseme(VISEME.AH);
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

    if (this._reducedMotion) {
      this._setViseme(VISEME.AH);
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
    this._setViseme(VISEME.REST);
  }

  // ── Internal tick loops ──

  _tickAudio() {
    if (!this._running) return;

    const audio = this._audioElement;
    if (!audio || audio.paused || audio.ended) {
      // Audio stopped — keep ticking briefly in case it resumes
      this._rafId = requestAnimationFrame(this._tickAudio.bind(this));
      return;
    }

    const elapsed = audio.currentTime;
    const totalDuration = audio.duration || this._estimatedDuration;

    // Scale estimated timeline to actual audio duration
    const scale = this._estimatedDuration > 0 ? totalDuration / this._estimatedDuration : 1;
    const viseme = this._findVisemeAt(elapsed, scale);

    this._setViseme(viseme);
    this._rafId = requestAnimationFrame(this._tickAudio.bind(this));
  }

  _tickEstimated() {
    if (!this._running) return;

    const elapsed = (performance.now() - this._startTime) / 1000; // seconds

    if (elapsed > this._estimatedDuration + 0.5) {
      // Past the end — stop
      this.stop();
      return;
    }

    const viseme = this._findVisemeAt(elapsed, 1);
    this._setViseme(viseme);
    this._rafId = requestAnimationFrame(this._tickEstimated.bind(this));
  }

  /**
   * Find which viseme should be active at a given elapsed time.
   * @param {number} elapsed - seconds
   * @param {number} scale - time scale factor (for audio sync)
   * @returns {string} viseme ID
   */
  _findVisemeAt(elapsed, scale) {
    for (let i = this._timeline.length - 1; i >= 0; i--) {
      const entry = this._timeline[i];
      const entryTime = entry.time * scale;
      if (elapsed >= entryTime) {
        return entry.viseme;
      }
    }
    return VISEME.REST;
  }

  /**
   * Set the current viseme on all avatars, only if changed.
   * @param {string} visemeId
   */
  _setViseme(visemeId) {
    if (visemeId === this._currentViseme) return;
    this._currentViseme = visemeId;

    if (window.avatarController && typeof window.avatarController.setAllViseme === 'function') {
      window.avatarController.setAllViseme(visemeId);
    }
  }
}


// ── Exports ──

window.VISEME = VISEME;
window.textToVisemesPortuguese = textToVisemesPortuguese;
window.estimateVisemeTiming = estimateVisemeTiming;
window.VisemeScheduler = VisemeScheduler;

console.log('[Visemes] Viseme mapping system loaded');
