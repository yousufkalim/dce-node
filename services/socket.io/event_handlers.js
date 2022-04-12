// Author: Umar Bin Ayaz

const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_SECRET;

const Constants = require("./utils/constants");
const State = require("./utils/state");
const Helpers = require("./utils/helpers");

function connectHandler(socket) {
  const token = socket.handshake.query.token;

  if (!token || !token?.startsWith("Bearer")) {
    socket.disconnect();
    return;
  }

  try {
    const tokenStr = token.split(" ")[1];
    const decoded = jwt.verify(tokenStr, tokenSecret);
    const user = decoded.user;

    const obj = {
      socketID: socket.id,
      user: user,
    };

    State.addUser(obj);

    Helpers.registerEvent(socket, Constants.E_DISCONNECT, () =>
      disconnectHandler(socket)
    );
  } catch (e) {
    console.trace(e);
    socket.disconnect();
  }
}

function disconnectHandler(socket) {
  console.log(`disconnectHandler(): THIS IS THE socket.id: ${socket.id}`);
  State.removeUser(socket.id);
}

module.exports = connectHandler;
