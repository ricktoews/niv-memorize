angular.module('Memorize')

	.service('titleMatches', function($http) {
		var restBase = '//memorize.toewsweb.net/rest.php';

		this.get = function(str) {
			var uri = restBase + '/titlematches/' + str;
			return $http.get(uri).then((response) => {
				return response.data;
			});
		};
	})
