/* global THREE Loader GameGraphics Lighting Guides Grid Hoshi PreviewStone */
function WebGLGraphics() {
  this.loader = new Loader();
  this.gameGraphics = new GameGraphics();

  this.lighting = new Lighting();

  this.camera = this.makeCamera();

  // this.camControls = new THREE.FirstPersonControls(this.camera);
  // this.initControls();
  this.clock = new THREE.Clock(false);
  this.scene = new THREE.Scene();
  this.raycaster = new THREE.Raycaster();
  this.raycastPlane = null;
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.mouse = new THREE.Vector2();
  this.guides = new Guides();

  this.interface = {
    updateInput: false,
    updateOutput: false,
    i: null,
    o: null,
    get input() {
      this.updateInput = false;
      return this.i;
    },
    set input(x) {
      this.updateInput = true;
      this.i = x;
    },
    get output() {
      this.updateOutput = false;
    },
    set output(x) {
      this.updateOutput = true;
      this.o = x;
    }
  };
}

WebGLGraphics.prototype = {
  makeCamera: function() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 389.30, 155.03);
    camera.rotation.set(-1.22, 0, 0);
    return camera;
  },
  makeLighting: function() {
    let lighting = new Lighting();
    lighting.addAmbient(0x404040, this.scene);
    lighting.addPoint(0xffffff, new THREE.Vector3(0, 10000, 0), this.scene, 0.8);
    return lighting;
  },
  init: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    let board = new Board();
    this.gameGraphics.board = board;

    this.loader.loader = new THREE.JSONLoader();

    board.load("models/board.json", this.loader);
    new Grid().load("models/grid.json", this.loader);
    new Hoshi().load("models/hoshi.json", this.loader);
    let previewStone = new PreviewStone(true).load("models/stone.json", this.loader);
    this.gameGraphics.previewStone = previewStone;
  },
  render: function() {
    let render = this;
    // render.startClock();
    let animate = function() {
      // render.camControls.update(render.clock.getDelta());
      render.renderer.render(render.scene, render.camera);
      requestAnimationFrame(animate);
    };
    animate();
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
  },
  mouseMove: function(x, y) {
    this.mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.getRayIntersect();
    let intersect = intersects.length > 0 ? intersects[0] : null;

    this.gameGraphics.onMouseMove(intersect);
  },
  send: function() {
    if (clicked) {
      this.gameGraphics.playStone();
    }
    if (space) {
      this.gameGraphics.pass();
    }
  },
  receive: function(msg) {
    if (msg.type === "place") {
      this.gameGraphics.addStone(this.gameGraphics.board.mesh, msg.data.point, msg.data.color);
    }

    if (msg.type === "mouseMove") {
      this.mouseMove(msg.data.x, msg.data.y);
      return;
    }

    this.gameGraphics.receive(msg);
  }
};
