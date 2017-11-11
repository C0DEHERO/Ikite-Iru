const size = 19;
let controller = new Controller(0);
let controller2 = new Controller(1);
let controller3 = new Controller(2);
let debugController = new DebugController();
let netController;
let game = new Game(size, 2);
let graphics = new Graphics(size, 2);
let cameraController = new CameraController(graphics);

let controllerManager = new ControllerManager();
controllerManager.controllers.push(controller);
controllerManager.controllers.push(controller2);
// controllerManager.controllers.push(controller3);
controllerManager.start();
// controllerManager.controllers.push(debugController);

loop();

function loop() {
  controllerManager.handleInput(game, graphics);
  // controller.handleInput(game, graphics);
  cameraController.handleInput(graphics);

  //netController.update();
  game.update();
  graphics.update();
  requestAnimationFrame(loop);
}
