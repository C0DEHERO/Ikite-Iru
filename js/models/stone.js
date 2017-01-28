/* global THREE */
function Stone(isBlack) {
  Model.call(this);
  this.black = isBlack;
}
Stone.prototype = Object.create(Model.prototype);
Stone.prototype.blackMaterial = null;
Stone.prototype.whiteMaterial = null;
Stone.prototype.radius = null;
Stone.prototype.load = function(url, loader, dontPush) {
  Model.prototype.load.call(this, url, loader, dontPush);
  if (this.blackMaterial == null) {
    this.blackMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000
    });
  }
  if (this.whiteMaterial == null) {
    this.whiteMaterial = new THREE.MeshPhongMaterial({
      color: 0xf0f0f0,
      specular: 0x202020,
      shininess: 120
    });
  }
  return this;
};
Stone.prototype.makeMesh = function() {
  if (this.black) {
    this.material = this.blackMaterial;
  } else {
    this.material = this.whiteMaterial;
  }
  this.mesh = new THREE.Mesh(this.geometry, this.material);

  if (this.mesh.geometry.boundingBox == null) {
    this.mesh.geometry.computeBoundingBox();
  }
  if (this.radius == null) {
    this.radius = this.mesh.geometry.boundingBox.getSize().x / 2;
  }
};
