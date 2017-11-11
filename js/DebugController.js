function DebugController(color) {
  this.position = null;
  this.pass = false;
  this.color = color;
}

DebugController.prototype = {
  handleInput: function(game, graphics) {
    if (this.position != null) {
      let result = game.play(new Move(this.position, this.color));
      this.position = null;
      if (result.status === "valid") {
        graphics.playStone(result.state.move, result.state.captured);
        return true;
      }
      if (this.pass) {
        game.pass(this.color);
        this.pass = false;
        return true;
      }
    }
    return false;
  },
  play: function(x, y) {
    this.position = new Position(x, y);
  },
  pass: function() {
    this.pass = true;
  },
  activate: function() {
  },
  deactivate: function() {
  }
};
