'use strict';

angular.module('angularApp')
  .directive('absCentre', ['$window','$document','$timeout', function ($window, $document, $timeout) {

    return {
    restrict: 'A',
    link:  function linkFunc(scope, element, attrs) {

    		var el = element;

			scope.getElementDimensions = function () {
			return { 'h': el.height(), 'w': el.width() };
			};

			var listener = scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
				
				centreElement();

			}, true);
			
			jQuery(window).on('resize', function () {

				centreElement();
				scope.$apply();
			
			});

			function centreElement () {

				var winHeight = $window.innerHeight,
				winWidth = $window.innerWidth,
				elHeight = el.height(),
				elWidth = el.width(),
				elTop = Math.round( (winHeight/2) - (elHeight/2) ),
				elLeft = Math.round( (winWidth/2) - (elWidth/2) );      

				el.css({ 'top':elTop, 'left':elLeft });

				//listener();
			}

		}
	}

}]);