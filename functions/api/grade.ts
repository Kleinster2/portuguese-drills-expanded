// Cloudflare Pages Function: POST /api/grade
// Expects JSON: { drillId: string, prompt?: string, answer: string, dialect?: "BR"|"PT" }
// Returns: { score: number (0-100), feedback: string }

const ALLOWED_ORIGINS = [
  'https://kleinster2.github.io',
  'https://kleinster2.github.io/portuguese-drills',
  'https://kleinster2.github.io/portuguese-drills/',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.find(o => origin.startsWith(o)) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  } as Record<string,string>;
}

export const onRequestOptions: PagesFunction = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
};

type GradeRequest = {
  drillId?: string;
  prompt?: string; // optional stem/context
  answer?: string;
  dialect?: 'BR' | 'PT';
};

type GradeResponse = {
  score: number;
  feedback: string;
};

// Minimal per-drill rubric examples (placeholder). In production, load from a KV/JSON file.
const DRILL_RUBRICS: Record<string, { title: string; rubric: string[]; examples?: { input: string; good: string; bad: string; }[] }> = {
  'regular-ar': {
    title: 'Regular -ar Verb Drill',
    rubric: [
      'Use correct person/number endings for regular -ar verbs in the requested tense.',
      'Respect the chosen dialect (PT-BR or PT-PT) for orthography and common usage when relevant.',
      'Minor typos reduce score slightly; major conjugation errors reduce more.'
    ],
    examples: [
      { input: 'Eu (falar) agora.', good: 'Eu falo agora.', bad: 'Eu fala agora.' }
    ]
  }
};

function buildPrompt(drillId: string, prompt: string | undefined, answer: string, dialect: 'BR'|'PT') {
  const d = DRILL_RUBRICS[drillId] || { title: 'Portuguese Drill', rubric: [], examples: [] };
  const dialectText = dialect === 'PT' ? 'European Portuguese (PT-PT)' : 'Brazilian Portuguese (PT-BR)';
  const rubric = d.rubric.map((r,i) => `${i+1}. ${r}`).join('\n');
  const examples = (d.examples || [])
    .slice(0,2)
    .map(ex => `Input: ${ex.input}\nGood: ${ex.good}\nBad: ${ex.bad}`)
    .join('\n\n');
  const stem = prompt ? `Prompt/Stem: ${prompt}\n` : '';
  return {
    system: `You are a strict but friendly Portuguese drill tutor. Grade briefly and consistently. Use ${dialectText} conventions when they differ. Output in JSON.`,
    user: `${stem}Drill: ${d.title}\nRubric:\n${rubric}\n\nLearner answer: ${answer}\n\nReturn a compact JSON object: {"score":0-100,"feedback":"one or two sentences with corrections"}${examples ? `\n\nExamples:\n${examples}` : ''}`
  };
}

async function callOpenAI(apiKey: string, messages: {role:'system'|'user'|'assistant'; content: string}[]) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 250,
      messages
    })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return String(content);
}

export const onRequestPost: PagesFunction<{ OPENAI_API_KEY: string }> = async ({ request, env }) => {
  const headers = corsHeaders(request);
  try {
    const body = (await request.json().catch(() => ({}))) as GradeRequest;
    const drillId = (body.drillId || 'regular-ar').toString();
    const answer = (body.answer || '').toString().slice(0, 2000);
    const prompt = body.prompt ? body.prompt.toString().slice(0, 1000) : undefined;
    const dialect = (body.dialect === 'PT' ? 'PT' : 'BR') as 'PT'|'BR';

    if (!answer) {
      return new Response(JSON.stringify({ error: 'Missing answer' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    const { system, user } = buildPrompt(drillId, prompt, answer, dialect);
    const content = await callOpenAI(env.OPENAI_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]);

    // Try to parse JSON from the model response; fallback to regex for score
    let parsed: GradeResponse | null = null;
    try { parsed = JSON.parse(content) as GradeResponse; } catch {}

    if (!parsed || typeof parsed.score !== 'number' || typeof parsed.feedback !== 'string') {
      const m = content.match(/\b(\d{1,3})\b/);
      const score = Math.max(0, Math.min(100, m ? parseInt(m[1], 10) : 0));
      parsed = { score, feedback: content.trim().slice(0, 800) };
    }

    return new Response(JSON.stringify(parsed), { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    const msg = err?.message || 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
};
