'use strict';

angular.module('angularApp')
  .directive('promoVideo', ['$window','$document', '$location', '$animate','$timeout', function ($window, $document, $location, $animate, $timeout) {

  return {
  restrict: 'E',
  templateUrl:"partials/promo-video.html",
  replace : true,
  link:  function linkFunc(scope, element, attrs) {

    var played = false;

    angular.element($window).on('scroll', function() {

        var scrollTarget = (angular.element(element).offset().top - ($window.innerHeight)),
        closeMove = (angular.element('.hero-image-container').height() - 120),
        scrolled = angular.element($window).scrollTop(),
        parallax = (scrolled - scrollTarget)*0.3,
        video = videojs(scope.promoVideoId);

        angular.element('.home-btn').css({'bottom':parallax});

        if (scrolled > closeMove) {
          scope.closeToggle = true;
        } else {
          scope.closeToggle = false;
        }

        if (scrolled >= scrollTarget) {

        if (played == false && scope.fullyLoaded ) {

        video.play();   

        played = true;

        }

        angular.element('#'+scope.promoVideoId).css({'position':'fixed','bottom':0});

        }

        else { 
          angular.element('#'+scope.promoVideoId).css({'position':'relative','bottom':0}); 
        }
        
       scope.$apply();
    
    });

    }
  }
}]);