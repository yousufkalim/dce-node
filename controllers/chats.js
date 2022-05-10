/**
 * Chats controllers
 * @author Shuja Naqvi
 */
const Chats = require("../models/Chats");
const Messages = require("../models/Messages");

/**
 * Get all Chats
 * @param {object} req
 * @param {object} res
 */
exports.getAllByQuery = async (req, res) => {
  try {
    const chats = await Chats.find(req.body)
      .populate("tailor")
      .populate("client")
      .populate("last_message"); // Finding all the chats from db
    res.json({ success: true, chats }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get chat by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const chatId = req.params.chatId; // Getting chat id from URL parameter
    const chat = await Chats.findById(chatId)
      .populate("tailor")
      .populate("client")
      .populate("last_message"); // Finding the chat from db
    res.json({ success: true, chat }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete chat by id
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const chatID = req.params.chatId;
    const chat = await Chats.findByIdAndDelete(chatID); // Finding the chat from db
    if (!chat) {
      res.status(400).json({ success: false, message: "Chat not found." });
      return;
    } else {
      await Messages.deleteMany({
        chat: chat._id,
      });
      res.json({ success: true, message: "Chat deleted" }); // Success
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
