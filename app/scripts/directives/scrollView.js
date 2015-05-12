'use strict';

angular.module('angularApp')
  .directive('scrollView', ['$window','$document','$timeout', function ($window, $document, $timeout) {

    return {
    restrict: 'A',
    link:  function linkFunc(scope, element, attrs) {

           

            angular.element($window).bind("scroll", function() {

                    var scrollTarget = angular.element(element)[0].getBoundingClientRect().top + $window.innerHeight;
                    
                    //console.log(this.pageYOffset);
                    //console.log(scrollTarget);
                     

                 if (this.pageYOffset >= scrollTarget) { 

           

         /*   var heroImg = angular.element('.hero-image-container').outerHeight();

            var copy = angular.element('.copy-content').outerHeight();

            var images = angular.element('.media-content').outerHeight();*/

                  
                   

        

                    console.log('IN VIEW');
                 
                 } else {
                    //console.log('anything');

                 }
                scope.$apply();
            });
        }
    }
}]);