/**
 * Diagnostic Test Report Generator
 * POST /api/diagnostic-test/report
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

// GET endpoint to view diagnostic test results
export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') || 50;
  const userId = url.searchParams.get('user'); // Filter by user hash

  try {
    let results;
    if (userId) {
      // Filter by specific user
      const query = await env.DB.prepare(
        'SELECT * FROM placement_test_results WHERE user_id = ? ORDER BY id DESC LIMIT ?'
      ).bind(userId, limit).all();
      results = query.results;
    } else {
      // Show all results
      const query = await env.DB.prepare(
        'SELECT * FROM placement_test_results ORDER BY id DESC LIMIT ?'
      ).bind(limit).all();
      results = query.results;
    }

    // Build topic breakdown for each result
    const formatTopics = (resultsJson) => {
      if (!resultsJson) return '-';
      try {
        const data = JSON.parse(resultsJson);
        const topics = [];
        (data.completedPhases || []).forEach(p => {
          for (const [name, s] of Object.entries(p.topics || {})) {
            const skip = s.skipped || 0;
            const skipText = skip > 0 ? ` (${skip} skipped)` : '';
            topics.push(`${name}: ${s.correct}/${s.total}${skipText}`);
          }
        });
        return topics.join('\n');
      } catch { return '-'; }
    };

    // Return as HTML for easy viewing
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Diagnostic Test Results</title>
  <style>
    body { font-family: system-ui; max-width: 1400px; margin: 0 auto; padding: 20px; }
    h1 { color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
    th { background: #f5f5f5; font-weight: 600; }
    .number { text-align: center; font-weight: bold; }
    .good { color: #16a34a; }
    .needs-work { color: #ea580c; }
    tr:hover { background: #f9f9f9; }
    tr.expandable { cursor: pointer; }
    .topics-row { display: none; background: #fafafa; }
    .topics-row.show { display: table-row; }
    .topics-cell { font-family: monospace; font-size: 13px; white-space: pre-wrap; padding: 12px 16px; }
  </style>
</head>
<body>
  <h1>Diagnostic Test Results${userId ? ` - User: ${userId}` : ''} (${results.length})</h1>
  <p style="color: #666; margin-bottom: 20px;">Click a row to see topic breakdown. ${userId ? `<a href="?">View all</a>` : 'Filter: <code>?user=HASH</code>'}</p>
  <table>
    <tr>
      <th>ID</th>
      <th>User</th>
      <th>Date</th>
      <th>Status</th>
      <th>Correct</th>
      <th>Wrong</th>
      <th>Questions</th>
      <th>Time</th>
    </tr>
    ${results.map((row, idx) => {
      const statusBadge = row.is_complete ?
        '<span style="background: #16a34a; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">COMPLETE</span>' :
        '<span style="background: #ea580c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">PARTIAL</span>';

      const topicsBreakdown = formatTopics(row.results_json);

      const userLink = row.user_id ?
        `<a href="?user=${row.user_id}" style="color: #2563eb;">${row.user_id.slice(0,8)}...</a>` : '-';

      return `
    <tr class="expandable" onclick="document.getElementById('topics-${idx}').classList.toggle('show')">
      <td class="number">${row.id}</td>
      <td>${userLink}</td>
      <td>${new Date(row.timestamp).toLocaleString()}</td>
      <td class="number">${statusBadge}</td>
      <td class="number good">${row.topics_mastered}</td>
      <td class="number needs-work">${row.topics_needs_work}</td>
      <td class="number">${row.total_questions}</td>
      <td class="number">${row.completion_time_mins ? row.completion_time_mins + 'm' : '-'}</td>
    </tr>
    <tr id="topics-${idx}" class="topics-row">
      <td colspan="8" class="topics-cell">${topicsBreakdown}</td>
    </tr>
      `;
    }).join('')}
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

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);

  try {
    const body = await request.json();
    const { answers, topics, completedPhases, userId, startTime, sessionId, isComplete } = body;

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

    // Calculate statistics
    const stats = calculateStats(completedPhases);

    // Get country from Cloudflare headers
    const country = request.cf?.country || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const completionTime = startTime ? Math.round((Date.now() - startTime) / 60000) : null;

    // Log to D1 database
    if (env.DB) {
      try {
        await env.DB.prepare(`
          INSERT INTO placement_test_results
          (user_id, session_id, phase_reached, topics_mastered, topics_needs_work, total_questions,
           completion_time_mins, is_complete, country, user_agent, results_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          userId || null,
          sessionId || null,
          stats.phasesCompleted,
          stats.totalCorrect,
          stats.totalWrong + stats.totalSkipped,
          answers.length,
          completionTime,
          isComplete ? 1 : 0,
          country,
          userAgent,
          JSON.stringify({ completedPhases, answers })
        ).run();
      } catch (dbError) {
        console.error('D1 logging error:', dbError);
        // Continue even if logging fails
      }
    }

    return new Response(JSON.stringify({
      report: report,
      stats: stats
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
 * Calculate test statistics
 */
function calculateStats(completedPhases) {
  if (!completedPhases || completedPhases.length === 0) {
    return {
      phasesCompleted: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalSkipped: 0
    };
  }

  let totalCorrect = 0;
  let totalWrong = 0;
  let totalSkipped = 0;

  completedPhases.forEach(p => {
    for (const [topic, stats] of Object.entries(p.topics || {})) {
      totalCorrect += stats.correct || 0;
      totalWrong += stats.wrong || 0;
      totalSkipped += stats.skipped || 0;
    }
  });

  return {
    phasesCompleted: completedPhases.length,
    totalCorrect,
    totalWrong,
    totalSkipped
  };
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
