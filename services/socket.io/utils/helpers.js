// Author: Umar Bin Ayaz

function registerEvent(socket, event, cb) {
  try {
    socket.on(event, cb);
  } catch (e) {
    console.trace(e);
  }
}

module.exports = {
  registerEvent,
};
