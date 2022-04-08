/**
 * Tailors CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const tailors = require("../controllers/tailors");
const { checkAuth } = require("../middleware/checkAuth");
const { upload } = require("../middleware/multer");
const {
  validateClient,
  validateTailorUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post tailor signup
 * @method get get all tailors
 * @method get get tailors by id
 * @method put update tailor
 * @method delete delete tailor
 */

// Create - tailor Signup
router.post("/", validateClient, isValidated, tailors.create);

// Read
router.get("/", checkAuth, tailors.getAll); // Get all tailor at once
router.get("/:userId", checkAuth, tailors.getById); // Get one tailor by it's id

// Update
router.put(
  "/",
  upload.single("image"),
  checkAuth,
  validateTailorUpdate,
  isValidated,
  tailors.update
); // Update a specific tailor by it's id

// Export
module.exports = router;
