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
    const client = await Clients.findById(req.body.client); //get client
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
exports.getAll = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("color")
      .populate("fabric")
      .populate("tailor")
      .populate("client"); // Finding all the orders from db
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
      .populate("color")
      .populate("fabric")
      .populate("tailor")
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

/**
 * Delete order
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Getting order id from URL parameter
    const order = await Orders.findByIdAndDelete(orderId); // Deleting the order
    console.log(order, "Order");
    if (order)
      return res.json({ success: true, message: "Oder deleted", order }); // Success
    res.json({ success: false, message: "order already deleted" }); // if order already deleted
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get  order of client(Pending)
 * @param {object} req
 * @param {object} res
 */
exports.ClientPendingOrder = async (req, res) => {
  try {
    const clientOrders = await Orders.find({
      client: req.params.clientId,
      status: "pending",
    })
      .populate("color")
      .populate("fabric"); //find all pending orders of a client
    if (clientOrders.length > 0)
      //if exist
      return res.json({ success: true, clientOrders });
    //if no order found
    else return res.json({ success: false, message: "No order is que" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get  order of client(In Progress)
 * @param {object} req
 * @param {object} res
 */
exports.ClientInProgressOrder = async (req, res) => {
  try {
    //find all in progress orders of a client
    const clientOrders = await Orders.find({
      client: req.params.clientId,
      status: "inprogress",
    })
      .populate("tailor")
      .populate("fabric")
      .populate("color");

    if (clientOrders.length > 0)
      //if exist
      return res.json({ success: true, clientOrders });
    //if no order found
    else return res.json({ success: false, message: "No order is que" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get  order of client(completed)
 * @param {object} req
 * @param {object} res
 */
exports.ClientCompletedOrder = async (req, res) => {
  try {
    //find all completed orders of a client
    const clientOrders = await Orders.find({
      client: req.params.clientId,
      status: "completed",
    })
      .populate("tailor")
      .populate("fabric")
      .populate("color");
    //if exist
    if (clientOrders.length > 0)
      return res.json({ success: true, clientOrders });
    //not found
    else
      return res.json({ success: false, message: "No order is completed yet" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get  order of Tailor(In Progress)
 * @param {object} req
 * @param {object} res
 */
exports.TailorInProgressOrder = async (req, res) => {
  try {
    //find all in Progress orders of a tailor
    const tailorOrders = await Orders.find({
      tailor: req.params.tailorId,
      status: "inprogress",
    })
      .populate("client")
      .populate("fabric")
      .populate("color");
    //If exist
    if (tailorOrders.length > 0)
      return res.json({ success: true, tailorOrders });
    //NOT FOUND
    else return res.json({ success: false, message: "No order is que" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get  order of Tailor(completed)
 * @param {object} req
 * @param {object} res
 */
exports.TailorCompletedOrder = async (req, res) => {
  try {
    //find all COMPLETED orders of a Tailor
    const tailorOrders = await Orders.find({
      tailor: req.params.tailorId,
      status: "completed",
    })
      .populate("client")
      .populate("fabric")
      .populate("color");
    //if found
    if (tailorOrders.length > 0)
      return res.json({ success: true, tailorOrders });
    else
      return res.json({ success: false, message: "No order is completed yet" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
