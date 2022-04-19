const mongoose = require("mongoose");
const Complaints = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    reason: { type: String },
    details: { type: String },
    attachment: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("complaints", Complaints);
