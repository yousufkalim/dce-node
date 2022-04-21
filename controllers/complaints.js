/**
 * Complaints controllers
 * @author Shuja Naqvi
 */
const Clients = require("../models/Clients");
const Tailors = require("../models/Tailors");
const Complaints = require("../models/Complaints");

/**
 * Create order
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { reason, details } = req.body;
    const complaints = await Complaints.create(req.body);

    if (req.file) {
      req.body.attachment = req.file.path; // Creating a new property called attachment in body object
    }

    res.json({ success: true, complaints }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const complaints = await Complaints.find().populate("complaints"); // Finding all the complaints from db
    res.json({ success: true, complaints }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get complaint by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const complaintId = req.params.complaintId; // Getting complaint id from URL parameter
    const complaints = await Complaints.findById(complaintId); // Finding complaint by id
    res.json({ success: true, complaints }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const complaintId = req.params.complaintId; // Getting user id from URL parameter
    const complaint = await Complaints.findByIdAndDelete(complaintId); // Deleting the user
    res.json({ success: true, complaint }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
