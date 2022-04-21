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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cut: {
      type: String,
      required: true,
    },
    measurements: {
      type: {
        type: String,
        enum: ["static", "tape", "call"],
        default: "static",
        required: true,
      },
      value: {
        type: String,
        default: "",
      },
    },
    color: {
      type: String,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    includes_alteration_services: {
      type: Boolean,
      required: true,
      default: false,
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
      zipcode: {
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
    budget: {
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        default: "fixed",
        required: true,
      },
      min_price: {
        type: Number,
        required: true,
      },
      max_price: {
        type: Number,
        required: true,
      },
      note: {
        type: String,
        required: false,
      },
    },
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quotes",
      },
    ],
    catalog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "catalogs",
      required: false, // It is optional and is used to sync ratings only.
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "discarded"],
      default: "pending",
    },
    attachment: {
      type: String,
      required: true,
    },
    tailor_submission: {
      details: {
        type: String,
        required: false,
      },
      attachment: {
        type: String,
        required: false,
      },
    },
    client_submission: {
      details: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
