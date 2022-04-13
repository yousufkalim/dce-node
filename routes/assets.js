/**
 * Assets CRUD routes
 * @author Shuja Naqvi
 */
const assets = require("../controllers/assets");
const router = require("express").Router();
const { checkAuth } = require("../middleware/checkAuth");
const { upload } = require("../middleware/multer");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post upload asset
 */

// Create - Upload asset
router.post("/", upload.single("file"), checkAuth, assets.upload);

// Export
module.exports = router;
