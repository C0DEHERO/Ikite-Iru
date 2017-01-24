/* global THREE */
function Board() {
  Model.call(this);
  this.raycastPlane = null;
}

Board.prototype = Object.create(Model.prototype, {
  getRaycastPlane: function() {
    this.mesh.geometry.computeBoundingBox();

    var planeGeo = new THREE.PlaneBufferGeometry(
      this.mesh.geometry.boundingBox.getSize().x,
      this.mesh.geometry.boundingBox.getSize().z
    );

    planeGeo.rotateX(-Math.PI / 2);

    this.raycastPlane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({visible: false}));
    this.raycastPlane.position.setY(this.mesh.geometry.boundingBox.max.y);

    return this.raycastPlane;
  }
});
Board.prototype.constructor = Board;
