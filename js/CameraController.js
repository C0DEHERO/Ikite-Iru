function CameraController(graphics) {
  this.keysPressed = new Map();
  this.mouseMovement = new Position(null, null);
  this.mouseMoved = false;
  this.lookEnabled = false;

  this.horizontalAngle = 0;
  this.verticalAngle = 0;
  this.mouseSpeed = 0.002;

  this.pitchObject = new THREE.Object3D();
  // this.pitchObject.add(graphics.camera);
  this.yawObject = new THREE.Object3D();
  this.yawObject.add(this.pitchObject);

  // this.pointerLockControls = new THREE.PointerLockControls(graphics.camera);
  // graphics.scene.remove(graphics.camera);
  // graphics.scene.add(this.pointerLockControls.getObject());

  // graphics.scene.remove(graphics.camera);
  // graphics.scene.add(this.yawObject);

  this.rotation = new THREE.Euler(0, 0, 0, "XYZ");
  console.log(this.rotation);

  this.keyDown = function(event) {
    this.keysPressed.set(event.keyCode, true);

    if (event.keyCode === 76) {
      this.lookEnabled = true;
      let element = document.body;
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock;
      element.requestPointerLock();
    }
  };
  this.keyUp = function(event) {
    this.keysPressed.set(event.keyCode, false);
  };
  this.mouseMove = function(event) {
    if (!this.lookEnabled) {
      return;
    }
    this.mouseMovement.x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    this.mouseMovement.y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    this.mouseMoved = true;
  };

  this.PI_2 = Math.PI / 2;

  document.addEventListener("keydown", this.keyDown.bind(this));
  document.addEventListener("keyup", this.keyUp.bind(this));
  document.addEventListener("mousemove", this.mouseMove.bind(this));
}

CameraController.prototype = {
  handleInput: function(graphics) {
    let camera = graphics.camera;
    if (this.keysPressed.get(87)) {
      camera.position.z -= 5;
    }
    if (this.keysPressed.get(65)) {
      // camera.position.x -= 5;
      camera.translateX(-5);
    }
    if (this.keysPressed.get(83)) {
      camera.position.z += 5;
    }
    if (this.keysPressed.get(68)) {
      // camera.position.x += 5;
      camera.translateX(5);
    }
    if (this.keysPressed.get(32)) {
      camera.position.y += 5;
    }
    if (this.keysPressed.get(16)) {
      camera.position.y -= 5;
    }
    if (this.keysPressed.get(76)) {
      camera.getWorldRotation(this.rotation);
    }
    if (this.keysPressed.get(27)) {
      this.lookEnabled = false;
      // this.pointerLockControls.enabled = true;
    }

    if (this.mouseMoved && this.lookEnabled) {
      this.horizontalAngle += this.mouseMovement.x * 0.002;
      this.verticalAngle += this.mouseMovement.y * 0.002;

      this.rotation.y -= this.mouseMovement.x * 0.002;
      this.rotation.x -= this.mouseMovement.y * 0.002;

      this.rotation.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.rotation.x));


      this.yawObject.rotation.y -= this.mouseMovement.x * 0.0002;
      this.pitchObject.rotation.x -= this.mouseMovement.y * 0.0002;

      this.pitchObject.rotation.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));

      //camera.setRotationFromEuler(this.pitchObject.getWorldRotation());
      camera.quaternion.setFromEuler(this.rotation);
      this.mouseMoved = false;
    }
  }
};
