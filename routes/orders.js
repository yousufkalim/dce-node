/**
 * Orders auth routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const orders = require("../controllers/orders");
const { checkAuth }  = require("../middleware/checkAuth");
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
router.post("/", upload.single("image"), checkAuth, validateOrder, isValidated, orders.create);
// Acceppt - order
router.post("/acceptRequest", checkAuth, orders.acceptRequest);
// Discard - order
router.post("/discard", checkAuth, orders.discard);
//mGet-orders by query
router.post("/byQuery", checkAuth, orders.getAllByQuery);
// Get-order by Id
router.get("/:orderId", checkAuth, orders.getById);
// Update order
router.put("/:orderId", upload.single("image"), checkAuth, orders.update);

// Export
module.exports = router;
