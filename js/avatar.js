// Avatar Controller - 2D animated talking avatar for chat interfaces
// Pure SVG + CSS, no external dependencies
// Viseme-driven mouth shapes for lip-sync animation

class AvatarController {
  constructor() {
    this.avatarCount = 0;
    this.state = 'idle'; // idle, speaking, thinking, happy
    this._speechWrapped = false;
    this._scheduler = null;
  }

  // Generate inline SVG HTML for embedding in message bubbles
  getInlineHtml(sizeClass) {
    this.avatarCount++;
    const id = 'avatar-' + this.avatarCount;
    const stateClass = this.state !== 'idle' ? ' ' + this.state : '';

    return `<div class="avatar-container${stateClass}" data-avatar-id="${id}">
      <svg viewBox="0 0 64 64" class="${sizeClass}" xmlns="http://www.w3.org/2000/svg">
        <!-- Face -->
        <circle cx="32" cy="34" r="26" fill="#FFD9B3"/>
        <!-- Hair -->
        <ellipse cx="32" cy="16" rx="24" ry="14" fill="#5B3A29"/>
        <ellipse cx="12" cy="26" rx="6" ry="10" fill="#5B3A29"/>
        <ellipse cx="52" cy="26" rx="6" ry="10" fill="#5B3A29"/>
        <!-- Blush cheeks -->
        <circle cx="18" cy="40" r="4" fill="#FFB3B3" opacity="0.5"/>
        <circle cx="46" cy="40" r="4" fill="#FFB3B3" opacity="0.5"/>
        <!-- Eyes -->
        <g class="avatar-eyes">
          <ellipse cx="24" cy="34" rx="3" ry="3.5" fill="#2D2D2D"/>
          <ellipse cx="40" cy="34" rx="3" ry="3.5" fill="#2D2D2D"/>
          <!-- Eye shine -->
          <circle cx="25" cy="33" r="1" fill="white"/>
          <circle cx="41" cy="33" r="1" fill="white"/>
        </g>
        <!-- Nose -->
        <ellipse cx="32" cy="39" rx="1.5" ry="1" fill="#E8C09A"/>

        <!-- Nasal indicator: subtle nostril flare (shown during nasal vowels) -->
        <g class="avatar-nasal">
          <line x1="30.2" y1="39.2" x2="29" y2="40.2" stroke="#D4A088" stroke-width="0.7" stroke-linecap="round"/>
          <line x1="33.8" y1="39.2" x2="35" y2="40.2" stroke="#D4A088" stroke-width="0.7" stroke-linecap="round"/>
          <ellipse cx="32" cy="39" rx="2" ry="1.3" fill="none" stroke="#D4A088" stroke-width="0.4" opacity="0.5"/>
        </g>

        <!-- Viseme mouth shapes (only rest visible by default) -->

        <!-- rest: closed smile -->
        <g class="avatar-viseme avatar-viseme-rest">
          <path d="M26 44 Q32 49 38 44" stroke="#B35A3A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        </g>

        <!-- ah: tall open oval (a, á, à) -->
        <g class="avatar-viseme avatar-viseme-ah">
          <ellipse cx="32" cy="45.5" rx="5" ry="4.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="4" ry="3.5" fill="#8B2F1A"/>
          <line x1="28" y1="44" x2="36" y2="44" stroke="white" stroke-width="0.8" opacity="0.7"/>
        </g>

        <!-- uh: schwa/reduced a ([ɐ]) — between ah and eh -->
        <g class="avatar-viseme avatar-viseme-uh">
          <ellipse cx="32" cy="45.2" rx="5.2" ry="3.7" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.2" rx="4.2" ry="2.7" fill="#8B2F1A"/>
          <line x1="27.8" y1="44.2" x2="36.2" y2="44.2" stroke="white" stroke-width="0.7" opacity="0.7"/>
        </g>

        <!-- eh: open-mid spread (é [ɛ]) — between ah and ee -->
        <g class="avatar-viseme avatar-viseme-eh">
          <ellipse cx="32" cy="45" rx="5.5" ry="3" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="4.5" ry="2" fill="#8B2F1A"/>
          <line x1="27.5" y1="44" x2="36.5" y2="44" stroke="white" stroke-width="0.7" opacity="0.7"/>
        </g>

        <!-- eh2: close-mid spread (ê [e]) — between eh and ee -->
        <g class="avatar-viseme avatar-viseme-eh2">
          <ellipse cx="32" cy="45" rx="5.5" ry="2.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="4.5" ry="1.6" fill="#8B2F1A"/>
          <line x1="27.5" y1="44.3" x2="36.5" y2="44.3" stroke="white" stroke-width="0.7" opacity="0.7"/>
        </g>

        <!-- oh: open rounded (ó [ɔ]) -->
        <g class="avatar-viseme avatar-viseme-oh">
          <ellipse cx="32" cy="45.5" rx="3.5" ry="3.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="2.5" ry="2.5" fill="#8B2F1A"/>
        </g>

        <!-- oh2: close-mid rounded (ô [o]) — tighter than oh -->
        <g class="avatar-viseme avatar-viseme-oh2">
          <ellipse cx="32" cy="45.5" rx="3" ry="3" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="2" ry="2" fill="#8B2F1A"/>
        </g>

        <!-- ee: wide horizontal (e, i, í) -->
        <g class="avatar-viseme avatar-viseme-ee">
          <ellipse cx="32" cy="45" rx="5.5" ry="2" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="4.5" ry="1.2" fill="#8B2F1A"/>
          <line x1="27.5" y1="44.5" x2="36.5" y2="44.5" stroke="white" stroke-width="0.6" opacity="0.6"/>
        </g>

        <!-- oo: tight small circle (u, ú) -->
        <g class="avatar-viseme avatar-viseme-oo">
          <ellipse cx="32" cy="45.5" rx="2.5" ry="2.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="1.5" ry="1.5" fill="#8B2F1A"/>
        </g>

        <!-- w: transitional glide ([w]) — slightly wider than oo -->
        <g class="avatar-viseme avatar-viseme-w">
          <ellipse cx="32" cy="45.5" rx="2.8" ry="2.8" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="1.8" ry="1.8" fill="#8B2F1A"/>
        </g>

        <!-- fv: lip bite (f, v) -->
        <g class="avatar-viseme avatar-viseme-fv">
          <path d="M27 44 Q32 47 37 44" stroke="#B35A3A" stroke-width="1.5" fill="#B35A3A"/>
          <line x1="28" y1="44" x2="36" y2="44" stroke="white" stroke-width="0.7" opacity="0.7"/>
        </g>

        <!-- mbp: lips pressed shut (m, b, p) -->
        <g class="avatar-viseme avatar-viseme-mbp">
          <line x1="27" y1="45" x2="37" y2="45" stroke="#B35A3A" stroke-width="2.2" stroke-linecap="round"/>
        </g>

        <!-- sz: teeth close, narrow slit (s, z, ç) -->
        <g class="avatar-viseme avatar-viseme-sz">
          <ellipse cx="32" cy="45" rx="5" ry="1.2" fill="#B35A3A"/>
          <line x1="27.5" y1="45" x2="36.5" y2="45" stroke="white" stroke-width="0.8" opacity="0.8"/>
          <ellipse cx="32" cy="45" rx="4" ry="0.4" fill="#8B2F1A"/>
        </g>

        <!-- sh: lips protruded, slightly rounded (ch [ʃ], j [ʒ], ge/gi, ti, di) -->
        <g class="avatar-viseme avatar-viseme-sh">
          <ellipse cx="32" cy="45.5" rx="3.2" ry="2.8" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="2.2" ry="1.8" fill="#8B2F1A"/>
        </g>

        <!-- td: slightly open, tongue hint (t, d, n) -->
        <g class="avatar-viseme avatar-viseme-td">
          <ellipse cx="32" cy="45" rx="4.5" ry="2.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="3.5" ry="1.5" fill="#8B2F1A"/>
          <ellipse cx="32" cy="43.8" rx="2" ry="0.6" fill="#E8A090" opacity="0.6"/>
        </g>

        <!-- l: lateral, tongue tip at ridge (initial l) -->
        <g class="avatar-viseme avatar-viseme-l">
          <ellipse cx="32" cy="45" rx="4" ry="2.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="3" ry="1.5" fill="#8B2F1A"/>
          <ellipse cx="32" cy="43.5" rx="1.2" ry="0.8" fill="#E8A090" opacity="0.7"/>
        </g>

        <!-- pal: palatal (lh [ʎ], nh [ɲ]) — wide with raised tongue body -->
        <g class="avatar-viseme avatar-viseme-pal">
          <ellipse cx="32" cy="45" rx="5" ry="3" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="4" ry="2" fill="#8B2F1A"/>
          <ellipse cx="32" cy="43.8" rx="2.5" ry="0.7" fill="#E8A090" opacity="0.5"/>
        </g>

        <!-- kg: velar stop (k, hard c, hard g) — slightly open, neutral -->
        <g class="avatar-viseme avatar-viseme-kg">
          <ellipse cx="32" cy="45" rx="4.5" ry="2" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="3.5" ry="1" fill="#8B2F1A"/>
        </g>

        <!-- r: R sounds (tap [ɾ], guttural [h]/[x]) — slightly open -->
        <g class="avatar-viseme avatar-viseme-r">
          <ellipse cx="32" cy="45" rx="4" ry="2" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="3" ry="1.2" fill="#8B2F1A"/>
        </g>

        <!-- Legacy mouth elements (hidden, kept for CSS fallback) -->
        <ellipse class="avatar-mouth-open-1" cx="32" cy="45" rx="5" ry="3" fill="#B35A3A"/>
        <ellipse class="avatar-mouth-open-2" cx="32" cy="45" rx="4" ry="2.5" fill="#8B2F1A"/>
      </svg>
    </div>`;
  }

