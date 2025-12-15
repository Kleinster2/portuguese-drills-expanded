/**
 * Audit Diagnostic Test Questions (v3.0)
 * Checks for English/Portuguese alignment issues
 *
 * Improvements in v3.0:
 * - EN/PT phrase alignment (over there → lá, right now → agora)
 * - Correct answer position distribution check
 *
 * Improvements in v2.0:
 * - Handles comprehension questions (use options, not template)
 * - Recognizes irregular verb conjugations
 * - Understands subjunctive mood
 * - Accepts colloquial Brazilian Portuguese
 * - Better false-positive prevention
 */

const fs = require('fs');
const path = require('path');

const testFile = path.join(__dirname, '../config/diagnostic-test-questions-v10.9-no-hints.json');
const data = JSON.parse(fs.readFileSync(testFile, 'utf8'));

const issues = [];
let totalChecked = 0;

console.log('🔍 Auditing Diagnostic Test Questions (v3.0)...\n');

// EN/PT phrase alignment mappings
const PHRASE_ALIGNMENTS = [
  { en: 'over there', pt: 'lá', ptAlt: ['ali', 'acolá'] },
  { en: 'right now', pt: 'agora', ptAlt: ['neste momento'] },
  { en: 'every day', pt: 'todos os dias', ptAlt: ['todo dia', 'diariamente'] },
  { en: 'right here', pt: 'aqui', ptAlt: ['bem aqui'] },
  { en: 'over here', pt: 'aqui', ptAlt: ['cá'] },
  { en: 'always', pt: 'sempre', ptAlt: [] },
  { en: 'never', pt: 'nunca', ptAlt: ['jamais'] },
  { en: 'together', pt: 'juntos', ptAlt: ['junto', 'juntas'] },
];

// Track correct answer positions for distribution check
const correctPositions = [];

// Portuguese verb patterns for validation
const PAST_TENSE_PATTERNS = [
  // Regular preterite endings
  /ei$/, /ou$/, /amos$/, /aram$/, /emos$/, /eram$/, /imos$/, /iram$/,
  // Regular imperfect endings
  /ava$/, /avam$/, /ia$/, /iam$/, /ávamos$/, /íamos$/,
  // Irregular preterite forms
  /^estive/, /^esteve/, /^estiveram/, /^estivemos/,
  /^fui$/, /^foi$/, /^foram$/, /^fomos$/,
  /^tive/, /^teve/, /^tiveram/, /^tivemos/,
  /^pude/, /^pôde/, /^puderam/, /^pudemos/,
  /^fiz/, /^fez/, /^fizeram/, /^fizemos/,
  /^disse/, /^disseram/, /^dissemos/,
  /^trouxe/, /^trouxeram/, /^trouxemos/,
  /^soube/, /^souberam/, /^soubemos/,
  /^quis/, /^quiseram/, /^quisemos/,
  /^vim$/, /^veio$/, /^vieram$/, /^viemos$/,
  /^pus$/, /^pôs$/, /^puseram$/, /^pusemos$/,
  // Imperfect forms
  /^era$/, /^eram$/, /^éramos$/,
  /^tinha/, /^tinham$/, /^tínhamos$/,
  /^morava/, /^moravam$/, /^morávamos$/,
  /^vivia/, /^viviam$/, /^vivíamos$/,
  /^comia/, /^comiam$/, /^comíamos$/,
  /^fazia/, /^faziam$/, /^fazíamos$/,
  /^vinha/, /^vinham$/, /^vínhamos$/,
  /^podia/, /^podiam$/, /^podíamos$/,
  /^sabia/, /^sabiam$/, /^sabíamos$/,
  /^queria/, /^queriam$/, /^queríamos$/,
];

const FUTURE_TENSE_PATTERNS = [
  // Synthetic future endings
  /rei$/, /rá$/, /remos$/, /rão$/, /rás$/,
  // Conditional (would) endings
  /ria$/, /riam$/, /ríamos$/,
  // Immediate future (ir + infinitive)
  /^vou$/, /^vai$/, /^vamos$/, /^vão$/,
  // Specific future forms
  /^irei$/, /^irá$/, /^iremos$/, /^irão$/,
  /^estarei$/, /^estará$/, /^estaremos$/, /^estarão$/,
  /^farei$/, /^fará$/, /^faremos$/, /^farão$/,
  /^terei$/, /^terá$/, /^teremos$/, /^terão$/,
  /^serei$/, /^será$/, /^seremos$/, /^serão$/,
];

