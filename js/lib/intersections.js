function calcIntersections(mesh) {
  var vertices = mesh.geometry.vertices;
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

  var bottomLeft = topVertices[0];
  var topRight = topVertices[0];

  for (let vertex of topVertices) {
    if (vertex.x <= bottomLeft.x && vertex.z >= bottomLeft.z) {
      bottomLeft = vertex;
    }

    if (vertex.x >= topRight.x && vertex.z <= topRight.z) {
      topRight = vertex;
    }
  }

  var width = Math.abs(bottomLeft.x - topRight.x);
  var length = Math.abs(bottomLeft.z - topRight.z);

  // ratios of line spacing to board edge length
  const wSpacingRatio = 22 / 424.2;
  const lSpacingRatio = 23.7 / 454.5;

  var wSpacing = width * wSpacingRatio;
  var lSpacing = length * lSpacingRatio;

  var wBorderWidth = (width - (wSpacing * 18)) / 2;
  var lBorderWidth = (length - (lSpacing * 18)) / 2;

  var bottomRow = [];
  for (let i = 0; i < 19; i++) {
    let newX = (bottomLeft.x + wBorderWidth) + i * wSpacing;
    bottomRow[i] = bottomLeft.clone().setX(newX);
  }

  var intersections = [[]];

  for (let i = 0; i < 19; i++) {
    let row = [];
    for (let vertex of bottomRow) {
      let newZ = (bottomLeft.z - lBorderWidth) - i * lSpacing;
      row.push(vertex.clone().setZ(newZ));
    }
    intersections[i] = row;
  }

  return intersections;
}

function closestIntersection(intersections, point, radius) {
  var result = null;

  for (let i = 0; i < 19; i++) {
    for (let j = 0; j < 19; j++) {
      if (intersections[j][i].distanceTo(point) < radius) {
        // switch i and j, because outer loop goes through (array) rows and
        // inner loop goes through columns
        result = {x: j, y: i};
        //result = intersections[j][i];
      }
    }
  }

  return result;
}
