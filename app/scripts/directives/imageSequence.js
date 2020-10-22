"use strict";

angular.module("angularApp").directive("imageSequence", [
  "$window",
  "$document",
  "$interval",
  function ($window, $document, $interval) {
    return {
      restrict: "A",
      scope: {
        numFrames: "@",
        imageLoc: "@",
        imagesource: "=",
      },
      link: function linkFunc(scope, element, attrs) {
        var numFrames = scope.numFrames - 1,
          framesLoaded = 0,
          currentFrame = 0,
          locString = scope.imageLoc,
          imageCache = {};

        var fps, fpsInterval, startTime, now, then, elapsed;

        for (var i = 0; i < numFrames; i++) {
          var theSrc = locString + i.toString() + ".png";

          var img = new Image();

          img.onload = function (event) {
            framesLoaded++;
            checkProgress();
          };

          img.src = theSrc;
          imageCache[i] = img;
        }

        function checkProgress() {
          if (framesLoaded == numFrames) {
            startAnimation();
          } else {
            return;
          }
        }

        function startAnimation() {
          fpsInterval = 1000 / 30;
          then = Date.now();
          startTime = then;
          animate();
          /*var mySrc = locString + currentFrame + ".png";

          angular.element(element).prop("src", mySrc);

          currentFrame++;

          var animate = $interval(function () {
            var newSrc = locString + currentFrame + ".png";

            angular.element(element).prop("src", newSrc);

            if (currentFrame < numFrames) {
              currentFrame++;
            } else {
              currentFrame = 0;
            }
          }, 50); */
        }
        function animate() {
          requestAnimationFrame(animate);

          // calc elapsed time since last loop

          now = Date.now();
          elapsed = now - then;

          // if enough time has elapsed, draw the next frame

          if (elapsed > fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here
            angular.element(element).find("img").remove();
            angular.element(element).prepend(imageCache[currentFrame]);

            if (currentFrame < numFrames - 1) {
              currentFrame++;
            } else {
              currentFrame = 0;
            }
            window.requestAnimationFrame(animate);
          }
        }
      }, // end link
    };
  },
]);
