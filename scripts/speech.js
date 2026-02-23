// Speech Utility - Web Speech API for Portuguese Pronunciation
// Provides text-to-speech functionality for language learning

class PortugueseSpeech {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.defaultLang = 'pt-BR';
    this.defaultRate = 1.0; // Normal speed (English)
    this.defaultPTRate = 0.95; // Slightly slower for Portuguese
    this.defaultPitch = 1.0;
    this.currentUtterance = null;

    // Cloud TTS fallback state
    this.cloudTTSRequired = false;
    this.cloudTTSCache = new Map(); // cacheKey -> blobURL
    this.cloudTTSCacheOrder = [];   // LRU tracking: oldest first
    this.cloudTTSCacheMax = 50;
    this.currentAudio = null;       // Audio element for cloud TTS

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

    // Determine if cloud TTS is needed for Portuguese
    if (!this.supported) {
      this.cloudTTSRequired = true;
    } else {
      this.cloudTTSRequired = (this.getBestVoice(false) === null);
    }

    // Allow forced cloud mode for testing
    if (window.FORCE_CLOUD_TTS) {
      this.cloudTTSRequired = true;
    }

    if (this.cloudTTSRequired) {
      console.log('[Speech] Cloud TTS will be used for Portuguese (no local pt-BR voices)');
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

    // Third preference: Google Brazilian Portuguese (much better than basic Microsoft voices)
    const googlePT = this.voices.find(voice =>
      voice.name.includes('Google') &&
      (voice.lang === 'pt-BR' || voice.lang === 'pt_BR')
    );
    if (googlePT) return googlePT;

    // Fourth preference: Any Brazilian Portuguese voice (MUST be pt-BR)
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

    // Second preference: Google US English (much better than basic Microsoft voices)
    const googleUS = this.voices.find(voice =>
      voice.name.includes('Google') &&
      (voice.lang === 'en-US' || voice.lang === 'en_US')
    );
    if (googleUS) return googleUS;

    // Third preference: Any Google English voice
    const googleEN = this.voices.find(voice =>
      voice.name.includes('Google') &&
      voice.lang.startsWith('en')
    );
    if (googleEN) return googleEN;

    // Fourth preference: Any US English voice
    const enUS = this.voices.find(voice =>
      voice.lang === 'en-US' || voice.lang === 'en_US'
    );
    if (enUS) return enUS;

    // Fifth preference: Any English voice
    const en = this.voices.find(voice =>
      voice.lang.startsWith('en')
    );
    if (en) return en;

    return null;
  }

  // Cloud TTS: store blob URL in LRU cache
  cloudCacheSet(key, blobURL) {
    // Evict oldest if at capacity
    if (this.cloudTTSCache.size >= this.cloudTTSCacheMax) {
      const oldestKey = this.cloudTTSCacheOrder.shift();
      if (oldestKey) {
        const oldURL = this.cloudTTSCache.get(oldestKey);
        if (oldURL) URL.revokeObjectURL(oldURL);
        this.cloudTTSCache.delete(oldestKey);
      }
    }
    this.cloudTTSCache.set(key, blobURL);
    this.cloudTTSCacheOrder.push(key);
  }

  // Cloud TTS: get blob URL from cache (and promote in LRU)
  cloudCacheGet(key) {
    if (!this.cloudTTSCache.has(key)) return null;
    // Promote to most-recently-used
    const idx = this.cloudTTSCacheOrder.indexOf(key);
    if (idx !== -1) {
      this.cloudTTSCacheOrder.splice(idx, 1);
      this.cloudTTSCacheOrder.push(key);
    }
    return this.cloudTTSCache.get(key);
  }

