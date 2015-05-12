'use strict';

angular.module('angularApp')
  .directive('mythree', ['$window','$document','$timeout', 'imageFactory','projectFactory', function ($window, $document, $timeout, imageFactory, projectFactory) {

return {
  restrict: 'E',
  scope: false,
  link: function linkFunc(scope, element, attrs) {

   var mouseX = 0, mouseY = 0,

    windowHalfX = $window.innerWidth / 2,
    windowHalfY = $window.innerHeight / 2;

    var container, stats;
    var camera, scene, renderer, light, directionalLight, directionalLight2, directionalLight3, spotlight, triangle, lightTarget, shape;
    var targetTile, targetObj;
    var tileMeshes = [], rays, caster;

    var PI2 = Math.PI * 2;

    var mouse = { x: 10000, y: 10000 }, INTERSECTED;

    var view = 'scene';

    scope.isAnimating = true;

    scope.exploreWork = function () {

      scope.appViewState.threeUi = 'browse';

    }

    scope.resetThree = function () {

      view = 'scene'
      scope.explodeTiles();
      targetTile = undefined;
      projectFactory.setTarget(undefined);
      scope.appViewState.threeUi = 'brand';
      scope.appViewState.tileMode = 'explode';


    }

    scope.explodeView = function () {

      scope.appViewState.threeUi = 'browse';
      scope.appViewState.tileMode = 'explode';
      scope.explodeTiles();

    }

    scope.resetGrid = function () {
      scope.appViewState.threeUi = 'browse';
      scope.appViewState.tileMode = 'grid'; 
      scope.tilesToGrid();

    }

     function contentTile (order,w,h,op,hue,img) {

      this.order = order;
      this.geometry = new THREE.PlaneBufferGeometry( w,h );
      this.opacity = op;
      this.map = img;
      this.tex = new THREE.MeshPhongMaterial( { 
        color: randomColor({ luminosity: 'bright', hue: hue}), 
        side: THREE.DoubleSide ,
        opacity: this.opacity 
         });

      this.newTex = new THREE.Texture( this.map );
      this.newTex.needsUpdate = true; 

      ///// aspect ratio stuff

      /*var texWidth = this.newTex.image.width,
      texHeight = this.newTex.image.height,
      imgAspect;
        if ( texWidth > texHeight ) {
          imgAspect = texHeight/texWidth;
          this.newTex.repeat.x = imgAspect;
          this.newTex.repeat.y = 1;
          this.newTex.offset.x = imgAspect/2;
        } else if ( texHeight > texWidth ) {
          imgAspect = texWidth/texHeight;
          this.newTex.repeat.x = 1;
          this.newTex.repeat.y = imgAspect;
          this.newTex.offset.y = imgAspect/2;
        } else if ( texWidth==texHeight ) {
          this.newTex.repeat.x = 1;
          this.newTex.repeat.y = 1;
        }*/


      this.imgTex = new THREE.MeshPhongMaterial( { 
        color: 0xffffff, 
        opacity: this.opacity , 
        side: THREE.DoubleSide, 
        map: this.newTex}); 

      //this.imgTex.needsUpdate = true;
      
      this.object = new THREE.Mesh( this.geometry, this.tex );  
      this.object.position.set(0,0,-5000);
      this.object.isNavigation = true;

      return this;
    }

    contentTile.prototype = {

      aniToGrid: function ( delay , callback) {

      var delay = delay || 0,
        theObj = this.object,
        complete = callback || undefined,
        gridX = ( ( this.order % 5 ) * 220 ) - (windowHalfX/2),
        gridY = ( - ( Math.floor( this.order / 5 ) % 8 ) * 180 ) + 200,
        gridZ = ( Math.floor( this.order / 25 ) ) * 100 - 200;

      var gridTween = new TWEEN.Tween( theObj.position ).to( {
          x: gridX,
          y: gridY,
          z: gridZ }, 2000)
          .delay(delay)
          .onComplete(complete)
          .easing( TWEEN.Easing.Quadratic.Out);
      return gridTween; 
      },

      backToGrid: function () {

    var theObj = this.object,
        gridX = ( ( this.order % 5 ) * 220 ) - (windowHalfX/2),
        gridY = ( - ( Math.floor( this.order / 5 ) % 8 ) * 180 ) + 200,
        gridZ = ( Math.floor( this.order / 25 ) ) * 100 - 200;

      var gridTween = new TWEEN.Tween( theObj.position ).to( {
          x: gridX,
          y: gridY,
          z: gridZ }, 500)
          .easing( TWEEN.Easing.Quadratic.Out);
      return gridTween; 
      },

      randScale: function( delay, duration ) {

       var delay = delay || 0,
       duration = duration || 500,
       randScale = new TWEEN.Tween(this.object.scale)
          .to({ x: Math.random() * 6 - 2,
              y: Math.random() * 6 - 2 }, duration)
          .delay(delay)
          .easing( TWEEN.Easing.Back.InOut);
          return randScale;
      },

      randRotation: function ( delay, duration ) {

      var delay = delay || 0, 
        duration = duration || 1000,
        rotation =  new TWEEN.Tween( this.object.rotation ).to( {
        x: (Math.random() * 2 * Math.PI),
        y: (Math.random() * 2 * Math.PI),
        z: (Math.random() * 2 * Math.PI) }, duration )
        .delay(delay)
        .easing( TWEEN.Easing.Quadratic.InOut);
      return rotation;
      },
      
      showHideImage: function ( delay ) {

      var delay = delay || 0, 
        theObj = this,
        theMesh = this.object,
        postaction = function() {};

        var r1 = new TWEEN.Tween( theMesh.rotation ).to( {
        y: 90*(Math.PI/180)}, 200 )
        .easing( TWEEN.Easing.Quadratic.In)
        .delay(delay)
        .onComplete(function() {
          theObj.toggleTexture();
        });
        var r2 = new TWEEN.Tween( theMesh.rotation ).to( {
        x: 0,
        y: 0,
        z: 0}, 200 )
        .easing( TWEEN.Easing.Quadratic.Out);

        var r3 = new TWEEN.Tween( theMesh.rotation ).to( {
        y: 90*(Math.PI/180)}, 200 )
        .easing( TWEEN.Easing.Quadratic.In)
        .delay(2000)
        .onComplete(function() {
          theObj.toggleTexture();
        });

        var r4 = new TWEEN.Tween( theMesh.rotation ).to( {
        x: 0,
        y: 0,
        z: 0}, 200 )
        .easing( TWEEN.Easing.Quadratic.Out)
        .onComplete(function() {
          postaction(theObj);
        });

        r1.chain(r2);
        r2.chain(r3);
        r3.chain(r4);
        r1.start();
        //postaction();
      return { 
            done:function(f){
                postaction=f || postaction 
            }
        }

      },

      flipToImage: function () {

        var theObj = this,
        theMesh = this.object,
        postaction = function() {};

        var r1 = new TWEEN.Tween( theMesh.rotation ).to( {
        y: 90*(Math.PI/180)}, 200 )
        .easing( TWEEN.Easing.Quadratic.In)
        .onComplete(function() {
          theObj.imageTex();
        });
        var r2 = new TWEEN.Tween( theMesh.rotation ).to( {
        x: 0,
        y: 0,
        z: 0}, 200 )
        .easing( TWEEN.Easing.Quadratic.Out)
        .onComplete(function() {
          postaction(theObj);
        });

        r1.chain(r2);

        r1.start();

         return { 
            done:function(f){
                postaction=f || postaction 
            }
        }

      },
      flipToColor: function () {
        var theObj = this,
        theMesh = this.object,
        currentRy = this.object.rotation.y,
        targetRy = currentRy+(90*(Math.PI/180)),
        postaction = function() {};

        var r1 = new TWEEN.Tween( theMesh.rotation ).to( {
        y: targetRy}, 200 )
        .easing( TWEEN.Easing.Quadratic.In)
        .onComplete(function() {
          theObj.colorTex();
        });
        var r2 = new TWEEN.Tween( theMesh.rotation ).to( {
        y: currentRy}, 200 )
        .easing( TWEEN.Easing.Quadratic.Out)
        .onComplete(function() {
          postaction(theObj);
        });

        r1.chain(r2);

        r1.start();

         return { 
            done:function(f){
                postaction=f || postaction 
            }
        }

      },
      toggleTexture: function () {
        // toggle between showing and hiding the tile image
      var theMesh = this.object;
        theMesh.material.needsUpdate = true;
        theMesh.geometry.buffersNeedUpdate = true;
        theMesh.geometry.uvsNeedUpdate = true;

        theMesh.material = (theMesh.material==this.tex) ? this.imgTex : this.tex;

      },
      colorTex: function () {
         var theMesh = this.object;
        theMesh.material.needsUpdate = true;
        theMesh.geometry.buffersNeedUpdate = true;
        theMesh.geometry.uvsNeedUpdate = true;

        theMesh.material = this.tex;

      },
      imageTex: function () {

        var theMesh = this.object;
        theMesh.material.needsUpdate = true;
        theMesh.geometry.buffersNeedUpdate = true;
        theMesh.geometry.uvsNeedUpdate = true;

        theMesh.material = this.imgTex;

      },
      moveRandom: function ( delay ) {

      var delay = delay || 0,
        This = this,
        theObj = this.object, // cache the object so the update function can access it
        actualZPos= 0,
          currentZPos = { zPos: 0 };
          this.targetZPos = Math.random() * 600 - 200;

      var move = new TWEEN.Tween(currentZPos)
            .to({ zPos: this.targetZPos }, 1500)
            .onUpdate(function() {

              var difference = Math.abs(currentZPos.zPos - actualZPos);
                actualZPos = currentZPos.zPos;
                theObj.translateX(difference);
                theObj.translateY(difference);
                theObj.translateZ(difference);
            })
            .delay(delay)
            .easing(TWEEN.Easing.Quadratic.InOut);
       return move;
      },
      setCameraPos: function () {

      var relCameraOffset = new THREE.Vector3(0,0,220);
      this.cameraOffset = relCameraOffset.applyMatrix4(this.object.matrix); 
      
      } ,
      introAnimation: function () {

      var theTile = this,
        toGrid = this.aniToGrid(0,function() { theTile.showHideImage(500)
          .done(function(theObject){ 

              var translate = theObject.moveRandom(),
                randRotate = theObject.randRotation(),
                randScale = theObject.randScale(500);
                randScale.chain(randRotate);
                randRotate.chain(translate);

                randScale.start();

          }) 
        });

        toGrid.start();

      },
      resetTranslate: function () {

        var theObj = this.object, // cache the object so the update function can access it
        actualZPos= this.targetZPos,
          currentZPos = { zPos: this.targetZPos },
          targetZPos = 0;

      var move = new TWEEN.Tween(currentZPos)
            .to({ zPos: targetZPos }, 500)
            .onUpdate(function() {

              var difference = Math.abs(currentZPos.zPos - actualZPos);
                actualZPos = currentZPos.zPos;
                theObj.translateX(difference);
                theObj.translateY(difference);
                theObj.translateZ(difference);
            })
            .easing(TWEEN.Easing.Quadratic.InOut);
       return move;

      },
      resetScale: function () {

       var resetScale = new TWEEN.Tween(this.object.scale)
          .to({ 
            x: 1,
            y: 1 }, 500)
          .easing( TWEEN.Easing.Back.InOut);
          return resetScale;

      },
      resetRotation: function () {
        var resetRotation =  new TWEEN.Tween( this.object.rotation ).to( {
        x: 0,
        y: 0,
        z: 0 }, 1000 )
        .easing( TWEEN.Easing.Quadratic.Out);
      return resetRotation;

      }
    }

    function cameraMoveIntro () {
      var tweenOut = new TWEEN.Tween( camera.position ).to( {
          z: 650 }, 2000)
          .easing( TWEEN.Easing.Quadratic.InOut)
          .delay(100)
          .onComplete(function() {
            secondMove();
            })
          .start();

            function secondMove () {
              var tweenBack = new TWEEN.Tween( camera.position ).to( {
              z: -650 }, 2000)
              .easing( TWEEN.Easing.Quadratic.InOut)
              .delay(4500)
              .start();
            }
    }

    function clearNearBy (target) {
      var mesh = target,
      mx = mesh.position.x,
      my = mesh.position.y,
      mz = mesh.position.z,
      tolerance = 300,
      moveDist = 180,
      xmin = mx - tolerance,
      xmax = mx + tolerance,
      ymin = my - tolerance,
      ymax = my + tolerance,
      zmin = mz - tolerance,
      zmax = mz + tolerance,
      obstacles = tileMeshes;

      for ( var i = 0; i < obstacles.length; i++) {

        var test = obstacles[i];
        
        if ( test!= mesh ) {

          var tx = test.position.x,
              ty = test.position.y,
              tz = test.position.z;

              //console.log ('mx '+mx+' tx'+ tx+' my '+my+' ty'+ ty+' mz '+mz+' tz'+ tz);

          if( tx > xmin && tx < xmax && ty > ymin && ty < ymax && tz > zmin && tz < zmax ) {

          var currentX = test.position.x,
          currentY = test.position.y,
          currentZ = test.position.z,
          targetX,targetY,targetZ;

          if(currentX<=mx){
            targetX = currentX - moveDist;
          } else if (currentX>mx) {
            targetX = currentX + moveDist;
          }

          if(currentY<=my){
            targetY = currentY - moveDist;
          } else if (currentY>my) {
            targetY = currentY + moveDist;
          }

          if(currentZ<=mz){
            targetZ = currentZ - moveDist;
          } else if (currentZ>mz) {
            targetZ = currentZ+ moveDist;
          }

          var moveIt = new TWEEN.Tween( test.position ).to( {
          x: targetX,
          y: targetY,
          z: targetZ }, 800)
          .easing( TWEEN.Easing.Quadratic.Out);
          moveIt.start();
            //console.log(test);
          }
        }
      }
    }

    scope.tilesToGrid = function () { 

    scope.isAnimating = true;

      $timeout(function() {
        scope.isAnimating = false;
      },4000);   

      for (var p in scope.myProjects) {

          var tile = scope.myProjects[p].tile,
          translate = tile.resetTranslate(),
          rotate = tile.resetRotation(),
          scale = tile.resetScale(),
          gridTween = tile.backToGrid();
          
          translate.chain(rotate);
          rotate.chain(scale);
          scale.chain(gridTween);

          tile.colorTex(),

          translate.start();
      }  
       var camTween = new TWEEN.Tween( camera.position ).to( {
        x: 0,
        y:0,
        z: 550 }, 2000)
        .easing( TWEEN.Easing.Quadratic.InOut)
        .delay(500)
        .start();

        //console.log(camera);
       var targetTween = new TWEEN.Tween(camera.rotation).to({
            x: 0,
            y: 0,
            z: 0
        }, 2000).easing(TWEEN.Easing.Quadratic.InOut)
       .delay(500)
        .onComplete(function () {
            view = 'scene';
            targetTile = undefined;
            targetObj = undefined;
            $timeout(function() {
             flipAllTiles('image');
            },500);
        }).start();
    }

    scope.explodeTiles = function () {

      scope.isAnimating = true;

      $timeout(function() {
        scope.isAnimating = false;
      },4000);

      flipAllTiles('color');

      for (var p in scope.myProjects) {
         var tile = scope.myProjects[p].tile;

          var translate = tile.moveRandom(),
          randRotate = tile.randRotation(),
          randScale = tile.randScale(1800,500);
          randScale.chain(randRotate);
          randRotate.chain(translate);

          randScale.start();
          
      }

          var camPull = new TWEEN.Tween( camera.position ).to( {
          x: 0,
          y:0,
          z: 3150 }, 1500)
          .easing( TWEEN.Easing.Quadratic.InOut);

          var camZoom = new TWEEN.Tween( camera.position ).to( {
          x: 0,
          y:0,
          z: -650 }, 2000)
          .delay(500)
          .easing( TWEEN.Easing.Quadratic.Out);
          

           var camRotation = new TWEEN.Tween(camera.rotation).to({
            x: 0,
            y: 0,
            z: 0 }, 500)
           .easing(TWEEN.Easing.Quadratic.Out)
           .onComplete(function () {
            view = 'scene';    
           });

        camRotation.chain(camPull);

        camPull.chain(camZoom);

        camRotation.start();

    }

    scope.nextTile = function () {

      var current = projectFactory.getTarget(),
      currentLoc = current.index,
      nextLoc = (currentLoc === scope.numImages - 1) ? 0 : currentLoc + 1;

      for (var p in scope.myProjects) {
        var thisLoc = scope.myProjects[p].index;

        if (thisLoc===nextLoc) {

          targetObj = scope.myProjects[p];

          projectFactory.setTarget(targetObj);

          scope.goToTarget(targetObj);

          return;
        }

      }

    }

      scope.prevTile = function () {

      var current = projectFactory.getTarget(),
      currentLoc = current.index,
      prevLoc = (currentLoc === 0) ? scope.numImages - 1 : currentLoc - 1;

      for (var p in scope.myProjects) {
        var thisLoc = scope.myProjects[p].index;

        if (thisLoc===prevLoc) {

          targetObj = scope.myProjects[p];

          projectFactory.setTarget(targetObj);

          scope.goToTarget(targetObj);

          return;
        }
      }
    }

    scope.goToTarget = function (obj) {

      scope.appViewState.threeUi = 'details';

      var thisObject = obj;

      /// set the info

      scope.projectInfo = {
        title: thisObject.title,
        client: thisObject.client
      }

      ///transform the old target
      if(targetTile && scope.appViewState.tileMode == 'explode') {

        var prevTile = targetTile,
        rotate =  prevTile.randRotation(0,200),
        scale = prevTile.randScale(0,500);
        rotate.chain(scale);
        rotate.start();
        prevTile.colorTex();      
      }

      targetTile = thisObject.tile;

      targetTile.imageTex();
      view = 'target';
      targetTile.setCameraPos();
      
      ///get rid of intersecting tiles

      if (scope.appViewState.tileMode === 'explode') {
        
        $timeout(function() {
          clearNearBy(targetTile.object);
        },500);

      }

      targetTile.object.material.opacity = 1;

      new TWEEN.Tween( targetTile.object.scale ).to( {
      x: 1,
      y: 1}, 500 )
      .easing( TWEEN.Easing.Quadratic.InOut).start();

      new TWEEN.Tween( camera.position ).to( {
      x: targetTile.cameraOffset.x,
      y: targetTile.cameraOffset.y,
      z: targetTile.cameraOffset.z}, 1000 )
      .onUpdate(function() {
           // spotlight.position.copy(camera.position);
          })
      .onComplete( function() {
        
      } )
      .easing( TWEEN.Easing.Quadratic.InOut).start();   

      /*new TWEEN.Tween( spotlight.position ).to( {
      x: targetTile.spotlightOffset.x,
      y: targetTile.spotlightOffset.y,
      z: targetTile.spotlightOffset.z}, 1000 )
      .easing( TWEEN.Easing.Quadratic.Out).start();   */       
    }

    function flipAllTiles(texture) {
      for (var p in scope.myProjects) {
        var theTile = scope.myProjects[p].tile;
        if (texture === 'image') {
        theTile.flipToImage();
      } else if (texture === 'color')
        theTile.flipToColor();
      }
    }

    THREE.Mesh.prototype.isNavigation=false;

    THREE.Mesh.prototype.fetchParent = function () {
      if(!this.isNavigation) { 

        return undefined;
      } else {  
      var targetObject;
      for (var i = 0; i < scope.numImages; i ++) {
      var thisObject = scope.myProjects[i],
        thisShape = scope.myProjects[i].tile.object;

          if (thisShape===this) {
          targetObject=thisObject;

          return targetObject;
          }
        }
      }
    }



    function setImagePosition( texture ) {
      tex = texture;

      //console.log($(tex.map.image).width());
      /*texWidth = tex.image.width,
      texHeight = tex.image.height,
      imgAspect;

      if ( texWidth > texHeight ) {
        imgAspect = tex.image.height/tex.image.width;
        tex.repeat.x = imgAspect;
        tex.repeat.y = 1;
        tex.offset.x = imgAspect/2;
      } else if ( texHeight > texWidth ) {
        imgAspect = tex.image.width/tex.image.height;
        tex.repeat.x = 1;
        tex.repeat.y = imgAspect;
        tex.offset.y = imgAspect/2;
      } else if ( texWidth==texHeight ) {
        tex.repeat.x = 1;
        tex.repeat.y = 1;
      }*/

    }

    function init() {

      container = angular.element('#container')[0];

      camera = new THREE.PerspectiveCamera( 55, $window.innerWidth / $window.innerHeight, 1, 12000 );
      camera.position.y = 0;
      camera.position.x = -400;
      camera.position.z = 0;
      scene = new THREE.Scene();

      light = new THREE.AmbientLight( 0x7c7d64 );
      //scene.add( light );

      directionalLight = new THREE.DirectionalLight( 0xcccccc, 0.5 );
      directionalLight.position.set(-1000, 1000, 500 );
      directionalLight.lookAt( scene.position );
      directionalLight.castShadow = false;

      scene.add( directionalLight );

      directionalLight2 = new THREE.DirectionalLight( 0xcccccc, 1 );
      directionalLight2.position.set(1000, 1000, 500 );
      directionalLight2.lookAt( scene.position );
      directionalLight2.castShadow = false;

      scene.add( directionalLight2 );

      directionalLight3 = new THREE.DirectionalLight( 0xcccccc, 1 );
      directionalLight3.position.set(0, -1000, -1000 );
      directionalLight3.lookAt( scene.position );
      directionalLight3.castShadow = false;

      scene.add( directionalLight3 );

      //directionalLight.shadowCameraVisible=true;
      //directionalLight2.shadowCameraVisible=true;
      //directionalLight3.shadowCameraVisible=true;

      var tri = new THREE.Geometry();

      var triV1 = new THREE.Vector3(3000,4000,-6000);
      var triV2 = new THREE.Vector3(-5000,0,-6000);
      var triV3 = new THREE.Vector3(800,-5000,-7000); 

      tri.vertices.push( triV1 ); 
      tri.vertices.push( triV2 );
      tri.vertices.push( triV3 );   

      tri.faces.push( new THREE.Face3( 0, 1, 2 ) );

      tri.computeFaceNormals();
      tri.computeVertexNormals(); // needed so my shape can accept lights!

      triangle = new THREE.Mesh( tri, new THREE.MeshLambertMaterial( { 
        color: 0x191919, 
        side: THREE.DoubleSide
        } ) );  

      triangle.name = 'triangle';

      triangle.geometry.dynamic = true
      triangle.geometry.__dirtyVertices = true;
      triangle.geometry.__dirtyNormals = true;
      scene.add( triangle );

      spotlight = new THREE.SpotLight(0xcccccc,0.7);
      //spotlight.shadowCameraVisible = true;

      spotlight.castShadow = false;
/*      spotlight.shadowCameraNear = 2;
      spotlight.shadowCameraFar = 200;
      spotlight.shadowCameraFov = 130;*/
      spotlight.distance = 0;
      spotlight.angle = Math.PI/2;

      scene.add(spotlight);

      lightTarget = new THREE.Object3D();
      lightTarget.position.set(0,0,-500);
      scene.add(lightTarget);
      spotlight.target=lightTarget;
      
      var sphereGeometry = new THREE.SphereGeometry( 10, 16, 8 );
      var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );

      var wireframeMaterial = new THREE.MeshBasicMaterial( 
        { color: 0xff0000, wireframe: true, transparent: true } ); 
      shape = THREE.SceneUtils.createMultiMaterialObject( 
        sphereGeometry, [ darkMaterial, wireframeMaterial ] );
      shape.position.copy(lightTarget.position);
      //scene.add( shape );

     

////////////////////* CREATE THE TILES *///////////////////////////////


      //projector = new THREE.Projector();

     // renderer = new THREE.WebGLRenderer({ antialias:true });
      renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias:true }) : new THREE.CanvasRenderer();
      renderer.setClearColor( 0x1a181b );
      renderer.setSize( $window.innerWidth, $window.innerHeight );
      renderer.shadowMapEnabled = false;

      container.appendChild(renderer.domElement);

      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      //container.appendChild( stats.domElement );

     /* $document.addEventListener( 'mousedown', onDocumentMouseDown, false );
      $document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      $document.addEventListener( 'touchstart', onDocumentTouchStart, false );
      $document.addEventListener( 'touchmove', onDocumentTouchMove, false );

      $window.addEventListener( 'resize', onWindowResize, false );*/

      jQuery(renderer.domElement).on('click' , onDocumentMouseDown);

      jQuery(document).on('mousemove', onDocumentMouseMove);

      jQuery(window).on('resize', onWindowResize);

       $timeout(function() {
        createTiles();
     },1000);

       $timeout(function() {
        scope.isAnimating = false;
     },8000);

    }

    function createTiles() {

       for ( var i = 0; i < scope.numImages; i ++ ) {

        //console.log(scope.myProjects[i].featuredImage[0]);

        scope.myProjects[i].map = scope.myProjects[i].featuredImage[0];
        scope.myProjects[i].tile = new contentTile(i,150,120,0.9,scope.appViewState.hue,scope.myProjects[i].map);

        var newObj = scope.myProjects[i].tile;

        scene.add(newObj.object);
        tileMeshes.push(newObj.object);
        newObj.introAnimation();  
      }

      cameraMoveIntro();
    }


    function onWindowResize() {

      camera.aspect = $window.innerWidth / $window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( $window.innerWidth, $window.innerHeight );

      }

    function onDocumentMouseDown( event ) {

      event.preventDefault();

      if ( scope.isAnimating == true ) {
        return;
      }

      var vector = new THREE.Vector3( ( event.clientX / $window.innerWidth ) * 2 - 1, - ( event.clientY / $window.innerHeight ) * 2 + 1, 0.5 );
      vector.unproject( camera );

      var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

      var intersects = raycaster.intersectObjects( scene.children );

      if ( intersects.length > 0 ) {

        var hit = intersects[0].object;

        /*console.log(target);*/

        
        if(hit.name === 'triangle') {

          return;
        
        } else {

          var thisObject = hit.fetchParent();

          if (thisObject.tile==targetTile) {

            return;

          } else {

            projectFactory.setTarget(thisObject);

            scope.goToTarget(thisObject);

            scope.$apply(function () {

            scope.appViewState.threeUi = 'details';
          
         });
          }
        }      
      }     
    }

    function onDocumentMouseMove(event) {

      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function onDocumentTouchStart( event ) {

      if ( event.touches.length > 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

      }
    }

    function onDocumentTouchMove( event ) {

      if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

      }
    }

    function animate() {

      if (scope.appViewState.viewing==='three') {

      requestAnimationFrame( animate );
      render();
    
    } else {

      requestAnimationFrame( animate );
      //console.info('Not animating');
    }
    }

    var radius = 600;
    var theta = 0;

    function render() {

      theta += 0.2;
      TWEEN.update();
      if(view==='target'){
      
      var newQuaternion = new THREE.Quaternion();
      THREE.Quaternion.slerp(camera.quaternion, targetTile.object.quaternion, newQuaternion, 0.1);
      camera.quaternion.copy(newQuaternion);
     /* camera.position.x += ( mouseX - camera.position.x ) * .0001;
      camera.position.y += ( - mouseY - camera.position.y ) * .00005;*/
      camera.position.x += ( mouseX - camera.position.x ) * .00005;
      //target.object.rotation.y += ( mouseX - target.object.rotation.y ) * .00001;

      //directionalLight.quaternion.copy(newQuaternion);
      lightTarget.position.copy(targetTile.object.position);
      lightTarget.translateX(-40);
      lightTarget.translateY(-40);
      shape.position.copy(lightTarget.position);
      

      } else if (scope.appViewState.tileMode === 'explode') {
        camera.position.x += ( mouseX - camera.position.x ) * .03;
        camera.position.y += ( - mouseY + 200 - camera.position.y ) * .03;
        camera.lookAt( scene.position );
        directionalLight.lookAt( scene.position );

        lightTarget.position.copy(scene.position);
        shape.position.copy(lightTarget.position);
         
      } else if (scope.appViewState.tileMode === 'grid') {

        camera.position.x += ( mouseX - camera.position.x ) * .03;
        camera.position.y += ( - mouseY + 200 - camera.position.y ) * .03;
        camera.lookAt( scene.position );
        directionalLight.lookAt( scene.position );

        lightTarget.position.copy(scene.position);
        shape.position.copy(lightTarget.position);

      }
      directionalLight.position.copy(camera.position);
      
      camera.updateMatrixWorld();
      spotlight.position.copy(camera.position);


      spotlight.translateX(-50);
      spotlight.translateY(-20);
      spotlight.translateZ(50);
     
      triangle.lookAt(camera.position);      

      var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
      vector.unproject( camera );

      var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

      var intersects = raycaster.intersectObjects( scene.children );

      if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

          if ( INTERSECTED && INTERSECTED != triangle ) INTERSECTED.material.opacity=1;
          
          INTERSECTED = intersects[ 0 ].object;

          if (INTERSECTED != triangle) {
          jQuery('.three').css({'cursor': 'pointer'});
          var tween = new TWEEN.Tween( INTERSECTED.material ).to( {
            opacity: 1 }, 200 )
          .start();
          }
        }

      } else {

        if ( INTERSECTED && INTERSECTED != triangle)  INTERSECTED.material.opacity=0.9;

        INTERSECTED = null;
        jQuery('.three').css({'cursor': 'all-scroll'});

      }

      renderer.render( scene, camera );

      }
      init();
      animate();

      }
    };
}]);