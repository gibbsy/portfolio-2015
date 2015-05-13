'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 3D scene
 */
angular.module('angularApp')
  .controller('MainCtrl', ['$scope', '$window', '$location', '$animate', '$timeout', 'projectFactory', 'imageFactory', function ($scope, $window, $location, $animate, $timeout, projectFactory, imageFactory) {

  // vars for imageFactory
    $scope.isLoading = "loading";
    $scope.isSuccessful = "success";
    $scope.percentLoaded = 0;
    $scope.showLogo = false;
    $scope.showSublinks = false;
  	$scope.pageClass = 'page-home';
    $scope.featuredImgs = [];
    $scope.imageObjects = {};
    $scope.myProjects = {};
    $scope.numImages = 0;

   function setWelcome() {
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if(is_chrome) {
      $scope.welcomeMessage='Looks like you are using Google Chrome. Happy days.'

    } else {
      $scope.welcomeMessage='This website uses WebGL, so kindly please check it out with a <a href="http://browsehappy.com/" target="_blank">nice modern browser</a> like Google Chrome'
    }
   }

   setWelcome();

    var cssColorDark, cssColorBright;

    function setColors() {

      var hues = ['purple'];

    $scope.appViewState.hue = 'purple';

    cssColorDark = randomColor({
      hue:$scope.appViewState.hue, 
      format:'hex',
      luminosity:'dark'
    }),
    cssColorBright = randomColor({
      hue:$scope.appViewState.hue, 
      format:'hex',
      luminosity:'bright'
    });

    }

/*    var palette = {
      'red': randomColor({hue:'red', format:'hex'}),
      'bright-red': randomColor({hue:'red', format:'hex',luminosity:'bright'}),
      'dark-red': randomColor({hue:'red', format:'hex',luminosity:'dark'}),
      'green': randomColor({hue:'green', format:'hex'}),
      'bright-green': randomColor({hue:'green', format:'hex',luminosity:'bright'}),
      'dark-green': randomColor({hue:'green', format:'hex',luminosity:'dark'}),
      'blue': randomColor({hue:'blue', format:'hex'}),
      'bright-blue': randomColor({hue:'blue', format:'hex',luminosity:'bright'}),
      'dark-blue': randomColor({hue:'blue', format:'hex',luminosity:'dark'}),
      'purple': randomColor({hue:'purple', format:'hex'}),
      'bright-purple': randomColor({hue:'purple', format:'hex',luminosity:'bright'}),
      'dark-purple': randomColor({hue:'purple', format:'hex',luminosity:'dark'}),
      'pink': randomColor({hue:'red', format:'hex'}),
      'bright-pink': randomColor({hue:'pink', format:'hex',luminosity:'bright'}),
      'dark-pink': randomColor({hue:'pink', format:'hex',luminosity:'dark'})
    }
    console.log(palette);*/

    jQuery(document).ready(function () {

      setColors();

      
    });

    


  	$scope.postQuery = projectFactory.queryPosts();

    $scope.postQuery.then(function(response){
           
           $scope.projects = response.data.Projects; 

           for (var i = 0; i < $scope.projects.length; i++) {

              var thisProject = $scope.projects[i];


            $scope.myProjects[i] = thisProject;

            $scope.featuredImgs[i] = thisProject.featured_image;

           }

           projectFactory.setAllProjects($scope.myProjects);

           $scope.numImages = $scope.projects.length;

           projectFactory.setNumProjects($scope.numImages);           

           $scope.projects = null; // clear from memory - refer to myProjects from now on

           loadTheImages();

        }, function(err){
          console.log(err);
        })
    

    function loadTheImages () { 

     imageFactory.preloadImages( $scope.featuredImgs ).then(

        function handleResolve( imgStore ) {

            for ( var i = 0 ; i < imgStore.length ; i++ ) {

            var img = imgStore[i];

            $scope.myProjects[i].featuredImage=img;

            }

             // Loading was successful.
            $timeout( function() {

            showSite();

            },3000);
            
            $scope.isSuccessful = true;

        },
        function handleReject( featuredImg ) {

            // Loading failed on at least one image.
            $scope.isLoading = "loaded";
            $scope.isSuccessful = "failed";

            console.info( "Preload Failure" );

        },
        function handleNotify( event ) {

            $scope.percentLoaded = event.percent;

        });
    }

    function showSite() {

       var threeView = angular.element('.three');

       projectFactory.setDeepLinking('READY');

           $scope.isLoading = "loaded";
           $animate.addClass( threeView ,'three-focus');

           $scope.appViewState.threeUi = "brand";
        $timeout(function() {
           $scope.showLogo = true;
         },400);

        $timeout(function() {
           $scope.showSublinks = true;
         },1200);
          

           
    }

    $scope.viewProject = function () {

    	$scope.target = projectFactory.getTarget();

      var goGet = '/project/'+$scope.target.slug;

      $location.path(goGet);

    }

  }]);
