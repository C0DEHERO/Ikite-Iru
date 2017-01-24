function Loader(render, game, onMouseDown, onMouseMove) {
  this.render = render;
  this.game;
  this.onMouseDown;
  this.onMouseMove;
  this.objects = [];
}

Loader.prototype = {
  onStart: function(url, itemsLoaded, itemsTotal) {
  },
  onLoad: function() {
    this.game.board.getRaycastPlane();
    this.game.getIntersections();

    for(let object of this.objects) {
      object.makeMesh();
      this.render.scene.add(object.mesh);
    }
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
  },
  onProgress: function(url, itemsLoaded, itemsTotal) {
  },
  onError: function(url) {
  }
};
