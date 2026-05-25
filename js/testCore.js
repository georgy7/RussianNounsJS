'use strict';

/*
 * testCore.js — shared test logic for RussianNounsJS testing.
 * Used by both the browser version (test2.js) and the CLI runner.
 *
 * Decoding functions (extractPair, decodeIncremental, knowThyself, Unpacker)
 * are pure and have no external dependencies.
 *
 * Test functions (evaluateSingularCase, processSingularForms, processPluralForms)
 * accept a `rn` parameter (the RussianNouns namespace) so they work in any environment.
 */

// ---------------------------------------------------------------------------
// Decoding
// ---------------------------------------------------------------------------

function extractPair(code) {
    if ((code & 0b100) === 0) {
        return [code >> 3, code & 0b11];
    }
    return [code >> 7, ((code >> 1) & 0b111100) | (code & 0b11)];
}

function decodeIncremental(code, baseString, dictionary) {
    const pair = extractPair(code);
    const dictIndex = pair[0];
    const common = baseString.length - pair[1];
    return baseString.substring(0, common) + dictionary[dictIndex];
}

function knowThyself(mixedArray) {
    const known = [];
    for (let i = 0; i < mixedArray.length; i++) {
        let v = mixedArray[i];
        if (typeof v === "number") {
            v = decodeIncremental(v, known[i - 1], known);
        }
        known.push(v);
    }
    return known;
}

class Unpacker {
    constructor(dictionary) {
        this._dict = dictionary;
        this._baseString = '';
    }

    unpackLemma(compressedLemma) {
        const singular = [];
        const plural = [];

        for (let i = 0, len = compressedLemma.cases.length; i < len; i++) {
            singular[i] = this.decodeWordForm(compressedLemma.cases[i]);
        }
        for (let i = 0, len = compressedLemma.casesPlural.length; i < len; i++) {
            plural[i] = this.decodeWordForm(compressedLemma.casesPlural[i]);
        }

        return { cases: singular, casesPlural: plural };
    }

    decode(num) {
        this._baseString = decodeIncremental(num, this._baseString, this._dict);
        return this._baseString;
    }

