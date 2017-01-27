/* global THREE */
function Stone(isBlack) {
  Model.call(this);
  this.black = isBlack;
}
Stone.prototype = Object.create(Model.prototype);
Stone.prototype.blackMaterial = null;
Stone.prototype.whiteMaterial = null;
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
  if (this.whiteMaterial == null) {
    this.whiteMaterial = new THREE.MeshPhongMaterial({
      color: 0xf0f0f0,
      specular: 0x202020,
      shininess: 63
    });
  }
  return this;
};
Stone.prototype.makeMesh = function() {
  if (this.black) {
    this.material = this.blackMaterial;
    this.mesh = new THREE.Mesh(this.geometry, this.blackMaterial);
  } else {
    this.material = this.whiteMaterial;
    this.mesh = new THREE.Mesh(this.geometry, this.whiteMaterial);
  }
  if (this.mesh.geometry.boundingBox == null) {
    this.mesh.geometry.computeBoundingBox();
  }
};
