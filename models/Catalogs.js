/**
 * Orders schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catalogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ratings: [
      {
        type: Number,
        required: true,
      },
    ],
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    attachments: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("catalogs", catalogSchema);
