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
    is_admin: {
      type: Boolean,
      default: false,
    },
    tailor_unread_messages: {
      type: Number,
      default: 0,
    },
    client_unread_messages: {
      type: Number,
      default: 0,
    },
    admin_unread_messages: {
      type: Number,
      default: 0,
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
