// Cloudflare Pages Function: POST /api/worksheet
// Generates a printable HTML worksheet from a drill prompt + student info

const ALLOWED_ORIGINS = [
  'https://kleinster2.github.io',
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

import promptManager from '../../utils/promptManager.js';
import { buildWorksheetPrompt } from '../../config/worksheet-meta-prompt.js';

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);

  try {
    const body = await request.json().catch(() => ({}));
    const { drillId, studentName, studentNotes } = body;

    // Validate required fields
    if (!drillId) {
      return new Response(JSON.stringify({ error: 'drillId is required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    if (!studentName || !studentName.trim()) {
      return new Response(JSON.stringify({ error: 'studentName is required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Check API key
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Get drill system prompt
    const drillPrompt = promptManager.getSystemPrompt(drillId);
    if (!drillPrompt) {
      return new Response(JSON.stringify({ error: `Drill '${drillId}' not found` }), {
        status: 404,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Build the worksheet generation prompt
    const systemPrompt = buildWorksheetPrompt(
      drillPrompt,
      studentName.trim(),
      studentNotes ? studentNotes.trim() : ''
    );

    // Single-shot Claude call — Sonnet for speed and cost
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 8000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Generate the worksheet now. Output ONLY the complete HTML document.`
          }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Anthropic error ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    let html = data.content?.[0]?.text ?? '';

    // Strip markdown fences if Claude wrapped the output
    html = html.replace(/^```html?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

    // Return the raw HTML
    return new Response(html, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

  } catch (err) {
    console.error('Worksheet API Error:', err);
    const rawMessage = err?.message || 'Unknown error';

    let userMessage = rawMessage;
    if (rawMessage.includes('503') || rawMessage.includes('529')) {
      userMessage = "Anthropic's AI service is temporarily busy. Please wait a moment and try again.";
    } else if (rawMessage.includes('401')) {
      userMessage = "API authentication error. Please contact support.";
    } else if (rawMessage.includes('429')) {
      userMessage = "Too many requests. Please wait a minute before trying again.";
    }

    return new Response(JSON.stringify({ error: userMessage }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
