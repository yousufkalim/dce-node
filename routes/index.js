/**
 * All api routes handles here
 * @author Shuja Naqvi
 */
const router = require("express").Router();

// Parent Routes
router.use("/clients", require("./clients")); // All the clients routes
router.use("/tailors", require("./tailors")); // All the Tailors routes
router.use("/orders", require("./orders")); //All the orders routes
router.use("/catalogs", require("./catalogs")); //All the catalogs routes
router.use("/otps", require("./OTPs")); //All the otps routes
router.use("/quotes", require("./quotes")); //All the quotes routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/chats", require("./chats")); // All the chat routes
router.use("/messages", require("./messages")); // All the messages routes

// Export
module.exports = router;
