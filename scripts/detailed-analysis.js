const fs = require('fs');

// Read the diagnostic test questions
const questionsFile = './config/diagnostic-test-questions-v10.9-no-hints.json';
const data = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
const questions = data.questions;

const phaseMap = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2' };

console.log('========================================');
console.log('DETAILED PEDAGOGICAL ISSUE ANALYSIS');
console.log('========================================\n');

// Sample 30 questions across all phases (more comprehensive)
const sampleSize = 30;
const sampledQuestions = [];

// Get even distribution across phases
[1, 2, 3, 4].forEach(phaseNum => {
    const phaseQuestions = questions.filter(q => q.phase === phaseNum);
    const step = Math.max(1, Math.floor(phaseQuestions.length / (sampleSize / 4)));

    for (let i = 0; i < sampleSize / 4 && i < phaseQuestions.length; i++) {
        const idx = Math.min(i * step, phaseQuestions.length - 1);
        sampledQuestions.push(phaseQuestions[idx]);
    }
});

console.log(`Analyzing ${sampledQuestions.length} sampled questions...\n`);

// Deep pedagogical analysis
const pedagogicalIssues = {
    scenarioHintsAnswer: [],
    scenarioTooVague: [],
    demonstrativesNoDistance: [],
    serEstarNoContext: [],
    tenseNoTimeMarker: [],
    distractorsSimilarToCorrect: [],
    distractorsNotPlausible: [],
    englishPortugueseMismatch: []
};

