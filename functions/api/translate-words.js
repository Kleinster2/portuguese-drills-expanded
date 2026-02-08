// Cloudflare Pages Function: POST /api/translate-words
// Batch translates Portuguese words to English using Claude

const ALLOWED_ORIGINS = [
  'https://portuguese-drills-expanded.pages.dev',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

function corsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

  if (!isAllowed) {
    return {}; // No CORS headers = browser blocks the request
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);

  try {
    const { words, context } = await request.json();

    if (!words || !Array.isArray(words) || words.length === 0) {
      return new Response(JSON.stringify({ error: 'No words provided' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Limit to 30 words per request
    const batch = words.slice(0, 30);

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Create prompt for Claude
    const wordList = batch.join(', ');
    const systemPrompt = `You are a Portuguese-English dictionary. Translate each Portuguese word to English based on how it's used in context.

Rules:
- Return ONLY a JSON object with translations
- Each key is the Portuguese word (lowercase)
- Each value is a brief English translation (1-5 words)
- Use the context to determine the correct meaning (e.g., "mora" as verb = "lives", not "blackberry")
- For conjugated verbs, translate the meaning (e.g., "mora" = "lives", not "to live")
- For multiple meanings, separate with semicolon
- If a word is not Portuguese or you're unsure, use null
- NO explanations, NO markdown, ONLY valid JSON`;

    let userMessage = `Translate these Portuguese words to English. Return only JSON:\n\n${wordList}`;

    // Add context if provided
    if (context) {
      userMessage = `Context: "${context}"\n\nTranslate these Portuguese words as used in the context above. Return only JSON:\n\n${wordList}`;
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Claude API error:', errorText);
      return new Response(JSON.stringify({ error: 'Translation API error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    const data = await resp.json();
    const responseText = data.content?.[0]?.text || '{}';

    // Parse the JSON response from Claude
    let translations = {};
    try {
      // Handle potential markdown code blocks
      let jsonStr = responseText.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      translations = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      // Return empty translations rather than error
      translations = {};
    }

    return new Response(JSON.stringify({ translations }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('translate-words error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
