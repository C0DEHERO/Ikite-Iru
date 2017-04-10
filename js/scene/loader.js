/* global THREE */
function Loader() {
  // this.render;
  // this.graphics;
  this.onMouseDown;
  this.onMouseMove;
  this.objects = [];
  this.loader;
}

// make loader queue with function that passes `this` to model object load function

Loader.prototype = {
  setLoader: function(loader) {
    this.loader = loader;
    this.loader.objects = this.objects;
  },
  setOnStart: function(callback) {
    THREE.DefaultLoadingManager.onStart = callback;
  },
  setOnLoad: function(callback) {
    THREE.DefaultLoadingManager.onLoad = callback;
  },
  setOnProgress: function(callback) {
    THREE.DefaultLoadingManager.onProgress = callback;
  },
  setOnError: function(callback) {
    THREE.DefaultLoadingManager.onError = callback;
  }
};
