(function () {

    let app = angular.module('testApp', [
        'ngTable'
    ]);

    //--------------------------------------------------------

    app.controller('TestRunnerController', TestRunnerController);

    TestRunnerController.$inject = [
        '$scope',
        'NgTableParams'
    ];

    function TestRunnerController(
        $scope,
        NgTableParams
    ) {

        $scope.genders = ['женский', 'мужской', 'общий', 'средний'];

        $scope.filter = {
            frequentOnly: true,
            pluraliaTantumOnly: false,
            gender: null
        };

        function wordComparableView(word) {
            if (word) {
                if ((word.wordForms[0]) && (typeof word.wordForms[0].expected === 'string')) {
                    return word.wordForms[0].expected;
                } else {
                    return word.pluralForms[0].expected;
                }
            } else {
                return '';
            }
        }

        (() => {
            const abc = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split('');
            const parts = [];

            const partCount = 4;
            const chunkSize = Math.floor(abc.length / partCount);

            for (let i = 0; i < (partCount-1); i++) {
                parts.push(abc.slice(i * chunkSize, (i+1) * chunkSize));
            }

            parts.push(abc.slice((partCount-1) * chunkSize, abc.length));

            const loadingStatuses = [];
            const jsonPromises = [];

            const results = [];
            const completed = [];
            const workers = [];

            for (let part of parts) {
                results.push([]);
                completed.push(false);

                loadingStatuses.push(
                    Array(part.length).fill(null)
                );

                workers.push(new Worker('js/test2.js', {"type": "module"}));
                jsonPromises.push([]);
            }

            const listenLetterPromise = (workerIndex, letterIndex) => {
                if (jsonPromises[workerIndex].length <= letterIndex) {
                    setTimeout(() => { listenLetterPromise(workerIndex, letterIndex) }, 100);
                    return;
                }

                var worker = workers[workerIndex];
                jsonPromises[workerIndex][letterIndex].then(response => response.json()).then(words => {
                    worker.postMessage({
                        type: 'start',
                        words: words,
                        workerIndex: workerIndex,
                        letterIndex: letterIndex
                    });
                });
            };

            const calculateLoading = () => {
                let count = 0;
                let sum = 0;
                for (var i = 0; i < loadingStatuses.length; i++) {
                    var arr = loadingStatuses[i];
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j]) {
                            sum += arr[j].status;
                        }
                        count++;
                    }
                }
                return sum / count;
            };

            const updateLoading = (loadStatus) => {
                const statusTag = document.querySelector('#loadingBar .status');
                const percentTag = document.querySelector('#loadingBar .status .percent');
                percentTag.classList.remove('beginning');

                if (statusTag) {
                    let barWidth = '' + Math.round(100 * loadStatus) + '%';
                    statusTag.style.width = barWidth;
                    percentTag.innerText = barWidth;
                }
            };

            const listenEvents = workerIndex => {
                workers[workerIndex].onmessage = function (e) {
                    if (e.data.type === 'ready') {

                        function load(theLetter) {
                            jsonPromises[workerIndex].push(
                                fetch('opencorpora-testing/nouns_' + theLetter + '.json'));
                        }

                        // Я пробовал делать через приоритеты.
                        // Там проблема в том, что low - он как будто глобально low,
                        // не только на моей вкладке.
                        // В общем, у меня только через setTimeout получилось сделать так,
                        // чтобы при большом пинге быстро появлялась строка загрузки.
                        const loadChunk = 3;
                        const loadDelay = 500;

                        const part = parts[workerIndex];

                        for (let li = 0; li < part.length; li += loadChunk) {
                            if (0 === li) {
                                for (let letter of part.slice(li, li + loadChunk)) {
                                    load(letter);
                                }
                                listenLetterPromise(workerIndex, 0);
                            } else {
                                setTimeout(() => {
                                    for (let letter of part.slice(li, li + loadChunk)) {
                                        load(letter);
                                    }
                                }, Math.floor(1 + li/loadChunk) * loadDelay);
                            }
                        }

                    } else if (e.data.type === 'loading') {
                        loadingStatuses[e.data.workerIndex][e.data.letterIndex] = e.data;
                        updateLoading(calculateLoading());

                    } else if (e.data.type === 'testResult') {

                        console.log('{1} completed: {2} words processed.'
                            .replace('{1}', parts[e.data.workerIndex][e.data.letterIndex])
                            .replace('{2}', e.data.totalWords)
                        );

                        results[e.data.workerIndex][e.data.letterIndex] = e.data;
                        var next = e.data.letterIndex + 1;
                        if (parts[e.data.workerIndex].length > next) {
                            listenLetterPromise(e.data.workerIndex, next);
                        } else {
                            console.log(new Date(), 'Process ' + (1 + e.data.workerIndex) + ' completed');
                            completed[e.data.workerIndex] = true;
                            workers[workerIndex].terminate();
                            if (completed.every(x => x)) {
                                $scope.$apply(() => {
                                    showResults();
                                });
                            }
                        }
                    }
                };
            };

            function showResults() {
                console.log(new Date(), 'Finish.');
                let totalCases = 0;
                let wrongCases = 0;
                let totalWords = 0;
                let totalWordsSingular = 0;
                let correctWordsWithWarningsSingular = 0;
                let wrongWordsSingular = 0;
                let items = [];

                let pluralizeWrong = 0;
                let pluralizeTotal = 0;

                let totalCasesPluralExceptTheNominativeCase = 0;
                let wrongCasesPluralExceptTheNominativeCase = 0;

                let itemLen = 0;

                for (let eArray of results) {
                    for (let data of eArray) {
                        totalCases += data.totalCases;
                        wrongCases += data.wrongCases;
                        totalWords += data.totalWords;
                        totalWordsSingular += data.totalWordsSingular;
                        correctWordsWithWarningsSingular += data.correctWordsWithWarningsSingular;
                        wrongWordsSingular += data.wrongWordsSingular;

                        pluralizeWrong += data.pluralizeWrong;
                        pluralizeTotal += data.pluralizeTotal;

                        totalCasesPluralExceptTheNominativeCase += data.totalCasesPluralExceptTheNominativeCase;
                        wrongCasesPluralExceptTheNominativeCase += data.wrongCasesPluralExceptTheNominativeCase;

                        items.push(data.resultForTemplate.items);
                        itemLen += data.resultForTemplate.items.length;
                    }
                }

                items = [].concat(...items);

                if (items.length !== totalWords) {
                    console.error('Incorrect totalWords value.')
                }

                items.sort((a, b) => {
                    const aView = wordComparableView(a);
                    const bView = wordComparableView(b);
                    return aView.localeCompare(bView)
                });

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    item.id = i;
                }

                $scope.items = items;
                $scope.wordTableParams.reload();

                $scope.wordsTotal = totalWords;

                $scope.wordsCorrectSingular = totalWordsSingular - wrongWordsSingular;
                $scope.totalWordsSingular = totalWordsSingular;
                $scope.wordsCorrectSingularShare = $scope.wordsCorrectSingular / $scope.totalWordsSingular * 100;

                $scope.wordFormsCorrect = totalCases - wrongCases;
                $scope.wordFormsTotal = totalCases;
                $scope.wordFormsCorrectShare = $scope.wordFormsCorrect / $scope.wordFormsTotal * 100;

                $scope.pluralizeCorrectWords = pluralizeTotal - pluralizeWrong;
                $scope.pluralizeTotalWords = pluralizeTotal;
                $scope.pluralizeCorrectShare = $scope.pluralizeCorrectWords / $scope.pluralizeTotalWords * 100;

                $scope.pluralWordFormsCorrect =
                    totalCasesPluralExceptTheNominativeCase - wrongCasesPluralExceptTheNominativeCase;
                $scope.pluralWordFormsTotal = totalCasesPluralExceptTheNominativeCase;
                $scope.pluralWordFormsCorrectShare = $scope.pluralWordFormsCorrect / $scope.pluralWordFormsTotal * 100;

                $scope.wordsHasWarningsSingular = correctWordsWithWarningsSingular;
                $scope.wordsHasWarningsSingularShare = correctWordsWithWarningsSingular / totalWordsSingular * 100;
            }

            console.log(new Date(), 'Start.');
            for (let w = 0; w < workers.length; w++) {
                listenEvents(w);
            }
        })();


        $scope.wordTableMode = 1;

        $scope.setWordTableMode = value => {
            $scope.wordTableMode = value;   // It would not affect until the table reloaded.
            $scope.updateFilter();
        };

        $scope.updateFilter = () => {
            $scope.previousTopWordView = wordComparableView($scope.wordTableParams.data[0]);

            const t = $scope.wordTableParams;
            t.reload();

            const filtered = $scope.wordTableParamsLastFiltered;
            const count = t.count();

            let pageIndex = 0;

            function nextPageExists() {
                return (count * (pageIndex + 1) < filtered.length);
            }

            function lastWordViewOnThisPage() {
                return wordComparableView(filtered[count * (pageIndex + 1) - 1]);
            }

            while (nextPageExists() && (lastWordViewOnThisPage().localeCompare($scope.previousTopWordView) < 0)) {
                pageIndex++;
            }

            const pageNumber = pageIndex + 1;
            const lastPageNumber = Math.floor(Math.max(0, t.total() - 1) / t.count()) + 1;

            if (pageNumber > lastPageNumber) {
                console.warn('Page number correction from {1} to {2}.'
                    .replace('{1}', pageNumber)
                    .replace('{2}', lastPageNumber));
                t.page(lastPageNumber);
            } else {
                t.page(pageNumber);
            }
        };

        $scope.filterWords = () => {
            let result = [];

            if ($scope.items && $scope.items.length) {

                if (1 === $scope.wordTableMode) {
                    result = $scope.items;
                } else if (2 === $scope.wordTableMode) {
                    result = $scope.items.filter(a => ['hasWarnings', 'wrong'].includes(a.status));
                } else {
                    result = $scope.items.filter(a => ['wrong'].includes(a.status));
                }

                if ($scope.filter.pluraliaTantumOnly) {
                    result = result.filter(item => (!!item.pluraleTantum));
                } else if ($scope.filter.gender) {
                    result = result.filter(item => ($scope.filter.gender === item.gender));
                }

                if ($scope.filter.frequentOnly) {
                    result = result.filter(item => item.frequent);
                }
            }

            $scope.wordTableParamsLastFiltered = result;
            return result;
        };

        $scope.wordTableParams = new NgTableParams({
            page: 1,
            count: 3
        }, {
            total: 0,
            counts: [3, 5, 10, 25, 100, 1000],
            getData: (params) => {
                const filtered = $scope.filterWords();
                params.total(filtered.length);

                const start = (params.page() - 1) * params.count();
                const stop = start + params.count();

                return filtered.slice(start, stop);
            }
        });

        $scope.genderColor = (item) => {
            if (!item.gender) {
                return "#fff";
            }
            const g = item.gender.toLowerCase();
            if (g.startsWith('м')) {
                return "#df5";
            }
            if (g.startsWith('ж')) {
                return "#9f5";
            }
            if (g.startsWith('с')) {
                return "#f59";
            }
            return "#bfbfbf";
        };

        $scope.declensionColor = (item) => {
            const d = item.declension;
            if (d === '') {
                return '#999999';
            }
            if (d === 1) {
                return '#3ef481';
            }
            if (d === 2) {
                return '#96f43e';
            }
            if (d === 3) {
                return '#f3f43e';
            }
            return 'transparent';
        };
    }
})();
