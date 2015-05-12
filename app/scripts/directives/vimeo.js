'use strict';

angular.module('angularApp')
  .directive('vimeo', function () {

    return {
    restrict: 'A',
    scope: {
        vimeoId: '='
    },
    link:  function linkFunc(scope, element, attrs) {

    	var id = scope.vimeoId,
    		vidHTML = '<iframe src="//player.vimeo.com/video/' + id + '" width="720" height="405" wmode="transparent" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
    		el = angular.element(element);
    		console.log(vidHTML);
    		el.append(vidHTML);


      }
  }
});