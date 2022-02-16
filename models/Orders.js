/**
 * Orders schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: String,
    gender: { type: String, enum: ["male", "female"] },
    note: String,
    creation: String,
    measurments: String,
    qoute_requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "qoutes",
      },
    ],
    fabric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fabrics",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colors",
    },
    budget: {
      max_amount: Number,
      min_amount: Number,
    },
    rating: {
      review: String,
      rating: Number,
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "completed"],
      default: "pending",
    },
    cut: {
      type: String,
    },
    address: {
      lat: String,
      lng: String,
      label: String,
      label2: String,
      city: String,
      postal_code: String,
    },
    delivery: {
      name: String,
      date: Date,
      status: {
        type: String,
        enum: ["pending", "in_progress", "delivered"],
        default: "pending",
      },
      type: {
        type: String,
        enum: ["urgent", "normal"],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
