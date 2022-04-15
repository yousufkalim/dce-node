/**
 * Client schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["client"],
      default: "client",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
      },
    ],
    phone: {
      type: String,
      required: false,
    },
    ratings: [
      {
        type: Number,
        required: true,
      },
    ],
    last_password_changed: {
      type: Date,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    check_in: {
      type: Date,
      required: false,
    },
    check_out: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("clients", clientSchema);
