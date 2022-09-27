// Author: Umar Bin Ayaz

const connectHandler = require("./event_handlers");
const State = require("./utils/state");

module.exports = (io) => {
  io.on("connection", (socket) => connectHandler(io, socket));

  const stdin = process.openStdin();
  stdin.addListener("data", function (d) {
    console.log(`COMMAND RECEIVED: ${d}`);
    if (d.toString().trim() == "q") {
      State.printUsers();
    }
  });
};
