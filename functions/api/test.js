export async function onRequestPost({ request, env }) {
  console.log('TEST: Function called!');
  console.log('TEST: env exists:', !!env);
  console.log('TEST: OPENAI_API_KEY exists:', !!env?.OPENAI_API_KEY);
  console.log('TEST: API key value:', env?.OPENAI_API_KEY);
  
  return new Response(JSON.stringify({
    success: true,
    hasEnv: !!env,
    hasApiKey: !!env?.OPENAI_API_KEY,
    apiKeyLength: env?.OPENAI_API_KEY ? env.OPENAI_API_KEY.length : 0
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}