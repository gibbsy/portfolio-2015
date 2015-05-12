'use strict';
angular.module('angularApp')
  .factory('projectFactory', ['$http','$routeParams', function ($http, $routeParams) {

  	var deepLinking = 'WAIT',
  	numProjects = 0,
  	allProjects = {},
  	ui = 'branding',
  	target ={};

 	return {
		queryPosts: function () {
			var theQueryAll = $http({
				method: 'GET',
				url: '/data/projects.json' 
				});

			return theQueryAll;
		} ,
		query: function (ID) { 
			var theProject = allProjects[ID];
			return theProject;
		},
		getDeepLinking: function() {
			return deepLinking;
		},
		setDeepLinking: function(value) {
			deepLinking = value;
		},
		getAllProjects: function() {
			return allProjects;

		},
		setAllProjects: function(obj) {
			allProjects = obj;
			//console.dir(allProjects);
		},
		setTarget: function(obj) {
			target = obj;
		},
		getTarget: function(obj) {
			return target;
		},
		setNumProjects:function(num) {
			numProjects = num;
		},
		getNumProjects: function() {
			return numProjects;
		}
	};

}]);


