
var main = function() {

var cases = [CaseDefinition.NOMINATIVE, CaseDefinition.GENITIVE, CaseDefinition.DATIVE, 
             CaseDefinition.ACCUSATIVE, CaseDefinition.INSTRUMENTAL, CaseDefinition.PREPOSITIONAL];

var dataM = [
    ['стол', 'стола', 'столу', 'стол', 'столом', 'столе']
  , ['муж', 'мужа', 'мужу', 'мужа', 'мужем', 'муже']
  
  , ['музей', 'музея', 'музею', 'музей', 'музеем', 'музее']
  , ['пролетарий', 'пролетария', 'пролетарию', 'пролетария', 'пролетарием', 'пролетарии']
  
  // адьективное склонение
  , ['лесничий', 'лесничего', 'лесничему', 'лесничего', 'лесничим', 'лесничем']
  
  , ['Георгий', 'Георгия', 'Георгию', 'Георгия', 'Георгием', 'Георгии']
  , ['Гоша', 'Гоши', 'Гоше', 'Гошу', 'Гошей', 'Гоше']
  , ['путь', 'пути', 'пути', 'путь', 'путем', 'пути']
  , ['дядя', 'дяди', 'дяде', 'дядю', 'дядей', 'дяде']
];

var dataF = [
    ['страна', 'страны', 'стране', 'страну', 'страной', 'стране']
  
  // жи, ши, шипящие
  , ['чаша', 'чаши', 'чаше', 'чашу', 'чашей', 'чаше']
  , ['ложа', 'ложи', 'ложе', 'ложу', 'ложей', 'ложе']
  , ['чаща', 'чащи', 'чаще', 'чащу', 'чащей', 'чаще']  // 4a
  , ['моча', 'мочи', 'моче', 'мочу', 'мочой', 'моче']  // 4b
  , ['туча', 'тучи', 'туче', 'тучу', 'тучей', 'туче']
  
  , ['мочь', 'мочи', 'мочи', 'мочь', 'мочью', 'мочи']
  
  // слова с основой на задненебные
  , ['рука', 'руки', 'руке', 'руку', 'рукой', 'руке']
  , ['дуга', 'дуги', 'дуге', 'дугу', 'дугой', 'дуге']
  , ['сноха', 'снохи', 'снохе', 'сноху', 'снохой', 'снохе']
  
  , ['птица', 'птицы', 'птице', 'птицу', 'птицей', 'птице']
  , ['земля', 'земли', 'земле', 'землю', 'землей', 'земле']
  , ['армия', 'армии', 'армии', 'армию', 'армией', 'армии']
  , ['соя', 'сои', 'сое', 'сою', 'соей', 'сое']
  //, ['', '', '', '', '', '']
];

var result = [];

var wrongForms = 0;
var wrongWords = 0;
var totalForms = (dataM.length + dataF.length) * 6;
var totalWords = dataM.length + dataF.length;


function test(data, gender) {
	for (var i = 0; i < data.length; i++) {
		
		var word = data[i][0];
		var expResults = data[i];
		
		var r = [];
		
		for (var j = 0; j < cases.length; j++) {
			var c = cases[j];
			var expected = expResults[j];
			
			try {
				var actual = decline(word, gender, c);
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
			}
			r.push({"expexted":expected,"actual":actual,"ok":ok,"failure":failure});
		}
		
		result.push({"wordForms":r});
	}
}

test(dataM, Gender.MASCULINE);
test(dataF, Gender.FEMININE);

var json = {"items":result};
console.log(json);

var template = $('#template').val();
var html = Mustache.to_html(template, json);
$('#result').append(html);
$('#stats').text((totalForms-wrongForms)+'/'+totalForms);

};
setTimeout(main, 500);