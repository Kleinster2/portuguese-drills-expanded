#!/usr/bin/env node
/**
 * JavaScript Consistency Test Runner - v2.0
 *
 * Runs test-consistency.html in a headless browser using Playwright.
 * Exits with 0 if all tests pass, 1 if any test fails.
 *
 * Usage: node utils/test-js.mjs
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function runTests() {
    console.log('=' .repeat(80));
    console.log('JAVASCRIPT ANNOTATION & SUBSTITUTION CONSISTENCY TEST');
    console.log('=' .repeat(80));
    console.log();

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Load the test file
    const testFilePath = `file://${join(projectRoot, 'test-consistency.html').replace(/\\/g, '/')}`;
    await page.goto(testFilePath);

    // Wait for tests to complete
    await page.waitForSelector('.test', { timeout: 10000 });
    await page.waitForTimeout(1000); // Give tests time to complete

    // Extract test results
    const results = await page.evaluate(() => {
        const testDivs = Array.from(document.querySelectorAll('.test'));
        const summary = testDivs[testDivs.length - 1];
        const isPassed = summary.classList.contains('passed');

        // Get individual test results
        const tests = testDivs.slice(0, -1).map((div, i) => {
            const passed = div.classList.contains('passed');
            const text = div.textContent;
            return { index: i + 1, passed, text };
        });

        return { allPassed: isPassed, tests };
    });

    // Print results
    results.tests.forEach(test => {
        const lines = test.text.split('\n').filter(l => l.trim());
        console.log(`Test ${test.index}:`);
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                console.log(`  ${trimmed}`);
            }
        });
        console.log();
    });

    console.log('=' .repeat(80));
    if (results.allPassed) {
        console.log('✓ ALL TESTS PASSED - JavaScript implementation is consistent');
    } else {
        console.log('⚠️  SOME TESTS FAILED - Issues detected in JavaScript implementation');
    }
    console.log('=' .repeat(80));

    await browser.close();

    // Exit with appropriate code
    process.exit(results.allPassed ? 0 : 1);
}

runTests().catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
});
