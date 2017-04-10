function GameGraphics() {
  this.board = null;
  this.intersections = [[]];
  this.previewStone = null;
  this.proximityRadius = null;
  this.stones = [[]];
  for (let i = 0; i < 19; i++) {
    this.stones[i] = [];
    for (let j = 0; j < 19; j++) {
      this.stones[i][j] = null;
    }
  }
}

// send messages to WebGLGraphics saying how meshes should be modified/added/deleted?
// probably not. gamegraphics only needs a reference to the board. threejs does the rest

GameGraphics.prototype = {
  receive: function(msg) {
    if (msg.type === "place") {
      this.gameGraphics.addStone(this.gameGraphics.board.mesh, msg.data.point, msg.data.color);
    }
    if (msg.type === "play") {
    }
    if (msg.type === "pass") {
      this.pass();
    }
  },
  send: function(msg) {
    this.gameHandler.routeMsg(msg);
  }
  input: function(action) {
    switch (action.type) {
      case "play":
        let color = convertColor(this.previewStone.black);
        return {
          type: action.type,
          data: {
            color: color,
            point: this.previewStone.intersection,
            checkRules: true
          }
        };
      case "pass":
        return {
          type: action.type
        };
    }
    return { type: "invalid" };
  },
  output: function(action) {
    switch (action.type) {
      case "procMove":
        if (action.data.success) {
          this.addStone(this.board.mesh, action.data.point, convertColor(action.data.color));
          for (let group of action.data.captured) {
            for (let stone of group) {
              this.removeStone(this.board.mesh, stone);
            }
          }
        }
    }
  },
  addStone: function(parent, intersection, isBlack) {
    let stone = new Stone(isBlack);
    stone.makeMesh();
    let x = intersection.x;
    let y = intersection.y;

    stone.mesh.position.copy(this.intersections[x][y]);
    stone.mesh.translateY(stone.height / 2);
    parent.add(stone.mesh);
    this.stones[x][y] = stone;
  },
  pass: function() {
    this.logic.pass();
    this.previewStone.changeColor();
  },
  playStone: function(parent) {
    let intersection = this.previewStone.intersection;
    let black = this.previewStone.black;
    if (this.playStoneAt(parent, intersection, black)) {
      this.previewStone.changeColor();
      this.previewStone.hide();
      return true;
    }
    return false;
  },
  playStoneAt: function(parent, intersection, isBlack) {
    let color = isBlack ? 1 : 2;
    let captured = [];
    let success = this.logic.playStone(intersection, color, captured);

    if (success) {
      this.addStone(parent, intersection, isBlack);
      for (let group of captured) {
        for (let stone of group) {
          this.removeStone(parent, stone);
        }
      }
    }
    return success;
  },
  getIntersections: function() {
    this.intersections = calcIntersections(this.board.mesh);
  },
  isOccupied: function(intersection) {
    let x = intersection.x;
    let y = intersection.y;
    return this.stones[x][y] != null;
  },
  movePreviewStone: function(intersection) {
    if (this.isOccupied(intersection)) {
      this.previewStone.hide();
    } else {
      this.previewStone.show();
    }
    this.previewStone.intersection = intersection;
    this.previewStone.mesh.position.copy(
      this.intersections[intersection.x][intersection.y]
    );
    this.previewStone.mesh.translateY(this.previewStone.height / 2);
  },
  removeStone: function(parent, intersection) {
    if (this.stones[intersection.x][intersection.y] === null) {
      return;
    }
    // parent.remove
    this.board.mesh.remove(this.stones[intersection.x][intersection.y].mesh);
    delete this.stones[intersection.x][intersection.y];
    this.stones[intersection.x][intersection.y] = null;
  },
  mouseMove: function(intersect) {
    if (intersect === null) {
      this.previewStone.hide();
      return;
    }
    let closestIntersect = closestIntersect(
      this.intersections,
      intersect.point,
      this.previewStone.radius
    );

    if (closestIntersect !== null) {
      this.previewStone.show();
      this.movePreviewStone(closestIntersect);
    }
  }
};
