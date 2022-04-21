/**
 * complaints CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const { checkAuth } = require("../middleware/checkAuth");
const complaints = require("../controllers/complaints");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { upload } = require("../middleware/multer");
const {
  validateClient,
  validateClientUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post complaints signup
 * @method get get all complaintss
 * @method get get complaints by id
 * @method put update complaints
 * @method delete delete complaints
 */

//Create - complaints
router.post("/", complaints.create);

// Read
router.get("/", complaints.getAll); // Get all complaintss at once
router.get("/:complaintId", checkAuth, complaints.getById); // Get one complaints by it's id

// // Update
// router.put(
//   "/",
//   upload.single("image"),
//   checkAuth,
//   validateClientUpdate,
//   isValidated,
//   complaints.update
// ); // Update a specific complaints by it's id

router.delete("/:complaintId", complaints.delete);

// Export
module.exports = router;