  // Set state on a specific avatar by data-avatar-id
  setState(id, state) {
    const el = document.querySelector(`[data-avatar-id="${id}"]`);
    if (el) {
      el.classList.remove('speaking', 'thinking', 'happy');
      if (state !== 'idle') {
        el.classList.add(state);
      }
    }
  }

  // Set state on ALL avatars on the page
  setAllState(state) {
    this.state = state;
    document.querySelectorAll('.avatar-container').forEach(el => {
      el.classList.remove('speaking', 'thinking', 'happy');
      if (state !== 'idle') {
        el.classList.add(state);
      }
    });
  }

  /**
   * Set the viseme mouth shape on ALL avatars.
   * Shows the matching viseme group, hides all others.
   * Optionally toggles nasal overlay indicator.
   * @param {string} visemeId - one of: rest, ah, uh, eh, eh2, oh, oh2, ee, oo, w, fv, mbp, sz, sh, td, l, pal, kg, r
   * @param {boolean} [nasal=false] - whether to show nasal overlay
   */
  setAllViseme(visemeId, nasal = false) {
    document.querySelectorAll('.avatar-container').forEach(el => {
      // Toggle mouth shapes
      const visemeGroups = el.querySelectorAll('.avatar-viseme');
      visemeGroups.forEach(g => {
        if (g.classList.contains('avatar-viseme-' + visemeId)) {
          g.style.display = 'block';
        } else {
          g.style.display = 'none';
        }
      });

      // Toggle nasal indicator
      const nasalEl = el.querySelector('.avatar-nasal');
      if (nasalEl) {
        nasalEl.style.display = nasal ? 'block' : 'none';
      }
    });
  }

