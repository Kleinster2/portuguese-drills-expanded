// Speech Utility - Web Speech API for Portuguese Pronunciation
// Provides text-to-speech functionality for language learning

class PortugueseSpeech {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.defaultLang = 'pt-BR';
    this.defaultRate = 0.85; // Slightly slower for learning
    this.defaultPitch = 1.0;
    this.currentUtterance = null;

    // Check browser support
    this.supported = 'speechSynthesis' in window;

    if (!this.supported) {
      console.warn('[Speech] Web Speech API not supported in this browser');
    }

    // Load available voices
    this.voices = [];
    this.loadVoices();

    // Voices load asynchronously in some browsers
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    const ptVoices = this.voices.filter(voice =>
      voice.lang.startsWith('pt-BR') || voice.lang.startsWith('pt_BR')
    );

    if (ptVoices.length > 0) {
      console.log(`[Speech] Found ${ptVoices.length} Portuguese voices:`,
        ptVoices.map(v => `${v.name} (${v.lang})`));
    } else {
      console.warn('[Speech] No Portuguese (Brazil) voices found. Will use default.');
    }
  }

  // Get best available Portuguese voice
  getBestVoice() {
    // Prefer Brazilian Portuguese voices
    const ptBR = this.voices.find(voice =>
      voice.lang === 'pt-BR' || voice.lang === 'pt_BR'
    );

    if (ptBR) return ptBR;

    // Fallback to any Portuguese voice
    const pt = this.voices.find(voice => voice.lang.startsWith('pt'));
    if (pt) return pt;

    // Let browser choose default
    return null;
  }

  // Main speak function
  speak(text, options = {}) {
    if (!this.supported) {
      console.warn('[Speech] Cannot speak - Web Speech API not supported');
      return;
    }

    // Stop any current speech
    this.stop();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set properties
    utterance.lang = options.lang || this.defaultLang;
    utterance.rate = options.rate || this.defaultRate;
    utterance.pitch = options.pitch || this.defaultPitch;
    utterance.volume = options.volume || 1.0;

    // Set voice
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Event handlers
    utterance.onstart = () => {
      console.log('[Speech] Started speaking:', text);
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      console.log('[Speech] Finished speaking');
      if (options.onEnd) options.onEnd();
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('[Speech] Error:', event.error);
      if (options.onError) options.onError(event);
      this.currentUtterance = null;
    };

    // Speak
    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  // Speak slowly (for beginners)
  speakSlowly(text, options = {}) {
    this.speak(text, { ...options, rate: 0.7 });
  }

  // Speak normally (for practice)
  speakNormally(text, options = {}) {
    this.speak(text, { ...options, rate: 1.0 });
  }

  // Stop current speech
  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis.speaking;
  }

  // Pause speech
  pause() {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  // Resume speech
  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }
}

// Create global instance
const portugueseSpeech = new PortugueseSpeech();

// Convenient helper functions for quick use
function speak(text, options) {
  portugueseSpeech.speak(text, options);
}

function speakSlowly(text, options) {
  portugueseSpeech.speakSlowly(text, options);
}

function speakNormally(text, options) {
  portugueseSpeech.speakNormally(text, options);
}

function stopSpeaking() {
  portugueseSpeech.stop();
}

// Make available globally
window.portugueseSpeech = portugueseSpeech;
window.speak = speak;
window.speakSlowly = speakSlowly;
window.speakNormally = speakNormally;
window.stopSpeaking = stopSpeaking;

console.log('[Speech] Portuguese speech utility loaded');
