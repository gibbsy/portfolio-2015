'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('errorCtrl',['$scope', '$routeParams', '$location', '$animate', function ($scope, $routParams, $location, $animate) {
   
    $scope.appViewState.viewing='error';

    var container = angular.element('.view-container'),
    threeView = angular.element('.three');

    $scope.getHome = function() {

      $scope.appViewState.viewing='three';
      $scope.appViewState.direction='';
      $animate.addClass(threeView,'three-focus');
      $animate.removeClass(container,'projects-container').then(function(){

        var cont = angular.element('.view-container')
        .attr( "style", "" )
        .css({
          position:'absolute',
          top:'100%'
        });

        $scope.$apply(function() {
          $location.path('');
          });
      });


    }


  }]);
