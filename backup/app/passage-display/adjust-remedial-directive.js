angular.module('Memorize')

	.directive('adjustRemedial', function(PassageParseHelper) {

		return {
			restrict: 'AE',
			template: 
'<div class="adjust-remedial-wrapper"> ' +
'  <span ng-repeat="word in words track by $index" ng-click="toggleRemedial($evt)" data-pos="{{pos}}">{{word}} </span> ' +
'</div>',
//			templateUrl: './app/templates/adjust-remedial.html',
			link: function(scope, el, attrs) {
				PassageParseHelper.parseText(scope.item.text);
				scope.words = PassageParseHelper.addSpans(scope.item.text);
			}
		};
	});
