/* global THREE */

init();

function init() {
  let handler = new GameHandler();
  let graphics = new WebGLGraphics();
  // let logic = new GameLogic();

  handler.addInterface("graphics", graphics);

  setCallbacks(loader, gameGraphics, camera);
}

function setCallbacks(loader, graphics, gameHandler) {
  let onMouseDown = function(event) {
    event.preventDefault();

    if (graphics.previewStone.material.visible) {
      graphics.playStone(graphics.board.mesh);
    }
  };

  let onMouseMove = function(event) {
    event.preventDefault();
    /*
      send(gameHandler, {
      type: "mouseEvent",
      data: {x: event.clientX, y: event.clientY}
      });
    */

    gameHandler.routeMsg({
      type: "mouseMove",
      recipient: "graphics",
      data: {x: event.clientX, y: event.clientY}
    });
  };

  let onKeyDown = function(event) {
    switch (event.keyCode) {
      case 32:
        graphics.pass();
        break;
      case 67:
        if (loader.render.camControls.enabled) {
          loader.render.camControls.enabled = false;
        } else {
          loader.render.camControls.enabled = true;
        }
        break;
    }
  };

  let onLoad = function() {
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
