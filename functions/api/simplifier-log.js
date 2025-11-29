// Cloudflare Pages Function to log simplifier usage to D1

const ALLOWED_ORIGINS = [
  'https://portuguese-drills-expanded.pages.dev',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

function getCorsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

  if (!isAllowed) {
    return {}; // No CORS headers = browser blocks the request
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = getCorsHeaders(request);

  try {
    const { level, input_text, output_text, user_id } = await request.json();

    // Get country from Cloudflare headers
    const country = request.cf?.country || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert into D1
    await env.DB.prepare(
      'INSERT INTO logs (level, input_text, output_text, country, user_agent, user_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(level, input_text, output_text, country, userAgent, user_id || null).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Log error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    headers: getCorsHeaders(request)
  });
}

// GET endpoint to view logs (simple viewer)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') || 50;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM logs ORDER BY id DESC LIMIT ?'
    ).bind(limit).all();

    // Return as HTML for easy viewing
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Simplifier Logs</title>
  <style>
    body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .text { max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .text:hover { white-space: normal; word-wrap: break-word; }
    tr:hover { background: #f9f9f9; }
  </style>
</head>
<body>
  <h1>Simplifier Logs (${results.length})</h1>
  <table>
    <tr>
      <th>ID</th>
      <th>Time</th>
      <th>User</th>
      <th>Level</th>
      <th>Input (hover to expand)</th>
      <th>Output (hover to expand)</th>
      <th>Country</th>
    </tr>
    ${results.map(row => `
    <tr>
      <td>${row.id}</td>
      <td>${row.timestamp}</td>
      <td><strong>${row.user_id || '-'}</strong></td>
      <td>${row.level}</td>
      <td class="text" title="${(row.input_text || '').replace(/"/g, '&quot;')}">${row.input_text || ''}</td>
      <td class="text" title="${(row.output_text || '').replace(/"/g, '&quot;')}">${row.output_text || ''}</td>
      <td>${row.country}</td>
    </tr>
    `).join('')}
  </table>
</body>
</html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