  // Cloud TTS: speak text via /api/tts endpoint using Audio element
  cloudSpeak(text, options = {}) {
    const lang = options.lang || this.defaultLang;
    const rate = options.rate || (lang.startsWith('pt') ? this.defaultPTRate : this.defaultRate);
    const preferFemale = options.preferFemale || false;
    const cacheKey = `${lang}|${rate}|${preferFemale}|${text}`;

    const cached = this.cloudCacheGet(cacheKey);
    if (cached) {
      console.log('[Speech] Cloud TTS cache hit');
      this._playAudio(cached, options);
      return;
    }

    // Fire onStart immediately so callers know speech is beginning
    if (options.onStart) options.onStart();

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang, preferFemale, rate })
    })
      .then(resp => {
        if (!resp.ok) {
          return resp.json().then(err => { throw new Error(err.error || 'TTS request failed'); });
        }
        return resp.blob();
      })
      .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        this.cloudCacheSet(cacheKey, blobURL);
        console.log(`[Speech] Cloud TTS: playing "${text.substring(0, 40)}..." (${lang})`);
        this._playAudio(blobURL, options, true); // skipOnStart=true, already fired
      })
      .catch(err => {
        console.error('[Speech] Cloud TTS error:', err);
        if (options.onError) options.onError(err);
        if (options.onEnd) options.onEnd();
        this.currentAudio = null;
      });
  }

  // Internal: play audio from a blob URL
  _playAudio(blobURL, options = {}, skipOnStart = false) {
    // Stop any currently playing audio
    this._stopAudio();

    const audio = new Audio(blobURL);
    this.currentAudio = audio;

    audio.addEventListener('playing', () => {
      if (!skipOnStart && options.onStart) options.onStart();
    }, { once: true });

    audio.addEventListener('ended', () => {
      this.currentAudio = null;
      if (options.onEnd) options.onEnd();
    }, { once: true });

    audio.addEventListener('error', (e) => {
      console.error('[Speech] Audio playback error:', e);
      this.currentAudio = null;
      if (options.onError) options.onError(e);
      if (options.onEnd) options.onEnd();
    }, { once: true });

    audio.play().catch(err => {
      console.error('[Speech] Audio play() rejected:', err);
      this.currentAudio = null;
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    });
  }

  // Internal: stop cloud audio playback
  _stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // Main speak function
  speak(text, options = {}) {
    // Route Portuguese to cloud TTS if no local voices
    const lang = options.lang || this.defaultLang;
    if (this.cloudTTSRequired && lang.startsWith('pt')) {
      this.stop();
      this.cloudSpeak(text, options);
      return;
    }

    if (!this.supported) {
      console.warn('[Speech] Cannot speak - Web Speech API not supported');
      return;
    }

    // Stop any current speech
    this.stop();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set properties
    utterance.lang = lang;
    utterance.rate = options.rate || (lang.startsWith('pt') ? this.defaultPTRate : this.defaultRate);
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
    if (!this.supported && !this.cloudTTSRequired) {
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

      // Strip simple parenthetical translations (no = inside) before further parsing
      // e.g., "Ótimo! (great) O que você faz?" → "Ótimo! O que você faz?"
      // But keep "(comer = to eat)" for the vocab pair handler below
      let processedLine = line;
      const hasVocabParens = /\([^)]*=[^)]*\)/.test(line);
      if (!hasVocabParens && line.includes('(') && line.includes(')')) {
        processedLine = line.replace(/\s*\([^)]*\)/g, '').trim();
      }

      if (processedLine.includes(' = ') && processedLine.includes('(')) {
        // Extract text before, inside, and after parentheses
        const match = line.match(/^(.*?)\(([^)]+)\)(.*)$/);
        if (match) {
          const [, before, inside, after] = match;

          // Add text before parentheses — default to Portuguese since
          // the (word = translation) pattern means it's PT being translated
          if (before.trim()) {
            const lang = this.isEnglishSentence(before) && !this.isPortuguese(before) ? 'en-US' : 'pt-BR';
            segments.push({ text: before.trim(), lang });
          }

          // Handle vocab pairs inside parentheses
          const pairs = inside.split(/,\s*/);
          for (const pair of pairs) {
            if (pair.includes(' = ')) {
              const [ptWord, enWord] = pair.split(' = ').map(s => s.trim());
              if (ptWord) segments.push({ text: ptWord, lang: 'pt-BR' });
              if (enWord) segments.push({ text: enWord, lang: 'en-US' });
            }
          }

          // Add text after parentheses — default to Portuguese (same reasoning)
          if (after.trim()) {
            const lang = this.isEnglishSentence(after) && !this.isPortuguese(after) ? 'en-US' : 'pt-BR';
            segments.push({ text: after.trim(), lang });
          }
        } else {
          // Fallback: old behavior for standalone vocab lines
          const cleanLine = line.replace(/[()]/g, '').trim();
          const pairs = cleanLine.split(/,\s*/);
          for (const pair of pairs) {
            if (pair.includes(' = ')) {
              const [ptWord, enWord] = pair.split(' = ').map(s => s.trim());
              if (ptWord) segments.push({ text: ptWord, lang: 'pt-BR' });
              if (enWord) segments.push({ text: enWord, lang: 'en-US' });
            }
          }
        }
      } else if (processedLine.includes(' = ')) {
        // Standalone vocab line without parentheses
        const pairs = processedLine.split(/,\s*/);
        for (const pair of pairs) {
          if (pair.includes(' = ')) {
            const [ptWord, enWord] = pair.split(' = ').map(s => s.trim());
            if (ptWord) segments.push({ text: ptWord, lang: 'pt-BR' });
            if (enWord) segments.push({ text: enWord, lang: 'en-US' });
          }
        }
      } else if (processedLine.includes(' → ')) {
        // Arrow pattern: PT → EN
        const parts = processedLine.split(' → ');
        if (parts.length >= 2) {
          segments.push({ text: parts[0].trim(), lang: 'pt-BR' });
          segments.push({ text: parts.slice(1).join(' → ').trim(), lang: 'en-US' });
        }
      } else {
        // Split line into sentences, detect language per sentence
        const sentences = processedLine.match(/[^.!?]+[.!?]*/g) || [processedLine];
        for (const sentence of sentences) {
          const trimmed = sentence.trim();
          if (!trimmed) continue;

          const hasEnglish = this.isEnglishSentence(trimmed);
          const hasPT = this.isPortuguese(trimmed);
          const hasQuotes = /[""\u201C\u201D]/.test(trimmed);
          console.log(`[Speech] Line: "${trimmed.substring(0, 50)}..." hasEnglish=${hasEnglish}, hasPT=${hasPT}, hasQuotes=${hasQuotes}`);

          if (hasQuotes && (hasEnglish || hasPT)) {
            // Quotes indicate mixed language — extract quoted PT from English context
            this.parseEnglishWithQuotes(trimmed, segments);
          } else if (hasPT && !hasEnglish) {
            // Pure Portuguese
            segments.push({ text: trimmed, lang: 'pt-BR' });
          } else if (hasEnglish) {
            // English sentence
            this.parseEnglishWithQuotes(trimmed, segments);
          } else {
            // Default to English
            segments.push({ text: trimmed, lang: 'en-US' });
          }
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

    // If no quotes found, parse the whole text for mixed content
    if (lastIndex === 0) {
      this.parseUnquotedMixed(text.trim(), segments);
    } else {
      // Add remaining text after last quote
      const remaining = text.slice(lastIndex).trim();
      if (remaining) {
        this.parseUnquotedMixed(remaining, segments);
      }
    }
  }

  // Parse unquoted text that may contain mixed English/Portuguese
  parseUnquotedMixed(text, segments) {
    // Split by comma or common punctuation that separates clauses
    const parts = text.split(/([,;:]\s*)/);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      // Skip pure punctuation
      if (/^[,;:]\s*$/.test(parts[i])) continue;

      // Determine language of this segment
      if (this.isPortuguese(part) && !this.isEnglish(part)) {
        segments.push({ text: part, lang: 'pt-BR' });
      } else {
        segments.push({ text: part, lang: 'en-US' });
      }
    }
  }

  // Simple heuristic to detect if text is English
  isEnglish(text) {
    // First check for Portuguese indicators
    if (this.isPortuguese(text)) {
      return false;
    }
    const englishPatterns = /\b(the|is|are|was|were|have|has|had|do|does|did|will|would|could|should|can|may|might|must|shall|this|that|these|those|what|which|who|whom|whose|where|when|why|how|if|then|than|because|although|however|therefore|means|called|translation|English|mistake|correction|literally|example|practice|want|like|need|try|know|think|say|said|make|made|go|went|get|got|see|saw|come|came|take|took|give|gave|find|found|tell|told|ask|asked|use|used|work|worked|seem|seemed|feel|felt|become|became|leave|left|put|keep|kept|let|begin|began|help|helped|show|showed|hear|heard|play|played|run|ran|move|moved|live|lived|believe|believed|hold|held|bring|brought|happen|happened|write|wrote|provide|provided|sit|sat|stand|stood|lose|lost|pay|paid|meet|met|include|included|continue|continued|set|learn|learned|change|changed|lead|led|understand|understood|watch|watched|follow|followed|stop|stopped|create|created|speak|spoke|read|allow|allowed|add|added|spend|spent|grow|grew|open|opened|walk|walked|win|won|offer|offered|remember|remembered|love|loved|consider|considered|appear|appeared|buy|bought|wait|waited|serve|served|die|died|send|sent|expect|expected|build|built|stay|stayed|fall|fell|cut|reach|reached|kill|killed|remain|remained|suggest|suggested|raise|raised|pass|passed|sell|sold|require|required|report|reported|decide|decided|pull|pulled|here|there|now|just|also|only|very|good|great|cool|nice|bad|new|old|big|small|long|short|high|low|first|last|next|same|other|more|most|some|any|all|both|each|every|many|much|few|little|own|such|even|still|already|always|never|often|again|away|back|down|off|over|under|up|out|about|after|before|between|through|during|into|onto|upon|within|without|above|below|around|along|across|against|among|behind|beside|beyond|inside|outside|near|far|left|right|front|behind)\b/i;
    return englishPatterns.test(text);
  }

  // Detect Portuguese text
  isPortuguese(text) {
    // Portuguese-specific characters
    if (/[ãõáéíóúâêôàç]/i.test(text)) {
      return true;
    }
    // Common Portuguese words
    const ptPatterns = /\b(você|vocês|não|está|estou|estão|são|sou|tudo|bem|muito|obrigado|obrigada|bom|boa|como|onde|quando|porque|por que|aqui|ali|aí|lá|meu|minha|seu|sua|nosso|nossa|dele|dela|para|pelo|pela|com|sem|mais|menos|agora|hoje|amanhã|ontem|gosto|gosta|moro|mora|trabalho|trabalha|falo|fala|tenho|tem|quero|quer|posso|pode|vou|vai|sinto|sente|prazer|olá|oi|tchau|até|depois|antes|sempre|nunca|às vezes|em|na|no|nas|nos|da|do|das|dos|uma|um|umas|uns|casa|dia|sim|isso|isto|aquilo|esse|essa|este|esta|ela|ele|elas|eles|nós|eu|que|qual|quais|se|já|também|ainda|só|todo|toda|tudo|cada|outro|outra|coisa|mesmo|mesma|gente|ser|ter|fazer|faz|ir|ver|dar|saber|dizer|querer|poder|dever|ficar|fica|fiquei|chamo|chama|nome|anos|legal|certo|certa|ótimo|ótima|claro|verdade|né)\b/i;
    return ptPatterns.test(text);
  }

  // Detect English sentence structure (even if it contains PT words in quotes)
  isEnglishSentence(text) {
    // English sentence patterns that indicate this is an English sentence with embedded Portuguese
    const englishStructures = /\b(means|meaning|it's|I'm|you're|we're|they're|he's|she's|this is|you can|you could|can also|could also|also say|also use|would you|do you|is the|are the|how to|what is|that's|here's|let's|I'll|you'll|we'll|they'll|isn't|aren't|doesn't|don't|won't|can't|couldn't|shouldn't|wouldn't|I notice|would you like|could be|response|simple|practice|responding|repeatedly|so,|now,|and |but |or |well,|ok,|yes,|no,|try |just |literally|basically|actually|remember|note|notice|correct|incorrect|instead|works|alternative)\b/i;
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
      .replace(/\*\*/g, '')       // Remove bold markers
      .replace(/\*/g, '')         // Remove italic markers
      .replace(/[\\\/]/g, '')     // Remove backslashes and forward slashes
      .replace(/[""]/g, '')       // Remove curly quotes
      .replace(/["]/g, '')        // Remove straight quotes
      .replace(/\[[^\]]*\]/g, '') // Remove [bracketed placeholders] like [word]
      .replace(/\s{2,}/g, ' ')   // Collapse multiple spaces
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

    // Per-segment callback (used by avatar for language-aware animation)
    if (options.onSegmentStart) options.onSegmentStart(segment, index);

    // Route pt-BR segments to cloud TTS if needed
    const useCloudForSegment = this.cloudTTSRequired && segment.lang === 'pt-BR';

    if (useCloudForSegment) {
      this.cloudSpeak(cleanedText, {
        lang: segment.lang,
        rate: options.rate || (segment.lang === 'pt-BR' ? this.defaultPTRate : this.defaultRate),
        preferFemale: options.preferFemale || false,
        onStart: (index === 0 && options.onStart) ? options.onStart : undefined,
        onEnd: () => {
          if (options.onSegmentEnd) options.onSegmentEnd(segment, index);
          this.speakSegmentsQueue(segments, index + 1, options);
        },
        onError: (err) => {
          console.error('[Speech] Cloud TTS segment error:', err);
          this.speakSegmentsQueue(segments, index + 1, options);
        }
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    utterance.lang = segment.lang;
    utterance.rate = options.rate || (segment.lang === 'pt-BR' ? this.defaultPTRate : this.defaultRate);
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
      if (options.onSegmentEnd) options.onSegmentEnd(segment, index);
      // No delay between segments for smoother flow
      this.speakSegmentsQueue(segments, index + 1, options);
    };

    utterance.onerror = (event) => {
      console.error('[Speech] Error:', event.error);
      if (event.error === 'not-allowed') {
        // Autoplay blocked — notify caller so it can retry after user gesture
        if (options.onBlocked) options.onBlocked();
        return;
      }
      // Continue to next segment on other errors
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
    // Stop Web Speech API
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
    // Stop cloud TTS Audio element
    this._stopAudio();
  }

  // Check if currently speaking
  isSpeaking() {
    if (this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended) {
      return true;
    }
    return this.synthesis.speaking;
  }

  // Pause speech
  pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    } else if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  // Resume speech
  resume() {
    if (this.currentAudio && this.currentAudio.paused && !this.currentAudio.ended) {
      this.currentAudio.play();
    } else if (this.synthesis.paused) {
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
