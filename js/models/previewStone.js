function PreviewStone(isBlack) {
  Stone.call(this, isBlack);
  this.intersection = null;
}

PreviewStone.prototype = Object.create(Stone, {
  load: function(url, loader) {
    Stone.prototype.load.apply(this, url, loader);

    if (this.material == null) {
      this.material = Object.getPrototypeOf(this).whiteMaterial.clone();
      this.material.opacity = 0.7;
      this.material.transparent = true;
    }
    if (this.blackMaterial == null) {
      this.blackMaterial = Object.getPrototypeOf(this).blackMaterial.clone();
      this.blackMaterial.opacity = 0.7;
      this.blackMaterial.transparent = true;
    }
  },
  makeStone: function() {
    var stone = new Stone(this.black);
    stone.makeMesh();
    stone.mesh.position.copy(this.mesh.position);
    return stone;
  }
});
