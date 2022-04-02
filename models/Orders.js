/**
 * Orders schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["ad", "direct"],
      default: "ad",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    category: {
      type: String,
      enum: ["category_1", "category_2"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cut: {
      type: String,
      enum: ["5", "10"],
      required: true,
    },
    measurements: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      enum: ["colour_1", "colour_2"],
      required: true,
    },
    fabric: {
      type: String,
      enum: ["fabric_1", "fabric_2"],
      required: true,
    },
    delivery: {
      address: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      note: {
        type: String,
      },
      type: {
        type: String,
        enum: ["urgent", "normal"],
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    note: {
      type: String
    },
    budget: {
      min_price: {
        type: Number,
        required: true,
      },
      max_price: {
        type: Number,
        required: true,
      },
    },
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quotes",
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    rating: {
      review: {
        type: String,
      },
      rating: {
        type: Number,
        required: true,
        default: 0
      },
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
