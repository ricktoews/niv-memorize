angular.module('Memorize')

	.service('drill', function(text_table, $http) {
		var restBase = '//memorize.toewsweb.net/rest.php';

		this.get = function(verse_id) {
			var url = restBase + '/check/' + user_id + '/' + text_table + '/' + verse_id;

			return $http.get(url).then(function(response) {
				return response.data;
			});
		};

		this.save = function(verse_id, position_wrong) {
			var url = restBase + '/saveresult';
			var payload = {
				user_id: user_id,
				text_table: text_table,
				verse_id: verse_id,
				position_wrong: position_wrong
			};
			return $http.put(url, payload).then(function(response) {
				return response;
			});
		};

		this.saveRemedial = function(verse_id) {
			var url = restBase + '/remedial';
			var payload = {
				user_id: user_id,
				text_table: text_table,
				verse_id: verse_id
			};
			return $http.put(url, payload).then(function(response) {
				return response;
			});
		};

	});
