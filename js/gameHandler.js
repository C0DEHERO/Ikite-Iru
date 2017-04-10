function GameHandler() {
  this.worker = new Worker("worker.js");
  this.interfaces = {};
}

GameHandler.prototype = {
  addInterface: function(name, obj) {
    obj.gameHandler = this;
    this.interfaces[name] = obj;
  },
  routeMsg: function(msg) {
    if (msg.recipient) {
      if (this.interfaces[msg.recipient] instanceof Worker) {
        this.interfaces[msg.recipient].postMessage(msg);
      }
      this.interfaces[msg.recipient].receive(msg);
    }

    if (msg.recpipentType) {
      for (let inter in this.interfaces) {
        if (msg.recpientType === inter.type) {
          inter.receive(msg);
        }
      }
    }
  }
};
