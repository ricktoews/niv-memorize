angular.module('Memorize')
	.controller('PassageCtrl', function($scope, getPassage, $state) {
		$scope.state = 'presenting';
		$scope.ref = ref; // Initialize first time.
console.log('beginning of PassageCtrl');
		function loadPassage() {
			getPassage.get($scope.ref).then((data) => {
				$scope.passage = data;
			});
		}

		loadPassage();

/*
		$scope.$watch('ref', function() {
console.log('watch ref', arguments);
$state.go('lookup');
			loadPassage();
		});

		$scope.$watch('state', function() {
console.log('watch state', arguments);
		});
*/
	});


