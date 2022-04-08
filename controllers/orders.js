/**
 * Orders controllers
 * @author Shuja Naqvi
 */
const Orders = require("../models/Orders");
const Clients = require("../models/Clients");
const Quotes = require("../models/Quotes");

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
    if (req.file) {
      req.body.attachment = req.file.path; // Creating a new property called attachment in body object
    }
    // Parse stringified Objects
    req.body.delivery = JSON.parse(req.body.delivery);
    req.body.budget = JSON.parse(req.body.budget);
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
 * Accept order request
 * @param {object} req
 * @param {object} res
 */
exports.acceptRequest = async (req, res) => {
  try {
    const orderID = req.body.id;
    const order = await Orders.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if tailor not found
    }
    const quote = await Quotes.create({
      order: order._id,
      price: order.budget.min_price,
      description: "*** System generated description ***",
      status: "accepted",
    }); // Create quote and accept it
    await Orders.findByIdAndUpdate(orderID, {
      status: "in_progress",
      $push: {
        quotes: quote._id,
      },
    }); //update order
    res.json({ success: true, message: "Order accepted." }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Discard order
 * @param {object} req
 * @param {object} res
 */
exports.discard = async (req, res) => {
  try {
    const orderID = req.body.id;
    const order = await Orders.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if tailor not found
    }
    await Orders.findByIdAndUpdate(orderID, {
      status: "discarded",
    }); //update order
    res.json({ success: true, message: "Order discarded." }); //Done ...:)
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
      .populate({
        path: "quotes",
        populate: {
          path: "tailor",
        },
      })
      .populate("client")
      .populate("tailor"); // Finding all the orders from db
    // TODO: Optimize it.
    for (let i = 0; i < orders.length; i++) {
      const quotes = orders[i].quotes.filter((_) => _.status == "pending");
      orders[i].quotes = quotes;
    }
    res.json({ success: true, orders }); // Success
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
exports.getAllByName = async (req, res) => {
  try {
    const name = req.params.name; // Getting order id from URL parameter
    const orders = await Orders.find({
      name: { $regex: new RegExp("^" + name, "i") },
    })
      .populate({
        path: "quotes",
        populate: {
          path: "tailor",
        },
      })
      .populate("client")
      .populate("tailor"); // Finding all the orders from db
    // TODO: Optimize it.
    for (let i = 0; i < orders.length; i++) {
      const quotes = orders[i].quotes.filter((_) => _.status == "pending");
      orders[i].quotes = quotes;
    }
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
      .populate({
        path: "quotes",
        populate: {
          path: "tailor",
        },
      })
      .populate("client")
      .populate("tailor"); // Finding all the orders from db
    // TODO: Optimize it.
    const quotes = order.quotes.filter((_) => _.status == "pending");
    order.quotes = quotes;
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
    if (req.file) {
      req.body.attachment = req.file.path; // Creating a new property called attachment in body object
    }
    // Parse stringified Objects
    req.body.delivery = JSON.parse(req.body.delivery);
    req.body.budget = JSON.parse(req.body.budget);
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
