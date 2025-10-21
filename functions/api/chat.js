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
  const randomizationSuffix = `\n\n**CRITICAL RANDOMIZATION REQUIREMENT:**
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

**Starting Questions:**
Your FIRST question should be randomly selected from the full range of available content, not always the same basic example. Pick something from the middle difficulty range to keep users engaged.

Remember: Variety and randomization are KEY to maintaining user interest and preventing boredom. Every session should feel fresh and different.`;

  return basePrompt + randomizationSuffix;
}

async function callClaude(apiKey, messages) {
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
    max_tokens: 500,
    temperature: 0.85, // Increased for more variety in questions
    messages: conversationMessages
  };
  
  // Add system message if present
  if (systemMessage) {
    requestBody.system = systemMessage;
  }
  
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
    throw new Error(`Anthropic error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content = data.content?.[0]?.text ?? '';
  return String(content);
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
    const msg = err?.message || 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}