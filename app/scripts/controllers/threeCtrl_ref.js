'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:threeCtrl
 * @description
 * # threeCtrl
 * Controller of the 3D scene
 */
angular.module('angularApp')
  .controller('threeCtrl', ['$scope', 'projectFactory', 'imageFactory', function ($scope, projectFactory, imageFactory) {

    $scope.featuredImgs = [];
    $scope.imageObjects = {};
    $scope.numImages = 0;

    // vars for imageFactory
    $scope.isLoading = true;
    $scope.isSuccessful = false;
    $scope.percentLoaded = 0;

  	$scope.postQuery = projectFactory.queryPosts();

    $scope.postQuery.then(function(response){
           
           $scope.projects = response.data;  

           projectFactory.setDeepLinking('READY');

           projectFactory.setAllProjects($scope.projects);

           console.log(projectFactory.getDeepLinking());


           pushImageLocations();

        }, function(err){
          console.log(err);
        })
    
    function pushImageLocations () {

      // return all the guid of the images into the array featuredImgs

      for (var i = 0 ; i < $scope.projects.length ; i++) {

        var imgUid = $scope.projects[i].featured_image.guid;

        $scope.featuredImgs.push(imgUid);

  
      }
      $scope.numImages = $scope.projects.length;
      loadTheImages();

    }

    function loadTheImages () {

      console.log($scope.featuredImgs);
     imageFactory.preloadImages( $scope.featuredImgs ).then(

        function handleResolve( imgStore ) {

            // Loading was successful.
            $scope.isLoading = false;
            $scope.isSuccessful = true;

            console.info( "Preload Successful" );
            for ( var i = 0 ; i < imgStore.length ; i++ ) {

            var img = imgStore[i];

            var imgObj = {
                order: i,
                url: $scope.featuredImgs[i],
                image: img[0],
                linkId: $scope.projects[i].ID,
                title: $scope.projects[i].title,
                slug: $scope.projects[i].slug,
                excerpt: $scope.projects[i].excerpt,
                tile: undefined,
                map: undefined
              }
              //console.dir(imgObj.image.getAttr(crossOrigin))
              $scope.imageObjects[i]=imgObj;
              
            }

        },
        function handleReject( featuredImg ) {

            // Loading failed on at least one image.
            $scope.isLoading = false;
            $scope.isSuccessful = false;

            console.error( "Image Failed", featuredImg );
            console.info( "Preload Failure" );

        },
        function handleNotify( event ) {

            $scope.percentLoaded = event.percent;

            console.info( "Percent loaded:", event.percent );

        });
    }


  }]);
