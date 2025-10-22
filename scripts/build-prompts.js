#!/usr/bin/env node

/**
 * Build Script: Sync JSON prompts into promptManager.js
 *
 * This script reads all JSON files from config/prompts/ and embeds them
 * into utils/promptManager.js so they can be used in Cloudflare Workers.
 */

const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', 'config', 'prompts');
const PROMPT_MANAGER_PATH = path.join(__dirname, '..', 'utils', 'promptManager.js');

console.log('🔨 Building promptManager.js from JSON files...\n');

// Read all JSON files
const jsonFiles = fs.readdirSync(PROMPTS_DIR)
  .filter(file => file.endsWith('.json') && file !== '.backup')
  .sort();

console.log(`Found ${jsonFiles.length} prompt files`);

// Load all prompts
const prompts = {};
for (const file of jsonFiles) {
  const filePath = path.join(PROMPTS_DIR, file);
  const relativePath = `./config/prompts/${file}`;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    prompts[relativePath] = data;
    console.log(`  ✓ Loaded ${file} (${data.id})`);
  } catch (error) {
    console.error(`  ✗ Skipping ${file}: ${error.message}`);
    // Skip invalid files instead of exiting
  }
}

// Read the current promptManager.js
let pmCode = fs.readFileSync(PROMPT_MANAGER_PATH, 'utf8');

// Find the promptConfigs object
const configsStart = pmCode.indexOf('const promptConfigs = {');
if (configsStart === -1) {
  console.error('❌ Could not find "const promptConfigs = {" in promptManager.js');
  process.exit(1);
}

// Find the closing of the promptConfigs object
// We need to find the matching closing brace
let braceCount = 0;
let configsEnd = -1;
for (let i = configsStart; i < pmCode.length; i++) {
  if (pmCode[i] === '{') braceCount++;
  if (pmCode[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      configsEnd = i + 1;
      break;
    }
  }
}

if (configsEnd === -1) {
  console.error('❌ Could not find end of promptConfigs object');
  process.exit(1);
}

// Generate the new promptConfigs code
const indent = '        ';
const entries = Object.keys(prompts).map(filePath => {
  const data = prompts[filePath];
  const jsonStr = JSON.stringify(data, null, 2)
    .split('\n')
    .map((line, idx) => idx === 0 ? line : indent + line)
    .join('\n');

  return `${indent}'${filePath}': ${jsonStr}`;
});

const newConfigsCode = `const promptConfigs = {\n${entries.join(',\n')}\n      };`;

// Replace the old promptConfigs with the new one
const before = pmCode.substring(0, configsStart);
const after = pmCode.substring(configsEnd);
const newPmCode = before + newConfigsCode + after;

// Write the updated promptManager.js
fs.writeFileSync(PROMPT_MANAGER_PATH, newPmCode);

console.log(`\n✅ Successfully updated promptManager.js with ${jsonFiles.length} prompts`);
console.log(`📦 File size: ${(newPmCode.length / 1024).toFixed(1)} KB`);
