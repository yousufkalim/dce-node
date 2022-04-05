/**
 * Orders auth routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const orders = require("../controllers/orders");
const { checkAuth }  = require("../middleware/checkAuth");
const { validateOrder, isValidated } = require("../middleware/validators");
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  place order
 * @method get get orders
 * @method put edit order
 * @method delete delete order
 */
// Create - New order
router.post("/", checkAuth, validateOrder, isValidated, orders.create);
// Acceppt - order
router.post("/acceptRequest", checkAuth, orders.acceptRequest);
// Discard - order
router.post("/discard", checkAuth, orders.discard);
//Get-orders by query
router.post("/byQuery", checkAuth, orders.getAllByQuery);
//Get-order by Id
router.get("/:orderId", checkAuth, orders.getById);
//update order
router.put("/:orderId", checkAuth, orders.update);

// Export
module.exports = router;
