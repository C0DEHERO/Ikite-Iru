function Node(point) {
  this.x = point.x;
  this.y = point.y;
}

Node.prototype = {
  clone: function(f) {
    let newObj = new Node(this);
    if (f) {
      f(newObj);
    }
    return newObj;
  }
};

function floodFill(point, matrix, target, replacement) {
  let node = new Node(point);
  let result = [];
  matrix.at = function(coords) {
    if (coords.x < 0 || coords.x >= this.length ||
        coords.y < 0 || coords.y >= this[0].length) {
      return null;
    }
    return this[coords.x][coords.y];
  };
  matrix.setAt = function(coords, x) {
    this[coords.x][coords.y] = x;
  };
  if (target === replacement) {
    return [];
  }
  if (matrix.at(node) !== target) {
    return [];
  }
  let queue = [];
  matrix.setAt(node, replacement);
  result.push(node);
  queue.push(node);
  while (queue.length > 0) {
    let element = queue.shift();
    let west = element.clone((o) => o.x--);
    let east = element.clone((o) => o.x++);
    let north = element.clone((o) => o.y--);
    let south = element.clone((o) => o.y++);
    if (matrix.at(west) === target) {
      matrix.setAt(west, replacement);
      queue.push(west);
      result.push(west);
    }
    if (matrix.at(east) === target) {
      matrix.setAt(east, replacement);
      queue.push(east);
      result.push(east);
    }
    if (matrix.at(north) === target) {
      matrix.setAt(north, replacement);
      queue.push(north);
      result.push(north);
    }
    if (matrix.at(south) === target) {
      matrix.setAt(south, replacement);
      queue.push(south);
      result.push(south);
    }
  }
  return result;
}

function floodFill2(point, matrix, target, replacement) {
  let node = new Node(point);
  let result = [];
  matrix.at = function(coords) {
    if (coords.x < 0 || coords.x >= this.length ||
        coords.y < 0 || coords.x >= this[0].length) {
      return null;
    }
    return this[coords.x][coords.y];
  };
  matrix.setAt = function(coords, x) {
    this[coords.x][coords.y] = x;
  };
  if (target === replacement) {
    return [];
  }
  if (matrix.at(node) !== target) {
    return [];
  }
  let queue = [];
  queue.push(node);
  while (queue.length > 0) {
    let element = queue.pop();
    let west = element.clone();
    let east = element.clone();

    while (matrix.at(west.clone((o) => o.x--)) === target) {
      west.x--;
    }
    while (matrix.at(east.clone((o) => o.x++)) === target) {
      east.x++;
    }

    for (let n = west.clone(); n.x <= east.x; n.x++) {
      matrix.setAt(n, replacement);
      result.push(n);
      let north = n.clone((o) => o.y--);
      let south = n.clone((o) => o.y++);
      if (matrix.at(north) === target) {
        queue.push(north);
      }
      if (matrix.at(south) === target) {
        queue.push(south);
      }
    }
  }
  return result;
}

function getData() {
  return [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1],
    [0, 2, 1, 0, 0],
    [2, 1, 1, 1, 0]];
}

function getTestData() {
  return [
    [0, 0, 0, 0, 0],
    [0, -1, -1, 0, 1],
    [0, 2, -1, 0, 0],
    [2, -1, -1, -1, 0]];
}

function getLongData() {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
    [0, 0, 0, 0, 1, 2, 2, 1, 2, 1, 1, 1, 3, 4, 0, 0, 0, 2, 1],
    [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 2, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2],
    [1, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0]];
}

function areEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] instanceof Array) {
      if (b[i] instanceof Array) {
        if (!areEqual(a[i], b[i])) {
          return false;
        }
      } else {
        return false;
      }
    } else if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
