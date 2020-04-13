angular.module('Memorize')

	.service('login', function(restBase, $http) {

		this.in = function(id) {
			var url = restBase + '/login';
			var payload = {
				fb_user_id: id
			};

			return $http.put(url, payload).then(function(response) {
				return response.data;
			});
		}
	});
