/* global THREE */
function Render(camera, renderParams) {
  this.camera = camera;
  this.camControls = new THREE.FirstPersonControls(this.camera);
  this.initControls();
  this.clock = new THREE.Clock(false);
  this.helpers = [];
  this.helpersEnabled = true;
  this.scene = new THREE.Scene();
  this.raycaster = new THREE.Raycaster();
  this.renderer = new THREE.WebGLRenderer(renderParams);
  this.markers = [];
  this.markersEnabled = false;
  this.markerGeometry = null;
  this.mouse = new THREE.Vector2();
}

Render.prototype = {
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
      var material = new THREE.MeshBasicMaterial({color: col});
      var cube = new THREE.Mesh(this.markerGeometry, material);
      cube.position.copy(pos);
      this.markers.push(cube);
      this.scene.add(cube);
    }
  },
  attachRenderer: function(parent) {
    parent.appendChild(this.renderer.domElement);
  },
  startClock: function() {
    this.clock.start();
  },
  render: function() {
    var render = this;
    render.startClock();
    var animate = function() {
      render.camControls.update(render.clock.getDelta());
      render.renderer.render(render.scene, render.camera);
      requestAnimationFrame(animate);
    };
    animate();
  },
  initControls: function() {
    Object.assign(this.camControls, {
      constrainVertical: false,
      lat: 120,
      lon: -150,
      lookSpeed: 20,
      lookVertical: true,
      movementSpeed: 100,
      noFly: true,
      verticalMax: 2.0,
      verticalMin: 1.0
    });
  }
};
