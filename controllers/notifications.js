/**
 * Notications controllers
 * @author Shuja Naqvi
 */
const Notifications = require("../models/Notifications");

/**
 * Get all Notifications
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const userID = req.user._id;
    const notifications = await Notifications.find({
      receiver: userID,
    });
    res.json({ success: true, notifications }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get notification by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const notificationId = req.params.notificationId; // Getting notification id from URL parameter
    const notification = await Notifications.findById(notificationId);
    res.json({ success: true, notification }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Notifications
 * @param {object} req
 * @param {object} res
 */
exports.UpdateStatus = async (req, res) => {
  try {
    const userID = req.user._id;
    const notifications = await Notifications.updateMany(
      {
        receiver: userID,
      },
      {
        is_read: true,
      }
    );
    res.json({ success: true, message: "Notifications read successfully." }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
