var window = self;
importScripts('third-party/underscore.js');
importScripts('RussianNouns.js');

var dataM, dataF, dataN, dataC;
var workerIndex, letterIndex;

var main = function() {

let cases = RussianNouns.caseList();

var wrongCases = 0;
var wrongWords = 0;
var correctWordsWithWarnings = 0;
var totalCases = 0;
var totalWords = 0;
var totalLoadingSteps = 5;
var result = [];

function iejieu(expected, actual, grCase) {
    if (grCase !== RussianNouns.cases().INSTRUMENTAL) {
        return false;
    }

    var uniqExp = _.uniq(expected);
    var uniqActual = _.uniq(actual);

    if ((uniqExp.length !== 1) && (uniqActual.length !== 1)) {
        return false;
	}

    const e = uniqExp[0];
    const a = uniqActual[0];

    // «-иею» в творительном падеже — устаревшая форма.
    // Но я на всякий случай не игнорирую короткие слова, т.к. там могут быть исключения.
    if (uniqActual[0].length >= 6) {

        let stemExp = e.substring(0, e.length - 3);
        let stemActual = a.substring(0, a.length - 3);

        let endingExp = e.substring(e.length - 3);
        let endingActual = a.substring(a.length - 3);

        if ((stemExp === stemActual) && ('иею' == endingExp) && ('ией' == endingActual)) {
        	return true;
		}
    }

    return false;
}

function ojejojueju(expected, actual, grCase) {
	if (grCase !== RussianNouns.cases().INSTRUMENTAL) {
		return false;
	}
	var uniqExp = _.uniq(expected);
	var uniqActual = _.uniq(actual);
	var oj = ['ой', 'ою'];
	var ej = ['ей', 'ею'];
	var ojStemsExp = [];
	var ejStemsExp = [];
	for (var i = 0, len = uniqExp.length; i < len; i++) {
		var item = uniqExp[i];
		if (item.length < 3) {
			return false;
		}
		var ending = item.substring(item.length - 2);
		var stem = item.substring(0, item.length - 2);
		if ((oj.indexOf(ending) >= 0) && (ojStemsExp.indexOf(ending) < 0)) {
			ojStemsExp.push(stem);
		} else if ((ej.indexOf(ending) >= 0) && (ejStemsExp.indexOf(ending) < 0)) {
			ejStemsExp.push(stem);
		} else {
			return false;
		}
	}
	return _.every(uniqActual, function (item) {
		if (item.length < 3) {
			return false;
		}
		var ending = item.substring(item.length - 2);
		var stem = item.substring(0, item.length - 2);
		if (oj.indexOf(ending) >= 0) {
			return ojStemsExp.indexOf(stem) >= 0;
		}
		if (ej.indexOf(ending) >= 0) {
			return ejStemsExp.indexOf(stem) >= 0;
		}
	});
}

function test(data, gender, loadingStepCompleted) {
	for (var i = 0; i < data.length; i++) {
		
		if ((i%250 == 0) || (i == (data.length - 1))) {
			var stepWidth = 1 / totalLoadingSteps;
			var loadStatus = stepWidth * (loadingStepCompleted + ((1+i) / data.length));
			postMessage({
				type: 'loading',
				status: loadStatus,
				workerIndex: workerIndex,
				letterIndex: letterIndex
			});
		}
		
		var word = data[i].cases[0][0]; // Именительный падеж
		var expResults = data[i].cases;
		
		if (data[i].g.indexOf('Pltm') >= 0) {
			continue; // PluraliaTantum is unsupported.
		}
		var animate = (data[i].g.indexOf('anim') >= 0);
		var fixed = (data[i].g.indexOf('Fixd') >= 0);
		var surname = (data[i].g.indexOf('Surn') >= 0);

		var lemma = RussianNouns.createLemma({
			text: word,
			gender: gender,
			animate: animate,
			surname: surname,
			indeclinable: fixed,
			pluraliaTantum: false
		});

		var r = [];
		totalWords++;
		totalCases += 6;
		
		var wordIsWrong = false;
		var wordHasWarning = false;
		for (var j = 0; j < 6; j++) {
			var c = cases[j];
			var expected = expResults[j];
			
			try {
                var actual = RussianNouns.decline(lemma, c);

			    if (5 === j) {
			        let locative = RussianNouns.decline(lemma, cases[6]);
			        for (const x of locative) {
			            if (!actual.includes(x)) {
			                actual.push(x);
                        }
                    }
                }

			} catch(e) {
				var actual = ['-----'];
				if (e.message !== "unsupported") throw e;
			}

			var sameCount = (_.uniq(actual).length == _.uniq(expected).length);
			var everyExpectedIsInActual = expected.every(function (e) {
				return actual.indexOf(e) >= 0;
			});
			var actualWithoutYo = actual.map(function (word) {
				return word.toLowerCase().replace(/ё/g, 'е');
			});
			var exactMatchIgnoringYo = sameCount && expected.every(function (word) {
				var yoLess = word.toLowerCase().replace(/ё/g, 'е');
				return actualWithoutYo.indexOf(yoLess) >= 0;
			});
			var exactMatchIgnoringNjeNjiAndYo = sameCount && (1 === actual.length) && (function () {
				var yoLess = expected[0].toLowerCase().replace(/ё/g, 'е');
				var actualYoLess = actual[0].toLowerCase().replace(/ё/g, 'е');
				if (!(yoLess.endsWith('нье') || yoLess.endsWith('ньи'))) {
					return false;
				}
				if (!(actualYoLess.endsWith('нье') || actualYoLess.endsWith('ньи'))) {
					return false;
				}
				return yoLess.substring(0, yoLess.length - 3) === actualYoLess.substring(0, actualYoLess.length - 3);
			})();
			
			var warning = false;
			var ok, failure;
			if (everyExpectedIsInActual && sameCount) {
				ok = true;
				failure = false;
			} else if ((everyExpectedIsInActual && ojejojueju(expected, actual, c))
				|| iejieu(expected, actual, c)
				|| (RussianNouns.cases().GENITIVE === c && actual[0] === expected[0])
				|| (RussianNouns.cases().PREPOSITIONAL == c && gender == RussianNouns.genders().NEUTER && word.endsWith('нье') && exactMatchIgnoringNjeNjiAndYo)
				|| exactMatchIgnoringYo) {
				ok = false;
				failure = false;
				warning = true;
				wordHasWarning = true;
			} else {
				ok = false;
				failure = true;
				wrongCases++;
				wordIsWrong = true;
			}
			r.push({
				"expected": expected.join(', '),
				"actual": actual.join(', '),
				"ok": ok,
				"failure": failure,
				"warning": warning,
				"failureOrWarning": (failure || warning)
			});
		}

		let wordStatus;

		if (wordIsWrong) {
			wrongWords++;
			wordStatus = 'wrong';
		} else if (wordHasWarning) {
			correctWordsWithWarnings++;
			wordStatus = 'hasWarnings';
		} else {
			wordStatus = 'correct';
		}

		var declension = '';
		try {
			declension = RussianNouns.getDeclension(lemma);
		} catch (e) {}

		result.push({
			"rowNumber": (result.length + 1),
			"wordForms": r,
			"gender": gender,
			"declension": declension,
			"status": wordStatus
		});
	}
}

test(dataM, RussianNouns.genders().MASCULINE, 1);
test(dataF, RussianNouns.genders().FEMININE, 2);
test(dataN, RussianNouns.genders().NEUTER, 3);
test(dataC, RussianNouns.genders().COMMON, 4);

postMessage({
	type: 'testResult',
	workerIndex: workerIndex,
	letterIndex: letterIndex,
	totalCases: totalCases,
	wrongCases: wrongCases,
	totalWords: totalWords,
	wrongWords: wrongWords,
	correctWordsWithWarnings: correctWordsWithWarnings,
	resultForTemplate: {"items":result}
});

};

onmessage = function(e) {
	if (e.data.type === 'start') {
		var words = e.data.words;
		workerIndex = e.data.workerIndex;
		letterIndex = e.data.letterIndex;
		postMessage({type:'started', wordsLen:words.length});
		dataM = [];
		dataF = [];
		dataN = [];
		dataC = [];
		for (var wordIndex = 0, wLen = words.length; wordIndex < wLen; wordIndex++) {
			var lemmaList = words[wordIndex];
			for (var lemmaIndex = 0, lemmaListLen = lemmaList.length; lemmaIndex < lemmaListLen; lemmaIndex++) {
				var lemma = lemmaList[lemmaIndex];
				if (lemma.g.indexOf('masc') >= 0) {
					dataM.push(lemma);
				} else if (lemma.g.indexOf('femn') >= 0) {
					dataF.push(lemma);
				} else if (lemma.g.indexOf('neut') >= 0) {
					dataN.push(lemma);
				} else if (lemma.g.indexOf('Ms-f') >= 0) {
					dataC.push(lemma);
				}
			}
		}
		main();
	}
};
