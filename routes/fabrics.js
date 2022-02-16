/**
 * Fabrics  routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const fabrics = require("../controllers/fabrics");
const { validateFabric, isValidated } = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  add fabrics
 * @method get get fabrics
 * @method put change fabric
 * @method delete delete fabrics
 */
// Create - New fabrics
router.post("/", validateFabric, isValidated, fabrics.create);
//Find-All fabrics
router.get("/", fabrics.getAll);
//Get-fabrics by Id
router.get("/:fabricId", fabrics.getById);
//  //update fabrics
router.put("/:fabricId", fabrics.update);
//  //Delete fabrics
router.delete("/:fabricId", fabrics.delete);
// Export
module.exports = router;
