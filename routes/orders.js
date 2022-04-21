/**
 * Orders auth routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const orders = require("../controllers/orders");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { upload } = require("../middleware/multer");
const { validateOrder, isValidated } = require("../middleware/validators");
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  place order
 * @method get get orders
 * @method put edit order
 * @method delete delete order
 */
// Create - New order
router.post(
  "/",
  upload.single("image"),
  checkAuth,
  validateOrder,
  isValidated,
  orders.create
);
// Accept - order request
router.post("/accept", checkAuth, orders.accept);
// Discard - order
router.post("/discard", checkAuth, orders.discard);
// Complete - order
router.post(
  "/complete",
  upload.single("attachment"),
  checkAuth,
  orders.complete
);
// Feedback - order
router.post("/feedback", checkAuth, orders.feedback);
// Get-orders by query
router.post("/byQuery", checkAuth, orders.getAllByQuery);
// Get-orders by name
router.get("/byName/:name", checkAuth, orders.getAllByName);
// Get-order by Id
router.get("/", checkAdminAuth, orders.getAll);
router.get("/:orderId", checkAuth, orders.getById);
// Update order
router.put("/:orderId", upload.single("image"), checkAuth, orders.update);

// Export
module.exports = router;
