angular.module('search_app', ['cgBusy']);

angular.module('search_app').controller('SearchController', function(
	$scope,
	$http
) {
	
	$scope.showError = function (response) {
		alert(e);
		console.log(e);
	};

	$scope.wordExplanation = null;
	
	$scope.search = function () {
		if (!$scope.word || $scope.word.length < 1) {
			$scope.wordExplanation = null;
			return;
		}
		$scope.loadVocabulary($scope.word[0].toLowerCase()).then(function () {
			$scope.wordExplanation = $scope.vocabulary[$scope.word];
		});
	};

	$scope.loadVocabulary = function (letter) {
		var promise = $http.get('opencorpora/nouns_' + letter + '.json', {cache: true}).then(function (response) {
			$scope.vocabulary = response.data;
		}, function (response) {
			if (404 != response.status) {
				$scope.showError(response);
			} else {
				$scope.vocabulary = {};
			}
		});
		$scope.vocabularyPromise = promise;
		return promise;
	};
	
});
