/* global THREE */
function Loader() {
  this.render;
  this.game;
  this.onMouseDown;
  this.onMouseMove;
  this.objects = [];
  this.loader;
}

Loader.prototype = {
  setLoader: function(loader) {
    this.loader = loader;
    this.loader.objects = this.objects;
  },
  onStart: function(url, itemsLoaded, itemsTotal) {
  },/*
  onLoad: function() {

    for(let object of this.objects) {
      object.makeMesh();
    }

    this.game.board.getRaycastPlane();
    this.game.getIntersections();

    for(let object of this.objects) {
    this.render.scene.add(object.mesh);
    }

    //    document.addEventListener("mousedown", this.onMouseDown);
    //    document.addEventListener("mousemove", this.onMouseMove);
    document.body.appendChild(this.render.renderer.domElement);
    this.render.render();
  },*/
  onProgress: function(url, itemsLoaded, itemsTotal) {
  },
  onError: function(url) {
  }
};
