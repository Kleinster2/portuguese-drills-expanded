const fs = require('fs');

// Read the diagnostic test questions
const questionsFile = './config/diagnostic-test-questions-v10.9-no-hints.json';
const data = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
const questions = data.questions;

// Extract syllabus data from syllabus.html (embedded in the file)
const syllabusData = {
    A1: [
        { unit: 1, title: "Ser - Identity Statements (Eu sou)" },
        { unit: 2, title: "Prepositions de/do/da (Eu sou do Brasil)" },
        { unit: 3, title: "Definite Articles (o, a, os, as)" },
        { unit: 4, title: "Indefinite Articles (um, uma, uns, umas)" },
        { unit: 5, title: "Estar - Location & States" },
        { unit: 6, title: "Adjective Agreement (bonito/bonita)" },
        { unit: 7, title: "Muito Agreement (muito/muita/muitos)" },
        { unit: 8, title: "Regular -AR Verbs: Morar, Falar" },
        { unit: 9, title: "Prepositions em/no/na (no Brasil, na casa)" },
        { unit: 10, title: "Regular -AR Verbs: Trabalhar, Estudar" },
        { unit: 11, title: "Numbers 0-100 & Age (Tenho X anos)" },
        { unit: 12, title: "Ser vs Estar - When to Use Each" },
        { unit: 13, title: "Location Prepositions (perto de, longe de)" },
        { unit: 14, title: "Family Vocabulary (mãe, pai, irmão)" },
        { unit: 15, title: "Food & Drinks Vocabulary" },
        { unit: 16, title: "Ter - Possession (Eu tenho)" },
        { unit: 17, title: "Colors (cores)" },
        { unit: 18, title: "Days of the Week" },
        { unit: 19, title: "Gostar de - Expressing Likes" },
        { unit: 20, title: "Body Parts (partes do corpo)" },
        { unit: 21, title: "Ficar - Location & Staying" },
        { unit: 22, title: "Regular -ER Verbs (Comer, Beber)" },
        { unit: 23, title: "3rd Person Singular (Ele/Ela fala)" },
        { unit: 24, title: "1st Person Plural (Nós falamos)" },
        { unit: 25, title: "Precisar de - Expressing Needs" }
    ],
    A2: [
        { unit: 26, title: "Regular -IR Verbs (Abrir, Partir)" },
        { unit: 27, title: "Near Future (Ir + Infinitive)" },
        { unit: 28, title: "3rd Person Plural (Eles/Elas falam)" },
        { unit: 29, title: "Weather Expressions (Está chovendo)" },
        { unit: 30, title: "Question Words (Onde, O que, Quando)" },
        { unit: 31, title: "Haver - Existence (Há, Havia)" },
        { unit: 32, title: "Possessives: Meu/Minha, Seu/Sua" },
        { unit: 33, title: "Possessives: Nosso/Nossa, Dele/Dela" },
        { unit: 34, title: "Negative Words (não, nunca, nada, ninguém)" },
        { unit: 35, title: "Preterite Regular -AR (falei, falou)" },
        { unit: 36, title: "Preterite Regular -ER/-IR (comi, parti)" },
        { unit: 37, title: "Preterite Irregular: Ser/Ir (fui, foi)" },
        { unit: 38, title: "Preterite Irregular: Ter/Estar" },
        { unit: 39, title: "Preterite Irregular: Fazer/Dizer/Trazer" },
        { unit: 40, title: "Preterite Irregular: Ver/Vir/Dar" },
        { unit: 41, title: "Preterite Irregular: Poder/Pôr/Saber/Querer" },
        { unit: 42, title: "Preposition Contractions (ao, à, pelo, pela)" },
        { unit: 43, title: "Para vs Por - Basic Uses" },
        { unit: 44, title: "Reflexive Pronouns (me, se, nos)" },
        { unit: 45, title: "Direct Object Pronouns (o, a, os, as)" },
        { unit: 46, title: "Imperfect Tense - Regular (falava, comia)" },
        { unit: 47, title: "Imperfect Tense - Irregular (era, tinha, vinha)" },
        { unit: 48, title: "Preterite vs Imperfect - When to Use" },
        { unit: 49, title: "Comparatives (mais...que, menos...que)" },
        { unit: 50, title: "Superlatives (o mais..., o menos...)" },
        { unit: 51, title: "Irregular Comparatives (melhor, pior, maior)" },
        { unit: 52, title: "Absolute Superlatives (-íssimo)" },
        { unit: 53, title: "Diminutives (-inho, -zinho)" },
        { unit: 54, title: "Augmentatives (-ão, -ona)" },
        { unit: 55, title: "Months, Dates & Telling Time" }
    ],
    B1: [
        { unit: 56, title: "Demonstratives (este, esse, aquele)" },
        { unit: 57, title: "Indefinite Pronouns (alguém, algo, nenhum)" },
        { unit: 58, title: "Indefinite Pronouns (qualquer, cada, outro)" },
        { unit: 59, title: "Indirect Object Pronouns (me, lhe, nos)" },
        { unit: 60, title: "Próclise with Negatives (não me)" },
        { unit: 61, title: "Próclise with Adverbs (sempre me)" },
        { unit: 62, title: "Pronouns after Infinitives (para me ver)" },
        { unit: 63, title: "Verb + Preposition: Pensar em, Sonhar com" },
        { unit: 64, title: "Verb + Preposition: Depender de, Gostar de" },
        { unit: 65, title: "Relative Pronoun: Que (basic)" },
        { unit: 66, title: "Relative Pronoun: Onde (where)" },
        { unit: 67, title: "Relative Pronoun: Quem (who)" },
        { unit: 68, title: "Relative Pronoun: Cujo (whose)" },
        { unit: 69, title: "Relative Pronoun: O que (what/that which)" },
        { unit: 70, title: "Preposition + Que (em que, com que)" },
        { unit: 71, title: "Relative Pronoun: O qual (formal)" },
        { unit: 72, title: "Compound Past: Ter + Participle (tenho feito)" },
        { unit: 73, title: "Pluperfect: Tinha + Participle (tinha feito)" },
        { unit: 74, title: "Reported Speech (Ele disse que...)" },
        { unit: 75, title: "Passive Voice with Ser (foi feito)" },
        { unit: 76, title: "Passive Progressive (está sendo feito)" },
        { unit: 77, title: "SE Passive (Fala-se português)" },
        { unit: 78, title: "SE Passive - Impersonal (Vende-se)" },
        { unit: 79, title: "Imperative - Affirmative (Fala! Fale!)" },
        { unit: 80, title: "Imperative - Negative (Não fale!)" }
    ],
    B2: [
        { unit: 81, title: "Simple Future (Farei, Fará)" },
        { unit: 82, title: "Conditional Tense (Faria, Gostaria)" },
        { unit: 83, title: "Past Future (Disse que faria)" },
        { unit: 84, title: "Acabar de + Infinitive (just did)" },
        { unit: 85, title: "Voltar a + Infinitive (do again)" },
        { unit: 86, title: "Aspectual Verbs (começar a, parar de)" },
        { unit: 87, title: "Time Expressions (há, faz, desde)" },
        { unit: 88, title: "Todo vs Tudo" },
        { unit: 89, title: "Present Subjunctive - Regular" },
        { unit: 90, title: "Present Subjunctive - Irregular" },
        { unit: 91, title: "Subjunctive Triggers: Querer que, Espero que" },
        { unit: 92, title: "Subjunctive Triggers: Talvez, Embora, Caso" },
        { unit: 93, title: "Imperfect Subjunctive (Se eu fosse)" },
        { unit: 94, title: "Future Subjunctive (Quando eu for)" },
        { unit: 95, title: "Personal Infinitive - Introduction" },
        { unit: 96, title: "Personal Infinitive - Uses (para eu fazer)" },
        { unit: 97, title: "Progressive Periphrases (estar/andar/vir)" },
        { unit: 98, title: "Ficar + Gerúndio (kept doing)" },
        { unit: 99, title: "Colloquial Contractions (pra, tá, né)" },
        { unit: 100, title: "Comprehensive Review & Synthesis" }
    ]
};

