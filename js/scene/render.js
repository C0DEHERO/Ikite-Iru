/* global THREE */
function Render(camera, renderParams) {
  this.camera = camera;
  this.camControls = new THREE.FirstPersonControls(this.camera);
  this.initControls();
  this.clock = new THREE.Clock(false);
  this.scene = new THREE.Scene();
  this.raycaster = new THREE.Raycaster();
  this.raycastPlane = null;
  this.renderer = new THREE.WebGLRenderer(renderParams);
  this.mouse = new THREE.Vector2();
}

Render.prototype = {
  attachRenderer: function(parent) {
    parent.appendChild(this.renderer.domElement);
  },
  startClock: function() {
    this.clock.start();
  },
  render: function() {
    let render = this;
    render.startClock();
    let animate = function() {
      render.camControls.update(render.clock.getDelta());
      render.renderer.render(render.scene, render.camera);
      requestAnimationFrame(animate);
    };
    animate();
  },
  initControls: function() {
    Object.assign(this.camControls, {
      enabled: false,
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
  },
  makeRaycastPlane: function(mesh) {
    mesh.geometry.computeBoundingBox();

    let planeGeo = new THREE.PlaneBufferGeometry(
      mesh.geometry.boundingBox.getSize().x,
      mesh.geometry.boundingBox.getSize().z
    );

    planeGeo.rotateX(-Math.PI / 2);

    this.raycastPlane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({visible: false}));
    this.raycastPlane.position.setY(mesh.geometry.boundingBox.max.y);

    this.scene.add(this.raycastPlane);
  },
  getRayIntersect: function() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObject(this.raycastPlane, false);
  }
};
