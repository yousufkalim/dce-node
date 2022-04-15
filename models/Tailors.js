/**
 * Tailor schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const tailorSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    experience: {
      type: String,
    },
    area_of_experience: {
      type: String,
    },
    diploma: {
      type: String,
    },
    speciality: {
      type: String,
    },
    role: {
      type: String,
      enum: ["tailor"],
      default: "tailor",
    },
    phone: {
      type: String,
      required: false,
    },
    shop_name: {
      type: String,
      required: false,
    },
    hourly_rate: {
      type: Number,
      required: false,
    },
    free_shipping_rate: {
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
module.exports = mongoose.model("tailors", tailorSchema);
