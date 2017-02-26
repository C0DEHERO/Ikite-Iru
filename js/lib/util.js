function containsPoint(arr, point) {
  for (let p of arr) {
    if (point.x === p.x && point.y === p.y) {
      return true;
    }
  }
  return false;
}

function comparePoints(a, b) {
  if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  } else if (a.y < b.y) {
    return -1;
  } else if (a.y > b.y) {
    return 1;
  }

  return 0;
}

// north, south, west, east respectively
function getDirections(point) {
  let directions = [];
  directions[0] = {x: point.x, y: point.y - 1};
  directions[1] = {x: point.x, y: point.y + 1};
  directions[2] = {x: point.x - 1, y: point.y};
  directions[3] = {x: point.x + 1, y: point.y};
  return directions;
}

function getNeighborGroup(point, conf, dir) {
  // north, south, west, east respectively
  let directions = getDirections(point);

  // if not null, zero, or undefined
  if (conf.at(directions[dir])) {
    let color = conf.at(directions[dir]);
    let group = floodFill(directions[dir], conf, color, -color);
    return group;
  }

  return null;
}

function getOpponentNeighborGroups(point, conf) {
  let directions = getDirections(point);
  let color = conf.at(point);
  let groups = [];
  for (let i = 0; i < 4; i++) {
    if (conf.at(directions[i]) !== color) {
      let group = getNeighborGroup(point, conf, i);
      if (group !== null) {
        groups.push(group);
      }
    }
  }
  return groups;
}
