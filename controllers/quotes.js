/**
 * quote CRUD controllers
 * @author Shuja Naqvi
 */

const Quotes = require("../models/quotes");
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
      chat.quotes.push(quote._id);
      exisitingOrder.quotes.push(quote._id);
      await chat.save();
      await exisitingOrder.save();
      return res.json({ success: true, exisitingOrder });
    }
    chat = await Chats.create({
      tailor: tailorId,
      client: exisitingOrder.client,
      quotes: quote._id,
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

