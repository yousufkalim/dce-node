const Clients = require('../models/Clients');
const Tailors = require('../models/Tailors');
const Orders = require('../models/Orders');
const Complaints = require('../models/Complaints');

/**
 * Get Clients Length
 * @param {object} req
 * @param {object} res
 */
exports.getTotal = async (req, res) => {
  try {
    let totalBudget = 0;
    const clients = await Clients.find().count(); // Finding all the users from db
    const designers = await Tailors.find().count(); // Finding all the users from db
    const orders = await Orders.find({ status: 'completed' }); // Finding all the users from db
    if (orders.length > 0) {
      totalBudget = orders.map((item) => item.budget.max_price).reduce((prev, curr) => +prev + +curr, 0);
    }
    const complaints = await Complaints.find().count(); // Finding all the users from db

    const statistics = {
      clients,
      designers,
      orders: orders.length,
      complaints,
      totalBudget,
    };

    res.json({ success: true, statistics }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
