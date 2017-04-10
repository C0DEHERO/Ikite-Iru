function Guides() {
  this.helpers = [];
  this.helpersEnabled = false;

  this.markers = [];
  this.markersEnabled = false;
  this.markerGeometry = null;
  this.markerMaterials = {};
}

Guides.prototype = {
  addHelper: function(helper) {
    if (this.helpersEnabled) {
      this.helpers.push(helper);
      this.scene.add(helper);
    }
  },
  addMarker: function(pos, col) {
    if (this.markersEnabled) {
      if (this.markerGeometry == null) {
        this.markerGeometry = new THREE.BoxGeometry(1, 1, 1);
      }
      if (this.markerMaterials[col] == null) {
        this.markerMaterials[col] = new THREE.MeshBasicMaterial({color: col});
      }
      let cube = new THREE.Mesh(this.markerGeometry, this.markerMaterials[col]);
      cube.position.copy(pos);
      this.markers.push(cube);
      this.scene.add(cube);
    }
  }
};
