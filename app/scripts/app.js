'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */
angular
  .module('angularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch', 
    'duScroll',
    'ngAudio'
  ])
.config(function ($routeProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/project/:slug', {
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  });