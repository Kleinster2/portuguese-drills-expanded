/**
 * Placement Test Report Generator
 * POST /api/placement-test/report
 *
 * Receives answers array from client and generates formatted diagnostic report
 */

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

export async function onRequestPost({ request }) {
  const headers = corsHeaders(request);

  try {
    const body = await request.json();
    const { answers, topics } = body;

    if (!answers || !Array.isArray(answers)) {
      return new Response(JSON.stringify({
        error: 'Invalid request: answers array required'
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Generate report
    const report = generateReport(answers, topics);

    return new Response(JSON.stringify({
      report: report
    }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating placement test report:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate report',
      details: error.message
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Generate formatted diagnostic report
 */
function generateReport(answers, topics) {
  // Group answers by topic
  const topicScores = {};

  answers.forEach(answer => {
    if (!topicScores[answer.topic]) {
      const topicInfo = topics.find(t => t.code === answer.topic);
      topicScores[answer.topic] = {
        code: answer.topic,
        name: topicInfo ? topicInfo.name : answer.topic,
        level: topicInfo ? topicInfo.level : 'Unknown',
        correct: 0,
        total: 0
      };
    }
    topicScores[answer.topic].total++;
    if (answer.correct) {
      topicScores[answer.topic].correct++;
    }
  });

  // Build report string
  let report = 'PORTUGUESE DIAGNOSTIC TEST\n\n';

  // Helper to get topics by level in correct order
  const getTopicsByLevel = (level) => {
    return topics
      .filter(t => t.level === level)
      .map(t => topicScores[t.code])
      .filter(Boolean); // Filter out any undefined
  };

  // A1 LEVEL
  const a1Topics = getTopicsByLevel('A1');
  if (a1Topics.length > 0) {
    report += 'A1 LEVEL\n';
    a1Topics.forEach((topic, idx) => {
      const prefix = idx === a1Topics.length - 1 ? '└─' : '├─';
      report += `${prefix} ${topic.name}: ${topic.correct}/${topic.total}\n`;
    });
    report += '\n';
  }

  // A2 LEVEL
  const a2Topics = getTopicsByLevel('A2');
  if (a2Topics.length > 0) {
    report += 'A2 LEVEL\n';
    a2Topics.forEach((topic, idx) => {
      const prefix = idx === a2Topics.length - 1 ? '└─' : '├─';
      report += `${prefix} ${topic.name}: ${topic.correct}/${topic.total}\n`;
    });
    report += '\n';
  }

  // B1 LEVEL
  const b1Topics = getTopicsByLevel('B1');
  if (b1Topics.length > 0) {
    report += 'B1 LEVEL\n';
    b1Topics.forEach((topic, idx) => {
      const prefix = idx === b1Topics.length - 1 ? '└─' : '├─';
      report += `${prefix} ${topic.name}: ${topic.correct}/${topic.total}\n`;
    });
    report += '\n';
  }

  // B2 LEVEL
  const b2Topics = getTopicsByLevel('B2');
  if (b2Topics.length > 0) {
    report += 'B2 LEVEL\n';
    b2Topics.forEach((topic, idx) => {
      const prefix = idx === b2Topics.length - 1 ? '└─' : '├─';
      report += `${prefix} ${topic.name}: ${topic.correct}/${topic.total}\n`;
    });
    report += '\n';
  }

  report += 'Send this report to your instructor.';

  return report;
}
