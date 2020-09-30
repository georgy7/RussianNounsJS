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

        $scope.genders = Object.values(RussianNouns.genders()).sort();

        $scope.filter = {
            gender: null
        };

        const abc = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split('');
        const parts = [];
        parts.push(abc.slice(0, 5));
        parts.push(abc.slice(5, 12));
        parts.push(abc.slice(12, 18));
        parts.push(abc.slice(18, abc.length));

        $scope.loadingStatuses = [
            _(parts[0].length).times(function () {
                return null;
            }),
            _(parts[1].length).times(function () {
                return null;
            }),
            _(parts[2].length).times(function () {
                return null;
            }),
            _(parts[3].length).times(function () {
                return null;
            })
        ];

        $scope.results = [[], [], [], []];
        $scope.completed = [false, false, false, false];

        $scope.workers = [];
        $scope.workers.push(new Worker('js/test.js'));
        $scope.workers.push(new Worker('js/test.js'));
        $scope.workers.push(new Worker('js/test.js'));
        $scope.workers.push(new Worker('js/test.js'));

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
                return word.wordForms[0].expected;
            } else {
                return '';
            }
        };

        $scope.showResults = () => {
            console.log(new Date(), 'Finish.');
            let totalCases = 0;
            let wrongCases = 0;
            let totalWords = 0;
            let correctWordsWithWarningsSingular = 0;
            let wrongWordsSingular = 0;
            let items = [];

            let pluralizeWrong = 0;
            let pluralizeTotal = 0;

            let itemLen = 0;

            for (let eArray of $scope.results) {
                for (let data of eArray) {
                    totalCases += data.totalCases;
                    wrongCases += data.wrongCases;
                    totalWords += data.totalWords;
                    correctWordsWithWarningsSingular += data.correctWordsWithWarningsSingular;
                    wrongWordsSingular += data.wrongWordsSingular;

                    pluralizeWrong += data.pluralizeWrong;
                    pluralizeTotal += data.pluralizeTotal;

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
            }

            $scope.items = items;
            $scope.wordTableParams.reload();

            $scope.wordsCorrectSingular = totalWords - wrongWordsSingular;
            $scope.wordsTotal = totalWords;
            $scope.wordsCorrectSingularShare = $scope.wordsCorrectSingular / $scope.wordsTotal * 100;

            $scope.wordFormsCorrect = totalCases - wrongCases;
            $scope.wordFormsTotal = totalCases;
            $scope.wordFormsCorrectShare = $scope.wordFormsCorrect / $scope.wordFormsTotal * 100;

            $scope.pluralizeCorrectWords = pluralizeTotal - pluralizeWrong;
            $scope.pluralizeTotalWords = pluralizeTotal;
            $scope.pluralizeCorrectShare = $scope.pluralizeCorrectWords / $scope.pluralizeTotalWords * 100;

            $scope.wordsHasWarningsSingular = correctWordsWithWarningsSingular;
            $scope.wordsHasWarningsSingularShare = correctWordsWithWarningsSingular / totalWords * 100;
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

                if ($scope.filter.gender) {
                    result = result.filter(item => ($scope.filter.gender === item.gender));
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
