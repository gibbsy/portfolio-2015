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
      aboutContent = angular.element('.about-me'),
      threeUiView = $scope.appViewState.threeUi;

      $scope.showAbout = false;

      $scope.appViewState.threeUi = 'about';

      $animate.removeClass(container,'projects-container');

      $timeout(function() {
      	$scope.appViewState.viewing = 'about';
      	$scope.appViewState.showthree = 'false';
		$animate.addClass(container,'about-container');
      },200);

      $timeout(function() {
      	$scope.showAbout = true;
        $window.ga('send', 'pageview', { page: $location.url() });
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

          $scope.appViewState.threeUi = threeUiView;
          
					 $scope.$apply(function() {
						$location.path('');
					});

			});


     	},500);

     	

     }

     $scope.$on('$locationChangeStart', function(event, next, current) {
   
   var thePath = $location.path();

   if (thePath == '/') { 

    $scope.closeAbout();

   }


});

  }]);
