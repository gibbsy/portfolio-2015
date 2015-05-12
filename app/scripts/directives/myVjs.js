'use strict';

angular.module('angularApp')
  .directive('myVjs', ['$window','$document', function ($window, $document) {

    return {
    restrict: 'A',
    replace: true,
    link:  function linkFunc(scope, element, attrs) {

      scope.$watch('promoVideoId', function () {

        var vidId = scope.promoVideoId;

        if(vidId) {
          //console.log(vidId);

          if (angular.element('#'+vidId[0])) {

             var aspectRatio = 5/12,
                 width = $window.innerWidth,
                 height = width * aspectRatio;

            videojs(vidId, {'autoplay': false, 'preload':'auto', 'width': width, 'height': height}, function(){
            //console.log(this);

            });

          }
        }

      })
    }
  }
}]);