sampledQuestions.forEach(q => {
    const qData = {
        id: q.id,
        phase: phaseMap[q.phase],
        unit: q.unit,
        unitName: q.unitName,
        en: q.en,
        template: q.template,
        scenario: q.scenario,
        correct: q.correct,
        chips: q.chips
    };

    // 1. Check if scenario hints at answer
    if (q.scenario) {
        const scenarioLower = q.scenario.toLowerCase();
        const correctLower = q.correct.toLowerCase();

        // Check for direct inclusion
        if (scenarioLower.includes(correctLower) && correctLower.length > 3) {
            pedagogicalIssues.scenarioHintsAnswer.push({
                ...qData,
                issue: `Scenario contains "${q.correct}"`
            });
        }

        // Check for excessive context that makes answer obvious
        const obviousWords = ['identity', 'temporary', 'permanent', 'location', 'characteristic'];
        if (q.unitName.includes('Ser') || q.unitName.includes('Estar')) {
            let hasContextClue = false;
            obviousWords.forEach(word => {
                if (scenarioLower.includes(word)) {
                    hasContextClue = true;
                }
            });

            if (hasContextClue) {
                pedagogicalIssues.scenarioTooVague.push({
                    ...qData,
                    issue: 'Scenario may telegraph ser/estar choice too obviously'
                });
            }
        }
    }

    // 2. Demonstratives - check for distance markers
    if (q.unitName && q.unitName.toLowerCase().includes('demonstrative')) {
        if (q.scenario) {
            const hasDistanceMarker = /\b(here|there|over there|aqui|aí|ali|perto|longe|close|far|próximo|distante|pointing at|pointing to|nearby|across)\b/i.test(q.scenario);

            if (!hasDistanceMarker) {
                pedagogicalIssues.demonstrativesNoDistance.push({
                    ...qData,
                    issue: 'Demonstrative question lacks clear spatial context'
                });
            }
        }
    }

    // 3. Ser/Estar - check for proper contextual setup
    if ((q.unitName.includes('Ser') || q.unitName.includes('Estar')) &&
        !(q.unitName.includes('Identity') || q.unitName.includes('Location'))) {

        if (q.scenario) {
            const hasProperContext = /\b(today|now|always|generally|currently|temporarily|permanently|feeling|usually|right now|at the moment)\b/i.test(q.scenario);

            if (!hasProperContext && !q.scenario.match(/\b(is located|feeling|emotion|characteristic|trait|occupation|nationality)\b/i)) {
                pedagogicalIssues.serEstarNoContext.push({
                    ...qData,
                    issue: 'Ser/Estar choice may be ambiguous without clearer temporal/contextual markers'
                });
            }
        }
    }

    // 4. Tense questions - check for time markers
    if (q.unitName.match(/preterite|imperfect|future|conditional|tense/i)) {
        if (q.scenario) {
            const hasTimeMarker = /\b(yesterday|tomorrow|last|next|ago|will|would|used to|usually|always|often|once|when|while|during|every|cada|sempre|ontem|amanhã|passado|futuro)\b/i.test(q.scenario);

            if (!hasTimeMarker) {
                pedagogicalIssues.tenseNoTimeMarker.push({
                    ...qData,
                    issue: 'Tense-based question lacks clear temporal context'
                });
            }
        }
    }

    // 5. Distractor analysis
    if (q.chips && q.correct) {
        const distractors = q.chips.filter(c => c.toLowerCase() !== q.correct.toLowerCase());

        // Check if distractors are too similar to correct answer
        distractors.forEach(d => {
            const correctLower = q.correct.toLowerCase();
            const dLower = d.toLowerCase();

            // If only 1-2 character difference
            if (correctLower.length > 2 && dLower.length > 2) {
                let diffCount = 0;
                const maxLen = Math.max(correctLower.length, dLower.length);

                for (let i = 0; i < maxLen; i++) {
                    if (correctLower[i] !== dLower[i]) diffCount++;
                }

                if (diffCount <= 2 && diffCount > 0) {
                    pedagogicalIssues.distractorsSimilarToCorrect.push({
                        ...qData,
                        issue: `Distractor "${d}" very similar to correct "${q.correct}" (may be pedagogically valid)`
                    });
                }
            }
        });

        // Check for completely implausible distractors
        // (This is harder to detect programmatically, so we'll flag potential issues)
        const allChipsAreDifferentTenses = distractors.every(d => {
            // Check if all distractors are from wildly different verb forms
            return d.length > 0; // Placeholder - deep grammar analysis needed
        });
    }

    // 6. English-Portuguese alignment
    if (q.en && q.template) {
        const enLower = q.en.toLowerCase();
        const templateLower = q.template.toLowerCase();

        // Check for key word mismatches
        const enHasPlural = /\b(we|they|are|were)\b/i.test(enLower) || enLower.includes('(pl)');
        const templateHasPlural = /\b(mos|ram|am|ão)\b/i.test(templateLower);

        const enHasPast = /\b(was|were|did|had|went|ate|said)\b/i.test(enLower) || enLower.includes('(past)');
        const templateHasPast = /\b(ou|ava|ia|ei|iu)\b/i.test(templateLower);

        // Flag if there's a mismatch
        if (enHasPlural && !templateHasPlural && !templateLower.includes('__')) {
            pedagogicalIssues.englishPortugueseMismatch.push({
                ...qData,
                issue: 'English suggests plural but Portuguese template may not match'
            });
        }
    }
});

// Print results
console.log('\n1. SCENARIO HINTS AT ANSWER:');
console.log('----------------------------');
if (pedagogicalIssues.scenarioHintsAnswer.length > 0) {
    pedagogicalIssues.scenarioHintsAnswer.forEach(item => {
        console.log(`\n  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  EN: ${item.en}`);
        console.log(`  Scenario: ${item.scenario}`);
        console.log(`  Correct: ${item.correct}`);
        console.log(`  Issue: ${item.issue}`);
    });
} else {
    console.log('  ✓ No issues found');
}

console.log('\n\n2. DEMONSTRATIVE QUESTIONS - DISTANCE CONTEXT:');
console.log('-----------------------------------------------');
if (pedagogicalIssues.demonstrativesNoDistance.length > 0) {
    pedagogicalIssues.demonstrativesNoDistance.forEach(item => {
        console.log(`\n  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  EN: ${item.en}`);
        console.log(`  Scenario: ${item.scenario || '(no scenario)'}`);
        console.log(`  Issue: ${item.issue}`);
    });
} else {
    console.log('  ✓ No demonstrative questions in sample or all have proper distance context');
}

