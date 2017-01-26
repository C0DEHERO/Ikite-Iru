function Game() {
  this.board = null;
  this.intersections = [[]];
  this.previewStone = null;
  this.proximityRadius = null;
  this.stones = [[]];
  for(let i = 0; i < 19; i++) {
    this.stones[i] = new Array();
    for(let j = 0; j < 19; j++) {
      this.stones[i][j] = null;
    }
  }
}

Game.prototype = {
  addStone: function(parent) {
    let intersection = this.previewStone.intersection;
    if(this.isLegalMove(intersection)) {
      var stone = this.previewStone.makeStone();
      parent.add(stone.mesh);
      this.stones[intersection.x][intersection.y] = stone; // this.stones[intersection.x] is undefined
      this.previewStone.changeColor();
      this.previewStone.hide();
    }
  },
  /*
  addStone: function(black, intersection, parent) {
    var x = intersection.x;
    var y = intersection.y;
    if (this.isLegalMove(x, y)) {
      var stone = new Stone(black, false);
      stone.makeMesh();
      stone.mesh.position.copy(this.intersections[x][y]);
      parent.add(stone);
      this.stones[x][y] = stone;
    }
  },
  */
  getIntersections: function() {
    this.intersections = calcIntersections(this.board.mesh);
  },
  isLegalMove: function(intersection) {
    return !this.isOccupied(intersection);
  },
  isOccupied: function(intersection) {
    let x = intersection.x;
    let y = intersection.y;
    return this.stones[x][y] != null;
  },
  movePreviewStone: function(intersection) {
    if(this.isOccupied(intersection)) {
      this.previewStone.hide();
    } else {
      this.previewStone.show();
    }
    this.previewStone.intersection = intersection;
    this.previewStone.mesh.position.copy(
      this.intersections[intersection.x][intersection.y]
    );
    this.previewStone.mesh.translateY(this.previewStone.mesh.geometry.boundingBox.getSize().y / 2);
  }
};
