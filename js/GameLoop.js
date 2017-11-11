let size = 19;
let controller = new Controller();
let netController;
let game = new Game(size);
let graphics = new Graphics(size);

loop();

function loop() {
  // maybe I should just add the state from Game to updateInfo and remove anything I don't want to pass to the gui
  // maybe updateInfo should be an array. not sure though
  // maybe updateInfo command should be an array
  controller.handleInput();
  netController.update();
  let updateInfo = game.update();
  graphics.update(updateInfo);
  requestAnimationFrame(loop);
}
