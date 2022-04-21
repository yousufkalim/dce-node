// Author: Umar Bin Ayaz

const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_SECRET;

const Constants = require("./utils/constants");
const State = require("./utils/state");
const Helpers = require("./utils/helpers");

const Clients = require("../../models/Clients");
const Tailors = require("../../models/Tailors");
const Chats = require("../../models/Chats");
const Messages = require("../../models/Messages");
const Notifications = require("../../models/Notifications");

async function connectHandler(io, socket) {
  const token = socket.handshake.query.token;

  if (!token || !token?.startsWith("Bearer")) {
    socket.disconnect();
    return;
  }

  try {
    const tokenStr = token.split(" ")[1];
    const decoded = jwt.verify(tokenStr, tokenSecret);
    const user = decoded.user;

    // CheckIn
    if (user.role == "client") {
      await Clients.findByIdAndUpdate(user._id, {
        check_in: Date.now(),
      });
    } else {
      await Tailors.findByIdAndUpdate(user._id, {
        check_in: Date.now(),
      });
    }

    const obj = {
      socketID: socket.id,
      user: user,
    };

    State.addUser(obj);

    Helpers.registerEvent(socket, Constants.E_DISCONNECT, () =>
      disconnectHandler(io, socket)
    );

    Helpers.registerEvent(socket, Constants.E_SEND_MESSAGE, (_) =>
      sendMessageHandler(io, socket, _)
    );
  } catch (e) {
    console.trace(e);
    socket.disconnect();
  }
}

async function disconnectHandler(io, socket) {
  console.log(`disconnectHandler(): THIS IS THE socket.id: ${socket.id}`);

  const user = State.findUser({
    socketID: socket.id,
  }).user;

  // CheckOut
  if (user.role == "client") {
    await Clients.findByIdAndUpdate(user._id, {
      check_out: Date.now(),
    });
  } else {
    await Tailors.findByIdAndUpdate(user._id, {
      check_out: Date.now(),
    });
  }

  State.removeUser(socket.id);
}

async function sendMessageHandler(io, socket, _) {
  const user = State.findUser({ socketID: socket.id }).user;

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

    let senderID = user._id;
    let receiverID;
    if (user.role == "client") {
      receiverID = chat.tailor;
    } else {
      receiverID = chat.client;
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

    // Emit message to sender
    socket.emit(Constants.E_RECEIVE_MESSAGE, message);

    // Emit message to receiver
    const receiver = State.findUser({
      userID: receiverID,
    });
    if (receiver) {
      // If online then emit message to receiver
      io.to(receiver.socketID).emit(Constants.E_RECEIVE_MESSAGE, message);
    } else {
      // If offline then update Chat.
      const body = {};
      if (user.role == "client") {
        Object.assign(body, {
          $inc: { tailor_unread_messages: 1 },
        });
      } else {
        Object.assign(body, {
          $inc: { client_unread_messages: 1 },
        });
      }
      chat = await Chats.findByIdAndUpdate(chat._id, body, { new: true })
        .populate("client")
        .populate("tailor");
      // Create Notification
      if (user.role == "client") {
        if (chat.tailor_unread_messages <= 1) {
          // Send notification to tailor
          await Notifications.create({
            sender: chat.client,
            receiver: chat.tailor._id,
            text: "Sent you a message.",
            link: "chat",
          });
        }
      } else {
        if (chat.client_unread_messages <= 1) {
          // Send notification to client
          await Notifications.create({
            sender: chat.tailor,
            receiver: chat.client._id,
            text: "Sent you a message.",
            link: "chat",
          });
        }
      }
    }
  }

  // TODO: Push chat and message
}

module.exports = connectHandler;
