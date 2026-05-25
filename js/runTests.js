#!/usr/bin/env node
'use strict';

/*
 * runTests.js — CLI test runner for RussianNounsJS
 *
 * Loads the UMD bundle, reads all OpenCorpora JSON test data,
 * runs declension + pluralization tests, and outputs metrics.
 *
 * Usage:
 *   node js/runTests.js            # metrics only
 *   node js/runTests.js --logs     # also write all_errors.log + frequent_errors.log
 */

const path = require('path');
const fs = require('fs');

const RussianNouns = require(path.join(__dirname, 'dist', 'RussianNouns.umd.js'));
const tc = require(path.join(__dirname, 'testCore.js'));
const mostFrequent = new Set(
    JSON.parse(fs.readFileSync(path.join(__dirname, 'mostFrequent.json'), 'utf8'))
);

const args = process.argv.slice(2);
const writeLogs = args.includes('--logs');

const testDataDir = path.join(__dirname, '..', 'opencorpora-testing');

// All 30 Cyrillic letters (matching the Ruby script order)
const letters = [
    'а', 'б', 'в', 'г', 'д',
    'е', 'ж', 'з', 'и', 'й',
    'к', 'л', 'м', 'н', 'о',
    'п', 'р', 'с', 'т', 'у',
    'ф', 'х', 'ц', 'ч', 'ш',
    'щ', 'ъ', 'ы', 'ь',
    'э', 'ю', 'я'
];

const genderMap = [
    { key: 'm', gender: RussianNouns.Gender.MASCULINE, label: 'M' },
    { key: 'f', gender: RussianNouns.Gender.FEMININE, label: 'F' },
    { key: 'n', gender: RussianNouns.Gender.NEUTER, label: 'N' },
    { key: 'c', gender: RussianNouns.Gender.COMMON, label: 'C' },
    { key: 'p', gender: null, label: 'P' }
];

// Collect all errors for log output
const allErrors = [];

const counters = tc.createCounters();
const results = [];
const rne = new RussianNouns.Engine();

let totalFiles = 0;
let totalLemmas = 0;