// Flatten syllabus into single array
const allUnits = [];
Object.keys(syllabusData).forEach(phase => {
    syllabusData[phase].forEach(unit => {
        allUnits.push({ ...unit, phase });
    });
});

console.log('========================================');
console.log('DIAGNOSTIC TEST PEDAGOGICAL ANALYSIS');
console.log('========================================\n');

// 1. COVERAGE GAP ANALYSIS
console.log('1. COVERAGE GAP ANALYSIS');
console.log('------------------------\n');

const unitCounts = {};
allUnits.forEach(unit => {
    unitCounts[unit.unit] = 0;
});

questions.forEach(q => {
    if (q.unit && unitCounts.hasOwnProperty(q.unit)) {
        unitCounts[q.unit]++;
    }
});

const unitsWithNoQuestions = [];
const unitsWithOneQuestion = [];
const unitsWithFivePlus = [];

allUnits.forEach(unit => {
    const count = unitCounts[unit.unit];
    if (count === 0) {
        unitsWithNoQuestions.push(unit);
    } else if (count === 1) {
        unitsWithOneQuestion.push(unit);
    } else if (count >= 5) {
        unitsWithFivePlus.push({ ...unit, count });
    }
});

console.log(`Total Syllabus Units: ${allUnits.length}`);
console.log(`Units with 0 questions (CRITICAL GAPS): ${unitsWithNoQuestions.length}`);
console.log(`Units with 1 question (Under-represented): ${unitsWithOneQuestion.length}`);
console.log(`Units with 5+ questions (Over-represented): ${unitsWithFivePlus.length}\n`);

