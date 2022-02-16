/**
 * Orders auth routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const orders = require("../controllers/orders");
const { validateAd, isValidated } = require("../middleware/validators");
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  place order
 * @method get get orders
 * @method put edit order
 * @method delete delete order
 */
// Create - New order
router.post("/", validateAd, isValidated, orders.create);

//Find-All order
router.get("/", orders.getAll);
//Get-order by Id
router.get("/:orderId", orders.getById);
//update order
router.put("/:orderId", orders.update);
//Delete order
router.delete("/:orderId", orders.delete);
/**
 * ////////////////////////// Routes /////////////////////////
 * Tailor side Routes
 */
//Get order of tailor(in_progress)
router.get("/TailorInProgressOrder/:tailorId", orders.TailorInProgressOrder);
//Get order of tailor(completed)
router.get("/TailorCompletedOrder/:tailorId", orders.TailorCompletedOrder);

/**
 * ////////////////////////// Routes /////////////////////////
 * Client side Routes
 */
//Get order of client(pending)
router.get("/ClientPendingOrder/:clientId", orders.ClientPendingOrder);
//Get order of client(in_progress)
router.get("/ClientInProgressOrder/:clientId", orders.ClientInProgressOrder);
//Get order of client(completed)
router.get("/ClientCompletedOrder/:clientId", orders.ClientCompletedOrder);
// Export
module.exports = router;
