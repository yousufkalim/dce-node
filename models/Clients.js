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
    },
    address: {
      type: String,
    },
    zip_code: {
      type: String,
    },
    city: {
      type: String,
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
    },
    avatar: {
      type: String,
    },
    check_in: {
      type: Date,
    },
    check_out: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("clients", clientSchema);
