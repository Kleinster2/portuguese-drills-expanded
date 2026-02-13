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

        <!-- Viseme mouth shapes (only rest visible by default) -->

        <!-- rest: closed smile -->
        <g class="avatar-viseme avatar-viseme-rest">
          <path d="M26 44 Q32 49 38 44" stroke="#B35A3A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        </g>

        <!-- ah: tall open oval (a, á, ã) -->
        <g class="avatar-viseme avatar-viseme-ah">
          <ellipse cx="32" cy="45.5" rx="5" ry="4.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="4" ry="3.5" fill="#8B2F1A"/>
          <line x1="28" y1="44" x2="36" y2="44" stroke="white" stroke-width="0.8" opacity="0.7"/>
        </g>

        <!-- oh: round circle (o, ó, ô, õ) -->
        <g class="avatar-viseme avatar-viseme-oh">
          <ellipse cx="32" cy="45.5" rx="3.5" ry="3.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="2.5" ry="2.5" fill="#8B2F1A"/>
        </g>

        <!-- ee: wide horizontal (e, é, i, í + most consonants) -->
        <g class="avatar-viseme avatar-viseme-ee">
          <ellipse cx="32" cy="45" rx="5.5" ry="2" fill="#B35A3A"/>
          <ellipse cx="32" cy="45" rx="4.5" ry="1.2" fill="#8B2F1A"/>
          <line x1="27.5" y1="44.5" x2="36.5" y2="44.5" stroke="white" stroke-width="0.6" opacity="0.6"/>
        </g>

        <!-- oo: tight small circle (u, ú, final -o) -->
        <g class="avatar-viseme avatar-viseme-oo">
          <ellipse cx="32" cy="45.5" rx="2.5" ry="2.5" fill="#B35A3A"/>
          <ellipse cx="32" cy="45.5" rx="1.5" ry="1.5" fill="#8B2F1A"/>
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
   * @param {string} visemeId - one of: rest, ah, oh, ee, oo, fv, mbp
   */
  setAllViseme(visemeId) {
    document.querySelectorAll('.avatar-container').forEach(el => {
      const visemeGroups = el.querySelectorAll('.avatar-viseme');
      visemeGroups.forEach(g => {
        if (g.classList.contains('avatar-viseme-' + visemeId)) {
          g.style.display = 'block';
        } else {
          g.style.display = 'none';
        }
      });
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
    function startVisemes(text, lang, speechInst) {
      if (!avatar._scheduler) return;

      // Skip very short text — use legacy fallback
      if (!text || text.length < 2) return;

      try {
        // Only animate for Portuguese speech
        const isPT = lang && lang.startsWith('pt');
        if (!isPT) return;

        const visemeSeq = textToVisemesPortuguese(text);
        const rate = speechInst.defaultPTRate || 0.95;
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
        avatar._scheduler.stop();
      }
    }

    // Wrap speak()
    const originalSpeak = speechInstance.speak.bind(speechInstance);
    speechInstance.speak = function(text, options = {}) {
      const origOnStart = options.onStart;
      const origOnEnd = options.onEnd;
      const origOnError = options.onError;
      const lang = options.lang || speechInstance.defaultLang;

      options.onStart = function() {
        avatar.setAllState('speaking');
        startVisemes(text, lang, speechInstance);
        if (origOnStart) origOnStart();
      };
      options.onEnd = function() {
        stopVisemes();
        avatar.setAllState('idle');
        if (origOnEnd) origOnEnd();
      };
      options.onError = function(e) {
        stopVisemes();
        avatar.setAllState('idle');
        if (origOnError) origOnError(e);
      };

      originalSpeak(text, options);
    };

    // Wrap speakMixed()
    const originalSpeakMixed = speechInstance.speakMixed.bind(speechInstance);
    speechInstance.speakMixed = function(text, options = {}) {
      const origOnStart = options.onStart;
      const origOnEnd = options.onEnd;
      const origOnBlocked = options.onBlocked;

      options.onStart = function() {
        avatar.setAllState('speaking');
        startVisemes(text, 'pt-BR', speechInstance);
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
