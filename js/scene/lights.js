/* global THREE */
function Lighting() {
  this.lights = [];
}

Lighting.prototype = {
  addAmbient: function(color, parent) {
    let light = new THREE.AmbientLight(color);
    this.lights.push(light);
    parent.add(light);
  },
  addPoint: function(color, pos, parent) {
    let light = new THREE.PointLight(color);
    light.position.set(pos);
    this.lights.push(light);
    parent.add(light);
  },
  addSpot: function(color, pos, shadow, parent) {
    var light = new THREE.SpotLight(color);
    light.castShadow = shadow.castShadow;
    light.shadow.mapSize = shadow.mapSize;
    light.shadow.camera = shadow.camera;
    this.lights.push(light);
    parent.add(light);
  }
}