if (unitsWithNoQuestions.length > 0) {
    console.log('Units with 0 questions:');
    unitsWithNoQuestions.forEach(unit => {
        console.log(`  [${unit.phase}] Unit ${unit.unit}: ${unit.title}`);
    });
    console.log();
}

// 2. PHASE BALANCE
console.log('\n2. PHASE BALANCE');
console.log('----------------\n');

const phaseCount = { A1: 0, A2: 0, B1: 0, B2: 0 };
const phaseMap = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2' };
questions.forEach(q => {
    const phaseName = phaseMap[q.phase];
    if (phaseName && phaseCount.hasOwnProperty(phaseName)) {
        phaseCount[phaseName]++;
    }
});

const totalQuestions = questions.length;
console.log(`Total Questions: ${totalQuestions}\n`);
Object.keys(phaseCount).forEach(phase => {
    const count = phaseCount[phase];
    const percentage = ((count / totalQuestions) * 100).toFixed(1);
    const syllabusUnits = syllabusData[phase].length;
    const qPerUnit = (count / syllabusUnits).toFixed(1);
    console.log(`${phase}: ${count} questions (${percentage}%) - ${syllabusUnits} units - ${qPerUnit} q/unit avg`);
});

// 3. UNIT DISTRIBUTION
console.log('\n\n3. UNIT DISTRIBUTION');
console.log('--------------------\n');

console.log('Under-represented units (1 question):');
if (unitsWithOneQuestion.length > 0) {
    unitsWithOneQuestion.forEach(unit => {
        console.log(`  [${unit.phase}] Unit ${unit.unit}: ${unit.title}`);
    });
} else {
    console.log('  None');
}

console.log('\nOver-represented units (5+ questions):');
if (unitsWithFivePlus.length > 0) {
    unitsWithFivePlus.forEach(unit => {
        console.log(`  [${unit.phase}] Unit ${unit.unit}: ${unit.title} - ${unit.count} questions`);
    });
} else {
    console.log('  None');
}

// 4. PEDAGOGICAL ISSUES - Sample 20 questions
console.log('\n\n4. PEDAGOGICAL ISSUES (Sample of 20 Questions)');
console.log('-----------------------------------------------\n');