console.log('\n\n3. SER/ESTAR QUESTIONS - CONTEXTUAL CLARITY:');
console.log('---------------------------------------------');
if (pedagogicalIssues.serEstarNoContext.length > 0) {
    pedagogicalIssues.serEstarNoContext.forEach(item => {
        console.log(`\n  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  EN: ${item.en}`);
        console.log(`  Template: ${item.template}`);
        console.log(`  Scenario: ${item.scenario || '(no scenario)'}`);
        console.log(`  Issue: ${item.issue}`);
    });
} else {
    console.log('  ✓ No issues found');
}

console.log('\n\n4. TENSE QUESTIONS - TEMPORAL MARKERS:');
console.log('---------------------------------------');
if (pedagogicalIssues.tenseNoTimeMarker.length > 0) {
    pedagogicalIssues.tenseNoTimeMarker.forEach(item => {
        console.log(`\n  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  EN: ${item.en}`);
        console.log(`  Template: ${item.template}`);
        console.log(`  Scenario: ${item.scenario || '(no scenario)'}`);
        console.log(`  Issue: ${item.issue}`);
    });
} else {
    console.log('  ✓ No issues found');
}

console.log('\n\n5. DISTRACTOR QUALITY:');
console.log('----------------------');
if (pedagogicalIssues.distractorsSimilarToCorrect.length > 0) {
    console.log('  Note: Similar distractors can be pedagogically valid (testing fine distinctions)');
    console.log('  Flagged for review:\n');
    pedagogicalIssues.distractorsSimilarToCorrect.slice(0, 5).forEach(item => {
        console.log(`  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  ${item.issue}\n`);
    });
    if (pedagogicalIssues.distractorsSimilarToCorrect.length > 5) {
        console.log(`  ... and ${pedagogicalIssues.distractorsSimilarToCorrect.length - 5} more similar distractor pairs`);
    }
} else {
    console.log('  ✓ No extremely similar distractors found');
}

console.log('\n\n6. ENGLISH-PORTUGUESE ALIGNMENT:');
console.log('---------------------------------');
if (pedagogicalIssues.englishPortugueseMismatch.length > 0) {
    pedagogicalIssues.englishPortugueseMismatch.forEach(item => {
        console.log(`\n  Q${item.id} [${item.phase}] ${item.unitName}`);
        console.log(`  EN: ${item.en}`);
        console.log(`  Template: ${item.template}`);
        console.log(`  Issue: ${item.issue}`);
    });
} else {
    console.log('  ✓ No obvious mismatches found');
}

// Summary
console.log('\n\n========================================');
console.log('PEDAGOGICAL ISSUES SUMMARY');
console.log('========================================\n');
console.log(`Questions Analyzed: ${sampledQuestions.length}`);
console.log(`\nIssues Found:`);
console.log(`  - Scenario hints at answer: ${pedagogicalIssues.scenarioHintsAnswer.length}`);
console.log(`  - Demonstratives lacking distance context: ${pedagogicalIssues.demonstrativesNoDistance.length}`);
console.log(`  - Ser/Estar lacking clear context: ${pedagogicalIssues.serEstarNoContext.length}`);
console.log(`  - Tense questions lacking time markers: ${pedagogicalIssues.tenseNoTimeMarker.length}`);
console.log(`  - Distractors very similar to correct: ${pedagogicalIssues.distractorsSimilarToCorrect.length}`);
console.log(`  - EN-PT alignment concerns: ${pedagogicalIssues.englishPortugueseMismatch.length}`);

const totalIssues =
    pedagogicalIssues.scenarioHintsAnswer.length +
    pedagogicalIssues.demonstrativesNoDistance.length +
    pedagogicalIssues.serEstarNoContext.length +
    pedagogicalIssues.tenseNoTimeMarker.length +
    pedagogicalIssues.englishPortugueseMismatch.length;

console.log(`\nTotal Pedagogical Concerns: ${totalIssues}`);
console.log(`Issue Rate: ${((totalIssues / sampledQuestions.length) * 100).toFixed(1)}%`);

console.log('\n========================================\n');
