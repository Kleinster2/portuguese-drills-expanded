#!/usr/bin/env node
/**
 * Batch-add dedup rule to all drill prompts that lack one.
 * Finds "CORE DIRECTIVES" section and inserts the rule after it.
 * Skips files that already have a dedup rule or aren't drill-type prompts.
 */

const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', 'config', 'prompts');

// Files to skip (already have dedup, or not drill-type)
const SKIP_IDS = new Set([
  // Already hardened manually
  'ser-estar', 'preterite-vs-imperfect', 'por-vs-para',
  'demonstratives', 'advanced-demonstratives', 'contractions-articles',
  'possessives',
  // Not drill-type (simplifiers, open-ended)
  'a1-simplifier', 'a2-simplifier', 'b1-simplifier', 'b2-simplifier',
  'capstone-synthesis', 'subjunctive-intro',
]);

const DEDUP_RULE = 'Never repeat an exercise within the same session. Track every sentence used and ensure each new question differs in vocabulary, structure, or context. Changing only the subject while keeping the same pattern counts as a repeat.';

let modified = 0;
let skipped = 0;
let alreadyHas = 0;
let noDirectives = 0;

const files = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filepath = path.join(PROMPTS_DIR, file);
  const raw = fs.readFileSync(filepath, 'utf8');

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.log(`SKIP (parse error): ${file}`);
    skipped++;
    continue;
  }

  if (!data.systemPrompt || !data.id) {
    console.log(`SKIP (no systemPrompt/id): ${file}`);
    skipped++;
    continue;
  }

  if (SKIP_IDS.has(data.id)) {
    console.log(`SKIP (in skip list): ${data.id}`);
    skipped++;
    continue;
  }

  // Check if already has a dedup rule
  if (/never repeat an exercise|don't repeat|no repeated|never repeat a question/i.test(data.systemPrompt)) {
    console.log(`SKIP (already has dedup): ${data.id}`);
    alreadyHas++;
    continue;
  }

  // Find CORE DIRECTIVES section
  const directivesMatch = data.systemPrompt.match(/CORE DIRECTIVES[^\n]*/);
  if (!directivesMatch) {
    console.log(`WARN (no CORE DIRECTIVES): ${data.id}`);
    noDirectives++;
    continue;
  }

  // Insert dedup rule right after "CORE DIRECTIVES (Do Not Break)" line
  const insertAfter = directivesMatch[0];
  const insertionPoint = data.systemPrompt.indexOf(insertAfter) + insertAfter.length;

  data.systemPrompt =
    data.systemPrompt.slice(0, insertionPoint) +
    '\\n' + DEDUP_RULE +
    data.systemPrompt.slice(insertionPoint);

  // Write back with same formatting
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n');
  console.log(`MODIFIED: ${data.id}`);
  modified++;
}

console.log(`\n--- Summary ---`);
console.log(`Modified: ${modified}`);
console.log(`Skipped (manual/non-drill): ${skipped}`);
console.log(`Already has dedup: ${alreadyHas}`);
console.log(`No CORE DIRECTIVES section: ${noDirectives}`);
console.log(`Total files: ${files.length}`);
