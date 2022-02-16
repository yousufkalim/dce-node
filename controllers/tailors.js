/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Tailors = require("../models/Tailors");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendEmail");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create Tailor - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Tailors.findOne({ email }); // Finding already existing user
    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    let otp = Math.random().toString(36).slice(-6); //generate otp of client
    sendOTP(email, otp).then(async () => {
      // If email is sent then we have to update the otp n password in db
      req.body.otp = otp; //create a new field for opt
      const user = await Tailors.create(req.body); // Adding user in db
      // Done
      return res.json({
        success: true,
        message: "Otp successfully sent",
        user,
      });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Tailors
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Tailors.find().populate("orders"); // Finding all the tailors from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Tailors.findById(userId).populate("orders"); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//To verify opt
exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.params.userId;
    const otp = req.body.otp;
    const user = await Tailors.findById(userId); //find user by its id
    if (!user)
      //if user not found
      return res.json({ success: false, message: "Invalid Tailor Id" });
    //if otp is invalid
    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid Otp" });
    }
    //verifying user
    user.verification = true;
    await user.save();
    return res.json({
      success: true,
      message: "You have been verified",
      user,
    });
  } catch (err) {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Tailors.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Tailors.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
