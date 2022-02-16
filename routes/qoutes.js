/**
 * Qoute routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const qoutes = require("../controllers/qoutes");
const { validateQoute, isValidated } = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  add qoutes
 * @method get get qoutes
 * @method put change qoutes
 * @method delete delete qoutes
 */
// Create - New qoutes
router.post("/", validateQoute, isValidated, qoutes.create);
//Find-All qoutes
router.get("/", qoutes.getAll);
//Get-qoute by Id
router.get("/:qouteId", qoutes.getById);
//update qoutes
router.put("/:qouteId", qoutes.update);
//Delete qoutes
router.delete("/:qouteId", qoutes.delete);
// Export
module.exports = router;
