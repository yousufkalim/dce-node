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
router.get("/:notificationId", checkAuth, notifications.getById);
// Read notifications
router.post("/read", checkAuth, notifications.updateStatus);

// Export
module.exports = router;
