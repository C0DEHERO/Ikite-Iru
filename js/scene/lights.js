/* global THREE */
function Lighting() {
  this.lights = [];
}

Lighting.prototype = {
  addAmbient: function(color, parent, intensity) {
    let light;
    if (intensity !== undefined) {
      light = new THREE.AmbientLight(color, intensity);
    } else {
      light = new THREE.AmbientLight(color);
    }
    this.lights.push(light);
    parent.add(light);
  },
  addPoint: function(color, pos, parent, intensity) {
    let light;
    if (intensity !== undefined) {
      light = new THREE.PointLight(color, intensity);
    } else {
      light = new THREE.PointLight(color);
    }
    light.position.copy(pos);
    this.lights.push(light);
    parent.add(light);
  },
  addSpot: function(color, pos, shadow, parent, intensity) {
    let light;
    if (intensity !== undefined) {
      light = new THREE.SpotLight(color, intensity);
    } else {
      light = new THREE.SpotLight(color);
    }
    light.castShadow = shadow.castShadow;
    light.shadow.mapSize = shadow.mapSize;
    light.shadow.camera = shadow.camera;
    this.lights.push(light);
    parent.add(light);
  }
};
