function Graphics(size, players) {
  this.loader = new THREE.JSONLoader();
  this.board = new Board();
  this.grid = new Grid();
  this.hoshi = new Hoshi();
  this.previewStone = new PreviewStone(0, players);
  this.scene = new THREE.Scene();

  this.raycaster = new THREE.Raycaster();
  this.raycastPlane;
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  this.camera.position.set(0, 389.30, 155.03);
  this.camera.rotation.set(-1.22, 0, 0);
  this.size = size;

  this.intersections = new Intersections();
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.stones = [[]];
  this.allLoaded = false;

  this.scene.add(new THREE.AmbientLight(0x404040));
  let light = new THREE.PointLight(0x0000ff);
  light.position.copy(this.camera.position);
  this.camera.add(light);
  light = new THREE.PointLight(0xffffff, 0.8);
  light.position.copy(new THREE.Vector3(0, 1000, 0));
  this.scene.add(light);

  let floorGeo = new THREE.PlaneGeometry(1000, 1000);
  floorGeo.rotateX(-Math.PI / 2);
  let floorMaterial = new THREE.MeshBasicMaterial({color: 0x07859b, side: THREE.DoubleSide});
  let floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.translateY(-90);
  this.scene.add(floor);

  for (let i = 0; i < size; i++) {
    this.stones[i] = [];
    for (let j = 0; j < size; j++) {
      this.stones[i][j] = null;
    }
  }

  this.mouse = new THREE.Vector2();

  this.init();
}

Graphics.prototype = {
  init: function() {
    let onLoad = function() {
      this.makeMeshes();
      this.addMeshesToScene();
      this.makeRaycastPlane();
      this.intersections.calculateIntersections(this.board.mesh);
      document.body.appendChild(this.renderer.domElement);

      this.allLoaded = true;
      // this.renderer.render();
    };
    this.loader.manager.onLoad = onLoad.bind(this);
    this.loadModels();
  },
  loadModels: function() {
    this.board.load("models/board.json", this.loader);
    this.grid.load("models/grid.json", this.loader);
    this.hoshi.load("models/hoshi.json", this.loader);
    this.previewStone.load("models/stone.json", this.loader);
  },
  makeMeshes: function() {
    this.board.makeMesh();
    this.grid.makeMesh();
    this.hoshi.makeMesh();
    this.previewStone.makeMesh();
    this.previewStone.makeStone();

    // use models array instead?
  },
  addMeshesToScene: function() {
    this.scene.add(this.board.mesh);
    this.scene.add(this.grid.mesh);
    this.scene.add(this.hoshi.mesh);
    this.scene.add(this.previewStone.mesh);
  },
  update: function() {
    this.renderer.render(this.scene, this.camera);
  },
  addStone: function(stone, pos) {
    this.stones[pos.x][pos.y] = stone;
    this.board.mesh.add(stone.mesh);
  },
  delStone: function(pos) {
    this.board.mesh.remove(this.stones[pos.x][pos.y].mesh);
    delete this.stones[pos.x][pos.y];
    this.stones[pos.x][pos.y] = null;
  },
  makeRaycastPlane: function() {
    let mesh = this.board.mesh;
    mesh.geometry.computeBoundingBox();
    let box = mesh.geometry.boundingBox;

    let planeGeo = new THREE.PlaneBufferGeometry(
      box.getSize().x,
      box.getSize().z
    );
    planeGeo.rotateX(-Math.PI / 2);

    this.raycastPlane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({visible: false})
    );
    this.raycastPlane.position.setY(box.max.y);

    this.scene.add(this.raycastPlane);
  },
  getIntersectionFromMouse: function(pos) {
    this.mouse.set(pos.x, pos.y);
    let meshIntersect = null;
    let boardIntersect = null;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObject(this.raycastPlane, false);
    if (intersects.length > 0) {
      meshIntersect = intersects[0];
      boardIntersect = this.intersections.getClosestIntersection(
        meshIntersect.point,
        this.previewStone.radius
      );
    }
    return {
      meshIntersect: meshIntersect,
      boardIntersect: boardIntersect
    };
  },
  isOccupied: function(intersect) {
    return this.stones[intersect.x][intersect.y] !== null;
  },
  updatePreviewStone: function(intersect) {
    if (intersect.meshIntersect !== null) {
      if (intersect.boardIntersect !== null) {
        this.movePreviewStone(intersect.boardIntersect);
        if (!this.isOccupied(intersect.boardIntersect)) {
          this.previewStone.show();
        } else {
          this.previewStone.hide();
        }
      }
    } else {
      this.previewStone.hide();
    }
  },
  movePreviewStone: function(intersection) {
/*    if (this.isOccupied(intersection)) {
      this.previewStone.hide();
    } else {
      this.previewStone.show();
    }*/
    this.previewStone.intersection = intersection;
    this.previewStone.mesh.position.copy(
      this.intersections.getCoordsForIntersection(intersection)
    );
    this.previewStone.mesh.translateY(this.previewStone.height / 2);
  },
  playStone: function(move, captured) {
    let newStone = new Stone(move.color - 1);
    newStone.makeMesh();

    newStone.mesh.position.copy(
      this.intersections.getCoordsForIntersection(move.pos)
    );
    newStone.mesh.translateY(newStone.height / 2);
    this.addStone(newStone, move.pos);
    for (let stone of captured) {
      this.delStone(stone);
    }

    this.previewStone.toggleColor();
    this.previewStone.hide();
  }
};
