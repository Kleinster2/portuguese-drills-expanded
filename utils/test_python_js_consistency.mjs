#!/usr/bin/env node
/**
 * Python-JavaScript Consistency Test Runner
 *
 * Runs a set of common test sentences through both the Python and JavaScript
 * pronunciation annotators and compares their outputs.
 * Exits with 0 if all outputs are consistent, 1 if any discrepancy is found.
 *
 * Usage: node utils/test_python_js_consistency.mjs
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import the JavaScript annotator function
import { annotatePronunciation as annotatePronunciationJs } from '../js/pronunciation-annotator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const PYTHON_ANNOTATOR_PATH = join(projectRoot, 'utils', 'annotate_pronunciation.py');

const testSentences = [
    "Eu sou o John.",
    "Eu sou de Miami.",
    "Eu falo português.",
    "Eu gosto de futebol.",
    "Eu tenho um amigo.",
    "Eu sou americano.",
    "Onde você trabalha?",
    "Eu estudo em casa.",
    "Que horas são?",
    "Eu moro em Brooklyn.",
    "Você é da internet?",
    "Meu pai é de Portugal.",
    "Minha mãe é do Brasil.",
    "Eu tenho dois cachorros.",
    "Eu tenho uma gata.",
    "Eu sou um homem.",
    "Eu sou uma mulher.",
    "Eu sou Daniel.",
    "Eu sou Sofia.",
    "O que você faz?",
    "Ele tem um iPad.",
    "Ela usa o Whatsapp.",
    "Eu bebo café.",
    "A casa é verde.",
    "Eu gosto de ler um livro.",
    "Eu sou feliz."
];

async function runConsistencyTests() {
    console.log('=' .repeat(80));
    console.log('PYTHON-JAVASCRIPT ANNOTATION CONSISTENCY TEST');
    console.log('=' .repeat(80));
    console.log();

    let allConsistent = true;
    let testCount = 0;

    for (const sentence of testSentences) {
        testCount++;
        console.log(`Test ${testCount}: "${sentence}"`);

        // Run Python annotator
        let pythonOutput;
        try {
            pythonOutput = execSync(`python "${PYTHON_ANNOTATOR_PATH}" "${sentence}"`, { encoding: 'utf8' }).trim();
        } catch (error) {
            console.error(`  Python annotator failed for sentence: "${sentence}"`);
            console.error(error.message);
            allConsistent = false;
            continue;
        }

        // Run JavaScript annotator
        const jsOutput = annotatePronunciationJs(sentence);

        // Compare outputs
        if (pythonOutput === jsOutput) {
            console.log('  Status: CONSISTENT');
        } else {
            console.log('  Status: INCONSISTENT');
            console.log(`    Python: "${pythonOutput}"`);
            console.log(`    JavaScript: "${jsOutput}"`);
            allConsistent = false;
        }
        console.log();
    }

    console.log('=' .repeat(80));
    if (allConsistent) {
        console.log('✓ ALL PYTHON AND JAVASCRIPT ANNOTATIONS ARE CONSISTENT');
    } else {
        console.log('⚠️  INCONSISTENCIES DETECTED BETWEEN PYTHON AND JAVASCRIPT ANNOTATORS');
    }
    console.log('=' .repeat(80));

    process.exit(allConsistent ? 0 : 1);
}

runConsistencyTests().catch(error => {
    console.error('Error running consistency tests:', error);
    process.exit(1);
});
