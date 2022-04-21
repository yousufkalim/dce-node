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
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
      required: true,
    },
    store_name: {
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
