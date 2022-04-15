/**
 * Messages controllers
 * @author Shuja Naqvi
 */
const Chats = require("../models/Chats");
const Messages = require("../models/Messages");

/**
 * Get all Messages
 * @param {object} req
 * @param {object} res
 */
exports.getAllByQuery = async (req, res) => {
  try {
    if (req.body.chat) {
      const body = {};
      if (req.user.role == "client") {
        Object.assign(body, {
          client_unread_messages: 0,
        });
      } else {
        Object.assign(body, {
          tailor_unread_messages: 0,
        });
      }
      await Chats.findByIdAndUpdate(req.body.chat, body);
    }
    const messages = await Messages.find(req.body); // Finding all the messages from db
    res.json({ success: true, messages }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get message by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const messageId = req.params.messageId; // Getting message id from URL parameter
    const message = await Messages.findById(messageId); // Finding the message from db
    res.json({ success: true, message }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get message by id
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const messageID = req.body.id;
    const message = await Messages.findByIdAndDelete(messageID); // Finding the message from db
    if (!message) {
      req.status(400).json({ success: false, message: "Message not found." });
      return;
    }
    res.json({ success: true, message: "Message deleted" }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
