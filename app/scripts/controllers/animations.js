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



angular.module('angularApp').animation('.projects-container', function() {
  return {

    addClass : function(element, className, done) {

      element.css({
      position: 'absolute',
      top: '100%',
      left: 0,
      opacity: 1,
      width: '100%',
      zIndex: 10000
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
      },500,'easeInOutCubic', done);

      return function(element) {
 
        
      }
    }
  }
});

angular.module('angularApp').animation('.about-container', function() {
  return {

    addClass : function(element, className, done) {

      element.css({
      position: 'fixed',
      width: 0,
      height:'96%',
      background: '#23143e',
      top: '2%',
      left:'2%',
      opacity: 1,
      zIndex:5000
    })
      .animate({
       width: '96%'
      },700,'easeInOutCubic', done);

       return function() {

        
      }

    },
    removeClass : function(element, className, done) {

      element.css({
      right: '2%',
      left:''      
    })
      .animate({
        width: 0,
        right: '2%'
      },600,'easeInOutCubic', done);

      return function(element) {

       
      }
    }
  }
});

