/**
 * Tailors CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const tailors = require("../controllers/tailors");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validatePassword,
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
router.post("/", validateUser, isValidated, tailors.create);
// Read
router.get("/", tailors.getAll); // Get all tailor at once
router.get("/:userId", tailors.getById); // Get one tailor by it's id

router.put("/verifyOTP/:userId", tailors.verifyOTP); //OTP verification
// Update
router.put("/:userId", validateTailorUpdate, isValidated, tailors.update); // Update a specific tailor by it's id

// Delete
router.delete("/:userId", tailors.delete); // delete a specific tailor by it's id

// Export
module.exports = router;
