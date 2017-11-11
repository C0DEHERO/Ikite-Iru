function Move(pos, color) {
  this.pos = pos;
  this.color = color;
}

Move.prototype = {
  clone: function() {
    return new Move(this.pos.clone(), this.color);
  }
};
