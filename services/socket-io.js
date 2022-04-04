const Chats = require("../models/Chats");

module.exports = (io) => {
  // Socket init
  io.on("connection", (socket) => {
    console.log("User connected successfully", socket.handshake.query.userId);

    socket.join(socket.handshake.query.userId);

    socket.emit("welcome", "Hello World");

    socket.on("chatInit", async ({ tailor, client, message }) => {
      const chat = await Chats.create({
        tailor,
        client,
        $push: {
          messages: message,
        },
      });

      socket.emit(`chatInit-${message.receiver}`, chat);
    });

    socket.on("sendMessage", async ({ chatId, message }) => {
      const chat = await Chats.findByIdAndUpdate(chatId, {
        $push: {
          messages: message,
        },
      });

      socket.emit(`message-${chatId}-${message.receiver}`, message);
    });

    exports.socket = socket;
  });
};
