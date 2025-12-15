/**
 * API endpoint for sharing simplifications
 * POST: Save a new shared simplification
 * GET: Retrieve a shared simplification by ID
 */

function generateShareId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export async function onRequestPost({ request, env }) {
  try {
    const { level, input_text, output_text } = await request.json();

    if (!level || !input_text || !output_text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const shareId = generateShareId();
    const timestamp = Date.now();

    await env.DB.prepare(
      'INSERT INTO shared_simplifications (id, level, input_text, output_text, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(shareId, level, input_text, output_text, timestamp).run();

    return new Response(JSON.stringify({
      success: true,
      shareId,
      url: `/simplifier?share=${shareId}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error saving shared simplification:', error);
    return new Response(JSON.stringify({ error: 'Failed to save' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const shareId = url.searchParams.get('id');

    if (!shareId) {
      return new Response(JSON.stringify({ error: 'Missing share ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare(
      'SELECT level, input_text, output_text, created_at FROM shared_simplifications WHERE id = ?'
    ).bind(shareId).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Share not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      level: result.level,
      input_text: result.input_text,
      output_text: result.output_text,
      created_at: result.created_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error retrieving shared simplification:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