    decodeWordForm(inputValue) {
        if (typeof inputValue === "number") {
            return [this.decode(inputValue)];
        }

        const result = [];
        if (Array.isArray(inputValue)) {
            for (let i = 0, len = inputValue.length; i < len; i++) {
                result.push(this.decode(inputValue[i]));
            }
        }
        return result;
    }
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function uniq(a) {
    return a.filter((item, index) => a.indexOf(item) === index);
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function arraysEqualCaseInsensitive(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if ((a[i] !== b[i]) && (a[i].toLowerCase() !== b[i].toLowerCase()))
            return false;
    }
    return true;
}

function pushUnique(arr, other) {
    for (const x of other) {
        if (!arr.includes(x)) arr.push(x);
    }
}

function unYoAll(list) {
    return list.map(w => w.toLowerCase().replaceAll('ё', 'е'));
}

// ---------------------------------------------------------------------------
// Ojejojueju — instrumental case о/е ending flexibility
// ---------------------------------------------------------------------------

function ojejojuejuStatus(expected, actual, caseType, rn) {
    if (caseType !== rn.Case.INSTRUMENTAL) return;

    const all = ['ой', 'ей', 'ою', 'ею'];
    const suExpected = uniq(expected).sort();
    const suActual = uniq(actual).sort();

    function tooShort(word) { return word.length < 3; }
    function getEnding(word) { return word.substring(word.length - 2); }
    function getStem(word) { return word.substring(0, word.length - 2); }
    function wordMatches(word) { return all.includes(getEnding(word)); }

    if (suExpected.find(tooShort) || suActual.find(tooShort)) return;
    if (suExpected.find(w => !wordMatches(w)) || suActual.find(w => !wordMatches(w))) return;

    const uniqExpStems = uniq(suExpected.map(getStem));
    const uniqActualStems = uniq(suActual.map(getStem));
    const expectedVowels = uniq(suExpected.map(getEnding).map(x => x[0])).sort();
    const actualVowels = uniq(suActual.map(getEnding).map(x => x[0])).sort();

    if (uniqExpStems.length === 1 &&
        uniqActualStems.length === 1 &&
        uniqExpStems[0] === uniqActualStems[0] &&
        expectedVowels.length === 1 &&
        actualVowels.length === 1 &&
        expectedVowels[0] === actualVowels[0]) {
        if (arraysEqual(suExpected, suActual) ||
            (uniqExpStems[0].length >= 3 && suExpected.every(w => suActual.includes(w)))) {
            return 'valid';
        } else {
            return 'doubtful';
        }
    }
}

// ---------------------------------------------------------------------------
// Singular evaluation
// ---------------------------------------------------------------------------

function generateDeclensionForms(rne, lemma, lemmaUpperCase, caseType) {
    let actual, actualUpperCase;
    try {
        actual = rne.decline(lemma, caseType);
        actualUpperCase = rne.decline(lemmaUpperCase, caseType);
        if (!arraysEqualCaseInsensitive(actual, actualUpperCase)) {
            throw new Error(`Different upper-case result: ${lemma.text()}, case: ${caseType}.`);
        }
    } catch (e) {
        if (e.message === "unsupported") {
            actual = ['-----'];
        } else {
            throw e;
        }
    }
    return actual;
}

function evaluateSingularCase(actual, expected, caseType, lemma, rn) {
    const sameCount = uniq(actual).length === uniq(expected).length;
    const everyExpectedIsInActual = expected.every(e => actual.includes(e));

    const actualWithoutYo = unYoAll(actual);
    const expectedWithoutYo = unYoAll(expected);

    const exactMatchIgnoringYo = sameCount && expectedWithoutYo.every(yoLess =>
        actualWithoutYo.includes(yoLess)
    );

    const exactMatchIgnoringNjeNjiAndYo = sameCount && actual.length === 1 && (function () {
        const yoLess = expectedWithoutYo[0];
        const actualYoLess = actualWithoutYo[0];
        if (!(yoLess.endsWith('нье') || yoLess.endsWith('ньи'))) return false;
        if (!(actualYoLess.endsWith('нье') || actualYoLess.endsWith('ньи'))) return false;
        return yoLess.slice(0, -3) === actualYoLess.slice(0, -3);
    })();

    let ok, failure, warning = false;

    if ((everyExpectedIsInActual && sameCount) ||
        ojejojuejuStatus(expected, actual, caseType, rn) === 'valid') {
        ok = true; failure = false;
    } else if (
        ojejojuejuStatus(expected, actual, caseType, rn) === 'doubtful' ||
        (caseType === rn.Case.GENITIVE && actual[0] === expected[0]) ||
        ([rn.Case.PREPOSITIONAL, rn.Case.LOCATIVE].includes(caseType) &&
            lemma.getGender() === rn.Gender.NEUTER &&
            lemma.text().endsWith('нье') &&
            exactMatchIgnoringNjeNjiAndYo) ||
        exactMatchIgnoringYo
    ) {
        ok = false; failure = false; warning = true;
    } else {
        ok = false; failure = true;
    }

    return { ok, failure, warning, failureOrWarning: failure || warning };
}

function createSingularResultEntry(expected, actual, evaluation) {
    return { expected: expected.join(', '), actual: actual.join(', '), ...evaluation };
}

function processSingularForms(rne, lemma, lemmaUpperCase, expResults, pluraleTantum, rn, counters) {
    const resultWordForms = [];
    let wordIsWrongSingular = false;
    let wordHasWarningSingular = false;

    if (!pluraleTantum) {
        counters.totalWordsSingular++;
        counters.totalCases += 6;

        for (let j = 0; j < 7; j++) {
            const c = rn.CASES[j];
            const expected = expResults[j];
            const actual = generateDeclensionForms(rne, lemma, lemmaUpperCase, c);
            const evaluation = evaluateSingularCase(actual, expected, c, lemma, rn);
            resultWordForms.push(createSingularResultEntry(expected, actual, evaluation));

            if (evaluation.failure) {
                counters.wrongCases++;
                wordIsWrongSingular = true;
            } else if (evaluation.warning) {
                wordHasWarningSingular = true;
            }
        }

        if (wordIsWrongSingular) {
            counters.wrongWordsSingular++;
        } else if (wordHasWarningSingular) {
            counters.correctWordsWithWarningsSingular++;
        }
    } else {
        for (let j = 0; j < 7; j++) resultWordForms.push({});
    }

    return { resultWordForms, wordIsWrongSingular, wordHasWarningSingular };
}

// ---------------------------------------------------------------------------
// Plural evaluation
// ---------------------------------------------------------------------------

function getPluralNominativeForms(rne, lemma, lemmaUpperCase, expectedCasesPlural, pluraleTantum) {
    const needsNominative = expectedCasesPlural[0] && expectedCasesPlural[0].length > 0;

    if (!needsNominative) return { simple: [], upper: [] };

    if (pluraleTantum) {
        return { simple: expectedCasesPlural[0], upper: expectedCasesPlural[0].map(w => w.toUpperCase()) };
    }

    const simple = rne.pluralize(lemma);
    const upper = rne.pluralize(lemmaUpperCase);

    if (!arraysEqualCaseInsensitive(simple, upper)) {
        throw new Error(`Different upper-case plurals (nominative): ${lemma.text()}.`);
    }

    return { simple, upper };
}

function declinePluralFormsWithCase(rne, lemma, lemmaUpperCase, pluralForms, pluralFormsUpper, caseType, rn) {
    const unique = [];
    const uniqueUpper = [];

    for (let i = 0; i < pluralForms.length; i++) {
        pushUnique(unique, rne.decline(lemma, caseType, pluralForms[i]));
        pushUnique(uniqueUpper, rne.decline(lemmaUpperCase, caseType, pluralFormsUpper[i]));
    }

    if (!arraysEqualCaseInsensitive(unique, uniqueUpper)) {
        throw new Error(`Different plurals: ${lemma.text()}, case: ${caseType}.`);
    }

    return unique;
}

function evaluatePluralCaseResult(actual, expected, isNominative, pluraleTantum, counters) {
    const actualSorted = actual.slice().sort();
    const expectedSorted = expected.slice().sort();
    const failure = !arraysEqual(actualSorted, expectedSorted);
    let warning = false;

    if (!failure) warning = !arraysEqual(actual, expected);

    if (failure) {
        if (isNominative) {
            if (!pluraleTantum) counters.pluralizeWrong++;
        } else {
            counters.wrongCasesPluralExceptTheNominativeCase++;
        }
    }

    return { actual: actual.join(', '), failure, warning, failureOrWarning: failure || warning };
}

function initializeResultPluralForms(expectedCasesPlural) {
    return expectedCasesPlural.map(expected =>
        expected.length > 0 ? { expected: expected.join(', ') } : {}
    );
}

function processPluralForms(rne, lemma, lemmaUpperCase, unpacked, pluraleTantum, rn, counters) {
    const resultPluralForms = [];
    let wordIsWrongPlural = false;
    let wordHasWarningPlural = false;

    const expectedCasesPlural = unpacked.casesPlural;
    if (expectedCasesPlural.length === 0) {
        return { resultPluralForms: [], wordIsWrongPlural, wordHasWarningPlural };
    }

    const results = initializeResultPluralForms(expectedCasesPlural);
    const { simple: nominativeSimple, upper: nominativeUpper } =
        getPluralNominativeForms(rne, lemma, lemmaUpperCase, expectedCasesPlural, pluraleTantum);

    for (let j = 0; j < 6; j++) {
        const expected = expectedCasesPlural[j];
        if (!expected || expected.length === 0) continue;

        const isNominative = j === 0;
        let actualForms;

        if (isNominative) {
            if (!pluraleTantum) counters.pluralizeTotal++;
            actualForms = nominativeSimple;
        } else {
            counters.totalCasesPluralExceptTheNominativeCase++;
            actualForms = declinePluralFormsWithCase(
                rne, lemma, lemmaUpperCase,
                nominativeSimple, nominativeUpper,
                rn.CASES[j], rn
            );
        }

        const evaluation = evaluatePluralCaseResult(actualForms, expected, isNominative, pluraleTantum, counters);
        Object.assign(results[j], evaluation);

        if (evaluation.failure) wordIsWrongPlural = true;
        else if (evaluation.warning) wordHasWarningPlural = true;
    }

    return { resultPluralForms: results, wordIsWrongPlural, wordHasWarningPlural };
}

// ---------------------------------------------------------------------------
// Result entry
// ---------------------------------------------------------------------------

function determineWordStatus(wordIsWrongSingular, wordIsWrongPlural, wordHasWarningSingular, wordHasWarningPlural) {
    if (wordIsWrongSingular || wordIsWrongPlural) return 'wrong';
    if (wordHasWarningSingular || wordHasWarningPlural) return 'hasWarnings';
    return 'correct';
}

function createResultEntry(resultLength, resultWordForms, resultPluralForms, gender,
    pluraleTantum, fixed, animate, declension, lemma, abbr, wordStatus, mostFrequent) {
    return {
        rowNumber: resultLength + 1,
        lemma: lemma.lower().replaceAll('ё', 'е'),
        wordForms: resultWordForms,
        pluralForms: resultPluralForms,
        gender,
        pluraleTantum,
        indeclinable: fixed,
        animate,
        declension,
        frequent: mostFrequent.has(lemma.lower().replaceAll('ё', 'е')) && !abbr,
        status: wordStatus
    };
}

// ---------------------------------------------------------------------------
// Main test function — processes one gender array
// ---------------------------------------------------------------------------

function testGender(rne, data, dictionary, gender, rn, mostFrequent, counters, results) {
    const unpacker = new Unpacker(dictionary);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const pluraleTantum = item.g.includes('Pltm');
        const abbr = item.g.includes('Abbr');
        const animate = item.g.includes('anim');
        const fixed = item.g.includes('Fixd');
        const surname = item.g.includes('Surn');
        const name = item.g.includes('Name');

        const unpacked = unpacker.unpackLemma(item);
        const word = pluraleTantum ? unpacked.casesPlural[0][0] : unpacked.cases[0][0];

        const lemma = rn.createLemmaOrNull({
            text: word, gender, animate, surname, name,
            indeclinable: fixed, pluraleTantum
        });
        if (!lemma) throw new Error(`Could not create lemma "${word}".`);

        const lemmaUpperCase = rn.createLemmaOrNull({
            text: word.toUpperCase(), gender, animate, surname, name,
            indeclinable: fixed, pluraleTantum
        });

        const { resultWordForms, wordIsWrongSingular, wordHasWarningSingular } =
            processSingularForms(rne, lemma, lemmaUpperCase, unpacked.cases, pluraleTantum, rn, counters);

        const { resultPluralForms, wordIsWrongPlural, wordHasWarningPlural } =
            processPluralForms(rne, lemma, lemmaUpperCase, unpacked, pluraleTantum, rn, counters);

        const wordStatus = determineWordStatus(
            wordIsWrongSingular, wordIsWrongPlural,
            wordHasWarningSingular, wordHasWarningPlural
        );

        let declension = '';
        try { declension = lemma.getDeclension(); } catch (e) { /* ignore */ }

        results.push(createResultEntry(
            results.length, resultWordForms, resultPluralForms,
            gender, pluraleTantum, fixed, animate, declension,
            lemma, abbr, wordStatus, mostFrequent
        ));

        counters.totalWords++;
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

module.exports = {
    extractPair,
    decodeIncremental,
    knowThyself,
    Unpacker,
    testGender,
    // counters template — callers should pass a mutable object with these fields
    createCounters: () => ({
        totalCases: 0,
        wrongCases: 0,
        totalWords: 0,
        totalWordsSingular: 0,
        wrongWordsSingular: 0,
        correctWordsWithWarningsSingular: 0,
        pluralizeTotal: 0,
        pluralizeWrong: 0,
        totalCasesPluralExceptTheNominativeCase: 0,
        wrongCasesPluralExceptTheNominativeCase: 0
    })
};
