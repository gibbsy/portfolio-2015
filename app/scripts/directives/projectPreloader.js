'use strict';

angular.module('angularApp')
  .directive('projectloader', ['$window','$document', function ($window, $document) {

    return {
    restrict: 'E',
    templateUrl:"partials/project-preloader.html",
    replace : true,
    link:  function linkFunc(scope, element, attrs) {

      }
  }
}]);