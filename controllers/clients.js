/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Clients = require("../models/Clients");
const Tailors = require("../models/Tailors");

const OTPs = require("../models/OTPs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;
const { sendForgetPasswordEmail } = require("../utils/sendEmail");

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
    if (!userOTP?.is_verified) {
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
 * forget password
 * @param {object} req
 * @param {object} res
 */

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check User Already Exists
    let client = await Clients.findOne({ email });
    let designer = await Tailors.findOne({ email });

    if (!client && !designer)
      return res
        .status(404)
        .send({ message: "User not found with that email" });
    if (client) {
      const payload = { user: client };
      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
        sendForgetPasswordEmail(email, link);

        res.json({ message: "Email sent successfully" });
      });
    } else if (designer) {
      const payload = { user: designer };
      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
        sendForgetPasswordEmail(email, link);

        res.json({ message: "Email sent successfully" });
      });
    }
  } catch (error) {
    console.log("Error ----> ", error);
    res
      .status(500)
      .json({ success: false, message: "internal server error", error });
  }
};
/**
 * reset password
 * @param {object} req
 * @param {object} res
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, tokenSecret);
    const client = await Clients.findOne({
      _id: decoded.user._id,
    });
    const designer = await Tailors.findOne({
      _id: decoded.user._id,
    });

    if (!client && !designer) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    if (client) {
      client.password = hashedPassword;
      await client.save();

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else if (designer) {
      designer.password = hashedPassword;
      await designer.save();
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "internal server error", error });
  }
};

/**
 * authenticating tokken
 * @param {object} req
 * @param {object} res
 */
exports.verifyPasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, tokenSecret);
    const client = await Clients.findOne({
      _id: decoded.user._id,
      // "tokens.token": token,
    });
    const designer = await Tailors.findOne({
      _id: decoded.user._id,
      // "tokens.token": token,
    });
    if (!client && !designer) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    } else if (client) {
      res.status(200).json({
        success: true,
        message: "Token verified successfully",
        clientId: client._id,
      });
    } else if (designer) {
      res.status(200).json({
        success: true,
        message: "Token verified successfully",
        designerId: designer._id,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "internal server error", error });
  }
};

/**
 * Create Client - Signup
 * @param {object} req
 * @param {object} res
 */
exports.createByAdmin = async (req, res) => {
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

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const client = await Clients.create(req.body); // Adding client in db

    // Done
    res.json({ success: true, client }); //Success
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
 * Get all Clients
 * @param {object} req
 * @param {object} res
 */
exports.getAllByQuery = async (req, res) => {
  try {
    const tailorID = req.user._id;
    const query = req.params.query; // Getting query from URL parameter
    const users = await Clients.find({
      name: { $regex: new RegExp("^" + query, "i") },
      tailor: tailorID,
    }).populate("orders"); // Finding all the users from db
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
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called avatar in body object
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        parseInt(bcryptSalt)
      );
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

/**
 * Update client by admin
 * @param {object} req
 * @param {object} res
 */
exports.updateByAdmin = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    // If user want to update it's password
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        parseInt(bcryptSalt)
      );
    }

    const client = await Clients.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    res.json({ success: true, client }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete client
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const client = await Clients.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, client }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
