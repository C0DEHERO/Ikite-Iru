/* global THREE */
function Stone(isBlack) {
  Model.call(this);
  this.black = isBlack;
}
Stone.prototype = Object.create(Model.prototype);
Stone.prototype.blackMaterial = null;
Stone.prototype.radius = null;
Stone.prototype.calculateRadius = function() {
  if (this.mesh.geometry.boundingBox == null) {
    this.mesh.geometry.computeBoundingBox();
  }
  this.radius = this.mesh.geometry.boundingBox.getSize().x / 2;
};
Stone.prototype.load = function(url, loader) {
  Model.prototype.load.call(this, url, loader);
  if (this.blackMaterial == null) {
    this.blackMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
  }
  return this;
};
Stone.prototype.makeMesh = function() {
  if (this.black) {
    this.mesh = new THREE.Mesh(this.geometry, this.blackMaterial);
  } else {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
  if (this.mesh.geometry.boundingBox == null) {
    this.mesh.geometry.computeBoundingBox();
  }
};
