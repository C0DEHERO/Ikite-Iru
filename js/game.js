function Game() {
  var board = null;
  var intersections = [[]];
  var previewStone = null;
  var proximityRadius = null;
  var stones = [[]];
}

Game.prototype = {
  addStone: function(parent) {
    var stone = this.previewStone.makeStone();
    parent.add(stone);
    this.stones[x][y] = stone;
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
  isLegalMove: function(x, y) {
    if (this.intersections[x][y] != null) {
      return false;
    }
  }
};
