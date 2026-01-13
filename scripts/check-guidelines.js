const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./config/dr-portuguese-questions.json', 'utf8'));

console.log('=== CHECKING FOR GUIDELINE VIOLATIONS ===\n');

// 1. Check correct answer positions
console.log('1. CORRECT ANSWER POSITION CHECK:');
const positions = {};
data.questions.forEach(q => {
  const pos = q.chips.indexOf(q.correct);
  positions[pos] = (positions[pos] || 0) + 1;
});
Object.entries(positions).sort((a,b) => a[0] - b[0]).forEach(([pos, count]) => {
  const pct = (count / data.questions.length * 100).toFixed(0);
  const flag = pct > 40 ? ' ⚠️ TOO HIGH' : '';
  console.log(`  Position ${pos}: ${count} (${pct}%)${flag}`);
});

// 2. Check for scenarios that hint at grammar
console.log('\n2. SCENARIO HINT CHECK (words that reveal grammar rule):');
const hintWords = ['permanent', 'temporary', 'location', 'origin', 'characteristic', 'emotion', 'progressive', 'trait'];
let hintCount = 0;
data.questions.forEach(q => {
  const scenario = (q.scenario || '').toLowerCase();
  hintWords.forEach(word => {
    if (scenario.includes(word)) {
      console.log(`  Q${q.id}: Scenario contains "${word}"`);
      hintCount++;
    }
  });
});
if (hintCount === 0) console.log('  None found');

// 3. Saber/Conhecer past tense distractors in present tense questions
console.log('\n3. PAST TENSE DISTRACTORS IN PRESENT TENSE QUESTIONS:');
let pastCount = 0;
data.questions.forEach(q => {
  if (q.unitName && q.unitName.includes('Saber vs Conhecer')) {
    const en = (q.en || '').toLowerCase();
    const isPast = en.includes('knew') || en.includes('did');
    if (!isPast) {
      const pastForms = q.chips.filter(c => ['conhecia', 'sabia', 'conheceu', 'soube'].includes(c));
      if (pastForms.length > 0) {
        console.log(`  Q${q.id} "${q.en}": has past distractors ${pastForms.join(', ')}`);
        pastCount++;
      }
    }
  }
});
if (pastCount === 0) console.log('  None found');

// 4. EN/PT alignment
console.log('\n4. EN/PT ALIGNMENT CHECK:');
let alignCount = 0;
data.questions.forEach(q => {
  if (q.en && q.en.toLowerCase().includes('every day')) {
    if (q.template && !q.template.toLowerCase().includes('todo')) {
      console.log(`  Q${q.id}: EN has "every day", PT missing "todo dia"`);
      alignCount++;
    }
  }
});
if (alignCount === 0) console.log('  None found');

console.log('\n=== CHECK COMPLETE ===');
