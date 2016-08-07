
var worker = new Worker('js/test.js');
worker.onmessage = function(e) {
	if (e.data.type === 'loading') {
		jQuery('#loadingBar .status').css('width', e.data.status);
	} else if (e.data.type === 'testResult') {
		var totalCases = e.data.totalCases;
		var wrongCases = e.data.wrongCases;
		var totalWords = e.data.totalWords;
		var wrongWords = e.data.wrongWords;
		var template = jQuery('#template').val();
		var html = Mustache.to_html(template, e.data.resultForTemplate);
		jQuery('#result').append(html);
		jQuery('#loadingBar').hide();
		jQuery('#stats .content').text(
			(totalCases-wrongCases)+'/'+totalCases + ' (' + ((totalCases-wrongCases)/totalCases*100).toFixed(2) + '%)'
		);
		jQuery('#statsWords .content').text(
			(totalWords-wrongWords)+'/'+totalWords + ' (' + ((totalWords-wrongWords)/totalWords*100).toFixed(2) + '%)'
		);
	}
};

jQuery(document).ready(function () {
	jQuery.get('opencorpora-testing/nouns_singular_а.json', function (words) {
		worker.postMessage({"type":'start', "words":words});
	});
});
