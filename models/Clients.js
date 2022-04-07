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
      required: true,
    },
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
      required: false
    },
    last_password_changed: {
      type: Date,
      required: false
    },
    avatar: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("clients", clientSchema);
