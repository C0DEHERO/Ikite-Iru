/* global THREE */

init();

function init() {
  var loader = new Loader();
  var game = new Game();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(300,10,0);

  var render = new Render(camera,{antialias: true});
  render.renderer.setSize(window.innerWidth, window.innerHeight);

  var lighting = new Lighting();
  lighting.addAmbient(0x404040, render.scene);
  lighting.addPoint(0x0000ff, render.camera.position, render.camera);
  lighting.addPoint(0xffffff, new THREE.Vector3(0, 500, 0), render.scene);

  render.addHelper(new THREE.AxisHelper(1000));

//  var game = new Game();
  var board = new Board();
  game.board = board;

  loader.render = render;
  loader.game = game;
  loader.loader = new THREE.JSONLoader();

  board.load("models/board.json", loader);
  var grid = new Grid().load("models/grid.json", loader);
  var hoshi = new Hoshi().load("models/hoshi.json", loader);
  var previewStone = new PreviewStone(true).load("models/stone.json", loader);
  game.previewStone = previewStone;

  setCallbacks(loader, game);
}

function setCallbacks(loader, game) {
  var onMouseDown = function(event) {
    event.preventDefault();

    if (game.previewStone.material.visible) {
      game.addStone(game.board.mesh);
    }
  };

  var onMouseMove = function(event) {
    event.preventDefault();
    var render = loader.render;

    render.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    render.raycaster.setFromCamera(render.mouse, render.camera);

    var intersects = render.raycaster.intersectObject(game.board.raycastPlane, false);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      var closestIntersect = closestIntersection(
        game.intersections,
        intersect.point,
        game.previewStone.radius
      );

      console.log(closestIntersect);

      if (closestIntersect != null) {
        game.previewStone.show();

        /*game.previewStone.mesh.position.set(
          closestIntersect.x,
          closestIntersect.y + 5,
          //closestIntersect.y + game.previewStone.geometry.boundingBox.getSize().y / 2,
          closestIntersect.z
          );*/

        game.movePreviewStone(closestIntersect);
      }
    } else {
      game.previewStone.hide();
    }
  };

  var onLoad = function() {
    for(let object of loader.objects) {
      object.makeMesh();
    }

    loader.game.board.getRaycastPlane();
    loader.render.scene.add(loader.game.board.raycastPlane);
    loader.game.getIntersections();
    loader.game.previewStone.calculateRadius();

    loader.render.addMarker(new THREE.Vector3(0,50,0),0xffffff);


    for(let row of loader.game.intersections) {
      for(let point of row) {
        loader.render.addMarker(point, 0xff0000);
      }
    }

    for(let object of loader.objects) {
      console.log("add to scene");
      loader.render.scene.add(object.mesh);
    }

    //  loader.render.startClock();
    loader.render.initControls();

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    //document.body.appendChild(loader.render.renderer.domElement);

    loader.render.attachRenderer(document.body);
    loader.render.render();

    //loader.render.camera.position.set(300,10,0);
  };
  THREE.DefaultLoadingManager.onLoad = onLoad;
}