const SUBJUNCTIVE_PATTERNS = [
  // Present subjunctive
  /^esteja/, /^seja/, /^tenha/, /^faça/, /^vá$/, /^venha/,
  /^possa/, /^queira/, /^saiba/, /^diga/, /^traga/,
  // Imperfect subjunctive
  /sse$/, /ssem$/, /ssemos$/,
  /^estivesse/, /^fosse/, /^tivesse/, /^fizesse/, /^pudesse/,
  // Future subjunctive
  /^estiver/, /^for$/, /^forem$/, /^tiver/, /^fizer/, /^puder/,
  /^chegar$/, /^quiser/, /^souber/, /^vier/, /^puser/,
];

const COLLOQUIAL_PATTERNS = [
  /^cê$/i, /^tá$/i, /^tô$/i, /^tava$/i, /^num$/i, /^pra$/i,
];

function matchesAnyPattern(word, patterns) {
  return patterns.some(pattern => pattern.test(word));
}

function isSubjunctiveContext(en) {
  const subjunctiveMarkers = [
    'hope that', 'want that', 'wish that', 'doubt that',
    'maybe', 'perhaps', 'it\'s important that', 'it\'s necessary that',
    'i hope', 'i want you to', 'i wish', 'i doubt',
    'if i were', 'if i had', 'if you', 'when you arrive', 'when we can',
    'before they', 'unless', 'so that', 'in order that'
  ];
  return subjunctiveMarkers.some(marker => en.toLowerCase().includes(marker));
}

function isColloquialQuestion(q) {
  return q.unitName?.toLowerCase().includes('colloquial') ||
         q.en?.toLowerCase().includes('colloquial') ||
         q.question?.toLowerCase().includes('colloquial');
}

