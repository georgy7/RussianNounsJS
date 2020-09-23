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

function ojejojuejuStatus(expected, actual, grCase) {

	if (grCase !== RussianNouns.cases().INSTRUMENTAL) {
		return;
	}

	const all = [
		'ой', 'ей',
		'ою', 'ею'		// This is a literary norm of the 19th century.
	];

	const suExpected = _.uniq(expected).sort();
	const suActual = _.uniq(actual).sort();


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

	let uniqExpStems = _.uniq(suExpected.map(getStem));
	let uniqActualStems = _.uniq(suActual.map(getStem));

	let expectedVowels = _.uniq(suExpected.map(getEnding).map(_.first)).sort();
	let actualVowels = _.uniq(suActual.map(getEnding).map(_.first)).sort();

	if ((uniqExpStems.length === 1)
		&& (uniqActualStems.length === 1)
		&& (uniqExpStems[0] === uniqActualStems[0])
		&& (expectedVowels.length === 1)
		&& (actualVowels.length === 1)
		&& (expectedVowels[0] === actualVowels[0])) {

		if (_.isEqual(suExpected, suActual)
			|| ((uniqExpStems[0].length >= 3) && suExpected.every(w => suActual.includes(w)))) {
			return 'valid';
		} else {
			return 'doubtful';
		}
	}
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
		for (var j = 0; j <= 6; j++) {
			var c = cases[j];
			var expected = expResults[j];
			
			try {
                var actual = RussianNouns.decline(lemma, c);
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
			if ((everyExpectedIsInActual && sameCount) || ('valid' === ojejojuejuStatus(expected, actual, c))) {
				ok = true;
				failure = false;
			} else if (('doubtful' === ojejojuejuStatus(expected, actual, c))
				|| (RussianNouns.cases().GENITIVE === c && actual[0] === expected[0])
				|| (
					[RussianNouns.cases().PREPOSITIONAL, RussianNouns.cases().LOCATIVE].includes(c)
					&& gender == RussianNouns.genders().NEUTER
					&& word.endsWith('нье')
					&& exactMatchIgnoringNjeNjiAndYo
				)
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
