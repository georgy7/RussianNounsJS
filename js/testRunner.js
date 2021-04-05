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

        $scope.genders = Object.values(RussianNouns.Gender).sort();

        $scope.filter = {
            frequentOnly: false,
            pluraliaTantumOnly: false,
            gender: null
        };

        const abc = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split('');
        const parts = [];

        for (let i = 0; i < 7; i++) {
            parts.push(abc.slice(3 * i, 3 * i + 3));
        }

        parts.push(abc.slice(3 * 7, abc.length));

        $scope.loadingStatuses = [];
        $scope.results = [];
        $scope.completed = [];
        $scope.workers = [];

        for (let part of parts) {
            $scope.results.push([]);
            $scope.completed.push(false);

            $scope.loadingStatuses.push(
                _(part.length).times(function () {
                    return null;
                })
            );

            $scope.workers.push(new Worker('js/test.js'));
        }

        $scope.runLetter = (workerIndex, letterIndex) => {
            var worker = $scope.workers[workerIndex];
            var letter = parts[workerIndex][letterIndex];
            if (!letter) {
                throw 'Out of bound of letter list index.';
            }
            jQuery.get('opencorpora-testing/nouns_' + letter + '.json', function (words) {
                worker.postMessage({
                    type: 'start',
                    words: words,
                    workerIndex: workerIndex,
                    letterIndex: letterIndex
                });
            });
        };

        $scope.listenEvents = workerIndex => {
            $scope.workers[workerIndex].onmessage = function (e) {
                if (e.data.type === 'loading') {
                    $scope.loadingStatuses[e.data.workerIndex][e.data.letterIndex] = e.data;
                    $scope.updateLoading($scope.calculateLoading());

                } else if (e.data.type === 'testResult') {

                    console.log('{1} completed: {2} of {3} words processed.'
                        .replace('{1}', parts[e.data.workerIndex][e.data.letterIndex])
                        .replace('{2}', e.data.totalWords)
                        .replace('{3}', e.data.inputWords)
                    );

                    $scope.results[e.data.workerIndex][e.data.letterIndex] = e.data;
                    var next = e.data.letterIndex + 1;
                    if (parts[e.data.workerIndex].length > next) {
                        $scope.runLetter(e.data.workerIndex, next);
                    } else {
                        console.log(new Date(), 'Process ' + (1 + e.data.workerIndex) + ' completed');
                        $scope.completed[e.data.workerIndex] = true;
                        $scope.workers[workerIndex].terminate();
                        if ($scope.completed.every(x => x)) {
                            $scope.$apply(() => {
                                $scope.showResults();
                            });
                        }
                    }
                }
            };
        };

        $scope.wordComparableView = (word) => {
            if (word) {
                if ((word.wordForms[0]) && (typeof word.wordForms[0].expected === 'string')) {
                    return word.wordForms[0].expected;
                } else {
                    return word.pluralForms[0].expected;
                }
            } else {
                return '';
            }
        };

        $scope.showResults = () => {
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

            for (let eArray of $scope.results) {
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

                    items = items.concat(data.resultForTemplate.items);
                    itemLen += data.resultForTemplate.items.length;
                }
            }

            if (items.length !== totalWords) {
                console.error('Incorrect totalWords value.')
            }

            items.sort((a, b) => {
                const aView = $scope.wordComparableView(a);
                const bView = $scope.wordComparableView(b);
                return aView.localeCompare(bView)
            });

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                item.id = i;

                // if (item.frequent) {
                //     const w = $scope.wordComparableView(item);
                //
                //     let g = item.pluraleTantum ? 'P' : null;
                //
                //     if (!g) {
                //         switch (item.gender) {
                //             case RussianNouns.Gender.MASCULINE:
                //                 g = 'M';
                //                 break;
                //             case RussianNouns.Gender.FEMININE:
                //                 g = 'F';
                //                 break;
                //             case RussianNouns.Gender.COMMON:
                //                 g = 'C';
                //                 break;
                //             case RussianNouns.Gender.NEUTER:
                //                 g = 'N';
                //         }
                //     }
                //
                //     const f = !!item.indeclinable;
                //     const a = !!item.animate;
                //
                //     if (w && (!w.toLowerCase().endsWith('и')) && (!w.toLowerCase().endsWith('ы')) && ('P' === g)) {
                //         console.log('FREQUENT:' + w + '|' + g + '|' + f + '|' + a)
                //     }
                // }
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
        };

        $scope.wordTableMode = 1;

        $scope.setWordTableMode = value => {
            $scope.wordTableMode = value;   // It would not affect until the table reloaded.
            $scope.updateFilter();
        };

        $scope.updateFilter = () => {
            $scope.previousTopWordView = $scope.wordComparableView($scope.wordTableParams.data[0]);

            const t = $scope.wordTableParams;
            t.reload();

            const filtered = $scope.wordTableParamsLastFiltered;
            const count = t.count();

            let pageIndex = 0;

            function nextPageExists() {
                return (count * (pageIndex + 1) < filtered.length);
            }

            function lastWordViewOnThisPage() {
                return $scope.wordComparableView(filtered[count * (pageIndex + 1) - 1]);
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

        $scope.calculateLoading = () => {
            let count = 0;
            let sum = 0;
            for (var i = 0; i < $scope.loadingStatuses.length; i++) {
                var arr = $scope.loadingStatuses[i];
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j]) {
                        sum += arr[j].status;
                    }
                    count++;
                }
            }
            return sum / count;
        };

        $scope.updateLoading = (loadStatus) => {
            let barWidth = '' + Math.round(100 * loadStatus) + '%';
            jQuery('#loadingBar .status').css('width', barWidth);
        };

        console.log(new Date(), 'Start.');
        for (let w = 0; w < $scope.workers.length; w++) {
            $scope.listenEvents(w);
            $scope.runLetter(w, 0);
        }

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
