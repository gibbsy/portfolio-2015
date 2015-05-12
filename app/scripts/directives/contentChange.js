'use strict';

angular.module('angularApp')
  .directive('contentChange',['$timeout', function ($timeout) {

 return {

  scope: {
   content: '=',
   sync: '='
  },

  template: '<span ng-bind-html="myContent"></span>',

  link: function linkedFunc (scope, element, attrs) {
   scope.$watch('content', function(){

    var syncEl = angular.element(scope.sync);
    //add fader class to element
    angular.element(element).addClass('fade-out');
    syncEl.addClass('fade-out');

    //console.log(myContent);

    $timeout(function() {
      scope.myContent = scope.content;
      angular.element(element).removeClass('fade-out');
      syncEl.removeClass('fade-out');
    },1000);

    //remove fader class from element
     });
   }
  }

}]);