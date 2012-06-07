
var main = function() {

var cases = [CaseDefinition.NOMINATIVE, CaseDefinition.GENITIVE, CaseDefinition.DATIVE, 
             CaseDefinition.ACCUSATIVE, CaseDefinition.INSTRUMENTAL, CaseDefinition.PREPOSITIONAL];

var dataM = [
    ['стол', 'стола', 'столу', 'стол', 'столом', 'столе']
  , ['музей', 'музея', 'музею', 'музей', 'музеем', 'музее']
  , ['лесничий', 'лесничего', 'лесничему', 'лесничего', 'лесничим', 'лесничем']
];

var data = dataM;
var gender = Gender.MASCULINE;
var result = [];

for (var i = 0; i < data.length; i++) {
	
	var word = data[i][0];
	var expResults = data[i];
	
	var r = [];
	
	for (var j = 0; j < cases.length; j++) {
		var c = cases[j];
		var expected = expResults[j];
		var actual = decline(word, gender, c);
		if (actual == expected) {
			var ok = true;
			var failure = false;
		} else {
			var ok = false;
			var failure = true;
		}
		r.push({"expexted":expected,"actual":actual,"ok":ok,"failure":failure});
	}
	
	result.push({"wordForms":r});
}

var json = {"items":result};
console.log(json);

var template = $('#template').val();
var html = Mustache.to_html(template, json);
$('#result').append(html);


};
setTimeout(main, 1000);