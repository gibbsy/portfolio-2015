'use strict';
angular.module('angularApp')
  .factory('imageFactory', ['$http','$q','$rootScope','$timeout', function ($http, $q, $rootScope, $timeout) {

  	// thanks to Ben Nadel http://www.bennadel.com/blog/2597-preloading-images-in-angularjs-with-promises.htm
	
	function Preloader( featuredImgs ) {

	    this.featuredImgs = featuredImgs;

	    this.imageCount = this.featuredImgs.length;
	    this.loadCount = 0;
	    this.errorCount = 0;
		this.imgStore = [];

	    this.states = {
	        PENDING: 1,
	        LOADING: 2,
	        RESOLVED: 3,
	        REJECTED: 4
	    };

	    this.state = this.states.PENDING;

	    // When loading the images, a promise will be returned to indicate
	    // when the loading has completed (and / or progressed).
	    this.deferred = $q.defer();
	    this.promise = this.deferred.promise;

	}

	// ---
	// STATIC METHODS.
	// ---

	// I reload the given images [Array] and return a promise. The promise
	// will be resolved with the array of image locations.
	Preloader.preloadImages = function( featuredImgs ) {

	    var preloader = new Preloader( featuredImgs );

	    return( preloader.load() );

	};

	// ---
	// INSTANCE METHODS.
	// ---

	Preloader.prototype = {

	    // Best practice for "instnceof" operator.
	    constructor: Preloader,

	    // ---
	    // PUBLIC METHODS.
	    // ---
	    isInitiated: function isInitiated() {

	        return( this.state !== this.states.PENDING );

	    },

	    isRejected: function isRejected() {

	        return( this.state === this.states.REJECTED );

	    },

	    isResolved: function isResolved() {

	        return( this.state === this.states.RESOLVED );

	    },

	    load: function load() {

	        // If the images are already loading, return the existing promise.
	        if ( this.isInitiated() ) {

	            return( this.promise );

	        }

	        this.state = this.states.LOADING;

	        for ( var i = 0 ; i < this.imageCount ; i++ ) {

	            this.loadImageLocation( this.featuredImgs[ i ] , i );

	        }

	        // Return the deferred promise for the load event.
	        return( this.promise );

	    },


	    // ---
	    // PRIVATE METHODS.
	    // ---

	    handleImageError: function handleImageError( imageLocation ) {

	        this.errorCount++;

	        if ( this.isRejected() ) {

	            return;

	        }

	        this.state = this.states.REJECTED;

	        this.deferred.reject( imageLocation );

	    },


	    // I handle the load-success of the given image location.
	    handleImageLoad: function handleImageLoad( imageLocation , image, order) {

	    	var loc = order;
	        this.loadCount++;
	        this.imgStore[loc]=image;

	        // If the preload action has already failed, ignore further action.
	        if ( this.isRejected() ) {

	            return;

	        }

	        // Notify the progress of the overall deferred. This is different
	        // than Resolving the deferred - you can call notify many times
	        // before the ultimate resolution (or rejection) of the deferred.
	        this.deferred.notify({
	            percent: Math.ceil( this.loadCount / this.imageCount * 100 ),
	            imageLocation: imageLocation
	        });

	        // If all of the images have loaded, we can resolve the deferred
	        // value that we returned to the calling context.
	        if ( this.loadCount === this.imageCount ) {

	            this.state = this.states.RESOLVED;

	            this.deferred.resolve( this.imgStore );

	        }

	    },


	    // I load the given image location and then wire the load / error
	    // events back into the preloader instance.
	    // --
	    // NOTE: The load/error events trigger a $digest.
	    loadImageLocation: function loadImageLocation( imageLocation , arrayLocation ) {

	        var preloader = this,
	        	order = arrayLocation;

	        // When it comes to creating the image object, it is critical that
	        // we bind the event handlers BEFORE we actually set the image
	        // source. Failure to do so will prevent the events from proper
	        // triggering in some browsers.
	        var image = $( new Image() );
	        	image[0].crossOrigin = ''; // allow images from other domains
	            image.load(
	                function( event ) {

	                    // Since the load event is asynchronous, we have to
	                    // tell AngularJS that something changed.
	                    $rootScope.$apply(
	                        function() {

	                            preloader.handleImageLoad( event.target.src , image, order);
	                     
	                            // Clean up object reference to help with the
	                            // garbage collection in the closure.

	                            //Andy added a timeout - was getting $digest error
	                          /*  $timeout(function() {
	                            	preloader = image = event = null;
	                            },2000);*/

	                        }
	                    );

	                }
	            )
	            .error(
	                function( event ) {

	                    // Since the load event is asynchronous, we have to
	                    // tell AngularJS that something changed.
	                    $rootScope.$apply(
	                        function() {

	                            preloader.handleImageError( event.target.src );

	                            // Clean up object reference to help with the
	                            // garbage collection in the closure.
	                            //Andy added a timeout - was getting $digest error
	                         /*   $timeout(function() {
	                            	preloader = image = event = null;
	                            },2000);*/
	                        }
	                    );

	                }
	            )
	            .prop( "src", imageLocation );

	    }

	};

	// Return the factory instance.
	return( Preloader );

		
}]);