data.questions.forEach((q, idx) => {
  totalChecked++;
  const qNum = idx + 1;
  const isComprehension = q.type === 'comprehension';

  // Check 1: Missing fields (adjusted for question type)
  if (!q.en) {
    issues.push(`Q${qNum} (ID: ${q.id}): Missing English translation`);
  }

  if (isComprehension) {
    // Comprehension questions use options, not template
    if (!q.options || q.options.length === 0) {
      issues.push(`Q${qNum} (ID: ${q.id}): Comprehension question missing options array`);
    }
  } else {
    // Production questions use template + chips
    if (!q.template) {
      issues.push(`Q${qNum} (ID: ${q.id}): Production question missing Portuguese template`);
    }
    if (!q.chips || q.chips.length === 0) {
      issues.push(`Q${qNum} (ID: ${q.id}): Production question missing chips array`);
    }
  }

  if (!q.correct) {
    issues.push(`Q${qNum} (ID: ${q.id}): Missing correct answer`);
  }

  // Check 2: Verify correct answer is in chips/options
  if (q.correct) {
    if (isComprehension && q.options && !q.options.includes(q.correct)) {
      issues.push(`Q${qNum} (ID: ${q.id}): Correct answer "${q.correct}" not in options array`);
    } else if (!isComprehension && q.chips && !q.chips.includes(q.correct)) {
      issues.push(`Q${qNum} (ID: ${q.id}): Correct answer "${q.correct}" not in chips array`);
    }
  }

  // Check 3: Template has blank (production only)
  if (!isComprehension && q.template && !q.template.includes('__')) {
    issues.push(`Q${qNum} (ID: ${q.id}): Template missing blank (__): "${q.template}"`);
  }

  // Skip alignment checks for comprehension questions
  if (isComprehension) return;

  // Check 4: Translation alignment (with better pattern matching)
  const en = (q.en || '').toLowerCase();
  const template = (q.template || '').toLowerCase();
  const correct = q.correct || '';

  // Skip subjunctive contexts for pronoun checks
  const isSubjunctive = isSubjunctiveContext(en) || matchesAnyPattern(correct, SUBJUNCTIVE_PATTERNS);
  const isColloquial = isColloquialQuestion(q) || matchesAnyPattern(correct.toLowerCase(), COLLOQUIAL_PATTERNS);

  // Pronoun checks (skip for subjunctive and colloquial)
  if (!isSubjunctive && !isColloquial) {
    if ((en.includes('i am') || en.includes('i\'m')) && en.startsWith('i ')) {
      // Only flag if template doesn't have eu AND correct answer isn't a valid "am" form
      const validAmForms = ['sou', 'estou', 'fico', 'tenho'];
      if (!template.includes('eu') && !validAmForms.includes(correct)) {
        issues.push(`Q${qNum} (ID: ${q.id}): "I am" in English but no "Eu" in Portuguese template`);
      }
    }

    // Remove parenthetical content before checking pronouns
    const enWithoutParens = en.replace(/\([^)]*\)/g, '').trim();
    if (enWithoutParens.startsWith('you are') || enWithoutParens.includes(' you are')) {
      if (!template.includes('você') && !template.includes('tu') && !template.includes('cê')) {
        issues.push(`Q${qNum} (ID: ${q.id}): "You are" in English but no "você/tu/cê" in Portuguese`);
      }
    }
  }

  // Tense checks with better pattern matching
  // Skip for questions testing non-verb elements
  const testingPreposition = q.unitName?.toLowerCase().includes('preposition');
  const testingArticle = q.unitName?.toLowerCase().includes('article');
  const testingRelativePronoun = q.unitName?.toLowerCase().includes('relative');
  const testingDemonstrative = q.unitName?.toLowerCase().includes('demonstrative');
  const testingObjectPronoun = q.unitName?.toLowerCase().includes('pronoun');
  const testingTudoTodo = q.unitName?.toLowerCase().includes('tudo vs todo');
  const testingPessoaGente = q.unitName?.toLowerCase().includes('pessoa vs gente');
  const testingBomBem = q.unitName?.toLowerCase().includes('bom vs bem');
  const testingMauMal = q.unitName?.toLowerCase().includes('mau vs mal');
  const testingPorque = q.unitName?.toLowerCase().includes('porque');
  const testingAcharPensar = q.unitName?.toLowerCase().includes('achar vs pensar');
  const testingVoltarDevolver = q.unitName?.toLowerCase().includes('voltar vs devolver');
  const skipTenseCheck = testingPreposition || testingArticle || testingRelativePronoun || testingDemonstrative || testingObjectPronoun || testingTudoTodo || testingPessoaGente || testingBomBem || testingMauMal || testingPorque || testingAcharPensar || testingVoltarDevolver;

  if ((en.includes('was') || en.includes('were') || en.includes('used to')) && !en.includes('if i were')) {
    if (correct && !matchesAnyPattern(correct, PAST_TENSE_PATTERNS) && !skipTenseCheck) {
      issues.push(`Q${qNum} (ID: ${q.id}): Past tense in English but correct "${correct}" may not be past tense`);
    }
  }

  if (en.includes('will ') && !en.includes('william')) {
    if (correct && !matchesAnyPattern(correct, FUTURE_TENSE_PATTERNS) && !skipTenseCheck && !isSubjunctive) {
      issues.push(`Q${qNum} (ID: ${q.id}): Future tense in English but correct "${correct}" may not be future tense`);
    }
  }

  // Check 5: Duplicate chips
  if (q.chips) {
    const uniqueChips = new Set(q.chips);
    if (uniqueChips.size !== q.chips.length) {
      const duplicates = q.chips.filter((chip, i) => q.chips.indexOf(chip) !== i);
      issues.push(`Q${qNum} (ID: ${q.id}): Duplicate chips found: ${duplicates.join(', ')}`);
    }
  }

  // Check 6: Very short chips (potential typos)
  // Allow: a, o, e, é, à (lowercase) and A, O (uppercase articles)
  if (q.chips) {
    const allowedSingleChars = ['a', 'o', 'e', 'é', 'à', 'A', 'O'];
    const suspiciousChips = q.chips.filter(c => c.length === 1 && !allowedSingleChars.includes(c));
    if (suspiciousChips.length > 0) {
      issues.push(`Q${qNum} (ID: ${q.id}): Suspicious single-character chips: ${suspiciousChips.join(', ')}`);
    }
  }

  // Check 7: EN/PT phrase alignment (skip for Tudo vs Todo questions - they test these phrases)
  if (q.en && q.template && !testingTudoTodo) {
    PHRASE_ALIGNMENTS.forEach(({ en: enPhrase, pt, ptAlt }) => {
      if (q.en.toLowerCase().includes(enPhrase)) {
        const templateLower = q.template.toLowerCase();
        const hasPt = templateLower.includes(pt) || ptAlt.some(alt => templateLower.includes(alt));
        if (!hasPt) {
          issues.push(`Q${qNum} (ID: ${q.id}): EN has "${enPhrase}" but PT missing "${pt}"`);
        }
      }
    });
  }

  // Track correct answer position for distribution check
  if (q.chips && q.correct) {
    const pos = q.chips.indexOf(q.correct);
    if (pos !== -1) {
      correctPositions.push({ id: q.id, position: pos, total: q.chips.length });
    }
  }
});