  // Connect to a PortugueseSpeech instance by wrapping speak/speakMixed/stop
  connectToSpeech(speechInstance) {
    if (!speechInstance || this._speechWrapped) return;

    const avatar = this;

    // Create a VisemeScheduler if the viseme system is loaded
    if (typeof VisemeScheduler === 'function') {
      this._scheduler = new VisemeScheduler();
      console.log('[Avatar] Viseme scheduler created');
    }

    // Helper: generate viseme timeline and start scheduler for given text/lang
    function startVisemes(text, lang, speechInst, rateOverride) {
      if (!avatar._scheduler) return;

      // Skip very short text — use legacy fallback
      if (!text || text.length < 2) return;

      try {
        // Only animate for Portuguese speech
        const isPT = lang && lang.startsWith('pt');
        if (!isPT) return;

        const visemeSeq = textToVisemesPortuguese(text);
        const rate = rateOverride || speechInst.defaultPTRate || 0.95;
        const { timeline, estimatedDuration } = estimateVisemeTiming(visemeSeq, rate, lang);

        if (timeline.length === 0) return;

        avatar._scheduler.schedule(timeline, estimatedDuration);

        // Determine playback mode: Cloud TTS (audio element) vs Web Speech (estimated)
        // Poll briefly for currentAudio in case cloud TTS sets it async
        const audio = speechInst.currentAudio;
        if (audio) {
          avatar._scheduler.startWithAudio(audio);
        } else {
          // Check again shortly — cloud TTS may set currentAudio after fetch
          avatar._scheduler.startEstimated();
          // Poll for audio element up to 500ms
          let pollCount = 0;
          const pollInterval = setInterval(() => {
            pollCount++;
            if (speechInst.currentAudio && avatar._scheduler._running) {
              avatar._scheduler.startWithAudio(speechInst.currentAudio);
              clearInterval(pollInterval);
            }
            if (pollCount >= 10) clearInterval(pollInterval);
          }, 50);
        }
      } catch (e) {
        console.warn('[Avatar] Viseme generation failed, using legacy animation:', e);
      }
    }

    function stopVisemes() {
      if (avatar._scheduler) {
        avatar._scheduler._flushAndStop();
      }
    }

    // Wrap speak() — store original for direct use (e.g. viseme sample playback)
    const originalSpeak = speechInstance.speak.bind(speechInstance);
    speechInstance._originalSpeak = originalSpeak;
    speechInstance.speak = function(text, options = {}) {
      if (avatar._scheduler && !options.preserveLog) avatar._scheduler.clearLog();
      if (avatar._scheduler && options.preserveLog) avatar._scheduler._suppressTags = true;

      const origOnStart = options.onStart;
      const origOnEnd = options.onEnd;
      const origOnError = options.onError;
      const lang = options.lang || speechInstance.defaultLang;

      options.onStart = function() {
        avatar.setAllState('speaking');
        startVisemes(text, lang, speechInstance, options.rate);
        if (origOnStart) origOnStart();
      };
      options.onEnd = function() {
        stopVisemes();
        avatar.setAllState('idle');
        if (avatar._scheduler) avatar._scheduler._suppressTags = false;
        if (origOnEnd) origOnEnd();
      };
      options.onError = function(e) {
        stopVisemes();
        avatar.setAllState('idle');
        if (avatar._scheduler) avatar._scheduler._suppressTags = false;
        if (origOnError) origOnError(e);
      };

      originalSpeak(text, options);
    };

    // Wrap speakMixed()
    const originalSpeakMixed = speechInstance.speakMixed.bind(speechInstance);
    speechInstance.speakMixed = function(text, options = {}) {
      // Clear viseme log from previous message (synchronous, before any segments start)
      if (avatar._scheduler) avatar._scheduler.clearLog();

      const origOnStart = options.onStart;
      const origOnEnd = options.onEnd;
      const origOnBlocked = options.onBlocked;

      options.onStart = function() {
        if (origOnStart) origOnStart();
      };
      options.onEnd = function() {
        stopVisemes();
        avatar.setAllState('idle');
        if (origOnEnd) origOnEnd();
      };
      options.onBlocked = function() {
        stopVisemes();
        avatar.setAllState('idle');
        if (origOnBlocked) origOnBlocked();
      };

      // Per-segment callbacks: animate mouth only for Portuguese
      const speechRate = options.rate;
      options.onSegmentStart = function(segment) {
        const isPT = segment.lang && segment.lang.startsWith('pt');
        if (isPT) {
          avatar.setAllState('speaking');
          startVisemes(segment.text, segment.lang, speechInstance, speechRate);
        } else {
          stopVisemes();
          avatar.setAllState('idle');
        }
      };
      options.onSegmentEnd = function() {
        stopVisemes();
      };

      originalSpeakMixed(text, options);
    };

    // Wrap stop()
    const originalStop = speechInstance.stop.bind(speechInstance);
    speechInstance.stop = function() {
      stopVisemes();
      avatar.setAllState('idle');
      originalStop();
    };

    this._speechWrapped = true;
    console.log('[Avatar] Connected to speech system' + (this._scheduler ? ' (with visemes)' : ''));
  }
}

// Create global singleton
window.avatarController = new AvatarController();
console.log('[Avatar] Avatar controller loaded');
