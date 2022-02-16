/**
 * Colors schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema(
  {
    color: String,
    photo: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("colors", colorSchema);
