	angular.module('Memorize')
	.controller('PassageCtrl', function($scope, getPassage) {
		getPassage.get(ref).then((data) => {
			$scope.passage = data;
		});

	});


