/**
 * Orders controllers
 * @author Shuja Naqvi
 */
const Clients = require("../models/Clients");
const Tailors = require("../models/Tailors");
const Orders = require("../models/Orders");
const Quotes = require("../models/Quotes");
const Catalogs = require("../models/Catalogs");
const Notifications = require("../models/Notifications");

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
    req.body.measurements = JSON.parse(req.body.measurements);
    req.body.delivery = JSON.parse(req.body.delivery);
    req.body.budget = JSON.parse(req.body.budget);
    const orders = await Orders.create(req.body); //create order of client
    client.orders.push(orders.id); //assign order to client too
    await client.save(); //save client

    if (req.body.type == "direct") {
      // Send notification to tailor
      await Notifications.create({
        sender: client,
        receiver: req.body.tailor,
        text: "Sent you an order request.",
        link: "orders",
      });
    }

    res.json({ success: true, orders }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all orders
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("quotes")
      .populate("client")
      .populate("tailor"); // Finding all the tailors from db
    res.json({ success: true, orders }); // Success
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
exports.accept = async (req, res) => {
  try {
    const orderID = req.body.id;
    const order = await Orders.findById(orderID).populate("tailor");
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

    // Send notification to client
    await Notifications.create({
      sender: order.tailor,
      receiver: order.client,
      text: "Order request accepted.",
      link: "orders",
    });

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
    const order = await Orders.findById(orderID).populate("tailor");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if tailor not found
    }
    await Orders.findByIdAndUpdate(orderID, {
      status: "discarded",
    }); //update order

    // Send notification to client
    await Notifications.create({
      sender: order.tailor,
      receiver: order.client,
      text: "Order discarded.",
      link: "orders",
    });

    res.json({ success: true, message: "Order discarded." }); //Done ...:)
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
exports.complete = async (req, res) => {
  try {
    const orderID = req.body.id;
    const order = await Orders.findById(orderID).populate("tailor");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if order not found
    }
    await Orders.findByIdAndUpdate(orderID, {
      status: "completed",
      tailor_submission: {
        details: req.body.details,
        attachment: req.file.path,
      },
    }); //update order

    // Update ratings.
    const _rating = req.body.rating;
    await Clients.findByIdAndUpdate(order.client, {
      $push: {
        ratings: _rating,
      },
    });
    if (order.catalog) {
      await Catalogs.findByIdAndUpdate(order.catalog, {
        $push: {
          ratings: _rating,
        },
      });
    }

    // Send notification to client
    await Notifications.create({
      sender: order.tailor,
      receiver: order.client,
      text: "Order completed.",
      link: "orders",
    });

    res.json({ success: true, message: "Order completed." }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Feedback to order
 * @param {object} req
 * @param {object} res
 */
exports.feedback = async (req, res) => {
  try {
    const orderID = req.body.id;
    const order = await Orders.findById(orderID).populate("client");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if order not found
    }
    await Orders.findByIdAndUpdate(orderID, {
      client_submission: {
        details: req.body.details,
      },
    }); //update order

    // Update ratings
    const _rating = req.body.rating;
    await Tailors.findByIdAndUpdate(order.tailor, {
      $push: {
        ratings: _rating,
      },
    });

    // Send notification to tailor
    await Notifications.create({
      sender: order.client,
      receiver: order.tailor,
      text: `Feedback given by client ${_rating}/5.`,
      link: "orders",
    });

    res.json({ success: true, message: "Feedback saved." }); //Done ...:)
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
    req.body.measurements = JSON.parse(req.body.measurements);
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
