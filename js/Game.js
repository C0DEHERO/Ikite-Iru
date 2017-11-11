function Game(size, players) {
  this.size = size || 19;
  this.players = players || 2;
  this.states = [];
  this.states[0] = new State(this.size);
  this.nextKo = null;
  // maybe I should create a Timer component similar to the chat component?
  // I could also store all the times for turns in an array instead of in State
  // or perhaps I could add a special field to State for additional information (sort of like a plugin system)
  this.time = null;
  // pointer to current state for going to next or previous turn
  // not sure if it should just be a number for the index or a reference
  this.currentState = null;
}

Game.prototype = {
  update: function() {
  },
  // I'll probably want a separate Timer object that I update in the game loop
  updateTime: function() {
    this.time.update(this.timer);
  },
  // for online games
  refreshTime: function(time) {
    this.time.set(time);
  },
  play: function(move) {
    let state = this.getNextState();
    let result = state.play(move, this.nextKo);

    if (result === "valid") {
      this.pushState(state);
      if (state.captured.size === 1) {
        for (let stone of state.captured) {
          this.nextKo = stone;
        }
      } else {
        this.nextKo = null;
      }
    }

    return {
      state: state,
      status: result
    };
  },
  pass: function(color) {
    let state = this.getNextState();
    state.play(new Move(null, color));
    this.pushState(state);

    return "pass";
  },
  getCurrentState: function() {
    return this.states[this.states.length - 1];
  },
  cloneCurrentState: function() {
    return this.getCurrentState().clone();
  },
  getNextState: function() {
    return this.getCurrentState().getStateForNextTurn(this.nextKo, this.players);
  },
  pushState: function(state) {
    Object.freeze(state);
    this.states.push(state);
  }
};
