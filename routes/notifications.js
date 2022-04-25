/**
 * Notifications routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const notifications = require("../controllers/notifications");
const { checkAuth } = require("../middleware/checkAuth");

// Get notifications
router.get("/", checkAuth, notifications.getAll);
// Get notification by Id
router.get("/:chatId", checkAuth, notifications.getById);
// Read notifications
router.get("/read", checkAuth, notifications.UpdateStatus);

// Export
module.exports = router;
