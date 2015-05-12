'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AnimationCtrl
 * @description
 * # AnimationCtrl
 * Controller of the angularApp
 */
//////////////////////////
/* CLASS CONTROLLER */
//////////////////////////

angular.module('angularApp')
  .controller('AnimationCtrl',['$scope', '$q', function ($scope, $q) {

    $scope.appViewState = {
      deepLink: undefined,
    	viewing: 'three',
    	showthree: true,
      direction:'',
      aniStatus:'ready',
      hue: '',
      threeUi:'preloading',
      tileMode: 'explode',
      loadingProject: false,
      loadingContent: false
    }

 }]);

//////////////////////////
/* ANIMATIONS */
//////////////////////////

/// move the 3D scene up out of the way 


angular.module('angularApp').animation('.three-focus', function() {
  return {

    addClass : function(element, className, done) {

      angular.element(element).css({
        top: 0
    });


   return function() {

          //alert('added three-focus'); 
        
      }


    },
    removeClass : function(element, className, done) {

      angular.element(element).css({
        top: '-100%'
    });
      
    }
  }
});



/// move the projects container up into view



angular.module('angularApp').animation('.project-focus', function() {
  return {

    addClass : function(element, className, done) {

      element.css({
      position: 'absolute',
      top: '100%',
      left: 0,
      opacity: 1
    })
      .animate({
        top: 0
      },700,'easeInOutCubic', done);

       return function() {

          //alert('added project-focus'); 
        
      }

    },
    removeClass : function(element, className, done) {

      element.css({
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 1
    })
      .animate({
        opacity: 0
      },600,'easeInOutCubic', done);

      

      return function(element) {

          //alert('removed project-focus'); 
        
      }
    }
  }
});


/// move between projects

/*angular.module('angularApp').animation('.slidein', function() {

  var animateIn = function(element, className, done) {

    element.css({
      position: 'absolute',
      top: '100%',
      left: 0,
      display: 'block'
    });

    jQuery(element).animate({
      top: 0
    },1200, "easeInOutQuart", done);

    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
  }

  return {
    addClass: animateIn
  };
});

angular.module('angularApp').animation('.slideout', function() {

  var animateOut = function(element, className, done) {

    element.css({
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'block'
    });

    jQuery(element).animate({
      top: '-100%'
    },1200, "easeInOutQuart", done);

    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
  }

  return {
    addClass: animateOut
  };
});*/
