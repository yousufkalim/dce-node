/**
 * Chat schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatsSchema = new Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    chat_info: [
      {
        Text: {
          type: String,
        },
        sender: {
          type: String,
        },
        receiver: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quotes",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatsSchema);
