'use strict';

angular.module('angularApp')
  .directive('scrollView', ['$window','$document','$timeout', function ($window, $document, $timeout) {

    return {
    restrict: 'A',
    link:  function linkFunc(scope, element, attrs) {

           

            angular.element($window).bind("scroll", function() {

                    var scrollTarget = angular.element(element)[0].getBoundingClientRect().top + $window.innerHeight;
                    

                 if (this.pageYOffset >= scrollTarget) { 


                 
                 } else {
                  

                 }
                scope.$apply();
            });
        }
    }
}]);