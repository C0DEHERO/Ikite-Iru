function State(size) {
  this.stones = new Array(size * size);
  this.stones.fill(0);
  this.size = size;
  this.move = null;
  this.captured = null;
  this.turn = 0;
  this.captureCount = [];
  this.ko = null;
  this.moveNumber = 0;
  // time left when move was made
  this.time = {
    black: null,
    white: null
  };
}

State.prototype = {
  at: function(pos) {
    return this.stones[pos.x * this.size + pos.y];
  },
  setAt: function(pos, color) {
    this.stones[pos.x * this.size + pos.y] = color;
  },
  clear: function() {
    for (let i = 0; i < this.stones.length; i++) {
      this.stones[i] = 0;
    }
  },
  getStateForNextTurn: function(ko, players) {
    // could do a clone and delete/modify stuff
    let newState = new State(this.size);
    newState.stones = this.stones.slice(0);
    newState.move = null;
    newState.captureCount = this.captureCount.slice(0);
    newState.moveNumber = this.moveNumber + 1;
    newState.turn = ((newState.moveNumber - 1) % players) + 1;
    newState.ko = ko;
    return newState;
  },
  clone: function() {
    let clone = new State(this.size);
    clone.stones = this.stones.slice(0);
    clone.move = this.move.clone();
    clone.captureCount = this.captureCount.slice(0);
    clone.ko = this.ko;
    return clone;
  },
  isOccupied: function(pos) {
    return this.at(pos) !== 0;
  },
  isKo: function(pos) {
    if (this.ko === null) {
      return false;
    }
    return this.ko.x === pos.x && this.ko.y === pos.y;
    // return this.ko.isEqual(pos);
  },
  isWithinBounds: function(pos) {
    return pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size;
  },
  // play: function(move, ko, time?)
  play: function(move) {
    console.log("current turn: " + this.turn);
    let result = this.checkMove(move);
    if (result !== "valid") {
      return result;
    }
    this.setAt(move.pos, this.turn);
    result = this.doCapture(move);
    if (result !== "valid") {
      return result;
    }

    this.move = new Move(move.pos, this.turn);

    return result;
  },
  checkGroup: function(pos) {
    let result = {
      group: floodFill(pos, this.stones.slice(0), this.size, this.at(pos), -this.at(pos)),
      alive: false
    };
    for (let stone of result.group) {
      let directions = stone.getDirections(this.size);
      for (let dir of directions) {
        if (this.at(dir) === 0) {
          result.alive = true;
        }
      }
    }
    return result;
  },
  getCaptured: function(move) {
    let captured = new Set();
    let directions = move.pos.getDirections(this.size);
    for (let dir of directions) {
      let group = this.checkGroup(dir);
      if (!group.alive && group.group.length > 0 && this.at(group.group[0]) !== move.color + 1) {
        for (let stone of group.group) {
          captured.add(stone);
        }
      }
    }
    // do Array.from(captured) instead?
    return captured;
  },
  doCapture: function(move) {
    let playedGroup = this.checkGroup(move.pos);
    console.log(playedGroup);
    let captured = this.getCaptured(move);
    if (!playedGroup.alive && captured.size === 0) {
      this.captured = [];
      return "suicide";
    }
    for (let stone of captured) {
      this.setAt(stone, 0);
    }
    this.captureCount[move.color] += captured.size;

    this.captured = captured;
    console.log("captured:");
    console.log(captured);
    return "valid";
  },
  checkMove: function(move) {
    if (move === null) {
      return "nomove";
    }
    if (move.color + 1 !== this.turn) {
      return "wrongcolor";
    }
    if (!this.isWithinBounds(move.pos)) {
      return "outofbounds";
    }
    if (this.isOccupied(move.pos)) {
      return "occupied";
    }
    if (this.isKo(move.pos)) {
      return "ko";
    }

    return "valid";
  }
};
