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
    experience: {
      type: String,
      required: true,
    },
    area_of_experience: {
      type: String,
      required: true,
    },
    diploma: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["tailor"],
      default: "tailor",
    },
    phone: {
      type: String,
      required: false
    },
    shop_name: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("tailors", tailorSchema);
