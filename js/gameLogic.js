function GameLogic() {
  this.board = [[]];
  this.ko = null;
  this.blackPrisoners = 0;
  this.whitePrisoners = 0;
  this.gameTree = null;
  this.moveNumber = 0;

  for (let i = 0; i < 19; i++) {
    this.board[i] = [];
    for (let j = 0; j < 19; j++) {
      this.board[i][j] = {
        color: 0
      };
    }
  }
}

GameLogic.prototype = {
  at: function(point) {
    return this.board[point.x][point.y];
  },
  setAt: function(point, color) {
    this.board[point.x][point.y].color = color;
  },
  isOccupied: function(point) {
    return this.board[point.x][point.y].color !== 0;
  },
  isWithinBounds: function(point) {
    let [x, y] = [point.x, point.y];
    return x >= 0 && x <= 18 && y >= 0 && y <= 18;
  },
  isKo: function(point) {
    let [x, y] = [point.x, point.y];
    return x === this.ko.x && y === this.ko.y;
  },
  pass: function() {
    this.moveNumber++;
    this.ko = null;
  },
  playStone: function(point, color, captured) {
    if (!this.isWithinBounds(point)) {
      return false;
    }
    if (this.isOccupied(point)) {
      return false;
    }

    if (this.ko !== null) {
      if (this.isKo(point)) {
        return false;
      }
    }

    let conf = this.getBoardConf();
    conf[point.x][point.y] = color;

    for (let i = 0; i < 4; i++) {
      let group = getNeighborGroup(point, conf, i);
      if (group === null || group.length < 1 || conf.at(group[0]) === color) {
        continue;
      }
      if (this.isDead(group, conf)) {
        this.capture(group, color);
        captured.push(group);
      }
    }

    if (captured.length < 1) {
      conf = this.getBoardConf();
      conf[point.x][point.y] = color;
      let playedGroup = floodFill(point, conf, color, -1);
      if (this.isDead(playedGroup, conf)) {
        return false;
      }
    }

    if (captured.length === 1 && captured[0].length === 1) {
      this.ko = captured[0][0];
    } else {
      this.ko = null;
    }

    this.setAt(point, color);
    this.moveNumber++;
    return true;
  },
  capture: function(group, color) {
    for (let stone of group) {
      if (this.at(stone).color === 0) {
        continue;
      }
      this.setAt(stone, 0);
      if (color === 1) {
        this.blackPrisoners++;
      } else if (color === 2) {
        this.whitePrisoners++;
      }
    }
  },
  isDead: function(group, conf) {
    for (let stone of group) {
      let directions = getDirections(stone);
      for (let dir of directions) {
        if (conf.at(dir) === 0) {
          return false;
        }
      }
    }
    return true;
  },
  getBoardConf: function() {
    let conf = [[]];
    for (let i = 0; i < 19; i++) {
      conf[i] = [];
      for (let j = 0; j < 19; j++) {
        conf[i][j] = this.board[i][j].color;
      }
    }

    conf.at = function(coords) {
      if (coords.x < 0 || coords.x >= this.length ||
          coords.y < 0 || coords.y >= this[0].length) {
        return null;
      }
      return this[coords.x][coords.y];
    };
    conf.setAt = function(coords, x) {
      this[coords.x][coords.y] = x;
    };

    return conf;
  },
  setBoardConf: function(conf) {
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        this.board[i][j].color = conf[i][j];
      }
    }
  }
};
