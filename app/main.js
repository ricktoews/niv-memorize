	var app = angular.module('Memorize', ['ui.router']);

	var text_table = 'bible_niv';
	var fb_user_id = 11011;
	var user_id;

	app.value('text_table', text_table);
	app.value('restBase', '//memorize.toewsweb.net/rest.php');

	app.run(function(login) {
		login.in(fb_user_id).then(function (response) {
			user_id = response.id;
		});
	});

	var ref = {
		book: 'Revelation',
		chapter: '22'
	};

	app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);

    	$urlRouterProvider.otherwise('/');

		$stateProvider

			.state('memorize', {
				url: '/',
				abstract: true,
				templateUrl: '/app/templates/layout.html',
				controller: 'MemorizeCtrl'
			})

			.state('memorize.start', {
				url: '',
				templateUrl: '/app/templates/initial-passage-select.html',
				controller: 'StartCtrl'
			})

			.state('memorize.lookup', {
				url: 'lookup/:ref',
				templateUrl: '/app/templates/enter-verse.html',
				controller: function($scope, $stateParams, getPassage) {
					$scope.lookup = $stateParams.ref.replace(/-/g, ' ');
console.log('memorize.lookup', $scope.lookup);
					if (!$scope.lookup) return;
					var parts = $scope.lookup.split(' ');
					var passage = {
						book: parts[0],
						chapter: parts[1]
					};
					getPassage.get(passage).then((data) => {
						$scope.passage = data;
					});
				}
			});
	});
