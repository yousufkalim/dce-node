/**
 * CLIENTS CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const clients = require("../controllers/clients");
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

// Read
router.get("/", clients.getAll); // Get all users at once
router.get("/:userId", clients.getById); // Get one user by it's id
router.put("/verifyOTP/:userId", clients.verifyOTP); //verify otp
// Update
router.put("/:userId", validateClientUpdate, isValidated, clients.update); // Update a specific user by it's id

// Delete
router.delete("/:userId", clients.delete); // delete a specific user by it's id

// Export
module.exports = router;
