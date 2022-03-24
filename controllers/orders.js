/**
 * Orders controllers
 * @author Shuja Naqvi
 */
const Orders = require("../models/Orders");
const Clients = require("../models/Clients");

/**
 * Create order
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const clientID = req.user._id;
    req.body.client = clientID;
    const client = await Clients.findById(clientID); //get client
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client do not exists" }); //if client not found
    }
    const orders = await Orders.create(req.body); //create order of client
    client.orders.push(orders.id); //assign order to client too
    await client.save(); //save client
    res.json({ success: true, orders }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


/**
 * Get all Orders
 * @param {object} req
 * @param {object} res
 */
 exports.getAllByQuery = async (req, res) => {
  try {
    const orders = await Orders.find(req.body)
      .populate(
        {
          path: "quotes",
          populate: {
            path: "tailor",
          }
        }
      )
      .populate("client"); // Finding all the orders from db
    console.log(orders.length);
    res.json({ success: true, orders }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get order by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Getting order id from URL parameter
    const order = await Orders.findById(orderId)
      .populate(
        {
          path: "quotes",
          populate: {
            path: "tailor",
          }
        }
      )
      .populate("client"); // Finding all the orders from db
    res.json({ success: true, order }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update order
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Getting order id from URL parameter
    const order = await Orders.findByIdAndUpdate(orderId, req.body, {
      new: true,
    }); // Updating the color
    res.json({ success: true, order }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

