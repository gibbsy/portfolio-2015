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
      threeView = angular.element('.three'),
      aboutContent = angular.element('.about-me');

      $scope.showAbout = false;

      $animate.removeClass(container,'projects-container');

      $timeout(function() {
      	$scope.appViewState.viewing = 'about';
      	$scope.appViewState.showthree = 'false';
		$animate.addClass(container,'about-container');
      },200);

      $timeout(function() {
      	$scope.showAbout = true;
      },1000);
      

     $scope.closeAbout = function() {

     	$scope.showAbout = false;

     	$timeout(function(){

			$scope.appViewState.viewing='three';
			$scope.appViewState.direction='';

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


     	},500);

     	

     }

  }]);
