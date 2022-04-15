/**
 * Messages routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const messages = require("../controllers/messages");
const { checkAuth } = require("../middleware/checkAuth");

// Get messages by query
router.post("/byQuery", checkAuth, messages.getAllByQuery);
// Get message by Id
router.get("/:messageId", checkAuth, messages.getById);
// Delete message
router.delete("/:messageId", checkAuth, messages.delete);

// Export
module.exports = router;
