// 0 is black and 1 is white
function Stone(color) {
  Model.call(this);
  this.color = color;
}

Stone.prototype = Object.create(Model.prototype);
Stone.prototype.materials = [null, null];
Stone.prototype.radius = null;
Stone.prototype.height = null;
Stone.prototype.load = function(url, loader) {
  Model.prototype.load.call(this, url, loader);
  if (this.materials[0] == null) {
    this.materials[0] = new THREE.MeshPhongMaterial({
      color: 0x000000
    });
  }
  if (this.materials[1] == null) {
    this.materials[1] = new THREE.MeshPhongMaterial({
      color: 0xf0f0f0,
      specular: 0x202020,
      shininess: 120
    });
  }
  if (this.materials[2] == null) {
    this.materials[2] = new THREE.MeshPhongMaterial({
      color: 0xf96e1d
    });
  }
};
Stone.prototype.makeMesh = function() {
  this.material = this.materials[this.color];
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  // Model.prototype.makeMesh.call(this);

  if (this.mesh.geometry.boundingBox == null) {
    // do I have to permanently store the bounding box?
    this.mesh.geometry.computeBoundingBox();
  }
  if (this.radius == null) {
    this.radius = this.mesh.geometry.boundingBox.getSize().x / 2;
  }
  if (this.height == null) {
    this.height = this.mesh.geometry.boundingBox.getSize().y;
  }
};
