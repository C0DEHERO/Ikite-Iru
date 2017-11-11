function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype = {
  clone: function() {
    return new Position(this.x, this.y);
  },
  cloneAndApply: function(f) {
    let newObj = new Position(this.x, this.y);
    f(newObj);
    return newObj;
  },
  isEqual: function(o) {
    return this.x === o.x && this.y === o.y;
  },
  getDirections: function(size) {
    let directions = [];
    directions[0] = this.cloneAndApply(o => o.y--);
    directions[1] = this.cloneAndApply(o => o.y++);
    directions[2] = this.cloneAndApply(o => o.x--);
    directions[3] = this.cloneAndApply(o => o.x++);

    return directions.filter(dir => dir.x >= 0 && dir.x < size && dir.y >= 0 && dir.y < size);
  },
  set: function(x, y) {
    this.x = x;
    this.y = y;
  }
};