for (const letter of letters) {
    const filePath = path.join(testDataDir, `nouns_${letter}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`Missing: ${filePath}`);
        process.exit(1);
    }

    totalFiles++;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dictionary = tc.knowThyself(data.dict);

    const fileLemmaCount = data.m.length + data.f.length + data.n.length + data.c.length + data.p.length;
    totalLemmas += fileLemmaCount;

    process.stdout.write(`\rLetter ${letter} (${totalFiles}/${letters.length}), ${fileLemmaCount} lemmas, dict=${data.dict.length}   `);
    process.stdout.flush && process.stdout.flush();

    for (const { key, gender, label } of genderMap) {
        tc.testGender(rne, data[key], dictionary, gender, RussianNouns, mostFrequent, counters, results);
    }
}

console.log('\n');

// ---- Summary metrics ----
const wrongResults = results.filter(r => r.status === 'wrong');
const warnResults = results.filter(r => r.status === 'hasWarnings');

const singularPct = counters.totalWordsSingular > 0
    ? ((counters.totalWordsSingular - counters.wrongWordsSingular) / counters.totalWordsSingular * 100).toFixed(2)
    : '100.00';
const formsPct = counters.totalCases > 0
    ? ((counters.totalCases - counters.wrongCases) / counters.totalCases * 100).toFixed(2)
    : '100.00';
const warningsPct = counters.totalWordsSingular > 0
    ? (counters.correctWordsWithWarningsSingular / counters.totalWordsSingular * 100).toFixed(2)
    : '0.00';
const pluralizePct = counters.pluralizeTotal > 0
    ? ((counters.pluralizeTotal - counters.pluralizeWrong) / counters.pluralizeTotal * 100).toFixed(2)
    : '100.00';
const pluralFormsPct = counters.totalCasesPluralExceptTheNominativeCase > 0
    ? ((counters.totalCasesPluralExceptTheNominativeCase - counters.wrongCasesPluralExceptTheNominativeCase)
       / counters.totalCasesPluralExceptTheNominativeCase * 100).toFixed(2)
    : '100.00';

console.log('Правильные слова в единственном числе:',
    `${counters.totalWordsSingular - counters.wrongWordsSingular}/${counters.totalWordsSingular} (${singularPct}%)`);
console.log('Правильные формы в единственном числе:',
    `${counters.totalCases - counters.wrongCases}/${counters.totalCases} (${formsPct}%)`);
console.log('Правильные слова с предупреждениями:',
    `${counters.correctWordsWithWarningsSingular}/${counters.totalWordsSingular} (${warningsPct}%)`);
console.log('Правильное образование множественного числа:',
    `${counters.pluralizeTotal - counters.pluralizeWrong}/${counters.pluralizeTotal} (${pluralizePct}%)`);
console.log('Правильные формы во множественном числе (кроме им.п.):',
    `${counters.totalCasesPluralExceptTheNominativeCase - counters.wrongCasesPluralExceptTheNominativeCase}/${counters.totalCasesPluralExceptTheNominativeCase} (${pluralFormsPct}%)`);

console.log(`\nВсего слов: ${counters.totalWords}, файлов: ${totalFiles}, лемм: ${totalLemmas}`);
console.log(`Ошибок: ${wrongResults.length}, предупреждений: ${warnResults.length}`);

// ---- Error logs ----
if (writeLogs) {
    const caseNames = ['им.п.', 'род.п.', 'дат.п.', 'вин.п.', 'твор.п.', 'предл.п.', 'мест.п.'];
    const pCaseNames = ['им.п.', 'род.п.', 'дат.п.', 'вин.п.', 'твор.п.', 'предл.п.'];

    function buildErrorEntry(r) {
        const failures = [];
        for (let j = 0; j < r.wordForms.length; j++) {
            const wf = r.wordForms[j];
            if (wf && wf.failure) {
                failures.push(`  синг ${caseNames[j]}: ожидал «${wf.expected}», получил «${wf.actual}»`);
            }
        }
        for (let j = 0; j < r.pluralForms.length; j++) {
            const pf = r.pluralForms[j];
            if (pf && pf.failure) {
                failures.push(`  мн. ${pCaseNames[j]}: ожидал «${pf.expected}», получил «${pf.actual}»`);
            }
        }
        return {
            row: r.rowNumber,
            lemma: r.lemma,
            gender: r.gender || '—',
            pluraleTantum: r.pluraleTantum,
            indeclinable: r.indeclinable,
            animate: r.animate,
            declension: r.declension || '—',
            frequent: r.frequent,
            failures
        };
    }

    function formatErrorEntry(e) {
        let s = `${e.lemma} | #${e.row} | род: ${e.gender} | склон: ${e.declension} | `;
        s += `pltm=${e.pluraleTantum} fixd=${e.indeclinable} anim=${e.animate} freq=${e.frequent}\n`;
        for (const f of e.failures) s += f + '\n';
        s += '\n';
        return s;
    }

    // Collect ALL errors
    const allErrorEntries = [];
    for (const r of results) {
        if (r.status !== 'wrong') continue;
        allErrorEntries.push(buildErrorEntry(r));
    }

    // Sort alphabetically by lemma (Russian locale)
    allErrorEntries.sort((a, b) => a.lemma.localeCompare(b.lemma, 'ru'));

    // Write all errors log
    const allLogPath = path.join(__dirname, '..', 'all_errors.log');
    fs.writeFileSync(allLogPath, allErrorEntries.map(formatErrorEntry).join(''), 'utf8');
    console.log(`\nВсе ошибки: ${allLogPath} (${allErrorEntries.length} слов)`);

    // Write frequent-only log (inherits sorted order)
    const freqEntries = allErrorEntries.filter(e => e.frequent);
    const freqLogPath = path.join(__dirname, '..', 'frequent_errors.log');
    fs.writeFileSync(freqLogPath, freqEntries.map(formatErrorEntry).join(''), 'utf8');
    console.log(`Частотные ошибки: ${freqLogPath} (${freqEntries.length} слов)`);
}
