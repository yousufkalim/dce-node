/**
 * Qoutes schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qouteSchema = new Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    budget: {
      max_amount: Number,
      min_amount: Number,
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
    offer: String,
    view: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("qoutes", qouteSchema);
