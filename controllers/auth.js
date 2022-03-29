/**
 * User auth controllers
 * @author Shuja Naqvi
 */
const Clients = require("../models/Clients");
const Tailors = require("../models/Tailors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
//Same login module for both users
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password } = req.body;
    // Getting user from db
    const client = await Clients.findOne({ email }); //finding if request by client
    const tailor = await Tailors.findOne({ email }); //finding if request by tailor
    if (!client && !tailor) {
      //if both empty
      // If user not found
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      //if request by a client
      if (client) {
        const isMatched = bcrypt.compareSync(password, client.password);
        if (!isMatched) {
          // If password not matched
          return res
            .status(400)
            .json({ success: false, message: "Invalid Password" });
        }

        // Creating payload with user object
        const payload = { user: client };

        // Generating token
        jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          // done
          return res.json({ success: true, user: client, token });
        });
      } else {
        const isMatched = bcrypt.compareSync(password, tailor.password);
        if (!isMatched) {
          // If password not matched
          return res
            .status(400)
            .json({ success: false, message: "Invalid Password" });
        }
        // Creating payload with user object
        const payload = { user: tailor };

        // Generating token
        jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;

          // done
          return res.json({ success: true, user: tailor, token });
        });
      }
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    //if new and confirm password are not same
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are not same",
      });
    }
    //if new and old password are  same
    if (oldPassword == newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new password are same",
      });
    }
    let user = await Clients.findById(userId); // to check request by client
    let tailor = await Tailors.findById(userId); // to check request by tailor
    //if both are empty
    if (!user && !tailor) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user) {
      //compare old password with password saved in DB
      const isMatched = bcrypt.compareSync(oldPassword, user.password);
      //If they don't match
      if (!isMatched) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid old Password" });
      }
      //it will bcrypt new password and will store in db
      user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));
      //save
      await user.save();
      // return response
      return res.json({ success: true, user });
    } else {
      //If the request send by tailor
      //it will compare old and password in db
      const isMatched = bcrypt.compareSync(oldPassword, tailor.password);
      //if no match found
      if (!isMatched) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid old Password" });
      }
      //it will bcrypt new password and will store in db
      tailor.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));
      //update tailor pswd
      await tailor.save();
      //return response
      return res.json({ success: true, tailor });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {

  const userID = req.user._id;

  const client = await Clients.findById(userID); //finding if request by client
  const tailor = await Tailors.findById(userID); //finding if request by tailor

  if(client){
    res.json({ success: true, user: client });
  } else {
    res.json({ success: true, user: tailor });
  }
  
};
