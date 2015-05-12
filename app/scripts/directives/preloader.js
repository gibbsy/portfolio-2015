'use strict';

angular.module('angularApp')
  .directive('preloader', ['$window','$document', function ($window, $document) {

    return {
    restrict: 'E',
    templateUrl:"partials/preloader.html",
    replace : true,
    link:  function linkFunc(scope, element, attrs) {

      }
  }
}]);