// Check 8: Correct answer position distribution
if (correctPositions.length > 0) {
  const positionCounts = {};
  correctPositions.forEach(({ position }) => {
    positionCounts[position] = (positionCounts[position] || 0) + 1;
  });

  const total = correctPositions.length;
  const firstPositionCount = positionCounts[0] || 0;
  const firstPositionPercent = (firstPositionCount / total * 100).toFixed(1);

  // Flag if >40% of answers are in position 0 (first)
  if (firstPositionPercent > 40) {
    issues.push(`DISTRIBUTION: ${firstPositionPercent}% of correct answers are in first position (should be ~16-20%)`);
  }

  // Flag if any position has >50% of answers
  Object.entries(positionCounts).forEach(([pos, count]) => {
    const percent = (count / total * 100).toFixed(1);
    if (percent > 50) {
      issues.push(`DISTRIBUTION: ${percent}% of correct answers are in position ${parseInt(pos) + 1}`);
    }
  });
}

console.log(`Total questions checked: ${totalChecked}`);
console.log(`Issues found: ${issues.length}\n`);

if (issues.length > 0) {
  console.log('⚠️  ISSUES FOUND:\n');
  issues.forEach(issue => {
    console.log(`  ${issue}`);
  });
} else {
  console.log('✅ No issues found! All questions look good.');
}

// Print summary by phase
console.log('\n📊 SUMMARY BY PHASE:');
const phases = {};
data.questions.forEach(q => {
  if (!phases[q.phase]) {
    phases[q.phase] = { total: 0, issues: 0 };
  }
  phases[q.phase].total++;
});

Object.keys(phases).sort().forEach(phase => {
  const phaseIssues = issues.filter(i => {
    const match = i.match(/ID: ([\d.]+)/);
    const qId = match ? parseFloat(match[1]) : null;
    const question = data.questions.find(q => q.id === qId);
    return question?.phase === parseInt(phase);
  }).length;

  console.log(`  Phase ${phase}: ${phases[phase].total} questions, ${phaseIssues} issues`);
});

// Print what was checked
console.log('\n📋 CHECKS PERFORMED:');
console.log('  ✓ Missing required fields (en, template/options, correct)');
console.log('  ✓ Correct answer exists in chips/options');
console.log('  ✓ Template has blank marker (__)');
console.log('  ✓ Pronoun alignment (I am → Eu, You are → Você)');
console.log('  ✓ Tense alignment (was/were → past, will → future)');
console.log('  ✓ Duplicate chips detection');
console.log('  ✓ Suspicious single-character chips');
console.log('  ✓ EN/PT phrase alignment (over there → lá, etc.)');
console.log('  ✓ Correct answer position distribution');
console.log('\n📝 SMART EXCLUSIONS:');
console.log('  • Comprehension questions: use options instead of template');
console.log('  • Subjunctive contexts: skip pronoun alignment checks');
console.log('  • Colloquial questions: accept informal forms (cê, tá, tô)');
console.log('  • Irregular verbs: recognized for tense validation');
console.log('  • Relative pronouns/demonstratives: skip tense checks');

process.exit(issues.length > 0 ? 1 : 0);
