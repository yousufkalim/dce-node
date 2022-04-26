const router = require("express").Router();
const statistics = require("../controllers/statistics");
router.get("/", statistics.getTotal); // Get total users

module.exports = router;
