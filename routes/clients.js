/**
 * CLIENTS CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const clients = require("../controllers/clients");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { upload } = require("../middleware/multer");
const {
  validateClient,
  validateClientUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post("/", validateClient, isValidated, clients.create);
router.post(
  "/createByAdmin",
  checkAdminAuth,
  validateClient,
  isValidated,
  clients.createByAdmin
);

// Read
router.get("/", checkAuth, clients.getAll); // Get all users by query
router.get("/:userId", checkAuth, clients.getById); // Get one user by it's id
router.get("/byQuery/:query", checkAuth, clients.getAll); // Get all users by query

// Update
router.put(
  "/:userId",
  upload.single("image"),
  checkAuth,
  validateClientUpdate,
  isValidated,
  clients.update
); // Update a specific user by it's id
router.put("/updateByAdmin/:userId", checkAdminAuth, clients.updateByAdmin);

// Delete
router.delete("/:userId", checkAdminAuth, clients.delete);
// forget password
router.post("/forget-password", clients.forgetPassword);
router.put("/reset-password/:token", clients.resetPassword);
router.get("/verify-token/:token", clients.verifyPasswordToken);

// Export
module.exports = router;
