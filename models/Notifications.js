/**
 * Notifications schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationsSchema = new Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: false,
      },
    },
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notifications", notificationsSchema);
