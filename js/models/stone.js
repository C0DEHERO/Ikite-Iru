/* global THREE */
function Stone(isBlack) {
  Model.call(this);
  var black = isBlack;
}

Stone.prototype = Object.create(Model, {
  blackMaterial: null,
  radius: null,
  calculateRadius: function() {
    if (!this.mesh.geometry.boundingBox) {
      this.mesh.geometry.computeBoundingBox;
    }
    this.radius = this.mesh.geometry.boundingBox.getSize(x) / 2;
  },
  load: function(url, loader) {
    loader.load(url, function(geometry, materials) {
      if (this.blackMaterial == null) {
        this.blackMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
      }
    });
  },
  makeMesh: function() {
    if(this.black) {
      this.mesh = new THREE.Mesh(this.geometry, this.blackMaterial);
    } else {
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
  }
});
