/* global THREE */
function Model() {
  this.mesh = null;
}

Model.prototype = {
  geometry: null,
  material: null,
  load: function(url, loader, dontPush) {
    var model = this;
    loader.loader.load(url, function(geometry, materials) {
      model.geometry = geometry;
      model.material = new THREE.MultiMaterial(materials);
    });
    if (!dontPush) {
      loader.objects.push(this);
    }
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
