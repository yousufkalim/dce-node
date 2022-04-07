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
       required: true,
     },
     price: {
      type: Number,
      required: true,
     },
     description: {
       type: String,
       required: true,
     },
     rating: {
      count: {
        type: Number,
        required: true,
        default: 10
      },
      value: {
        type: Number,
        required: true,
        default: 5
      },
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tailors",
    },
    attachment: {
      type: String,
      required: true,
    },
   },
   {
     timestamps: true,
   }
 );
 
 module.exports = mongoose.model("catalogs", catalogSchema);
 