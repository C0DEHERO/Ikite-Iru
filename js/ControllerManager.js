function ControllerManager() {
  this.controllers = [];
  this.turn = 0;
}

ControllerManager.prototype = {
  handleInput: function(game, graphics) {
    let currentController = this.controllers[this.turn];
    let result = currentController.handleInput(game, graphics);
    if (result) {
      this.deactivate(this.turn);
      this.turn++;
      if (this.turn >= this.controllers.length) {
        this.turn = 0;
      }
      this.activate(this.turn);
    }
  },
  activate: function(index) {
    this.controllers[index].activate();
  },
  deactivate: function(index) {
    this.controllers[index].deactivate();
  },
  start: function() {
    this.activate(this.turn);
  }
};
