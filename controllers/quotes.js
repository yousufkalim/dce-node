/**
 * quote CRUD controllers
 * @author Shuja Naqvi
 */

const Quotes = require("../models/Quotes");
const Orders = require("../models/Orders");
const Chats = require("../models/Chats");

/**
 * Create quotes
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const tailorId = req.user._id;
    const { order } = req.body;
    req.body.tailor = tailorId;
    const exisitingOrder = await Orders.findById(order);
    if (!exisitingOrder)
      return res.json({ success: false, message: "OrderId is invalid" });
    const quote = await Quotes.create(req.body);
    let chat = await Chats.findOne({
      tailor: tailorId,
      client: exisitingOrder.client,
    });
    if (chat) {
      exisitingOrder.quotes.push(quote._id);
      await chat.save();
      await exisitingOrder.save();
      return res.json({ success: true, exisitingOrder });
    }
    chat = await Chats.create({
      tailor: tailorId,
      client: exisitingOrder.client,
    });
    exisitingOrder.quotes.push(quote._id);
    await exisitingOrder.save();
    return res.json({ success: true, message: "Quote sent successfully." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Create quotes
 * @param {object} req
 * @param {object} res
 */
exports.acceptQuote = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { quote } = req.body;
    const existingQuote = await Quotes.findById(quote);
    if (!existingQuote)
      return res.json({ success: false, message: "QuoteId is invalid" });
    const quotes = await Quotes.findByIdAndUpdate(existingQuote._id, {
      $set: {
        status: "accepted",
      },
    });
    const orders = await Orders.findByIdAndUpdate(existingQuote.order, {
      $set: {
        status: "in_progress",
        tailor: existingQuote.tailor,
      },
    });
    if (quotes && orders) {
      return res.json({
        success: true,
        message: "Quote accepted successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Could not accept quote successfully.",
      });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Create quotes
 * @param {object} req
 * @param {object} res
 */
exports.rejectQuote = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { quote } = req.body;
    const existingQuote = await Quotes.findById(quote);
    if (!existingQuote)
      return res.json({ success: false, message: "QuoteId is invalid" });
    const quotes = await Quotes.findByIdAndUpdate(existingQuote._id, {
      $set: {
        status: "rejected",
      },
    });
    if (quotes) {
      return res.json({
        success: true,
        message: "Quote discarded successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Could not discard quote successfully.",
      });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get quotes by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const quoteId = req.params.quoteId; // Getting quotes id from URL parameter
    const quote = await Quotes.findById(quoteId).populate("tailor"); // Finding quotes by id
    res.json({ success: true, quote }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
