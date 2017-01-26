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
PreviewStone.prototype.makeMesh = function() { // could also add a callback function array to loader instead
  Stone.prototype.makeMesh.call(this);

  this.material.opacity = 0.7;
  this.material.transparent = true;

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
  if(this.black) {
    this.black = false;
    this.mesh.material = this.material;
  } else {
    this.black = true;
    this.mesh.material = this.blackMaterial;
  }
};
PreviewStone.prototype.hide = function() {
  this.material.visible = false;
  this.blackMaterial.visible = false;
};
PreviewStone.prototype.show = function() {
  this.material.visible = true;
  this.blackMaterial.visible = true;
};
