importScripts("gameLogic.js");

gameLogic = new GameLogic();
onmessage = function(e) {
  if (e.data.type === "play") {
    let captured = [];
    let success = self.gameLogic.playStone(
      e.data.data.point,
      e.data.data.color,
      captured
    );
    let workerResult = {
      type: "procMove",
      data: this.getData(success, captured, e.data.data.point)
    };
    postMessage(workerResult);
  } else if (e.data.type === "pass") {
    self.gameLogic.pass();
    postMessage({
      type: "procMove",
      data: self.getData()
    });
  }
};

getData = function(success, captured, point) {
  let data = {
    currentColor: self.gameLogic.currentColor,
    moveNumber: self.gameLogic.moveNumber,
    prisoners: {
      black: self.gameLogic.blackPrisoners,
      white: self.gameLogic.whitePrisoners
    }
  };
  if (success !== undefined) {
    data.success = success;
  }
  if (captured !== undefined) {
    data.captured = captured;
  }
  if (point !== undefined) {
    data.point = point;
  }
};
