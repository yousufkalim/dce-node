/**
 * Chats schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatsSchema = new Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    tailor_unread_messages: {
      type: Number,
    },
    client_unread_messages: {
      type: Number,
    },
    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatsSchema);
