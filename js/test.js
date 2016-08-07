var dataM = [];
var dataF = [];
var dataN = [];
var dataC = [];

var main = function() {

var russianNouns = new RussianNouns()

var cases = [Case.NOMINATIVE, Case.GENITIVE, Case.DATIVE, 
             Case.ACCUSATIVE, Case.INSTRUMENTAL, Case.PREPOSITIONAL];

var result = [];

var wrongForms = 0;
var wrongWords = 0;
var totalCases = 0;
var totalWords = 0;


function test(data, gender) {
	for (var i = 0; i < data.length; i++) {
		
		var word = data[i].name;
		var expResults = data[i].cases;
		
		if (data[i].g.indexOf('Pltm') >= 0) {
			continue; // PluraliaTantum is unsupported.
		}
		var animate = (data[i].g.indexOf('anim') >= 0);
		var fixed = (data[i].g.indexOf('Fixd') >= 0);
		var lemma = {
			"text": function () { return word; },
			"gender": function () { return gender; },
			"isAnimate": function () { return animate; },
			"isIndeclinable": function () { return fixed; },
			"isPluraliaTantum": function () { return false; }
		};
		
		var r = [];
		totalWords++;
		totalCases += 6;
		
		var wordIsWrong = false;
		for (var j = 0; j < cases.length; j++) {
			var c = cases[j];
			var expected = expResults[j][0];
			
			try {
				var actual = russianNouns.decline(lemma, c);
			} catch(e) {
				var actual = '-----';
				if (e.message !== "unsupported") throw e;
			}
			if (actual == expected) {
				var ok = true;
				var failure = false;
			} else {
				var ok = false;
				var failure = true;
				wrongForms++;
				wordIsWrong = true;
			}
			r.push({"expexted":expected,"actual":actual,"ok":ok,"failure":failure});
		}
		
		if (wordIsWrong) {
			wrongWords++;
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
		
		
		result.push({"wordForms":r,"gender":g, "genderColor":gbg, "declension":declension, "dColor":dColor});
	}
}

test(dataM, Gender.MASCULINE);
test(dataF, Gender.FEMININE);
test(dataN, Gender.NEUTER);
test(dataC, Gender.COMMON);

var json = {"items":result};
// console.log(json);

var template = $('#template').val();
var html = Mustache.to_html(template, json);
$('#result').append(html);
$('#stats .content').text(
	(totalCases-wrongForms)+'/'+totalCases + ' (' + ((totalCases-wrongForms)/totalCases*100).toFixed(2) + '%)'
);
$('#statsWords .content').text(
	(totalWords-wrongWords)+'/'+totalWords + ' (' + ((totalWords-wrongWords)/totalWords*100).toFixed(2) + '%)'
);

};

jQuery.get('opencorpora-testing/nouns_singular_а.json', function (words) {
	jQuery.each(words, function (wordIndex, lemmaList) {
		jQuery.each(lemmaList, function (lemmaIndex, lemma) {
			if (lemma.g.indexOf('masc') >= 0) {
				dataM.push(lemma);
			} else if (lemma.g.indexOf('femn') >= 0) {
				dataF.push(lemma);
			} else if (lemma.g.indexOf('neut') >= 0) {
				dataN.push(lemma);
			} else if (lemma.g.indexOf('Ms-f') >= 0) {
				dataC.push(lemma);
			}
		});
	});
	main();
});
