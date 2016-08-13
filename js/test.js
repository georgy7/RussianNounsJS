var window = self;
importScripts('third-party/underscore.js');
importScripts('third-party/Snowball.js');
importScripts('RussianNouns.js');

var dataM = [];
var dataF = [];
var dataN = [];
var dataC = [];

var main = function() {

var russianNouns = new RussianNouns()

var cases = [Case.NOMINATIVE, Case.GENITIVE, Case.DATIVE, 
             Case.ACCUSATIVE, Case.INSTRUMENTAL, Case.PREPOSITIONAL];

var result = [];

var wrongCases = 0;
var wrongWords = 0;
var correctWordsWithWarnings = 0;
var totalCases = 0;
var totalWords = 0;
var totalLoadingSteps = 5;

function ojejojueju(expected, actual, grCase) {
	if (grCase !== Case.INSTRUMENTAL) {
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
		
		if ((i%200 == 0) || (i == (data.length - 1))) {
			var stepWidth = 1 / totalLoadingSteps;
			var loadStatus = stepWidth * (loadingStepCompleted + ((1+i) / data.length));
			var barWidth = '' + Math.round(100 * loadStatus) + '%';
			postMessage({type:'loading', status:barWidth});
		}
		
		var word = data[i].cases[0][0]; // Именительный падеж
		var expResults = data[i].cases;
		
		if (data[i].g.indexOf('Pltm') >= 0) {
			continue; // PluraliaTantum is unsupported.
		}
		var animate = (data[i].g.indexOf('anim') >= 0);
		var fixed = (data[i].g.indexOf('Fixd') >= 0);
		var surname = (data[i].g.indexOf('Surn') >= 0);
		var lemma = {
			"text": function () { return word; },
			"gender": function () { return gender; },
			"isAnimate": function () { return animate; },
			"isSurname": function () { return surname; },
			"isIndeclinable": function () { return fixed; },
			"isPluraliaTantum": function () { return false; }
		};
		
		var r = [];
		totalWords++;
		totalCases += 6;
		
		var wordIsWrong = false;
		var wordHasWarning = false;
		for (var j = 0; j < cases.length; j++) {
			var c = cases[j];
			var expected = expResults[j];
			
			try {
				var actual = russianNouns.decline(lemma, c);
			} catch(e) {
				var actual = ['-----'];
				if (e.message !== "unsupported") throw e;
			}
			var everyExpectedIsInActual = expected.every(function (e) {
				return actual.indexOf(e) >= 0;
			});
			
			var warning = false;
			var ok, failure;
			if (everyExpectedIsInActual && (_.uniq(actual).length == _.uniq(expected).length)) {
				ok = true;
				failure = false;
			} else if (everyExpectedIsInActual && ojejojueju(expected, actual, c)) {
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
				"expexted": expected.join(', '),
				"actual": actual.join(', '),
				"ok": ok,
				"failure": failure,
				"warning": warning,
				"failureOrWarning": (failure || warning)
			});
		}
		
		if (wordIsWrong) {
			wrongWords++;
		} else if (wordHasWarning) {
			correctWordsWithWarnings++;
		} else {
			continue;
		}
		
		if (gender == Gender.MASCULINE) { var g = 'мужской'; var gbg = "#df5" }
		if (gender == Gender.FEMININE) { var g = 'женский'; var gbg = "#9f5" }
		if (gender == Gender.NEUTER) { var g = 'средний'; var gbg = "#f59" }
		if (gender == Gender.COMMON) { var g = 'общий'; }
		
		var declension = '';
		try {
			var declension = russianNouns.getDeclension(lemma);
		} catch (e) {}
		
		if (declension === '') { var dColor = '#999999'; }
		else if (declension === 1) { var dColor = '#3ef481'; }
		else if (declension === 2) { var dColor = '#96f43e'; }
		else if (declension === 3) { var dColor = '#f3f43e'; }
		else { var dColor = '#fff'; }
		
		
		result.push({
			"rowNumber": (result.length + 1),
			"wordForms": r,
			"gender": g,
			"genderColor": gbg,
			"declension": declension,
			"correctWithWarnings": (!wordIsWrong && wordHasWarning),
			"dColor": dColor
		});
	}
}

test(dataM, Gender.MASCULINE, 1);
test(dataF, Gender.FEMININE, 2);
test(dataN, Gender.NEUTER, 3);
test(dataC, Gender.COMMON, 4);

postMessage({
	type: 'testResult',
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
		postMessage({type:'started', wordsLen:words.length});
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
