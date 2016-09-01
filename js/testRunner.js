
var abc = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split('');
var parts = [];
parts.push(abc.slice(0, 5));
parts.push(abc.slice(5, 12));
parts.push(abc.slice(12, 18));
parts.push(abc.slice(18, abc.length));

/*
var abc = "клмнопрсту".split('');
var parts = [];
parts.push(abc.slice(0, 2));
parts.push(abc.slice(2, 4));
parts.push(abc.slice(4, 7));
parts.push(abc.slice(7, abc.length));
*/

if (tmini) {
        parts[0] = "к";
        parts[1] = "м";
        parts[2] = "о";
        parts[3] = "с";
}

var loadingStatuses = [
	_(parts[0].length).times(function(){ return null; }),
	_(parts[1].length).times(function(){ return null; }),
	_(parts[2].length).times(function(){ return null; }),
	_(parts[3].length).times(function(){ return null; })
];
var results = [[], [], [], []];
var completed = [false, false, false, false];

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
			console.log('' + parts[e.data.workerIndex][e.data.letterIndex] + ' completed');
			results[e.data.workerIndex][e.data.letterIndex] = e.data;
			var next = e.data.letterIndex + 1;
			if (parts[e.data.workerIndex].length > next) {
				runLetter(e.data.workerIndex, next);
			} else {
				console.log(new Date(), 'Process ' + (1 + e.data.workerIndex) + ' completed');
				completed[e.data.workerIndex] = true;
				if (completed.every(function (e) { return e; })) {
					showResults();
				}
			}
		}
	};
}

function showResults() {
	console.log(new Date(), 'Finish.');
	var totalCases = 0;
	var wrongCases = 0;
	var totalWords = 0;
	var correctWordsWithWarnings = 0;
	var wrongWords = 0;
	var items = [];
	
	jQuery.each(results, function (index, eArray) {
		jQuery.each(eArray, function (index2, data) {
			totalCases += data.totalCases;
			wrongCases += data.wrongCases;
			totalWords += data.totalWords;
			correctWordsWithWarnings += data.correctWordsWithWarnings;
			wrongWords += data.wrongWords;
			items = items.concat(data.resultForTemplate.items)
		});
	});
	
	var template = jQuery('#template').val();
	var html = Mustache.to_html(template, {"items": items});
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
	console.log(new Date(), 'Start.');
	for (var i = 0; i < workers.length; i++) {
		listenEvents(i);
		runLetter(i, 0);
	}
});
