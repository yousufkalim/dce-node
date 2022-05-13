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
const Chats = require("../models/Chats");
const Messages = require("../models/Messages");

/**
 * Create order
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const clientID = req.user._id;
    req.body.client = clientID;
    const client = await Clients.findById(clientID); // get client

    // Handle attachments
    const attachments = req.files ?? [];
    req.body.attachments = [];
    for (let i = 0; i < attachments.length; i++) {
      req.body.attachments.push(attachments[i].path);
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

    // Handle attachments
    const attachments = req.files ?? [];
    req.body.attachments = [];
    for (let i = 0; i < attachments.length; i++) {
      req.body.attachments.push(attachments[i].path);
    }

    const order = await Orders.findById(orderID)
      .populate("tailor")
      .populate("quotes");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exists." }); //if order not found
    }
    await Orders.findByIdAndUpdate(orderID, {
      status: "completed",
      tailor_submission: {
        details: req.body.details,
        attachments: req.body.attachments,
      },
    }); //update order

    // Update ratings.
    // const _rating = req.body.rating;
    // await Clients.findByIdAndUpdate(order.client, {
    //   $push: {
    //     ratings: _rating,
    //   },
    // });
    // if (order.catalog) {
    //   await Catalogs.findByIdAndUpdate(order.catalog, {
    //     $push: {
    //       ratings: _rating,
    //     },
    //   });
    // }

    // Check if creation of catalog was requested in order
    if (order.create_catalog_after_completion) {
      const cPrice =
        order.quotes.filter((__) => __.status == "accepted")[0]?.price ?? 0;
      const cAttachment = order.attachments[0];
      await Catalogs.create({
        name: order.name,
        gender: order.gender,
        category: order.category,
        price: cPrice,
        description: "DCE: System generated description. You may edit it.",
        tailor: order.tailor._id,
        attachment: cAttachment,
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
    // for (let i = 0; i < orders.length; i++) {
    //   const quotes = orders[i].quotes.filter((_) => _.status == "pending");
    //   orders[i].quotes = quotes;
    // }
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
    // const quotes = order.quotes.filter((_) => _.status == "pending");
    // order.quotes = quotes;
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

    // Handle attachments
    const attachments = req.files ?? [];
    req.body.attachments = [];
    for (let i = 0; i < attachments.length; i++) {
      req.body.attachments.push(attachments[i].path);
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

/**
 * Create order
 * @param {object} req
 * @param {object} res
 */
exports.contactSupport = async (req, res) => {
  try {
    const userID = req.user._id;

    let chat;

    if (req.user.role == "client") {
      await Orders.findByIdAndUpdate(req.body.id, {
        client_support: true,
      });

      chat = await Chats.findOne({
        client: userID,
        is_admin: true,
      });

      if (!chat) {
        chat = await Chats.create({
          client: userID,
          is_admin: true,
        });
      }
    } else {
      await Orders.findByIdAndUpdate(req.body.id, {
        tailor_support: true,
      });

      console.log(xyz);

      chat = await Chats.findOne({
        tailor: userID,
        is_admin: true,
      });

      if (!chat) {
        chat = await Chats.create({
          tailor: userID,
          is_admin: true,
        });
      }
    }

    let message;

    message = await Messages.create({
      type: "text",
      chat: chat._id,
      sender: userID,
      is_admin: true,
      content: `Support regarding Order # ${req.body.id}`,
    });

    message = await Messages.create({
      type: "text",
      chat: chat._id,
      sender: userID,
      is_admin: true,
      content: `Reason:\n${req.body.reason}`,
    });

    await Chats.findByIdAndUpdate(chat._id, {
      last_message: message._id,
    });

    if (req.body.details) {
      message = await Messages.create({
        type: "text",
        chat: chat._id,
        sender: userID,
        is_admin: true,
        content: `Details:\n${req.body.details}`,
      });

      await Chats.findByIdAndUpdate(chat._id, {
        last_message: message._id,
      });
    }

    if (req.file) {
      message = await Messages.create({
        type: "attachment",
        chat: chat._id,
        sender: userID,
        is_admin: true,
        content: req.file.path,
      });

      await Chats.findByIdAndUpdate(chat._id, {
        last_message: message._id,
      });
    }

    res.json({
      success: true,
      message: "Support request submitted successfully.",
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
