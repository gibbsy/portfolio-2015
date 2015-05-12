'use strict';

angular.module('angularApp')
  .directive('mySvg', ['$window','$document','$timeout', function ($window, $document, $timeout) {

return {
  restrict: 'E',
  scope: {
    theImage: '=',
    radius: '=',
    width: '='
  },
  template: "<div><svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' id='hero' height='600'><polygon id='myShape' style='fill:lime;' /><image id='svgImage' width='100%' height='100%' /></svg></div>",
  replace: true,
  link: function linkFunc(scope, element, attrs) {

    scope.$watch('theImage', function(){

      if(scope.theImage) {

        var poly = document.getElementById('myShape'),
            img = document.getElementById('svgImage');

        poly.setAttribute("points","0,0 "+scope.width+",0 "+scope.width+",450 0,600");
        svgImage.setAttribute("xlink:href",scope.theImage); 

         // points='0,0 {{width}},0 {{width}},450 0,600' style='fill:lime;' 
          //<image xlink:href="http://upload.wikimedia.org/wikipedia/en/thumb/0/08/DioHolyDiver.jpg/220px-DioHolyDiver.jpg" width='100%' class/>

          /*var svgDocument = document.getElementById('hero'),
              svgns = "http://www.w3.org/2000/svg",
              shape = svgDocument.createElementNS(svgns, "circle");
          shape.setAttributeNS(null, "cx", 25);
          shape.setAttributeNS(null, "cy", 25);
          shape.setAttributeNS(null, "r",  20);
          shape.setAttributeNS(null, "fill", "red");




          console.log(svgDocument);*/
          /*var draw = SVG('hero');

          //var mysvg = angular.element('#hero').find('svg')[1];

          //console.log(mysvg);

          console.log(draw);

          //draw.svg('thefuck');


          // create image
          var image = draw.image(scope.theImage)
          image.size(600, 600);

          // create text
          var text = draw.text('Andy G').move(300, 0)
          text.font({
            family: 'Source Sans Pro'
          , size: 180
          , anchor: 'middle'
          , leading: 1
          })

          var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({ width: 1 })

          angular.element('#hero').append(draw.node);*/
        }

     });


      // clip image with text
      //image.clipWith(polyline)


    /* image.filter(function(add) {
        add.colorMatrix('matrix', [  0, 0, 0, 0.4, 0, 
                                     0, 1, 0, 0, 0, 
                                     0, 0, 1, 0.3, 0.1, 
                                     0, 0, 0, 1, 0 ])
      })*/

   
    }
  }
}]);