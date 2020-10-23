"use strict";

/**
 * @ngdoc function
 * @name angularApp.controller:projectCtrl
 * @description
 * # projectCtrl
 * Controller of the angularApp
 */
angular.module("angularApp").controller("ProjectCtrl", [
  "$scope",
  "$window",
  "$routeParams",
  "$animate",
  "$location",
  "$timeout",
  "projectFactory",
  "imageFactory",
  function (
    $scope,
    $window,
    $routeParams,
    $animate,
    $location,
    $timeout,
    projectFactory,
    imageFactory
  ) {
    //////////////// DETERMINE WHICH ANIMATION IS NECESSARY //////////////////////

    $scope.pageClass = "page-project";

    $scope.showImage = false;
    $scope.showCopy = false;

    $scope.nextLink = undefined;
    $scope.prevLink = undefined;

    $scope.fullyLoaded = false;
    $scope.showPrevNext = false;
    $scope.showFirstImage = false;

    $scope.closeToggle = false;

    $scope.vidContent = "hide";

    $scope.imagesReady = "wait";

    var imgUrls = [],
      domain = "https://" + $window.location.host;

    var container = angular.element(".view-container"),
      threeView = angular.element(".three");

    $animate.removeClass(container, "about-container");

    projectSetUp();

    ///////////// CHECK IF THE PROJECT INDEX IS READY AND WHETHER LOADING A DEEP LINK OR NOT ////////////////

    function projectSetUp() {
      //console.log($routeParams.slug);

      $scope.appViewState.loadingProject = true;
      $scope.appViewState.loadingContent = true;

      /* check the project index is READY */

      if (projectFactory.getDeepLinking() === "READY") {
        $scope.projects = projectFactory.getAllProjects();

        $scope.target = projectFactory.getTarget();

        $scope.numProjects = projectFactory.getNumProjects();

        /* check if the user has come through the 3D UI - target will be set */

        if (jQuery.type($scope.target.index) === "number") {
          $scope.project = $scope.target;

          $timeout(function () {
            prepareToLoad();
          }, 50);
        } else {
          /* process the deep link */

          $scope.appViewState.deepLink = true;

          $scope.gettingDeeplink = "LOADING";

          var goToID = $routeParams.slug;

          for (var p in $scope.projects) {
            var project = $scope.projects[p];

            if (project.slug === goToID) {
              $scope.project = project;

              projectFactory.setTarget(project);

              // check that the three ui is ready before going to the project

              prepareToLoad();
            }
          }
        }
      } else {
        $timeout(projectSetUp, 500);
      }
    }

    function setNextLink() {
      var currentPos = $scope.project.index,
        nextID = currentPos + 1;

      for (var n in $scope.projects) {
        var next = $scope.projects[n];

        if (next.index === nextID) {
          return "/#/project/" + next.slug;
        }
      }
    }

    function setPrevLink() {
      var currentPos = $scope.project.index,
        nextID = currentPos - 1;

      for (var n in $scope.projects) {
        var next = $scope.projects[n];

        if (next.index === nextID) {
          return "/#/project/" + next.slug;
        }
      }
    }

    function setNextProject() {
      //sbtrkt 1 from numProjects because order is zero based

      var currentPos = $scope.project.index,
        nextID = currentPos === $scope.numProjects - 1 ? 0 : currentPos + 1;

      for (var n in $scope.projects) {
        var next = $scope.projects[n];

        if (next.index === nextID) {
          return next;
        }
      }
    }

    function setPrevProject() {
      //sbtrkt 1 from numProjects because order is zero based

      var currentPos = $scope.project.index,
        prevID = currentPos === 0 ? $scope.numProjects - 1 : currentPos - 1;

      for (var p in $scope.projects) {
        var prev = $scope.projects[p];

        if (prev.index === prevID) {
          return prev;
        }
      }
    }

    $scope.goToNext = function () {
      var goingTo = $scope.nextProject,
        theUrl = "/project/" + goingTo.slug;

      jQuery(".page-project").fadeOut();

      $scope.appViewState.direction = "rtl";

      $scope.appViewState.aniStatus = "wait";

      if ($scope.$$phase) {
        $timeout(function () {
          $location.path(theUrl);
        }, 500);
      } else {
        $location.path(theUrl);
      }
    };

    $scope.goToPrev = function () {
      var goingTo = $scope.prevProject,
        theUrl = "/project/" + goingTo.slug;

      jQuery(".page-project").fadeOut();

      $scope.appViewState.direction = "ltr";

      $scope.appViewState.aniStatus = "wait";

      if ($scope.$$phase) {
        $timeout(function () {
          $location.path(theUrl);
        }, 500);
      } else {
        $location.path(theUrl);
      }
    };

    $scope.close = function () {
      $scope.appViewState.viewing = "three";
      $scope.appViewState.direction = "";
      $animate.addClass(threeView, "three-focus");
      $animate.removeClass(container, "projects-container").then(function () {
        var cont = angular.element(".view-container").attr("style", "").css({
          position: "absolute",
          top: "100%",
        });

        $scope.$apply(function () {
          $location.path("");
        });
      });
    };

    $scope.$on("$locationChangeStart", function (event, next, current) {
      if ($scope.appViewState.aniStatus == "ready") {
        jQuery(".page-project").fadeOut();
      }

      var n = next.lastIndexOf("/"),
        thePath = next.substring(n + 1);

      if (thePath == "" || thePath == "about") {
        $scope.close();
      } else if (thePath != $scope.project.slug) {
        for (var p in $scope.projects) {
          var project = $scope.projects[p];

          if (project.slug === thePath) {
            $scope.getProject = project;

            projectFactory.setTarget(project);
          }
        }

        if (!$scope.getProject) {
          //console.log('404 invalid url');

          $location.path("/404");
        }

        //console.log($scope.getProject);

        if ($scope.getProject == $scope.nextProject) {
          $scope.appViewState.direction = "rtl";

          $scope.appViewState.aniStatus = "wait";
        } else if ($scope.getProject == $scope.prevProject) {
          $scope.appViewState.direction = "ltr";

          $scope.appViewState.aniStatus = "wait";
        } else {
          $scope.appViewState.direction = "ltr";

          $scope.appViewState.aniStatus = "wait";
        }
      }
    });

    ///////////// GET THE PROJECT DATA ////////////////

    function prepareToLoad() {
      $scope.appViewState.viewing = "projects";
      $scope.appViewState.showthree = "false";

      $scope.nextProject = setNextProject();
      $scope.prevProject = setPrevProject();

      $scope.nextLink = setNextLink();
      $scope.prevLink = setPrevLink();

      $scope.promoVideoId = "promo-" + $scope.project.slug; // not now needed

      /* $scope.target = {};*/ if ($scope.project.content_images.length) {
        for (var i = 1; i < $scope.project.content_images.length; i++) {
          // imgUrls.push(domain + $scope.project.content_images[i]);
          imgUrls.push(domain + $scope.project.content_images[i]);
        }
      } else {
        imgUrls = null;
      }

      if ($scope.project.vimeo_ids) {
        $scope.vidContent = "include";
      }

      $animate.addClass(container, "projects-container").then(function () {
        $animate.removeClass(threeView, "three-focus");
      });

      loadTheHero();
    }

    function loadTheHero() {
      var theHero = $(new Image());

      theHero
        .load(function (event) {
          $scope.$apply(function () {
            $scope.heroImg = event.target.src;
          });

          if (imgUrls) {
            loadTheFirstImage();
            $scope.appViewState.loadingProject = false;
            showProjectHero();
          } else {
            showProject();
          }
        })
        .error(function (event) {
          console.info("error loading hero");
        })
        .prop("src", $scope.project.hero_image);
    }

    function loadTheFirstImage() {
      var firstImage = $(new Image());

      firstImage
        .load(function (event) {
          $scope.$apply(function () {
            $scope.project.firstImage = event.target.src;
          });

          loadTheContent();

          $timeout(function () {
            $scope.showFirstImage = true;
          }, 2000);
        })
        .error(function (event) {
          console.info("error loading hero");
        })
        .prop("src", $scope.project.content_images[0]);
    }

    function loadTheContent() {
      imageFactory.preloadImages(imgUrls).then(
        function handleResolve(imgStore) {
          // Loading was successful.
          $scope.isLoading = false;
          $scope.isSuccessful = true;
          $scope.project.contentImages = imgUrls;

          $scope.appViewState.loadingContent = false;
          $scope.appViewState.aniStatus = "ready";

          showProjectContent();
        },
        function handleReject(featuredImg) {
          // Loading failed on at least one image.
          $scope.isLoading = false;
          $scope.isSuccessful = false;

          console.info("Preload Failure");
        },
        function handleNotify(event) {
          $scope.percentLoaded = event.percent;
        }
      );
    }

    function showProjectHero() {
      $scope.radius = 100;
      $scope.winWidth = $window.innerWidth;

      /* var resetTarget = {};
      projectFactory.setTarget(resetTarget);*/

      /// set up some visual stuff ... fade in image, parallax etc

      $timeout(function () {
        $scope.showImage = true;
      }, 1000);

      $timeout(function () {
        $scope.showCopy = true;
      }, 1500);

      $timeout(function () {
        $scope.showPrevNext = true;
      }, 2000);
    }

    function showProjectContent() {
      $scope.imagesReady = "ready";

      $timeout(function () {
        $scope.fullyLoaded = true;

        $window.ga("send", "pageview", { page: $location.url() });
      }, 500);
    }
  },
]);
