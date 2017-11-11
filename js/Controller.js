function Controller(color) {
  this.mouse = new Position(null, null);
  this.mouseDown = false;
  this.mouseMoved = false;
  this.intersection = {
    meshIntersect: null,
    boardIntersect: null
  };
  this.color = color;
  this.active = false;

  this.mouseDown = function(event) {
    if (!this.active) {
      return;
    }
    event.preventDefault();
    this.mouseDown = true;
  };

  this.mouseMove = function(event) {
    if (!this.active) {
      return;
    }
    event.preventDefault();
    this.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.mouseMoved = true;
  };

  document.addEventListener("mousedown", this.mouseDown.bind(this));
  document.addEventListener("mousemove", this.mouseMove.bind(this));
}
// I could make a separate Controller for the board (move preview stone, place stone) and the UI (move camera, etc)
Controller.prototype = {
  handleInput: function(game, graphics) {
    if (!graphics.allLoaded) {
      return false;
    }
    if (this.mouseMoved) {
      this.mouseMoved = false;
      let newIntersection = graphics.getIntersectionFromMouse(this.mouse);
      this.intersection.meshIntersect = newIntersection.meshIntersect;

      if (newIntersection.boardIntersect !== null) {
        this.intersection.boardIntersect = newIntersection.boardIntersect;
      }

      if (this.intersection.meshIntersect === null) {
        this.intersection.boardIntersect = null;
      }

      graphics.updatePreviewStone(this.intersection);
    }
    if (this.mouseDown) {
      this.mouseDown = false;
      if (this.intersection.boardIntersect !== null) {
        // let color = (game.getCurrentState().moveNumber + 1) % 2;

        // if I want to, I can check if game and graphics use the same color
        // I could also pass an argument to update saying whether the ui or the gamestate should decide the color
        // or whether the controller or the gamestate should decide the color. because technically, i don't have to
        // tell Game which color it should play
        let result = game.play(new Move(this.intersection.boardIntersect, this.color));
        if (result.status === "valid" && this.intersection.meshIntersect !== null) {
          graphics.playStone(result.state.move, result.state.captured);
          return true;
        } else {
          console.log(result);
          // graphics.displayError(result.status);
        }
      }
    }
    return false;
  },
  // maybe call them resume() and pause() instead
  activate: function() {
    this.active = true;
  },
  deactivate: function() {
    this.active = false;
  }
};
