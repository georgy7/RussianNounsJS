// test2.js — browser/worker test runner (uses testCore for shared logic)
// Loaded as Web Worker via importScripts, or as ES module via await import()

var window = self;

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    importScripts('dist/RussianNouns.umd.js');
    importScripts('testCore.js');
}

const post = (typeof postCall === "function") ? postCall : postMessage;

let rn, rne;
let mostFrequent;
let testData;
let workerIndex, letterIndex;

function main() {
    rn = RussianNouns;
    rne = new rn.Engine();

    const counters = testCore.createCounters();
    const results = [];

    function onProgress(i, dataLength, loadingStepCompleted) {
        const stepWidth = 1 / 5;
        const loadStatus = stepWidth * (loadingStepCompleted - 1 + (i + 1) / dataLength);
        post({
            type: 'loading',
            status: loadStatus,
            workerIndex: workerIndex,
            letterIndex: letterIndex
        });
    }

    const genders = [
        { data: testData.m, gender: rn.Gender.MASCULINE, step: 1 },
        { data: testData.f, gender: rn.Gender.FEMININE, step: 2 },
        { data: testData.n, gender: rn.Gender.NEUTER, step: 3 },
        { data: testData.c, gender: rn.Gender.COMMON, step: 4 },
        { data: testData.p, gender: null, step: 5 },
    ];

    for (const { data, gender, step } of genders) {
        testCore.testGender(rne, data, testData.dict, gender, rn, mostFrequent, counters, results,
            (i, len) => onProgress(i, len, step));
    }

    post({
        type: 'testResult',
        workerIndex: workerIndex,
        letterIndex: letterIndex,
        totalCases: counters.totalCases,
        wrongCases: counters.wrongCases,
        totalWords: counters.totalWords,
        totalWordsSingular: counters.totalWordsSingular,
        wrongWordsSingular: counters.wrongWordsSingular,
        correctWordsWithWarningsSingular: counters.correctWordsWithWarningsSingular,
        pluralizeWrong: counters.pluralizeWrong,
        pluralizeTotal: counters.pluralizeTotal,
        totalCasesPluralExceptTheNominativeCase: counters.totalCasesPluralExceptTheNominativeCase,
        wrongCasesPluralExceptTheNominativeCase: counters.wrongCasesPluralExceptTheNominativeCase,
        resultForTemplate: {"items": results}
    });
}

function work(e) {
    if (e.data.type === 'init') {
        mostFrequent = new Set(e.data.mostFrequent);
        post({ type: 'ready' });
    } else if (e.data.type === 'start') {
        testData = e.data.words;
        testData.dict = testCore.knowThyself(testData.dict);

        workerIndex = e.data.workerIndex;
        letterIndex = e.data.letterIndex;

        post({
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
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    onmessage = work;
} else {
    window.sendToWorker = data => work({"data": data});
}
