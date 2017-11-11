function Timer() {
  this.lastTime = Date.now();
  this.timeLeft = [];
  // or plug those into State
  // not sure how to do that though
  this.timeLeftStates = [[]];
}

Timer.prototype = {

};
