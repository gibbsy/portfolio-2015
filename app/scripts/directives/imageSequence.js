'use strict';

angular.module('angularApp')
  .directive('imageSequence', ['$window','$document','$interval', function ($window, $document, $interval) {

    return {
    restrict: 'A',
    scope: {
    numFrames: '@',
    imageLoc: '@',
    imagesource: '='
  	},
    link:  function linkFunc(scope, element, attrs) {

    	var numFrames = scope.numFrames-1,
    		framesLoaded = 0,
    		currentFrame = 0,
    		locString = scope.imageLoc,
    		imageCache = {};

    		for (var i = 0; i < numFrames; i++) {

    			var theSrc = locString + i.toString() + '.png';

    			imageCache[i] = $( new Image() );

    			imageCache[i].load(
                  function( event ) {

                      framesLoaded++;
                      checkProgress();
                  }
              )
              .error(
                  function( event ) {

                      console.info('error loading image sequence')

                  }
              )
              .prop( "src", theSrc );


    		} 

    	function checkProgress () {
    		
    		if( framesLoaded == numFrames ) {

    			startAnimation();
    		} else {
    			return;
    		}

    	}	

    	function startAnimation() {

    		var mySrc = locString + currentFrame + '.png';

    		angular.element(element).prop( "src", mySrc );

    		currentFrame++;

    		var animate = $interval(function() {

    		var newSrc = locString + currentFrame + '.png';

    		angular.element(element).prop( "src", newSrc );

    		if (currentFrame < numFrames) {
    			currentFrame++;
    		} else {
    			currentFrame =0;
    		}
            
          }, 50);
    	
    	}


      } // end link
  }

}]);