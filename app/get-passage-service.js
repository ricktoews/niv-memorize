angular.module('Memorize')
	.service('getPassage', function($http) {
		var restBase = '//memorize.toewsweb.net/rest.php';

		this.get = function(ref) {
			var book = ref.book;
			var chapter = ref.chapter;
			var requestParams = '/' + book + '/' + chapter;
			var uri = restBase + '/getpassage' + requestParams;
			return $http.get(uri).then((response) => {
				return response.data;
			});	
		};

		this.getPartial = function(str) {
			var uri = restBase + '/gettitle/' + str;
			return $http.get(uri).then((response) => {
console.log('getPartial', uri, response);
				return response.data;
			});
		};

	});

