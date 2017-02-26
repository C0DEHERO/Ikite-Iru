function GameGraphics() {
  this.board = null;
  this.intersections = [[]];
  this.previewStone = null;
  this.proximityRadius = null;
  this.stones = [[]];
  this.logic = null;
  for (let i = 0; i < 19; i++) {
    this.stones[i] = [];
    for (let j = 0; j < 19; j++) {
      this.stones[i][j] = null;
    }
  }
}

GameGraphics.prototype = {
  addStone: function(parent, intersection, isBlack) {
    var stone = new Stone(isBlack);
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
    }
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
    this.board.mesh.remove(this.stones[intersection.x][intersection.y].mesh);
    delete this.stones[intersection.x][intersection.y];
    this.stones[intersection.x][intersection.y] = null;
  }
};
