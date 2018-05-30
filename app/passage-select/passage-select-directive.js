angular.module('Memorize')

	.directive('passageSelect', function(titleMatches, $state) {
		var html = document.createElement('ul');
		html.setAttribute('class', 'title-select');

		function getMatches(str) {
			return titleMatches.get(str).then((data) => {
				return data;
			});			
		}

		return {
			restrict: 'AE',
			scope: {
				ref: '='
			},
			templateUrl: '/app/templates/passage-select.html',
			link: function(scope, el, attrs) {
console.log('passage select directive');
				scope.getKey = function(evt) {
					while (html.childNodes[0]) html.childNodes[0].remove();
					var fld = evt.currentTarget;
					if (!fld.value) return;

					getMatches(fld.value).then((data) => {
						_.each(data, (item) => {
							var el = document.createElement('li');
							el.dataset.book_id = item.book_id;
							el.innerHTML = item.book_name;
							html.appendChild(el);
						});
						fld.parentNode.appendChild(html);
					});
				};

				scope.requestPassage = function(evt) {
					var parts = evt.currentTarget.value.split(' ');
					var ref = evt.currentTarget.value.replace(/ /g, '-');
console.log('requestPassage', ref);
					$state.go('memorize.lookup', { ref: ref });
					scope.ref = {
						book: parts[0],
						chapter: parts[1]
					};
				};
			}
		};
	});

