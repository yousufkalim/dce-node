/**
 * Chats routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const chats = require("../controllers/chats");
const { checkAuth } = require("../middleware/checkAuth");

// Get chats by query
router.post("/byQuery", checkAuth, chats.getAllByQuery);
// Get chat by Id
router.get("/:chatId", checkAuth, chats.getById);
// Delete chat
router.delete("/:chatId", checkAuth, chats.delete);

// Export
module.exports = router;
