/**
 * Fabrics schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fabricSchema = new Schema(
  {
    name: String,
    detail: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("fabrics", fabricSchema);
