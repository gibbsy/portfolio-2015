'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AboutCtrl',['$scope', '$routeParams', '$location', '$timeout', '$animate', function ($scope, $routParams, $location, $timeout, $animate) {
   
   $scope.pageClass = 'page-about';

   var container = angular.element('.view-container'),
      threeView = angular.element('.three');

      $animate.removeClass(container,'projects-container');

      $timeout(function() {
		$animate.addClass(container,'about-container');
      },200);
      

     $scope.closeAbout = function() {

     	$animate.removeClass(container,'about-container').then(function() {

     		// clear container styles and move it out the way

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
