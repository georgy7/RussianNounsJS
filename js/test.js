var window = self;
importScripts('RussianNouns.js');
importScripts('freq.js');

let testData;
let workerIndex, letterIndex;

let main = function () {

    const uniq = a => a.filter((item, index) => a.indexOf(item) === index);

    const pushAll = (arr, other) => arr.push.apply(arr, other);

    function arraysEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }

        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    let cases = RussianNouns.CASES;

    let wrongCases = 0;
    let wrongWordsSingular = 0;
    let correctWordsWithWarningsSingular = 0;
    let totalCases = 0;
    let totalWords = 0;
    let totalWordsSingular = 0;
    const totalLoadingSteps = 6;
    const result = [];

    let pluralizeTotal = 0;
    let pluralizeWrong = 0;

    let totalCasesPluralExceptTheNominativeCase = 0;
    let wrongCasesPluralExceptTheNominativeCase = 0;

    function ojejojuejuStatus(expected, actual, grCase) {

        if (grCase !== RussianNouns.Case.INSTRUMENTAL) {
            return;
        }

        const all = [
            'ой', 'ей',
            'ою', 'ею'        // This is a literary norm of the 19th century.
        ];

        const suExpected = uniq(expected).sort();
        const suActual = uniq(actual).sort();


        // --------- Utility functions --------------

        function tooShort(word) {
            return word.length < 3;
        }

        function getEnding(word) {
            return word.substring(word.length - 2);
        }

        function getStem(word) {
            return word.substring(0, word.length - 2)
        }

        function wordMatches(word) {
            return all.includes(getEnding(word));
        }

        // -----------------------------------------

        if (suExpected.find(tooShort) || suActual.find(tooShort)) {
            return;
        }

        if (suExpected.find(w => !wordMatches(w)) || suActual.find(w => !wordMatches(w))) {
            return;
        }

        let uniqExpStems = uniq(suExpected.map(getStem));
        let uniqActualStems = uniq(suActual.map(getStem));

        let expectedVowels = uniq(suExpected.map(getEnding).map(x => x[0])).sort();
        let actualVowels = uniq(suActual.map(getEnding).map(x => x[0])).sort();

        if ((uniqExpStems.length === 1)
            && (uniqActualStems.length === 1)
            && (uniqExpStems[0] === uniqActualStems[0])
            && (expectedVowels.length === 1)
            && (actualVowels.length === 1)
            && (expectedVowels[0] === actualVowels[0])) {

            if (arraysEqual(suExpected, suActual)
                || ((uniqExpStems[0].length >= 3) && suExpected.every(w => suActual.includes(w)))) {
                return 'valid';
            } else {
                return 'doubtful';
            }
        }
    }

    // This format supports fairly large numbers on the left
    // and numbers ranging from 0 to 63 on the right.
    // I use something very similar to varint for the right part:
    // https://protobuf.dev/programming-guides/encoding/#varints
    function extractPair(code) {
        if ((code & 0b100) === 0) {
            return [code >> 3, code & 0b11];
        }

        return [code >> 7, ((code >> 1) & 0b111100) | (code & 0b11)];
    }

    // https://en.wikipedia.org/wiki/Incremental_encoding
    function decodeIncremental(code, basePointer, dictionary) {
        const pair = extractPair(code);
        const dictIndex = pair[0];
        const common = basePointer[0].length - pair[1];
        const decoded = basePointer[0].substring(0, common) + dictionary[dictIndex];
        basePointer[0] = decoded;
        return decoded;
    }

    function test(rne, data, dictionary, gender, loadingStepCompleted) {
        let baseStringPointer = [''];

        for (let i = 0; i < data.length; i++) {

            if ((i % 250 == 0) || (i == (data.length - 1))) {
                var stepWidth = 1 / totalLoadingSteps;
                var loadStatus = stepWidth * (loadingStepCompleted + ((1 + i) / data.length));
                postMessage({
                    type: 'loading',
                    status: loadStatus,
                    workerIndex: workerIndex,
                    letterIndex: letterIndex
                });
            }

            const pluraleTantum = (data[i].g.indexOf('Pltm') >= 0);
            const abbr = (data[i].g.indexOf('Abbr') >= 0);

            const unpacked = {
                cases: [],
                casesPlural: []
            };

            function decodeWordForm(inputValue) {
                if (typeof inputValue === "number") {
                    return [decodeIncremental(inputValue, baseStringPointer, dictionary)];
                } else if (inputValue instanceof Array) {
                    return inputValue.map(x => decodeIncremental(x, baseStringPointer, dictionary));
                } else {
                    return [];
                }
            }

            for (let ci = 0; ci < data[i].cases.length; ci++) {
                unpacked.cases[ci] = decodeWordForm(data[i].cases[ci]);
            }

            for (let ci = 0; ci < data[i].casesPlural.length; ci++) {
                unpacked.casesPlural[ci] = decodeWordForm(data[i].casesPlural[ci]);
            }

            const word = pluraleTantum ? (unpacked.casesPlural[0][0]) : (unpacked.cases[0][0]); // Именительный падеж
            const expResults = unpacked.cases;

            const animate = (data[i].g.indexOf('anim') >= 0);
            const fixed = (data[i].g.indexOf('Fixd') >= 0);
            const surname = (data[i].g.indexOf('Surn') >= 0);
            const name = (data[i].g.indexOf('Name') >= 0);

            const lemma = RussianNouns.createLemmaOrNull({
                text: word,
                gender: gender,
                animate: animate,
                surname: surname,
                name: name,
                indeclinable: fixed,
                pluraleTantum: pluraleTantum
            });

            // Я здесь даже не проверяю тип. Какой смысл?
            // Я могу лишь выкинуть исключение, а оно итак вылетит на следующей строчке.
            // Если там null, в консоли будет TypeError.

            const lemmaUpperCase = lemma.newText(o => o.text().toUpperCase());

            const resultWordForms = [];

            let wordIsWrongSingular = false;
            let wordHasWarningSingular = false;

            totalWords++;

            if (!pluraleTantum) {

                totalWordsSingular++;
                totalCases += 6;

                for (let j = 0; j <= 6; j++) {

                    const c = cases[j];
                    const expected = expResults[j];

                    let actual;

                    try {
                        actual = rne.decline(lemma, c);

                        const actualUpperCase = rne.decline(lemmaUpperCase, c);
                        const aString = actual.toString().toLowerCase();
                        const auString = actualUpperCase.toString().toLowerCase();

                        if (aString !== auString) {
                            throw `Different upper-case result: ${word}, gender: ${gender}, case: ${c}, "${aString} !== ${auString}".`
                        }

                    } catch (e) {
                        actual = ['-----'];
                        if (e.message !== "unsupported") {
                            throw e;
                        } else {
                            console.log(`Unsupported: "${word}"`);
                        }
                    }

                    const sameCount = (uniq(actual).length == uniq(expected).length);
                    const everyExpectedIsInActual = expected.every(function (e) {
                        return actual.indexOf(e) >= 0;
                    });
                    const actualWithoutYo = actual.map(function (word) {
                        return word.toLowerCase().replace(/ё/g, 'е');
                    });
                    const exactMatchIgnoringYo = sameCount && expected.every(function (word) {
                        var yoLess = word.toLowerCase().replace(/ё/g, 'е');
                        return actualWithoutYo.indexOf(yoLess) >= 0;
                    });
                    const exactMatchIgnoringNjeNjiAndYo = sameCount && (1 === actual.length) && (function () {
                        const yoLess = expected[0].toLowerCase().replace(/ё/g, 'е');
                        const actualYoLess = actual[0].toLowerCase().replace(/ё/g, 'е');
                        if (!(yoLess.endsWith('нье') || yoLess.endsWith('ньи'))) {
                            return false;
                        }
                        if (!(actualYoLess.endsWith('нье') || actualYoLess.endsWith('ньи'))) {
                            return false;
                        }
                        return yoLess.substring(0, yoLess.length - 3) === actualYoLess.substring(0, actualYoLess.length - 3);
                    })();

                    let warning = false;
                    let ok, failure;
                    if ((everyExpectedIsInActual && sameCount) || ('valid' === ojejojuejuStatus(expected, actual, c))) {
                        ok = true;
                        failure = false;
                    } else if (('doubtful' === ojejojuejuStatus(expected, actual, c))
                        || (RussianNouns.Case.GENITIVE === c && actual[0] === expected[0])
                        || (
                            [RussianNouns.Case.PREPOSITIONAL, RussianNouns.Case.LOCATIVE].includes(c)
                            && gender == RussianNouns.Gender.NEUTER
                            && word.endsWith('нье')
                            && exactMatchIgnoringNjeNjiAndYo
                        )
                        || exactMatchIgnoringYo) {
                        ok = false;
                        failure = false;
                        warning = true;
                        wordHasWarningSingular = true;
                    } else {
                        ok = false;
                        failure = true;
                        wrongCases++;
                        wordIsWrongSingular = true;
                    }
                    resultWordForms.push({
                        "expected": expected.join(', '),
                        "actual": actual.join(', '),
                        "ok": ok,
                        "failure": failure,
                        "warning": warning,
                        "failureOrWarning": (failure || warning)
                    });
                }

                if (wordIsWrongSingular) {
                    wrongWordsSingular++;
                } else if (wordHasWarningSingular) {
                    correctWordsWithWarningsSingular++;
                }
            } else {
                for (let j = 0; j <= 6; j++) {
                    resultWordForms.push({});
                }
            }

            let declension = '';
            try {
                declension = RussianNouns.getDeclension(lemma);
            } catch (e) {
            }

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            const resultPluralForms = [];

            let wordIsWrongPlural = false;
            let wordHasWarningPlural = false;

            if (unpacked.casesPlural.length > 0) {

                const expectedCasesPlural = unpacked.casesPlural;

                for (let j = 0; j <= 5; j++) {
                    resultPluralForms[j] = {
                        "expected": expectedCasesPlural[j].join(', ')
                    };
                }

                let currentLemmaActualPluralNominativeArray = null;
                let currentLemmaActualPluralNominativeUpperCaseArray = null;

                for (let j = 0; j <= 5; j++) {
                    if (expectedCasesPlural[j].length > 0) {

                        const r = resultPluralForms[j];

                        let pluralSimple;
                        let pluralUpperCase;

                        if (0 === j) {

                            if (!pluraleTantum) {
                                pluralizeTotal++;
                            }

                            currentLemmaActualPluralNominativeArray = rne.pluralize(lemma);
                            currentLemmaActualPluralNominativeUpperCaseArray = rne.pluralize(lemmaUpperCase);
                            pluralSimple = currentLemmaActualPluralNominativeArray;
                            pluralUpperCase = currentLemmaActualPluralNominativeUpperCaseArray;
                        } else {
                            totalCasesPluralExceptTheNominativeCase++;
                            pluralSimple = [];
                            pluralUpperCase = [];

                            if (currentLemmaActualPluralNominativeArray) {
                                const c = cases[j];

                                for (let pluralizedIndex = 0;
                                     pluralizedIndex < currentLemmaActualPluralNominativeArray.length;
                                     pluralizedIndex++
                                ) {
                                    const pluralized1 = currentLemmaActualPluralNominativeArray[pluralizedIndex];
                                    const pluralized2 = currentLemmaActualPluralNominativeUpperCaseArray[pluralizedIndex];
                                    pushAll(pluralSimple, rne.decline(lemma, c, pluralized1));
                                    pushAll(pluralUpperCase, rne.decline(lemmaUpperCase, c, pluralized2));
                                }
                            }

                            pluralSimple = uniq(pluralSimple);
                            pluralUpperCase = uniq(pluralUpperCase);
                        }

                        const aString = pluralSimple.toString().toLowerCase();
                        const auString = pluralUpperCase.toString().toLowerCase();

                        if (aString !== auString) {
                            throw `Different upper-case plurals: ${word}, gender: ${lemma.getGender()}, "${aString} !== ${auString}".`
                        }

                        r.actual = pluralSimple.join(', ');

                        r.failure =
                            pluralSimple.slice().sort().toString() !==
                            expectedCasesPlural[j].slice().sort().toString();

                        if (r.failure) {

                            if (0 === j) {
                                if (!pluraleTantum) {
                                    pluralizeWrong++;
                                } else {
                                    throw `Pluralia tantum word pluralization error: ${lemma.text()} != ${aString}`;
                                }
                            } else {
                                wrongCasesPluralExceptTheNominativeCase++;
                            }

                            wordIsWrongPlural = true;

                        } else {
                            r.warning = pluralSimple.toString() !== expectedCasesPlural[j].toString();

                            if (r.warning) {
                                wordHasWarningPlural = true;
                            }
                        }

                        r.failureOrWarning = r.failure || r.warning;
                    }
                }

            }

            let wordStatus;

            if (wordIsWrongSingular || wordIsWrongPlural) {
                wordStatus = 'wrong';
            } else if (wordHasWarningSingular || wordHasWarningPlural) {
                wordStatus = 'hasWarnings';
            } else {
                wordStatus = 'correct';
            }

            result.push({
                "rowNumber": (result.length + 1),
                "wordForms": resultWordForms,
                "pluralForms": resultPluralForms,
                "gender": gender,
                "pluraleTantum": pluraleTantum,
                "indeclinable": fixed,
                "animate": animate,
                "declension": declension,
                "frequent": (mostFrequent.has(lemma.lower().replaceAll('ё', 'е')) && !abbr),
                "status": wordStatus
            });
        }
    }

    const rne = new RussianNouns.Engine();

    const dictDecodingState = [''];
    for (let i = 0; i < testData.dict.length; i++) {
        if (typeof testData.dict[i] === "number") {
            testData.dict[i] = decodeIncremental(testData.dict[i], dictDecodingState, testData.dict);
        }
    }

    test(rne, testData.m, testData.dict, RussianNouns.Gender.MASCULINE, 1);
    test(rne, testData.f, testData.dict, RussianNouns.Gender.FEMININE, 2);
    test(rne, testData.n, testData.dict, RussianNouns.Gender.NEUTER, 3);
    test(rne, testData.c, testData.dict, RussianNouns.Gender.COMMON, 4);
    test(rne, testData.p, testData.dict, null, 5);

    postMessage({
        type: 'testResult',
        workerIndex: workerIndex,
        letterIndex: letterIndex,
        totalCases: totalCases,
        wrongCases: wrongCases,
        totalWords: totalWords,
        totalWordsSingular: totalWordsSingular,
        wrongWordsSingular: wrongWordsSingular,
        correctWordsWithWarningsSingular: correctWordsWithWarningsSingular,
        pluralizeWrong: pluralizeWrong,
        pluralizeTotal: pluralizeTotal,
        totalCasesPluralExceptTheNominativeCase: totalCasesPluralExceptTheNominativeCase,
        wrongCasesPluralExceptTheNominativeCase: wrongCasesPluralExceptTheNominativeCase,
        resultForTemplate: {"items": result}
    });

};

onmessage = function (e) {
    if (e.data.type === 'start') {
        testData = e.data.words;
        workerIndex = e.data.workerIndex;
        letterIndex = e.data.letterIndex;

        postMessage({
            type: 'started',
            wordsLen: (
                testData.m.length +
                testData.f.length +
                testData.n.length +
                testData.c.length +
                testData.p.length)
        });

        main();
    }
};
