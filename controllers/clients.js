/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Clients = require("../models/Clients");
const OTPs = require("../models/OTPs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Clients.findOne({ email }); // Finding already existing user
    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    const userOTP = await OTPs.findOne({ email });
    if(!userOTP?.is_verified){
      // If this email has not been verified yet.
      return res
        .status(409)
        .json({ success: false, message: "Email not verified." });
    }

    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8

    const user = await Clients.create(req.body);

    // Creating payload with user object
    const payload = { user };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      // done
      return res.json({ success: true, user, token });
    });
    
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Clients
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Clients.find().populate("orders"); // Finding all the users from db
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
    const user = await Clients.findById(userId).populate("orders"); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
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
    console.log(req.file);
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called avatar in body object
    }
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, parseInt(bcryptSalt));
      req.body.last_password_changed = Date.now();
    }
    const user = await Clients.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

