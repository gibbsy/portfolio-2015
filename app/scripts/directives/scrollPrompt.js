'use strict';

angular.module('angularApp')
  .directive('scrollprompt', ['$window','$document', '$timeout', function ($window, $document, $timeout) {

  return {
  restrict: 'E',
  templateUrl:"partials/scroll-prompt.html",
  replace : true,
  link:  function linkFunc(scope, element, attrs) {

    var scrolled = false;
    scope.showPrompt = false;

    $timeout(checkScrolled,8000);

    function checkScrolled() {

      if(!scrolled) {
        scope.showPrompt = true;
      }

    }

    angular.element($window).on('scroll', scrollHandler);

    function scrollHandler() {
      scrolled = true;

      if(scope.showPrompt){
        angular.element(element).css({'opacity':0,'bottom':'-100px'});
        angular.element($window).off('scroll', scrollHandler);
      }

    }

    }
  }
}]);