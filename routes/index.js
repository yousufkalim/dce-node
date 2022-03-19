/**
 * All api routes handles here
 * @author Shuja Naqvi
 */
const router = require("express").Router();

// Parent Routes
router.use("/clients", require("./clients")); // All the clients routes
router.use("/tailors", require("./tailors")); // All the Tailors routes
router.use("/orders", require("./orders")); //All the orders routes
router.use("/otps", require("./OTPs")); //All the orders routes
router.use("/quotes", require("./quotes")); //All the orders routes
router.use("/auth", require("./auth")); // All the auth routes

// Export
module.exports = router;
