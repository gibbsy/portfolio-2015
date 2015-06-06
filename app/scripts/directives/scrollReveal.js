'use strict';

angular.module('angularApp')
  .directive('scrollReveal', ['$timeout', '$window', function ($timeout, $window) {

return {
restrict: 'A',
link:  function linkFunc(scope, element, attrs) {

            /// based on the scrollReveal js plugin but modified for this site

            var _requestAnimFrame;
            var _handler;
            var self;
            var myEl = element;
            var revealEl;

        
            function scrollReveal (myElement) {

                self = this;
                self.index = scope.reveals;
                self.theElem   = myElement;
                self.blocked = false;
                self.elems = {};

                $window.addEventListener( 'scroll', _handler, false );
                $window.addEventListener( 'resize', _handler, false );

                /// wait till the media has been added to the dom then store in an object

                function waitForMedia() {
                
                  $timeout(function() {

                    if ( scope.imagesReady=="ready" && angular.element('[data-reveal]') ) {

                      angular.element('[data-reveal]').each(function( index ) {
                        self.elems[index] = {};
                        self.elems[index].showme = angular.element(this);
                        self.elems[index].seen = false;
                        });
                        self.init();


                    } else {
                      waitForMedia();
                    }

                  },100);
                }

                waitForMedia();

            }


            scrollReveal.prototype = {

                init: function(){

                // chrome workaround to avoid the background fixed bug when using transforms
                  
                var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) && /Google Inc/.test(navigator.vendor);

                var elem = self.theElem,
                elems = self.elems;
                
                if (!isChrome) {
                self.initial = { 
                'opacity' : 0, 
                '-moz-transform': 'translate(0,20px)',
                '-webkit-transform': 'translate(0,20px)',
                '-o-transform': 'translate(0,20px)',
                '-ms-transform': 'translate(0,20px)',
                'transform': 'translate(0,20px)'
                };
                } else {
                self.initial = {'opacity':0,'padding-top':'+=20','padding-bottom':'-=20' };
                }
                self.transition = { 
                '-webkit-transition': 'all 0.7s cubic-bezier( 0.6, 0.2, 0.1, 1 )',
                '-moz-transition': 'all 0.7s cubic-bezier( 0.6, 0.2, 0.1, 1 )',
                '-ms-transition': 'all 0.7s cubic-bezier( 0.6, 0.2, 0.1, 1 )',
                '-o-transition': 'all 0.7s cubic-bezier( 0.6, 0.2, 0.1, 1 )',
                'transition': 'all 0.7s cubic-bezier( 0.6, 0.2, 0.1, 1 )'
                };
                
                if(!isChrome) {
                self.reveal = { 
                'opacity': 1 , 
                '-moz-transform': 'translate(0,0)',
                '-webkit-transform': 'translate(0,0)',
                '-o-transform': 'translate(0,0)',
                '-ms-transform': 'translate(0,0)',
                'transform': 'translate(0,0)'

                };
              } else {
                self.reveal = {'opacity':1,'padding-top':'-=20','padding-bottom':'+=20' };
              }
                self.vFactor = 0.15;

                for ( var elKey in self.elems ) {

                self.elems[elKey].showme.css( self.initial ).css( self.transition );

                }
                    
                self.scrolled = self.scrollY();

                $timeout(function(){
                   self.animate();
                },1000);
                
                },

                animate: function(){

                  for ( var elKey in self.elems ) {

                      var showit = self.elems[elKey].showme;
                      var visible;

                      visible = self.isElemInViewport(showit);

                      if ( visible && !self.elems[elKey].seen ){

                      self.elems[elKey].seen = true;

                      showit.css( self.reveal );

                      } else if ( !visible ){
                        
                      }

                  }
            
                  self.blocked = false;
                  
                },
                getViewportH: function(){

                  return $window.innerHeight;
                },

                scrollY: function(){
                    
                    return angular.element($window).scrollTop();
                  
                },

                isElemInViewport: function( elem ){

                  var kinel = elem,
                  elTop= kinel.offset().top,
                  scrolled = angular.element($window).scrollTop(),
                  elHeight = kinel.height(),
                  vFactor = self.vFactor,
                  elBottom = elTop + elHeight;

                  return ( confirmBounds() || isPositionFixed() );

                  function confirmBounds(){

                    var top        = elTop + elHeight * vFactor;
                    var bottom     = elBottom - elHeight * vFactor;
                    var viewBottom = self.scrolled + self.getViewportH();
                    var viewTop    = self.scrolled;

                    return ( top < viewBottom ) && ( bottom > viewTop );
                  }

                  function isPositionFixed(){

                    return false; //style.position === 'fixed';
                  }
                },

                isMobile: function(){

                  var agent = navigator.userAgent || navigator.vendor || window.opera;

                  return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
                },

                isSupported: function(){

                  var sensor    = document.createElement('sensor');
                  var cssPrefix = 'Webkit,Moz,O,'.split(',');
                  var tests     = ( 'transition ' + cssPrefix.join('transition,') ).split(',');

                  for ( var i = 0; i < tests.length; i++ ){
                    if ( !sensor.style[tests[i]] === '' ){
                      return false;
                    }
                  }

                  return true;
                }

              } // End of the scrollReveal prototype ======================================|


             _handler = function( e ){

                if ( !self.blocked ){

                  self.blocked  = true;
                  self.scrolled = self.scrollY();

                  _requestAnimFrame(function(){
                    self.animate();
                  });
                }
              }

              // RequestAnimationFrame polyfill.
              _requestAnimFrame = (function(){

                return window.requestAnimationFrame        ||
                       window.webkitRequestAnimationFrame  ||
                       window.mozRequestAnimationFrame     ||

                      function( callback ){
                        window.setTimeout( callback, 1000 / 60 );
                      };
              }());

                    
              revealEl = new scrollReveal( myEl );               
  
        }
    }
}]);