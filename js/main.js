/* global THREE */

init();

function init() {
  var loader = new Loader();
  var game = new Game();

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
  game.board = board;

  loader.render = render;
  loader.game = game;
  loader.loader = new THREE.JSONLoader();

  board.load("models/board.json", loader);
  new Grid().load("models/grid.json", loader);
  new Hoshi().load("models/hoshi.json", loader);
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

    var intersects = render.getRayIntersect();
    if (intersects.length > 0) {
      var intersect = intersects[0];
      var closestIntersect = closestIntersection(
        game.intersections,
        intersect.point,
        game.previewStone.radius
      );

      if (closestIntersect != null) {
        game.previewStone.show();

        game.movePreviewStone(closestIntersect);
      }
    } else {
      game.previewStone.hide();
    }
  };

  var onLoad = function() {
    for (let object of loader.objects) {
      object.makeMesh();
      loader.render.scene.add(object.mesh);
    }

    loader.render.makeRaycastPlane(loader.game.board);
    loader.game.getIntersections();

    markIntersections(loader.game, loader.render);

    loader.render.initControls();

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);

    loader.render.attachRenderer(document.body);
    loader.render.render();
  };
  loader.setOnLoad(onLoad);
}
