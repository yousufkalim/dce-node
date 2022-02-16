/**
 * Colors CRUD controllers
 * @author Shuja Naqvi
 */
const Colors = require("../models/Colors");

/**
 * Create color
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    const colors = await Colors.create(req.body); //create a new color
    res.json({ success: true, colors }); //Done :)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all colors
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const colors = await Colors.find(); // Finding all the colors from db
    res.json({ success: true, colors }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get color by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const colorId = req.params.colorId; // Getting color id from URL parameter
    const color = await Colors.findById(colorId); // Finding color by id
    if (color) return res.json({ success: true, color }); // Success
    return res.json({ success: false, message: "Invalid Id" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Update color
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const colorId = req.params.colorId; // Getting color id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    const color = await Colors.findByIdAndUpdate(colorId, req.body, {
      new: true,
    }); // Updating the color
    if (color) return res.json({ success: true, color }); // Success
    res.json({ success: false, message: "unable to " });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete Color
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const colorId = req.params.colorId; // Getting color id from URL parameter
    const colors = await Colors.findByIdAndDelete(colorId); // Deleting the color
    res.json({ success: true, colors }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
