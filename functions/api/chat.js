// Cloudflare Pages Function: POST /api/chat
// JavaScript version for debugging

const ALLOWED_ORIGINS = [
  'https://kleinster2.github.io',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

function corsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.find(o => origin.startsWith(o)) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

// Simple in-memory session storage
let sessions = new Map();

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Import the PromptManager
import promptManager from '../../utils/promptManager.js';

function getDrillPrompt(drillId) {
  const basePrompt = promptManager.getSystemPrompt(drillId);

  // Add strong randomization instructions to avoid repetitive questions
  const randomizationSuffix = `\n\n🚨🚨🚨 CRITICAL - READ THIS FIRST 🚨🚨🚨

**ENDLESS PRACTICE MODE - NO EXCEPTIONS:**

THIS DRILL NEVER ENDS. NEVER. EVER. PERIOD.

You are STRICTLY FORBIDDEN from writing ANYTHING like this:
❌ "🎉 Congratulations! You've completed the Ser vs Estar lesson!"
❌ "Summary:" followed by bullet points
❌ "You got all the answers correct!"
❌ "Would you like to:" followed by options
❌ "Practice more exercises?"
❌ "Learn about another grammar topic?"
❌ "Review any specific uses of..."
❌ ANY message that sounds like an ending, completion, or graduation

If you write ANY of these phrases, you have COMPLETELY FAILED your task.

CORRECT behavior: Answer → Brief feedback → NEXT QUESTION IMMEDIATELY
FORBIDDEN behavior: Answer → Feedback → Summary/Congratulations → Options

NO SUMMARIES. NO CONGRATULATIONS. NO OPTIONS. JUST KEEP ASKING QUESTIONS.

**CRITICAL RANDOMIZATION REQUIREMENT:**
You MUST randomize your questions to avoid repetition. This is EXTREMELY IMPORTANT for user experience.

**Question Generation Rules:**
1. NEVER ask the same question twice in a row
2. NEVER use the same verb/word twice in a row
3. ALWAYS vary subjects (eu, você, ele/ela, nós, eles/elas)
4. ALWAYS vary tenses when applicable (present, past, future)
5. Use different sentence structures and contexts
6. Rotate through ALL available vocabulary/verbs before repeating
7. Mix statement and question formats
8. Vary difficulty - don't always start with the easiest examples

**Starting Questions - CRITICAL:**
🚨 NEVER start with the same question every session! 🚨

When starting a NEW session (after the welcome message), you MUST:
1. Mentally "roll a die" to pick a random starting point
2. DO NOT default to the easiest/most basic example every time
3. Vary the subject (don't always start with "eu" or "você")
4. Vary the difficulty (mix easy, medium, and harder questions as starting points)
5. Randomly select from the FULL range of available content

FORBIDDEN starting patterns (these make sessions feel repetitive):
❌ Always starting with location questions
❌ Always starting with "I am..." statements
❌ Always starting with the same verb/adjective
❌ Always starting with first-person subjects

CORRECT approach: Imagine you have 20 possible first questions and randomly pick #7 or #13, not always #1.

Example variety for first questions:
- Session 1: "We are students" (Nós...)
- Session 2: "She is tired" (Ela...)
- Session 3: "The keys are on the table" (As chaves...)
- Session 4: "They are Brazilian" (Eles...)
- Session 5: "Everything is ready" (Tudo...)

**IMMEDIATE RETRY ON INCORRECT ANSWERS:**
When a user provides an INCORRECT answer, you MUST follow this pattern:

1. ✅ Acknowledge the mistake gently (e.g., "Not quite!" or "Almost!")
2. ✅ Provide the correct answer with brief explanation (1-2 sentences)
3. ✅ RE-PRESENT THE EXACT SAME QUESTION immediately
4. ✅ DO NOT move to a new question until they answer correctly

Example of CORRECT behavior:
User: "está" (incorrect for "We are Brazilian")
AI: "Not quite! For permanent characteristics like nationality, we use ser. The correct answer is: Nós somos brasileiros.

Let's try that same one again:
\"We are Brazilian.\"
Nós ______ brasileiros."

This immediate retry reinforces learning by giving the user a chance to practice the correct answer right away.

**ANSWER CHIPS - CLICKABLE OPTIONS:**
When asking fill-in-the-blank questions, you SHOULD provide clickable answer options to make practice faster and more interactive.

After presenting your question, add a [CHIPS: ...] marker on a new line with 3-5 answer options separated by commas:
- Include the CORRECT answer
- Include 2-4 PLAUSIBLE incorrect answers (common mistakes)
- Shuffle mentally (the system will shuffle them for display)

Example format:
"I have many friends."
Eu tenho ______ amigos.
(agreement - plural masculine)
[CHIPS: muitos, muito, muitas, muita]

Example format:
"Everything is ready."
______ está pronto.
(pronoun/everything)
[CHIPS: tudo, todo, toda, todos]

**When to use answer chips:**
- ✅ DO use for: agreement drills, prepositions, articles, demonstratives, possessives
- ✅ DO use for: todo/tudo, muito agreement, por/para distinction
- ❌ DON'T use for: verb conjugations (these have their own button system)
- ❌ DON'T use for: open-ended translation exercises

The [CHIPS: ...] marker will be automatically removed from the display and converted into clickable buttons.

**CRITICAL GRAMMAR RULE - CONTRACTIONS:**
When 'por' is followed by a definite article (o, a, os, as), you MUST use the contracted form. This is NOT optional - it is MANDATORY Portuguese grammar:
- por + o = pelo (NOT "por o")
- por + a = pela (NOT "por a")
- por + os = pelos (NOT "por os")
- por + as = pelas (NOT "por as")

Examples:
- ✅ CORRECT: "Andamos pelo parque" (We walked through THE park)
- ❌ WRONG: "Andamos por o parque" (grammatically incorrect!)

When explaining these cases in feedback, you MUST:
1. Always use the contraction in the full sentence (pelo/pela/pelos/pelas)
2. Explain that the contraction is REQUIRED, not just "more common"
3. Never say "or more commonly" - the contraction is the ONLY correct form

**FORMATTING FOR CORRECT ANSWERS - APPLIES TO ALL DRILLS:**
When showing the correct answer or full sentence, you MUST use this exact format:

Full correct sentence: **[Portuguese sentence]**

Examples:
- Full correct sentence: **As chaves estão na mesa.**
- Correct answer: **Ela é médica.**
- The answer is: **Nós somos brasileiros.**

🚨 CRITICAL FORMATTING RULE 🚨
- Only the PORTUGUESE SENTENCE should be bold
- The label ("Full correct sentence:", "Correct answer:", etc.) should NOT be bold
- This makes the Portuguese stand out and be easier to read

NEVER do this:
❌ **Full correct sentence: As chaves estão na mesa.**
❌ **Correct answer: Ela é médica.**

ALWAYS do this:
✅ Full correct sentence: **As chaves estão na mesa.**
✅ Correct answer: **Ela é médica.**

**CONJUGATION TABLES - COMPREHENSIVE FORMAT:**
When showing conjugation tables, you MUST group subjects that share the same conjugation on ONE line.

🚨 REQUIRED FORMAT - Group by conjugation:

**For Brazilian Portuguese (BP):**
eu                                                    **[conjugation for eu]**
ele/ela/você/a gente/todo mundo/alguém/ninguém/quem/tudo   **[conjugation for 3rd person singular]**
nós                                                   **[conjugation for nós]**
eles/elas/vocês                                       **[conjugation for 3rd person plural]**

**For European Portuguese (EP) - include tu:**
eu                                            **[conjugation for eu]**
tu                                            **[conjugation for tu]**
ele/ela/você                                  **[conjugation for 3rd person singular]**
nós                                           **[conjugation for nós]**
eles/elas/vocês                               **[conjugation for 3rd person plural]**

**Alignment Rules:**
- Subjects with the same conjugation go on ONE line, separated by slashes
- No spaces around the slashes (ele/ela/você NOT ele / ela / você)
- Use consistent spacing to align conjugations vertically
- All conjugations should line up in the same column
- **CRITICAL: Conjugated verbs must be in bold** using **verb** format

**Example for estar (present tense) in BP:**

eu                                                    **estou**
ele/ela/você/a gente/todo mundo/alguém/ninguém/quem/tudo   **está**
nós                                                   **estamos**
eles/elas/vocês                                       **estão**

**Example for estar (present tense) in EP:**

eu                    **estou**
tu                    **estás**
ele/ela/você          **está**
nós                   **estamos**
eles/elas/vocês       **estão**

NEVER use markdown tables:
❌ | Subject | Conjugation |
❌ |---------|-------------|

NEVER list each subject on a separate line:
❌ eu          estou
❌ você        está
❌ ele         está
❌ ela         está

ALWAYS group subjects with the same conjugation ✅

**SUBJECT VARIETY - INDEFINITE PRONOUNS:**
When creating exercises with subjects, remember to occasionally use indefinite pronouns that take third-person singular conjugation:

- **alguém** (someone) - Alguém está na porta. (Someone is at the door)
- **ninguém** (no one) - Ninguém sabe a resposta. (No one knows the answer)
- **todo mundo** (everyone) - Todo mundo gosta de música. (Everyone likes music)
- **quem** (who) - Quem é você? (Who are you?) / Quem sabe português? (Who knows Portuguese?)
- **tudo** (everything) - Tudo está bem. (Everything is fine) / Tudo vai passar. (Everything will pass)

These should be included in conjugation tables alongside ele/ela/você as they all share the same third-person singular form.

**FEEDBACK VARIETY - NATURAL POSITIVE RESPONSES:**
When giving positive feedback for correct answers, you MUST vary your response naturally. NEVER use the same phrase repeatedly.

🚨 CRITICAL: Avoid overusing "Perfect!" - it should appear at most 1 in 8 correct answers.

Rotate through these natural positive responses:
- That's right!
- Exactly!
- Correct!
- Well done!
- Excellent!
- Great!
- Nice work!
- You got it!
- Spot on!
- Absolutely!
- Perfect! (use sparingly - max 1 in 8)

Additional variety for specific contexts:
- Good eye! (when they spot a nuanced case)
- Nicely done! (for complex answers)
- That's the one! (for choices)
- Exactly right! (for precise answers)

The goal is to sound like a natural, encouraging human tutor, not a robot repeating "Perfect!" constantly.

**SER + PROFESSION - NO ARTICLE RULE:**
When using ser with professions, Portuguese does NOT use an indefinite article (um/uma), unlike English.

🚨 IMPORTANT DIFFERENCE FROM ENGLISH:

English: "She is a doctor"
Portuguese: **Ela é médica** (NOT "Ela é uma médica")

English: "He is a teacher"
Portuguese: **Ele é professor** (NOT "Ele é um professor")

HOWEVER, if you add an adjective, you MUST use the article:
- Ela é uma médica excelente. (She is an excellent doctor)
- Ele é um professor dedicado. (He is a dedicated teacher)

Common professions to remember:
- médico/médica (doctor)
- professor/professora (teacher)
- engenheiro/engenheira (engineer)
- advogado/advogada (lawyer)
- estudante (student - invariable)

**When to explain this rule:**
- When giving feedback on profession-related questions
- When the sentence uses ser + profession
- Include a brief note: "Remember: No article needed with professions in Portuguese (unlike English)"

**Spanish Analogy for this rule:**
"This is different from English but identical to Spanish! Portuguese Ela é médica matches Spanish Ella es médica (both without article)."

Remember: Variety and randomization are KEY to maintaining user interest and preventing boredom. Every session should feel fresh and different.`;

  return basePrompt + randomizationSuffix;
}

async function callClaude(apiKey, messages, retryCount = 0) {
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1000; // 1 second

  // Use full context for Claude reliability
  const limitedMessages = messages.slice(-10); // Keep last 10 messages for context

  // Convert messages to Claude format - separate system message from conversation
  let systemMessage = '';
  const conversationMessages = [];

  for (const msg of limitedMessages) {
    if (msg.role === 'system') {
      systemMessage = msg.content;
    } else {
      // Remove timestamp and other extra fields for Claude API
      conversationMessages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  const requestBody = {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024, // Increased to accommodate full welcome messages + first question
    temperature: 0.85, // Increased for more variety in questions
    messages: conversationMessages
  };

  // Add system message if present
  if (systemMessage) {
    requestBody.system = systemMessage;
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!resp.ok) {
      const text = await resp.text();
      const status = resp.status;

      // Retry on 503 (service unavailable) or 529 (overloaded)
      if ((status === 503 || status === 529) && retryCount < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Anthropic API error ${status}, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry with incremented count
        return await callClaude(apiKey, messages, retryCount + 1);
      }

      // If not retryable or max retries reached, throw error
      throw new Error(`Anthropic error ${status}: ${text}`);
    }

    const data = await resp.json();
    const content = data.content?.[0]?.text ?? '';
    return String(content);

  } catch (error) {
    // If this is a network error and we haven't exceeded retries, try again
    if (retryCount < MAX_RETRIES && error.message.includes('fetch')) {
      const delay = BASE_DELAY * Math.pow(2, retryCount);
      console.log(`Network error, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return await callClaude(apiKey, messages, retryCount + 1);
    }

    throw error;
  }
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);


  try {
    const body = await request.json().catch(() => ({}));
    const { sessionId, drillId, message, isNewSession, messages: clientMessages } = body;
    

    if (isNewSession || !sessionId) {
      // Create new session and return welcome message
      const newSessionId = generateSessionId();
      const actualDrillId = drillId || 'regular-ar';

      // Use provided message or random greeting to ensure variety
      const greetings = [
        'Hello, I\'m ready to start practicing!',
        'Hi! Let\'s begin.',
        'Ready to practice!',
        'I\'m ready to learn.',
        'Let\'s get started!',
        'Hello! I\'m ready.',
        'Ready when you are!',
        'Let\'s practice!'
      ];
      const initialMessage = message || greetings[Math.floor(Math.random() * greetings.length)];

      const session = {
        sessionId: newSessionId,
        drillId: actualDrillId,
        messages: [
          { role: 'system', content: getDrillPrompt(actualDrillId), timestamp: new Date() },
          { role: 'user', content: initialMessage, timestamp: new Date() }
        ],
        createdAt: new Date(),
        lastActivity: new Date(),
        metadata: { dialect: 'BP' }
      };
      
      sessions.set(newSessionId, session);
      
      // Get initial welcome message
      // For local development, use fallback if env var not working
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ 
          error: 'Anthropic API key not configured'
        }), {
          status: 500,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }
      const welcomeResponse = await callClaude(apiKey, session.messages);
      session.messages.push({
        role: 'assistant',
        content: welcomeResponse,
        timestamp: new Date()
      });

      return new Response(JSON.stringify({
        sessionId: newSessionId,
        response: welcomeResponse
      }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    } else {
      // Continue existing session
      let session = sessions.get(sessionId);

      // If session not found but client provided messages, use those (stateless mode)
      if (!session && clientMessages && Array.isArray(clientMessages)) {
        const actualDrillId = drillId || 'regular-ar';

        // Reconstruct session with system message first
        const systemMessage = { role: 'system', content: getDrillPrompt(actualDrillId), timestamp: new Date() };
        const allMessages = [systemMessage, ...clientMessages];

        session = {
          sessionId: sessionId,
          drillId: actualDrillId,
          messages: allMessages,
          createdAt: new Date(),
          lastActivity: new Date(),
          metadata: { dialect: 'BP' }
        };
        // Store it temporarily
        sessions.set(sessionId, session);
      }

      if (!session) {
        return new Response(JSON.stringify({ error: 'Session not found' }), {
          status: 404,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message required for existing session' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      // Add user message
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Get AI response
      const openaiMessages = session.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // For local development, use fallback if env var not working
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
          status: 500,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }
      const aiResponse = await callClaude(apiKey, openaiMessages);
      
      session.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });
      
      session.lastActivity = new Date();

      return new Response(JSON.stringify({
        sessionId: sessionId,
        response: aiResponse
      }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    console.error('Chat API Error:', err);
    const rawMessage = err?.message || 'Unknown error';

    // Provide user-friendly error messages
    let userMessage = rawMessage;

    // Handle Anthropic API errors
    if (rawMessage.includes('503') || rawMessage.includes('1200')) {
      userMessage = "Anthropic's AI service is temporarily busy. We automatically retried 3 times but it's still unavailable. Please wait a moment and try again.";
    } else if (rawMessage.includes('529')) {
      userMessage = "Anthropic's AI service is overloaded right now. Please wait 30 seconds and try again.";
    } else if (rawMessage.includes('401') || rawMessage.includes('authentication')) {
      userMessage = "API authentication error. Please contact support.";
    } else if (rawMessage.includes('429') || rawMessage.includes('rate limit')) {
      userMessage = "Too many requests. Please wait a minute before trying again.";
    } else if (rawMessage.includes('timeout')) {
      userMessage = "Request timed out. The AI took too long to respond. Please try again.";
    }

    return new Response(JSON.stringify({
      error: userMessage,
      technicalDetails: rawMessage
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}