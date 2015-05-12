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
		mediaQuery: function (ID) {
			var theMedia = $http({
				method: 'GET',
				url: 'http://localhost:8888/andrewgillon/wordpress/wp-json/media/' + ID,
				withCredentials: true,
				header: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			return theMedia;
		},
		mediaArray: function (array) {
			var theArray = array,
				theUrls = {},
				loadedUrls = 0,
				postFunction = function(){};

			function imageLoaded(){
				loadedUrls++;
				if (loadedUrls===theArray.length){
					postFunction(theUrls);
					
				}
			}

			for(var i=0; i < theArray.length; i++) {
				var ID = theArray[i];
				
				$http({
					method: 'GET',
					url: 'http://localhost:8888/andrewgillon/wordpress/wp-json/media/' + ID,
					withCredentials: true,
					header: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(response){
           
		          var url = response.data.guid;

		          var key = response.data.ID;

		          theUrls[key] = url;

		          imageLoaded();

		        }, function(err){
		          console.log(err);
		        })
			}

			return { 
				done: function(f){
					postFunction=f || postFunction
				}
			}
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


