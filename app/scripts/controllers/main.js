'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 3D scene
 */
angular.module('angularApp')
  .controller('MainCtrl', ['$scope', '$window', '$location', '$animate', '$timeout', 'ngAudio', 'projectFactory', 'imageFactory', function ($scope, $window, $location, $animate, $timeout, ngAudio, projectFactory, imageFactory) {

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
    $scope.showInstructions = false;

    $scope.webgl = ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; } } )();

    //console.log($scope.webgl);

   function setWelcome() {
    $scope.is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    $scope.is_firefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && $scope.webgl );
    $scope.is_safari = (navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1);

    if($scope.is_chrome) {
      $scope.welcomeMessage='Looks like you are using Google Chrome. Happy days.'

    } else if ($scope.is_safari) {
      $scope.welcomeMessage='This website uses webGL - performance is much better in Chrome or the latest version of Firefox, but we should be fine if you have WebGL enabled.'

    } else if ($scope.is_firefox) {
      $scope.welcomeMessage='Looks like you are using a nice modern browser. Happy Days.'
    }
      else {
      $scope.welcomeMessage='This website uses WebGL, so please check it out with a <a href="http://browsehappy.com/" target="_blank">nice modern browser</a> like Google Chrome.'
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

  

  }]);
