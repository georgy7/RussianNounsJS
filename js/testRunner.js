
var abc = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split('');

var parts = [];
parts.push(abc.slice(0, 8));
parts.push(abc.slice(8, 16));
parts.push(abc.slice(16, 24));
parts.push(abc.slice(24, abc.length));

var loadingStatuses = [
	_(parts[0].length).times(function(){ return null; }),
	_(parts[1].length).times(function(){ return null; }),
	_(parts[2].length).times(function(){ return null; }),
	_(parts[3].length).times(function(){ return null; })
];
var results = [[], [], [], []];

var workers = [];
workers.push(new Worker('js/test.js'));
workers.push(new Worker('js/test.js'));
workers.push(new Worker('js/test.js'));
workers.push(new Worker('js/test.js'));

function runLetter(workerIndex, letterIndex) {
	var worker = workers[workerIndex];
	var letter = parts[workerIndex][letterIndex];
	if (!letter) {
		throw 'Out of bound of letter list index.';
	}
	jQuery.get('opencorpora-testing/nouns_singular_' + letter + '.json', function (words) {
		worker.postMessage({
			type: 'start',
			words: words,
			workerIndex: workerIndex,
			letterIndex: letterIndex
		});
	});
}

function listenEvents(workerIndex) {
	workers[workerIndex].onmessage = function(e) {
		if (e.data.type === 'loading') {
			loadingStatuses[e.data.workerIndex][e.data.letterIndex] = e.data;
			updateLoading(calculateLoading());
		} else if (e.data.type === 'testResult') {
			console.log(e.data);
		}
	};
}

/*
function showResults() {
	var totalCases = 0;
	var wrongCases = 0;
	var totalWords = 0;
	var correctWordsWithWarnings = 0;
	var wrongWords = 0;
	
	jQuery.each(results, function (eArray) {
		jQuery.each(eArray, function (e) {
			totalCases += e.data.totalCases;
			wrongCases += e.data.wrongCases;
			totalWords += e.data.totalWords;
			correctWordsWithWarnings += e.data.correctWordsWithWarnings;
			wrongWords += e.data.wrongWords;
		});
	});
	
	var template = jQuery('#template').val();
	var html = Mustache.to_html(template, e.data.resultForTemplate);
	jQuery('#result').append(html);
	jQuery('#loadingBar').hide();
	jQuery('#stats .content').text(
		(totalCases-wrongCases)+'/'+totalCases + ' (' + ((totalCases-wrongCases)/totalCases*100).toFixed(2) + '%)'
	);
	jQuery('#stats .correctWordsWithWarnings').text(
		correctWordsWithWarnings+'/'+totalWords + ' (' + (correctWordsWithWarnings/totalWords*100).toFixed(2) + '%)'
	);
	jQuery('#statsWords .content').text(
		(totalWords-wrongWords)+'/'+totalWords + ' (' + ((totalWords-wrongWords)/totalWords*100).toFixed(2) + '%)'
	);
	jQuery('.resultControls').show();
}
*/

function calculateLoading() {
	var count = 0;
	var sum = 0;
	for (var i = 0; i < loadingStatuses.length; i++) {
		var arr = loadingStatuses[i];
		for (var j = 0; j < arr.length; j++) {
			if (arr[j]) {
				sum += arr[j].status;
			}
			count++;
		}
	}
	return sum/count;
}
function updateLoading(loadStatus) {
	var barWidth = '' + Math.round(100 * loadStatus) + '%';
	jQuery('#loadingBar .status').css('width', barWidth);
}

jQuery(document).ready(function () {
	for (var i = 0; i < workers.length; i++) {
		listenEvents(i);
		runLetter(i, 0);
	}
});
