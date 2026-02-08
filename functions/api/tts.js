// Cloudflare Pages Function: POST /api/tts
// Proxies Google Cloud Text-to-Speech API for devices without local pt-BR voices

const ALLOWED_ORIGINS = [
  'https://portuguese-drills-expanded.pages.dev',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

function corsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

  if (!isAllowed) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

// Voice mapping: lang + gender → Google Cloud TTS voice name
const VOICES = {
  'pt-BR': { female: 'pt-BR-Neural2-C', male: 'pt-BR-Neural2-B' },
  'en-US': { female: 'en-US-Neural2-F', male: 'en-US-Neural2-D' }
};

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);

  try {
    const { text, lang, preferFemale, rate } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    if (text.length > 2000) {
      return new Response(JSON.stringify({ error: 'Text exceeds 2000 character limit' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    const apiKey = env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Google TTS API key not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Resolve voice
    const langKey = lang && VOICES[lang] ? lang : 'pt-BR';
    const gender = preferFemale ? 'female' : 'male';
    const voiceName = VOICES[langKey][gender];

    // Build Google Cloud TTS request
    const ttsRequest = {
      input: { text: text.trim() },
      voice: {
        languageCode: langKey,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: typeof rate === 'number' ? Math.max(0.25, Math.min(4.0, rate)) : 1.0
      }
    };

    const resp = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ttsRequest)
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Google TTS API error:', errorText);
      return new Response(JSON.stringify({ error: 'TTS API error' }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    const data = await resp.json();
    const audioContent = data.audioContent; // base64-encoded MP3

    if (!audioContent) {
      return new Response(JSON.stringify({ error: 'No audio returned from TTS' }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Decode base64 to binary
    const binaryString = atob(audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Response(bytes, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error('tts error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
