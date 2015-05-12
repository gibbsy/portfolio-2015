'use strict';

angular.module('angularApp')
  .directive('bgImage', function () {

    return {
    restrict: 'A',
    scope: {
        imgLoc: '='
    },
    link:  function linkFunc(scope, element, attrs) {

            var url = scope.imgLoc,
                el =  angular.element(element);

            scope.$watch('imgLoc', function(){

                if(scope.imgLoc) {
                    el.css({'background-image':'url('+scope.imgLoc+')'});
                    //console.log(el);
                }

            });
        }
    }
});