// Speech Utility - Web Speech API for Portuguese Pronunciation
// Provides text-to-speech functionality for language learning

class PortugueseSpeech {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.defaultLang = 'pt-BR';
    this.defaultRate = 0.90; // Slightly slower for learning
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
    const enVoices = this.voices.filter(voice =>
      voice.lang.startsWith('en')
    );

    if (ptVoices.length > 0) {
      console.log(`[Speech] Found ${ptVoices.length} Portuguese voices:`,
        ptVoices.map(v => `${v.name} (${v.lang})`));
    } else {
      console.warn('[Speech] No Portuguese (Brazil) voices found. Will use default.');
    }

    if (enVoices.length > 0) {
      console.log(`[Speech] Found ${enVoices.length} English voices:`,
        enVoices.slice(0, 5).map(v => `${v.name} (${v.lang})`));
    }
  }

  // Get best available Portuguese voice
  getBestVoice(preferFemale = false) {
    // First preference: Microsoft Natural voices
    if (preferFemale) {
      // Female: Microsoft ThalitaMultilingual Online (Natural)
      const thalita = this.voices.find(voice =>
        voice.name.includes('ThalitaMultilingual') && voice.name.includes('Natural')
      );
      if (thalita) return thalita;

      // Alternative: Microsoft Francisca (pt-BR)
      const francisca = this.voices.find(voice =>
        voice.name.includes('Francisca') && (voice.lang === 'pt-BR' || voice.lang === 'pt_BR')
      );
      if (francisca) return francisca;
    } else {
      // Male: Microsoft Antonio Online (Natural)
      const antonio = this.voices.find(voice =>
        voice.name.includes('Antonio') && voice.name.includes('Natural')
      );
      if (antonio) return antonio;
    }

    // Second preference: Any Microsoft Natural BR voice
    const msNatural = this.voices.find(voice =>
      voice.name.includes('Microsoft') &&
      voice.name.includes('Natural') &&
      (voice.lang === 'pt-BR' || voice.lang === 'pt_BR')
    );
    if (msNatural) return msNatural;

    // Third preference: Any Brazilian Portuguese voice (MUST be pt-BR)
    const ptBR = this.voices.find(voice =>
      (voice.lang === 'pt-BR' || voice.lang === 'pt_BR')
    );
    if (ptBR) return ptBR;

    // DO NOT fall back to European Portuguese - warn instead
    console.warn('[Speech] No Brazilian Portuguese (pt-BR) voices available. Please install Brazilian Portuguese voices.');
    return null;
  }

  // Get best available English voice
  getBestEnglishVoice() {
    // First preference: Microsoft Natural English voices
    const msNatural = this.voices.find(voice =>
      voice.name.includes('Microsoft') &&
      voice.name.includes('Natural') &&
      (voice.lang === 'en-US' || voice.lang === 'en_US')
    );
    if (msNatural) return msNatural;

    // Second preference: Any US English voice
    const enUS = this.voices.find(voice =>
      voice.lang === 'en-US' || voice.lang === 'en_US'
    );
    if (enUS) return enUS;

    // Third preference: Any English voice
    const en = this.voices.find(voice =>
      voice.lang.startsWith('en')
    );
    if (en) return en;

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

    // Set voice (preferFemale option can be passed in options)
    const voice = this.getBestVoice(options.preferFemale || false);
    if (voice) {
      utterance.voice = voice;
      console.log('[Speech] Using voice:', voice.name);
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

  // Speak mixed Portuguese/English content with appropriate voices
  speakMixed(text, options = {}) {
    if (!this.supported) {
      console.warn('[Speech] Cannot speak - Web Speech API not supported');
      return;
    }

    // Stop any current speech
    this.stop();

    // Parse text into segments with language detection
    const segments = this.parseLanguageSegments(text);

    if (segments.length === 0) return;

    // Queue segments
    this.speakSegmentsQueue(segments, 0, options);
  }

  // Parse text into language segments
  parseLanguageSegments(text) {
    const segments = [];

    // Split by newlines first
    const lines = text.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // Check if line has "=" pattern (vocabulary breakdown)
      if (line.includes(' = ')) {
        // Split into Portuguese and English parts
        const parts = line.split(' = ');
        if (parts.length >= 2) {
          segments.push({ text: parts[0].trim(), lang: 'pt-BR' });
          segments.push({ text: parts.slice(1).join(', ').trim(), lang: 'en-US' });
        }
      } else if (line.includes(' → ')) {
        // Arrow pattern: PT → EN
        const parts = line.split(' → ');
        if (parts.length >= 2) {
          segments.push({ text: parts[0].trim(), lang: 'pt-BR' });
          segments.push({ text: parts.slice(1).join(' → ').trim(), lang: 'en-US' });
        }
      } else {
        // Check if line has English sentence structure
        const hasEnglish = this.isEnglishSentence(line);
        const hasPT = this.isPortuguese(line);
        console.log(`[Speech] Line: "${line.substring(0, 50)}..." hasEnglish=${hasEnglish}, hasPT=${hasPT}`);

        if (hasEnglish) {
          // English sentence - parse for embedded Portuguese quotes
          this.parseEnglishWithQuotes(line, segments);
        } else if (hasPT) {
          // Pure Portuguese
          segments.push({ text: line.trim(), lang: 'pt-BR' });
        } else {
          // Default to English
          segments.push({ text: line.trim(), lang: 'en-US' });
        }
      }
    }

    return segments;
  }

  // Parse English text that may contain quoted Portuguese
  parseEnglishWithQuotes(text, segments) {
    // Match text in quotes: "..." or '...' or "..." (curly quotes)
    const quotePattern = /[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]/g;
    let lastIndex = 0;
    let match;

    while ((match = quotePattern.exec(text)) !== null) {
      // Add English text before the quote
      const beforeQuote = text.slice(lastIndex, match.index).trim();
      if (beforeQuote) {
        segments.push({ text: beforeQuote, lang: 'en-US' });
      }

      // Check if quoted text looks Portuguese
      const quotedText = match[1].trim();
      if (quotedText && !this.isEnglish(quotedText)) {
        // It's Portuguese
        segments.push({ text: quotedText, lang: 'pt-BR' });
      } else if (quotedText) {
        // It's English
        segments.push({ text: quotedText, lang: 'en-US' });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining English text after last quote
    const remaining = text.slice(lastIndex).trim();
    if (remaining) {
      segments.push({ text: remaining, lang: 'en-US' });
    }

    // If no quotes found, just add the whole line as English
    if (lastIndex === 0) {
      segments.push({ text: text.trim(), lang: 'en-US' });
    }
  }

  // Simple heuristic to detect if text is English
  isEnglish(text) {
    // First check for Portuguese indicators
    if (this.isPortuguese(text)) {
      return false;
    }
    const englishPatterns = /\b(the|is|are|was|were|have|has|had|do|does|did|will|would|could|should|can|may|might|must|shall|this|that|these|those|what|which|who|whom|whose|where|when|why|how|if|then|than|because|although|however|therefore|means|called|translation|English|mistake|correction|literally|example|practice|want|like|need|try|know|think|say|said|make|made|go|went|get|got|see|saw|come|came|take|took|give|gave|find|found|tell|told|ask|asked|use|used|work|worked|seem|seemed|feel|felt|become|became|leave|left|put|keep|kept|let|begin|began|help|helped|show|showed|hear|heard|play|played|run|ran|move|moved|live|lived|believe|believed|hold|held|bring|brought|happen|happened|write|wrote|provide|provided|sit|sat|stand|stood|lose|lost|pay|paid|meet|met|include|included|continue|continued|set|learn|learned|change|changed|lead|led|understand|understood|watch|watched|follow|followed|stop|stopped|create|created|speak|spoke|read|allow|allowed|add|added|spend|spent|grow|grew|open|opened|walk|walked|win|won|offer|offered|remember|remembered|love|loved|consider|considered|appear|appeared|buy|bought|wait|waited|serve|served|die|died|send|sent|expect|expected|build|built|stay|stayed|fall|fell|cut|reach|reached|kill|killed|remain|remained|suggest|suggested|raise|raised|pass|passed|sell|sold|require|required|report|reported|decide|decided|pull|pulled)\b/i;
    return englishPatterns.test(text);
  }

  // Detect Portuguese text
  isPortuguese(text) {
    // Portuguese-specific characters
    if (/[ãõáéíóúâêôàç]/i.test(text)) {
      return true;
    }
    // Common Portuguese words
    const ptPatterns = /\b(você|vocês|não|está|estou|estão|são|sou|tudo|bem|muito|obrigado|obrigada|bom|boa|como|onde|quando|porque|por que|aqui|ali|aí|lá|meu|minha|seu|sua|nosso|nossa|dele|dela|para|pelo|pela|com|sem|mais|menos|agora|hoje|amanhã|ontem|gosto|gosta|moro|mora|trabalho|trabalha|falo|fala|tenho|tem|quero|quer|posso|pode|vou|vai|sinto|sente|prazer|olá|oi|tchau|até|depois|antes|sempre|nunca|às vezes)\b/i;
    return ptPatterns.test(text);
  }

  // Detect English sentence structure (even if it contains PT words in quotes)
  isEnglishSentence(text) {
    // English sentence patterns that indicate this is an English sentence with embedded Portuguese
    const englishStructures = /\b(means|it's|I'm|you're|we're|they're|he's|she's|this is|you can|would you|do you|is the|are the|how to|what is|that's|here's|let's|I'll|you'll|we'll|they'll|isn't|aren't|doesn't|don't|won't|can't|couldn't|shouldn't|wouldn't|I notice|would you like|could be|response|simple|practice|responding|repeatedly)\b/i;
    return englishStructures.test(text);
  }

  // Check if text has English sentence structure
  hasEnglishStructure(text) {
    // Check for English sentence starters and connectors
    const englishStructure = /^(the|a|an|this|that|it|you|we|they|he|she|is|are|was|were|would|could|should|can|may|if|when|how|what|where|why)\b/i;
    return englishStructure.test(text.trim()) || this.isEnglishSentence(text);
  }

  // Clean text for speech (remove symbols that get read aloud)
  cleanTextForSpeech(text) {
    return text
      .replace(/\s*=\s*/g, ', ')  // Replace = with comma pause
      .replace(/\s*→\s*/g, ', ')  // Replace → with comma pause
      .replace(/\\/g, '')         // Remove backslashes
      .replace(/[""]/g, '')       // Remove curly quotes
      .replace(/["]/g, '')        // Remove straight quotes
      .trim();
  }

  // Speak segments in sequence
  speakSegmentsQueue(segments, index, options) {
    if (index >= segments.length) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const segment = segments[index];
    const cleanedText = this.cleanTextForSpeech(segment.text);
    if (!cleanedText) {
      // Skip empty segments
      this.speakSegmentsQueue(segments, index + 1, options);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    utterance.lang = segment.lang;
    utterance.rate = options.rate || this.defaultRate;
    utterance.pitch = options.pitch || this.defaultPitch;
    utterance.volume = options.volume || 1.0;

    // Set appropriate voice
    const voice = segment.lang === 'pt-BR'
      ? this.getBestVoice(options.preferFemale || false)
      : this.getBestEnglishVoice();

    if (voice) {
      utterance.voice = voice;
      console.log(`[Speech] Segment "${segment.text.substring(0, 30)}..." using ${segment.lang} voice: ${voice.name}`);
    } else {
      console.warn(`[Speech] No voice found for ${segment.lang}`);
    }

    utterance.onend = () => {
      // Small pause between segments
      setTimeout(() => {
        this.speakSegmentsQueue(segments, index + 1, options);
      }, 50);
    };

    utterance.onerror = (event) => {
      console.error('[Speech] Error:', event.error);
      // Continue to next segment even on error
      this.speakSegmentsQueue(segments, index + 1, options);
    };

    if (index === 0 && options.onStart) {
      utterance.onstart = options.onStart;
    }

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

function speakMixed(text, options) {
  portugueseSpeech.speakMixed(text, options);
}

// Make available globally
window.portugueseSpeech = portugueseSpeech;
window.speak = speak;
window.speakSlowly = speakSlowly;
window.speakNormally = speakNormally;
window.stopSpeaking = stopSpeaking;
window.speakMixed = speakMixed;

console.log('[Speech] Portuguese speech utility loaded');