// Sample 5 questions from each phase
const sampleQuestions = [];
Object.keys(phaseCount).forEach(phase => {
    const phaseNum = Object.keys(phaseMap).find(k => phaseMap[k] === phase);
    const phaseQuestions = questions.filter(q => q.phase === parseInt(phaseNum));
    const step = Math.floor(phaseQuestions.length / 5);
    for (let i = 0; i < 5 && i * step < phaseQuestions.length; i++) {
        sampleQuestions.push(phaseQuestions[i * step]);
    }
});

const issues = [];

sampleQuestions.forEach((q, idx) => {
    const qIssues = [];

    // Check scenario quality
    if (q.scenario) {
        const scenario = q.scenario.toLowerCase();
        const correct = q.correct.toLowerCase();
        const english = (q.en || '').toLowerCase();

        // Check if scenario hints at answer
        if (scenario.includes(correct) && correct.length > 3) {
            qIssues.push('Scenario contains correct answer');
        }

        // Check for demonstratives - should have clear distance markers
        if (q.unitName && (q.unitName.includes('Demonstrative') || q.unitName.includes('demonstrative'))) {
            const hasDistanceMarker = /\b(here|there|over there|aqui|aí|ali|perto|longe|close|far)\b/i.test(scenario);
            if (!hasDistanceMarker) {
                qIssues.push('Demonstrative question lacks clear distance context');
            }
        }

        // Check for ser/estar questions - should have clear context
        if (q.unitName && (q.unitName.includes('Ser') || q.unitName.includes('Estar'))) {
            const hasContext = /\b(identity|temporary|permanent|location|feeling|characteristic|estado|característica)\b/i.test(scenario + english);
            if (!hasContext) {
                qIssues.push('Ser/Estar question may lack clear context for choice');
            }
        }
    } else {
        // Check if scenario is needed but missing
        if (q.unitName && (
            q.unitName.includes('Demonstrative') ||
            q.unitName.includes('Ser') ||
            q.unitName.includes('Estar') ||
            q.unitName.includes('Tense')
        )) {
            qIssues.push('Missing scenario where context is needed');
        }
    }

    // Check distractor quality (basic check for duplicates or exact matches)
    if (q.chips) {
        const chips = q.chips.map(c => c.toLowerCase().trim());
        const uniqueChips = new Set(chips);
        if (chips.length !== uniqueChips.size) {
            qIssues.push('Duplicate chips found');
        }
    }

    // Check English-Portuguese alignment
    if (q.en && q.template) {
        // Basic check: if English is very short but Portuguese is long or vice versa
        const enWords = q.en.split(/\s+/).length;
        const ptWords = q.template.split(/\s+/).length;
        if (Math.abs(enWords - ptWords) > 10) {
            qIssues.push('Potential English-Portuguese length mismatch');
        }
    }

    if (qIssues.length > 0) {
        issues.push({
            id: q.id,
            phase: phaseMap[q.phase],
            unitName: q.unitName,
            issues: qIssues
        });
    }
});

if (issues.length > 0) {
    console.log('Issues found in sample:');
    issues.forEach(issue => {
        console.log(`\n  Question ID: ${issue.id}`);
        console.log(`  Phase: ${issue.phase}`);
        console.log(`  Unit: ${issue.unitName}`);
        console.log(`  Issues:`);
        issue.issues.forEach(i => console.log(`    - ${i}`));
    });
} else {
    console.log('No major issues found in sample.');
}

// 5. SPECIFIC DEFECT SCAN
console.log('\n\n5. SPECIFIC DEFECT SCAN (All Questions)');
console.log('----------------------------------------\n');

const defects = {
    correctAnswerMissing: [],
    duplicateChips: [],
    missingScenario: []
};

