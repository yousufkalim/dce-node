const Clients = require("../models/Clients");
const Tailors = require("../models/Tailors");
const Orders = require("../models/Orders");
const Complaints = require("../models/Complaints");

/**
 * Get Clients Length
 * @param {object} req
 * @param {object} res
 */
exports.getTotal = async (req, res) => {
  try {
    const clients = await Clients.find().count(); // Finding all the users from db
    const designers = await Tailors.find().count(); // Finding all the users from db
    const orders = await Orders.find().count(); // Finding all the users from db
    const complaints = await Complaints.find().count(); // Finding all the users from db

    const statistics = {
      clients,
      designers,
      orders,
      complaints,
    };

    res.json({ success: true, statistics }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
