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
      required: true,
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
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
      },
    ], // TODO: Populate it properly and then use at search
    phone: {
      type: String,
      required: true,
    },
    shop_name: {
      type: String,
    },
    store_name: {
      type: String,
    },
    hourly_rate: {
      type: Number,
    },
    free_shipping_rate: {
      type: String,
    },
    ratings: [
      {
        type: Number,
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
module.exports = mongoose.model("tailors", tailorSchema);
