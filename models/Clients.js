/**
 * Client schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    otp: {
      type: String,
      minlength: 6,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    dob: Date,
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
      },
    ],
    address: {
      lat: String,
      lng: String,
      label: String,
      label2: String,
      city: String,
      postal_code: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("clients", clientSchema);
