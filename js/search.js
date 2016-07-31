angular.module('search_app', ['cgBusy']);

angular.module('search_app').controller('SearchController', function(
	$scope,
	$http
) {
	
	$scope.vocabularyPromise = $http.get('opencorpora/nouns_а.json').success(function (data) {
		$scope.vocabulary = data;
		console.log('v = ', $scope.vocabulary);
	}).error(function (e) {
		alert(e);
		console.log(e);
	});
	
});
