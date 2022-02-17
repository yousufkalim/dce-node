/**
 * Qoute CRUD controllers
 * @author Shuja Naqvi
 */
const Qoutes = require("../models/Qoutes");
const Orders = require("../models/Orders");
const Chats = require("../models/Chats");
const Tailors = require("../models/Tailors");

/**
 * Create Qoutes
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    console.log("body", req.body);
    const { tailor, order } = req.body;
    const exisitingOrder = await Orders.findById(order);
    if (!exisitingOrder)
      return res.json({ success: false, message: "OrderId is invalid" });
    const qoute = await Qoutes.create(req.body);
    let chat = await Chats.findOne({
      tailor: tailor,
      client: exisitingOrder.client,
    });
    if (chat) {
      chat.qoutes.push(qoute._id);
      exisitingOrder.qoute_requests.push(qoute._id);
      await chat.save();
      await exisitingOrder.save();
      return res.json({ success: true, exisitingOrder });
    }
    chat = await Chats.create({
      tailor: tailor,
      client: exisitingOrder.client,
      qoutes: qoute._id,
    });
    exisitingOrder.qoute_requests.push(qoute._id);
    await exisitingOrder.save();
    return res.json({ success: true, exisitingOrder });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Qoutes
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const qoutes = await Qoutes.find().populate("tailor"); // Finding all the Qoutes from db
    res.json({ success: true, qoutes }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Qoutes by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const qouteId = req.params.qouteId; // Getting Qoutes id from URL parameter
    console.log(qouteId, "QouteId");
    const qoute = await Qoutes.findById(qouteId).populate("tailor"); // Finding Qoutes by id
    res.json({ success: true, qoute }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Update Qoutes
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const qouteId = req.params.qouteId; // Getting Qoutes id from URL parameter
    const qoute = await Qoutes.findByIdAndUpdate(qouteId, req.body, {
      new: true,
    }); // Updating the Qoutes
    res.json({ success: true, qoute }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete Qoute
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const qouteId = req.params.qouteId; // Getting Qoutes id from URL parameter
    const qoute = await Qoutes.findByIdAndDelete(qouteId); // Deleting the Qoutes
    if (qoute) return res.json({ success: true, qoute });
    // Success
    else return res.json({ success: false, message: "Already Deleted" }); //if already deleted
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Set Qoute Status
 * @param {object} req
 * @param {object} res
 */
exports.qouteResponse = async (req, res) => {
  try {
    const qouteId = req.params.qouteId; // Getting Qoutes id from URL parameter
    const status = req.body.status;
    let qoute = await Qoutes.findById(qouteId); //finding qoute from db
    if (!qoute) {
      //if qouteId is invalid
      return res.json({ success: false, message: "Invalid Qoute Id" });
    }
    //if qoute is accepted
    if (status === "accepted") {
      qoute.status = status;
      await qoute.save();
      // Updating the order
      await Orders.findByIdAndUpdate(
        qoute.order,
        { tailor: qoute.tailor, status: "inprogress" },
        {
          new: true,
        }
      );
      // Assign tailor order too
      await Tailors.findByIdAndUpdate(
        qoute.tailor,
        { $push: { orders: qoute.order } },
        {
          new: true,
        }
      );
      return res.json({ success: true, qoute }); // Success
    }
    //If client reject the qoute then simple update
    qoute.status = status;
    await qoute.save();
    res.json({ success: true, qoute }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
