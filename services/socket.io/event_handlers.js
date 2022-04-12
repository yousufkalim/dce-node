// Author: Umar Bin Ayaz

const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_SECRET;

const Constants = require("./utils/constants");
const State = require("./utils/state");
const Helpers = require("./utils/helpers");

const Chats = require("../../models/Chats");
const Messages = require("../../models/Messages");

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

    Helpers.registerEvent(socket, Constants.E_SEND_MESSAGE, (_) =>
      sendMessageHandler(socket, _)
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

async function sendMessageHandler(socket, _) {
  const user = State.findUser({ socketID: socket.id });

  // If chat doeesn't exit then create it.
  if (!_.chat) {
    const directUser = _.direct_user;

    let clientID;
    let trailorID;
    if (user.role == "client") {
      clientID = user._id;
      trailorID = directUser._id;
    } else {
      clientID = directUser._id;
      trailorID = user._id;
    }

    let chat = await Chats.create({
      client: clientID,
      tailor: trailorID,
    });

    let message = await Messages.create({
      ..._,
      chat: chat._id,
      sender: user._id,
      receiver: directUser._id,
    });

    // TODO: Optimize it.
    chat = await Chats.findByIdAndUpdate(
      chat._id,
      {
        last_message: message._id,
      },
      {
        new: true,
      }
    )
      .populate("client")
      .populate("tailor")
      .populate("last_message");

    socket.emit(Constants.E_RECEIVE_CHAT, chat);
  } else {
    let chat = await Chats.findById(_.chat._id);

    let senderID;
    let receiverID;
    if (user.role == "client") {
      senderID = user._id;
      receiverID = chat.tailor;
    } else {
      senderID = chat.client;
      receiverID = user._id;
    }

    let message = await Messages.create({
      ..._,
      chat: chat._id,
      sender: senderID,
      receiver: receiverID,
    });

    chat = await Chats.findByIdAndUpdate(chat._id, {
      last_message: message._id,
    });

    socket.emit(Constants.E_RECEIVE_MESSAGE, message);
  }

  // TODO: Push chat and message
}

module.exports = connectHandler;
