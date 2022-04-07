/**
 * OTPs schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTPs", otpSchema);
