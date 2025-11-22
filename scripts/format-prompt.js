/**
 * Utility script to make prompt JSON files more human-readable
 * 
 * This script helps you view and edit the systemPrompt in a readable format.
 * 
 * Usage:
 *   node scripts/format-prompt.js view <prompt-file>     - Extract and display systemPrompt in readable format
 *   node scripts/format-prompt.js edit <prompt-file>     - Opens systemPrompt in a temp file for editing
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function viewPrompt(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);

    console.log('='.repeat(80));
    console.log(`Prompt ID: ${json.id}`);
    console.log(`Name: ${json.name}`);
    console.log('='.repeat(80));
    console.log('\nSYSTEM PROMPT:\n');
    console.log(json.systemPrompt);
    console.log('\n' + '='.repeat(80));
}

function extractPrompt(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);

    const tempFile = path.join(__dirname, 'temp-prompt.txt');
    fs.writeFileSync(tempFile, json.systemPrompt, 'utf-8');

    console.log(`\nSystemPrompt extracted to: ${tempFile}`);
    console.log('Edit this file, then run the update command to save changes back.\n');

    return tempFile;
}

function updatePrompt(promptFile, textFile) {
    const content = fs.readFileSync(promptFile, 'utf-8');
    const json = JSON.parse(content);

    const newPrompt = fs.readFileSync(textFile, 'utf-8');
    json.systemPrompt = newPrompt;

    fs.writeFileSync(promptFile, JSON.stringify(json, null, 2), 'utf-8');
    console.log(`Updated ${promptFile} with new prompt content.`);
}

const command = process.argv[2];
const file = process.argv[3];

if (!command || !file) {
    console.log('Usage:');
    console.log('  node format-prompt.js view <prompt-json-file>');
    console.log('  node format-prompt.js extract <prompt-json-file>');
    console.log('  node format-prompt.js update <prompt-json-file> <text-file>');
    process.exit(1);
}

const fullPath = path.resolve(file);

switch (command) {
    case 'view':
        viewPrompt(fullPath);
        break;
    case 'extract':
        extractPrompt(fullPath);
        break;
    case 'update':
        const textFile = process.argv[4];
        if (!textFile) {
            console.error('Please provide the text file path');
            process.exit(1);
        }
        updatePrompt(fullPath, path.resolve(textFile));
        break;
    default:
        console.error('Unknown command:', command);
        process.exit(1);
}