questions.forEach(q => {
    // Check if correct answer is in chips
    if (q.chips && q.correct) {
        const chips = q.chips.map(c => c.toLowerCase().trim());
        const correct = q.correct.toLowerCase().trim();
        if (!chips.includes(correct)) {
            defects.correctAnswerMissing.push({
                id: q.id,
                phase: phaseMap[q.phase],
                unitName: q.unitName,
                correctAnswer: q.correct,
                chips: q.chips
            });
        }
    }

    // Check for duplicate chips
    if (q.chips) {
        const chips = q.chips.map(c => c.toLowerCase().trim());
        const uniqueChips = new Set(chips);
        if (chips.length !== uniqueChips.size) {
            defects.duplicateChips.push({
                id: q.id,
                phase: phaseMap[q.phase],
                unitName: q.unitName,
                chips: q.chips
            });
        }
    }

    // Check for missing scenarios where needed
    if (!q.scenario || q.scenario.trim() === '') {
        const needsScenario = q.unitName && (
            q.unitName.toLowerCase().includes('demonstrative') ||
            q.unitName.toLowerCase().includes('ser') && q.unitName.toLowerCase().includes('estar') ||
            q.unitName.toLowerCase().includes('tense selection') ||
            q.unitName.toLowerCase().includes('preterite vs imperfect')
        );

        if (needsScenario) {
            defects.missingScenario.push({
                id: q.id,
                phase: phaseMap[q.phase],
                unitName: q.unitName
            });
        }
    }
});

console.log(`Correct answer missing from chips: ${defects.correctAnswerMissing.length}`);
if (defects.correctAnswerMissing.length > 0) {
    console.log('\nDetails:');
    defects.correctAnswerMissing.slice(0, 10).forEach(d => {
        console.log(`  Question ${d.id} [${d.phase}]: ${d.unitName}`);
        console.log(`    Correct: "${d.correctAnswer}"`);
        console.log(`    Chips: ${d.chips.join(', ')}`);
    });
    if (defects.correctAnswerMissing.length > 10) {
        console.log(`  ... and ${defects.correctAnswerMissing.length - 10} more`);
    }
}

console.log(`\nDuplicate chips: ${defects.duplicateChips.length}`);
if (defects.duplicateChips.length > 0) {
    console.log('\nDetails:');
    defects.duplicateChips.slice(0, 10).forEach(d => {
        console.log(`  Question ${d.id} [${d.phase}]: ${d.unitName}`);
        console.log(`    Chips: ${d.chips.join(', ')}`);
    });
    if (defects.duplicateChips.length > 10) {
        console.log(`  ... and ${defects.duplicateChips.length - 10} more`);
    }
}

console.log(`\nMissing scenarios where needed: ${defects.missingScenario.length}`);
if (defects.missingScenario.length > 0) {
    console.log('\nDetails:');
    defects.missingScenario.forEach(d => {
        console.log(`  Question ${d.id} [${d.phase}]: ${d.unitName}`);
    });
}

// Summary statistics
console.log('\n\n========================================');
console.log('SUMMARY STATISTICS');
console.log('========================================\n');

const testedUnits = Object.values(unitCounts).filter(c => c > 0).length;
const coveragePercentage = ((testedUnits / allUnits.length) * 100).toFixed(1);

console.log(`Total Questions: ${totalQuestions}`);
console.log(`Syllabus Units: ${allUnits.length}`);
console.log(`Units Tested: ${testedUnits} (${coveragePercentage}%)`);
console.log(`Units Untested: ${unitsWithNoQuestions.length}`);
console.log(`Average Questions per Tested Unit: ${(totalQuestions / testedUnits).toFixed(1)}`);
console.log(`\nDefects Found:`);
console.log(`  - Correct answer missing: ${defects.correctAnswerMissing.length}`);
console.log(`  - Duplicate chips: ${defects.duplicateChips.length}`);
console.log(`  - Missing scenarios: ${defects.missingScenario.length}`);
console.log(`  - Total defects: ${defects.correctAnswerMissing.length + defects.duplicateChips.length + defects.missingScenario.length}`);

console.log('\n========================================\n');
