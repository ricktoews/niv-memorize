var text_table = 'bible_niv';

angular.module('Memorize', ['ui.router', 'ngCacheBuster'])

.run(($rootScope, $templateCache) => {
	$rootScope.$on('$viewContentLoaded', () => {
		$templateCache.removeAll();
	});
})

.value('text_table', text_table)
.value('restBase', '//memorize.toewsweb.net/rest.php')

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('memorize', {
			url: '',
			abstract: true
		})

		.state('memorize.main', {
			url: '/main',
			views: {
				'passage@': {
					controller: 'MainCtrl',
					templateUrl: 'app/templates/layout.tmpl.html'
				}
			}
		})

		.state('memorize.lookup', {
			url: '/lookup/:ref',
			views: {
				'lookup@': {
					controller: 'DisplayCtrl',
					templateUrl: 'app/passage-display/passage-text.tmpl.html'
				}
			}
		})

		.state('memorize.rand-verse', {
			url: '/rand-verse/:ref',
			views: {
				'rand-verse@': {
					controller: 'RandVerseCtrl',
					templateUrl: 'app/passage-display/random-verse.tmpl.html'
				}
			}
		})
	;

	$urlRouterProvider.otherwise('/main');
})

.controller('MainCtrl', function($scope, $state) {
	$scope.requestPassage = function(evt) {
		var ref = evt.currentTarget.value.replace(/ /g, '-');
		$state.go('memorize.lookup', { ref: ref });
	};
})

.controller('DisplayCtrl', function($scope, $state, getPassage, PassageParseHelper) {
	var ref = $state.params['ref'];
	var parts = ref.split('-');
	var passage = {
		book: parts[0],
		chapter: parts[1]
	};

	$scope.passageLabel = parts[0] + ' ' + parts[1];

	$scope.getKey = function(evt) {
	};

	$scope.checkEntry = function(evt) {
		var el = evt.currentTarget;
		var verseRef = el.getAttribute('data-verse');
		var enteredText = el.textContent;
		evaluateInput(verseRef, enteredText, $scope.passage[verseRef-1]);
	};

	getPassage.get(passage).then((data) => {
		$scope.passage = data;
		PassageParseHelper.registerPassage(data);
		// Start drill
	});
})

.controller('RandVerseCtrl', function($scope, $state) {
	var ref = $state.params['ref'];
	var parts = ref.split('-');
	var passage = {
		book: parts[0],
		chapter: parts[1]
	};

	$scope.passageLabel = parts[0] + ' ' + parts[1];

	getPassage.get(passage).then((data) => {
		$scope.passage = data;
		PassageParseHelper.registerPassage(data);
		// Start drill
	});
})
;

function evaluateInput(ref, entered, actual) {
	console.log(ref, entered, actual);
}
;
