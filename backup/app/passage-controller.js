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

	});


