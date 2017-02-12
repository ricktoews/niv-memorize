angular.module('Memorize')

	.directive('passageDisplay', function() {

		return {
			restrict: 'AE',
			templateUrl: '/app/templates/passage-display.html',
			link: function(scope, el, attrs) {
console.log('passage display directive');
			}
		};
	});

