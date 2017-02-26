/* global THREE */

init();

function init() {
  var loader = new Loader();
  var gameGraphics = new GameGraphics();
  var gameLogic = new GameLogic();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 200, 300);

  var render = new Render(camera, {antialias: true});
  render.renderer.setSize(window.innerWidth, window.innerHeight);

  var lighting = new Lighting();
  lighting.addAmbient(0x404040, render.scene);
  lighting.addPoint(0x0000ff, render.camera.position, render.camera);
  lighting.addPoint(0xffffff, new THREE.Vector3(0, 500, 0), render.scene);

  render.addHelper(new THREE.AxisHelper(1000));

  var board = new Board();
  gameGraphics.board = board;

  loader.render = render;
  loader.graphics = gameGraphics;
  loader.loader = new THREE.JSONLoader();

  board.load("models/board.json", loader);
  new Grid().load("models/grid.json", loader);
  new Hoshi().load("models/hoshi.json", loader);
  var previewStone = new PreviewStone(true).load("models/stone.json", loader);
  gameGraphics.previewStone = previewStone;

  setCallbacks(loader, gameGraphics);
  // TODO: use callback to gameLogic.playStone instead
  gameGraphics.logic = gameLogic;
}

function setCallbacks(loader, graphics) {
  var onMouseDown = function(event) {
    event.preventDefault();

    if (graphics.previewStone.material.visible) {
      graphics.playStone(graphics.board.mesh);
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

    var intersects = render.getRayIntersect();
    if (intersects.length > 0) {
      var intersect = intersects[0];
      var closestIntersect = closestIntersection(
        graphics.intersections,
        intersect.point,
        graphics.previewStone.radius
      );

      if (closestIntersect != null) {
        graphics.previewStone.show();

        graphics.movePreviewStone(closestIntersect);
      }
    } else {
      graphics.previewStone.hide();
    }
  };

  var onKeyDown = function(event) {
    if (event.keyCode === 32) {
      graphics.pass();
    }
  }

  var onLoad = function() {
    for (let object of loader.objects) {
      object.makeMesh();
      loader.render.scene.add(object.mesh);
    }

    loader.render.makeRaycastPlane(loader.graphics.board);
    loader.graphics.getIntersections();

    markIntersections(loader.game, loader.render);

    loader.render.initControls();

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);

    loader.render.attachRenderer(document.body);
    loader.render.render();
  };
  loader.setOnLoad(onLoad);
}
