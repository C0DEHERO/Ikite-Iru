/* global THREE */
var state = {
  camera: null,
  clock: null,
  controls: null,
  goban: {
    bottomLeft: null,
    intersections: [[]],
    lSpacing: null,
    mesh: null,
    topRight: null,
    wSpacing: null
  },
  lights: [],
  markers: [],
  markersEnabled: false,
  markerGeometry: null,
  mouse: null,
  plane: null,
  preview: false,
  raycaster: null,
  renderer: null,
  scene: null,
  stone: null,
  stoneMaterials: {
    black: null,
    white: null
  }
};

init();
render();

function init() {
  state.scene = new THREE.Scene();

  state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  state.camera.position.y = 120;

  state.controls = new THREE.FirstPersonControls(state.camera);
  initControls(state.controls);

  state.clock = new THREE.Clock();

  state.lights[0] = new THREE.AmbientLight(0x404040);
  state.scene.add(state.lights[0]);

  var pointLight = new THREE.PointLight(0xffffff);
  pointLight.position = state.camera.position;
  state.camera.add(pointLight);
  state.scene.add(state.camera);

  state.raycaster = new THREE.Raycaster();
  state.mouse = new THREE.Vector2();

  var loader = new THREE.JSONLoader();
  loader.load("models/goban/board.json", function(geometry, materials) {
    var material = new THREE.MultiMaterial(materials);
    state.goban.mesh = new THREE.Mesh(geometry, material);
    state.scene.add(state.goban.mesh);

    calcIntersections(state.goban);

    var planeGeo = new THREE.PlaneBufferGeometry(
      Math.abs(state.goban.bottomLeft.x - state.goban.topRight.x),
      Math.abs(state.goban.bottomLeft.z - state.goban.topRight.z)
    );

    planeGeo.rotateX(-Math.PI / 2);

    state.plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({visible: false}));
    state.plane.position.setY(state.goban.bottomLeft.y);
    state.scene.add(state.plane);

    addMarker(state.goban.bottomLeft, 0x00ff00);
    addMarker(state.goban.topRight, 0xff0000);
  });

  loader.load("models/goban/grid.json", function(geometry, materials) {
    var grid = new THREE.Mesh(geometry, materials[0]);
    // state.goban.mesh.localToWorld(state.goban.mesh.position);
    state.goban.mesh.add(grid);
  });

  loader.load("models/goban/hoshi.json", function(geometry, materials) {
    var hoshi = new THREE.Mesh(geometry, materials[0]);
    state.goban.mesh.add(hoshi);
  });

  loader.load("models/goban/stone.json", function(geometry, materials) {
    var material = materials[0];
    state.stoneMaterials.white = material.clone();
    material.opacity = 0.7;
    material.transparent = true;
    state.stone = new THREE.Mesh(geometry, material);
    state.stone.geometry.computeBoundingBox();
    state.goban.mesh.add(state.stone);
  });

  state.scene.add(new THREE.AxisHelper(1000));

  state.renderer = new THREE.WebGLRenderer({antialias: true});
  state.renderer.setSize(window.innerWidth, window.innerHeight);

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.body.appendChild(state.renderer.domElement);
}

function render() {
  state.controls.update(state.clock.getDelta());
  state.renderer.render(state.scene, state.camera);
  requestAnimationFrame(render);
}

function addMarker(pos, col) {
  if (state.markersEnabled) {
    if (state.markerGeometry == null) {
      state.markerGeometry = new THREE.BoxGeometry(1, 1, 1);
    }
    var material = new THREE.MeshBasicMaterial({color: col});
    var cube = new THREE.Mesh(state.markerGeometry, material);
    cube.position.copy(pos);
    state.markers.push(cube);
    state.scene.add(cube);
  }
}

function initControls(camControls) {
  Object.assign(camControls, {
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

function calcIntersections(goban) {
  var vertices = goban.mesh.geometry.vertices;
  var topVertices = [];
  var maxY = vertices[0].y;

  for (let vertex of vertices) {
    maxY = vertex > maxY ? vertex : maxY;
  }

  for (let vertex of vertices) {
    if (vertex.y == maxY) {
      topVertices.push(vertex);
    }
  }

  goban.bottomLeft = topVertices[0];
  goban.topRight = topVertices[0];

  for (let vertex of topVertices) {
    if (vertex.x <= goban.bottomLeft.x && vertex.z >= goban.bottomLeft.z) {
      goban.bottomLeft = vertex;
    }

    if (vertex.x >= goban.topRight.x && vertex.z <= goban.topRight.z) {
      goban.topRight = vertex;
    }
  }

  var width = Math.abs(goban.bottomLeft.x - goban.topRight.x);
  var length = Math.abs(goban.bottomLeft.z - goban.topRight.z);

  // ratios of line spacing to board edge length
  const wSpacingRatio = 22 / 424.2;
  const lSpacingRatio = 23.7 / 454.5;

  goban.wSpacing = width * wSpacingRatio;
  goban.lSpacing = length * lSpacingRatio;

  var wBorderWidth = (width - (goban.wSpacing * 18)) / 2;
  var lBorderWidth = (length - (goban.lSpacing * 18)) / 2;

  var bottomRow = [];
  for (let i = 0; i < 19; i++) {
    let newX = (goban.bottomLeft.x + wBorderWidth) + i * goban.wSpacing;
    bottomRow[i] = goban.bottomLeft.clone().setX(newX);
  }

  for (let i = 0; i < 19; i++) {
    let row = [];
    for (let vertex of bottomRow) {
      let newZ = (goban.bottomLeft.z - lBorderWidth) - i * goban.lSpacing;
      row.push(vertex.clone().setZ(newZ));
    }
    goban.intersections[i] = row;
  }

  for (let row of goban.intersections) {
    for (let p of row) {
      addMarker(p, 0x0000ff);
    }
  }
}

function closestIntersection(goban, point) {
  var x = goban.intersections[0][0].x;
  var z = goban.intersections[0][0].z;
  var result = null;

  for (let i = 0; i < 19; i++) {
    if (Math.abs((x + i * goban.wSpacing) - point.x) < goban.wSpacing / 2) {
      for (let j = 0; j < 19; j++) {
        if (Math.abs((z - j * goban.lSpacing) - point.z) < goban.lSpacing / 2) {
          // switch i and j, because outer loop goes through (array) rows and
          // inner loop goes through columns
          result = goban.intersections[j][i];
        }
      }
    }
  }

  return result;
}

function onMouseDown(event) {
  event.preventDefault();

  if (state.preview) {
    var newStone = state.stone.clone(false);
    newStone.material = state.stoneMaterials.white;
    state.goban.mesh.add(newStone);
  }
}

function onMouseMove(event) {
  event.preventDefault();

  state.mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  state.raycaster.setFromCamera(state.mouse, state.camera);

  var intersects = state.raycaster.intersectObject(state.plane, false);
  if (intersects.length > 0) {
    var intersect = intersects[0];
    var closestIntersect = closestIntersection(state.goban, intersect.point);
    if (closestIntersect != null) {
      state.preview = true;
      state.stone.material.visible = true;
      /*
        stone.position.set(
        intersect.point.x,
        bottomLeft.y + state.stone.geometry.boundingBox.getSize().y / 2,
        intersect.point.z);
      */

      state.stone.position.set(
        closestIntersect.x,
        closestIntersect.y + state.stone.geometry.boundingBox.getSize().y / 2,
        closestIntersect.z
      );
    } else {
      state.preview = false;
      state.stone.material.visible = false;
    }
  } else {
    state.preview = false;
    state.stone.material.visible = false;
  }
}
