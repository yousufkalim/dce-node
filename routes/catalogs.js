/**
 * Catalogs routes
 * @author Shuja Naqvi
 */
 const router = require("express").Router();
 const catalogs = require("../controllers/catalogs");
 const { checkAuth }  = require("../middleware/checkAuth");
 const { upload } = require("../middleware/multer");
 const { validateCatalog, isValidated } = require("../middleware/validators");
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post  place catalog
  * @method get get catalogs
  * @method put edit catalog
  * @method delete delete catalog
  */
 // Create - New catalog
 router.post("/", upload.single("image"), checkAuth, validateCatalog, isValidated, catalogs.create);
 // Get-catalogs by query
 router.post("/byQuery", checkAuth, catalogs.getAllByQuery);
 // Get-catalog by Id
 router.get("/:catalogId", checkAuth, catalogs.getById);
 // Update catalog
 router.put("/:catalogId", upload.single("image"), checkAuth, catalogs.update);
 
 // Export
 module.exports = router;
 