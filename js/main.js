/* global THREE */

init();

function init() {
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 120;

  var render = new Render(camera,{antialias: true});
  render.renderer.setSize(window.innerWidth, window.innerHeight);

  var lighting = new Lighting();
  lighting.addAmbient(0x404040, render.scene);
  lighting.addPoint(0xffffff, render.camera);

  render.addHelper(new THREE.AxisHelper(1000));

  var game = new Game();
  var board = new Board();
  game.board = board;

  var loader = new Loader(render, game);

  board.load("models/board.json", loader);
  var grid = new Grid().load("models/grid.json", loader);
  var hoshi = new Hoshi().load("models/hoshi.json", loader);
  var previewStone = new PreviewStone(true, true).load("models/stone.json", loader);
  game.previewStone = previewStone;
}

function onMouseDown(event) {
  event.preventDefault();

  if (game.previewStone.material.visible) {
    game.addStone(game.board);
  }
}

function onMouseMove(event) {
  event.preventDefault();

  this.mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  this.raycaster.setFromCamera(this.mouse, this.camera);

  var intersects = this.raycaster.intersectObject(this.plane, false);
  if (intersects.length > 0) {
    var intersect = intersects[0];
    var closestIntersect = closestIntersection(
      game.intersections,
      intersect.point,
      game.previewStone.radius
    );

    if (closestIntersect != null) {
      game.previewStone.show();

      game.previewStone.position.set(
        closestIntersect.x,
        closestIntersect.y + state.stone.geometry.boundingBox.getSize().y / 2,
        closestIntersect.z
      );
    }
  } else {
    game.previewStone.hide();
  }
}
