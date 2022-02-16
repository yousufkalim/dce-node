/**
 * Color auth routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const colors = require("../controllers/colors");
const { upload } = require("../middleware/multer");
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post  add colors
 * @method get get colors
 * @method put change color
 * @method delete delete color
 */
// Create - New color
router.post("/", upload.single("image"), colors.create);
//Find-All color
router.get("/", colors.getAll);
//Get-color by Id
router.get("/:colorId", colors.getById);
//  //update color
router.put("/:colorId", upload.single("image"), colors.update);
//  //Delete color
router.delete("/:colorId", colors.delete);
// Export
module.exports = router;
