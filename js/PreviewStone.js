function PreviewStone(color, players) {
  Stone.call(this, color);
  this.intersection = null;
  this.players = players || 2;
}

PreviewStone.prototype = Object.create(Stone.prototype);
PreviewStone.prototype.load = function(url, loader) {
  Stone.prototype.load.call(this, url, loader);
  // make sure that Stone also gets mesh and materials
  Stone.prototype.load(url, loader);
};
PreviewStone.prototype.makeMesh = function() {
  this.materials = this.materials.slice(0);
  for (let i = 0; i < this.materials.length; i++) {
    this.materials[i] = this.materials[i].clone();
    this.materials[i].opacity = 0.7;
    this.materials[i].transparent = true;
  }

  Stone.prototype.makeMesh.call(this);
};
PreviewStone.prototype.makeStone = function() {
  let stone = new Stone(this.color);
  stone.makeMesh();
  stone.mesh.position.copy(this.mesh.position);
  return stone;
};
PreviewStone.prototype.setColor = function(color) {
  this.color = color;
  this.material = this.materials[color];
  this.mesh.material = this.material;
};
PreviewStone.prototype.toggleColor = function() {
  // this.setColor(1 - this.color);
  if (this.color + 1 < this.players) {
    this.setColor(this.color + 1);
  } else {
    this.setColor(0);
  }
};
