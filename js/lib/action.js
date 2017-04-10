function Action(name) {
  this.name = name;
}


// make Interface object? dunno

function GameController() {
  this.gameLogic;
  this.gameGraphics;
}

function Interface() {
  this.inputs;
  this.outputs;
  this.gameLogic;
}

interface.inputs.push(gui);

process(data) {
  if (data.type === "play") {
    if (data.checkRules) {
      let result = this.gameLogic.input(data);
      for (output of outputs) {
        output.output(result);
    } else {
      this.gameLogic.setAt(data.point, data.color);
      return = {
        type: "set",
        data: {
          color: data.color,
          success: true
        }
      };
    }
  }
}


guiData = {
  type: "play",
  data: {
    color: 1,
    point: {
      x: 0,
      y: 0
    },
    checkRules: true
  }
}


// graphics -> logic -> graphics
  // graphics -> interface -> logic -> interface -> graphics

// graphics -> worker -> logic -> worker -> graphics
// graphics -> worker -> graphics
