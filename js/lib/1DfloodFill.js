function floodFill(node, matrix, size, target, replacement) {
  let result = [];
  matrix.at = function(coords) {
    if (coords.x < 0 || coords.x >= size ||
        coords.y < 0 || coords.y >= size) {
      return null;
    }
    return this[coords.x * size + coords.y];
  };
  matrix.setAt = function(coords, x) {
    this[coords.x * size + coords.y] = x;
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
    let west = element.cloneAndApply(o => o.x--);
    let east = element.cloneAndApply(o => o.x++);
    let north = element.cloneAndApply(o => o.y--);
    let south = element.cloneAndApply(o => o.y++);
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

function floodFill2(node, matrix, size, target, replacement) {
  let result = [];
  matrix.at = function(coords) {
    if (coords.x < 0 || coords.x >= size ||
        coords.y < 0 || coords.x >= size) {
      return null;
    }
    return this[coords.x * size + coords.y];
  };
  matrix.setAt = function(coords, x) {
    this[coords.x * size + coords.y] = x;
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

    while (matrix.at(west.cloneAndApply(o => o.x--)) === target) {
      west.x--;
    }
    while (matrix.at(east.cloneAndApply(o => o.x++)) === target) {
      east.x++;
    }

    for (let n = west.clone(); n.x <= east.x; n.x++) {
      matrix.setAt(n, replacement);
      result.push(n);
      let north = n.cloneAndApply(o => o.y--);
      let south = n.cloneAndApply(o => o.y++);
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
