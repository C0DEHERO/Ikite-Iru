function PreviewStone(isBlack) {
  Stone.call(this, isBlack);
  this.intersection = null;
}

PreviewStone.prototype = Object.create(Stone.prototype);
PreviewStone.prototype.load = function(url, loader) {
  Stone.prototype.load.call(this, url, loader);
  Stone.prototype.load(url, loader);
  return this;
};
PreviewStone.prototype.makeMesh = function() {
  Stone.prototype.makeMesh.call(this);

  this.whiteMaterial.opacity = 0.7;
  this.whiteMaterial.transparent = true;

  this.blackMaterial.opacity = 0.7;
  this.blackMaterial.transparent = true;
};
PreviewStone.prototype.makeStone = function() {
  var stone = new Stone(this.black);
  stone.makeMesh();
  stone.mesh.position.copy(this.mesh.position);
  return stone;
};
PreviewStone.prototype.changeColor = function() {
  if (this.black) {
    this.black = false;
    this.material = this.whiteMaterial;
  } else {
    this.black = true;
    this.material = this.blackMaterial;
  }
  this.mesh.material = this.material;
};
