/* global THREE */
function Model() {
  this.mesh = null;
}

Model.prototype = {
  geometry: null,
  material: null,
  load: function(url, loader) {
    loader.load(url, function(geometry, materials) {
      this.geometry = geometry;
      this.material = new THREE.MultiMaterial(materials);
    });
    loader.objects.push(this);
    return this;
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
