/**
 * Fabrics CRUD controllers
 * @author Shuja Naqvi
 */
const Fabrics = require("../models/Fabrics");

/**
 * Create Fabrics
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    console.log("body", req.body);
    const fabrics = await Fabrics.create(req.body);
    res.json({ success: true, fabrics });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Fabrics
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const fabrics = await Fabrics.find(); // Finding all the fabrics from db
    res.json({ success: true, fabrics }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get fabric by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const fabricId = req.params.fabricId; // Getting user id from URL parameter
    const fabrics = await Fabrics.findById(fabricId); // Finding user by id
    res.json({ success: true, fabrics }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Update fabric
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const fabricId = req.params.fabricId; // Getting fabric id from URL parameter
    const fabric = await Fabrics.findByIdAndUpdate(fabricId, req.body, {
      new: true,
    }); // Updating the fabric
    res.json({ success: true, fabric }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete Fabric
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const fabricId = req.params.fabricId; // Getting fabric id from URL parameter
    const fabric = await Fabrics.findByIdAndDelete(fabricId); // Deleting the fabric
    res.json({ success: true, fabric }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
