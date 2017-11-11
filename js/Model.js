function Model() {
  this.mesh = null;
}

Model.prototype = {
  geometry: null,
  material: null,
  load: function(url, loader) {
    let model = this;
    loader.load(url, function(geometry, materials) {
      model.geometry = geometry;
      model.material = materials[0];
    });
  },
  makeMesh: function() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  },
  hide: function() {
    this.mesh.material.visible = false;
  },
  show: function() {
    this.mesh.material.visible = true;
  }
};
