/**
 * Catalogs routes
 * @author Shuja Naqvi
 */
 const router = require("express").Router();
 const catalogs = require("../controllers/catalogs");
 const { checkAuth }  = require("../middleware/checkAuth");
 const { validateCatalog, isValidated } = require("../middleware/validators");
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post  place catalog
  * @method get get catalogs
  * @method put edit catalog
  * @method delete delete catalog
  */
 // Create - New catalog
 router.post("/", checkAuth, validateCatalog, isValidated, catalogs.create);
 //Get-catalogs by query
 router.post("/byQuery", checkAuth, catalogs.getAllByQuery);
 //Get-catalog by Id
 router.get("/:catalogId", checkAuth, catalogs.getById);
 //update catalog
 router.put("/:catalogId", checkAuth, catalogs.update);
 
 // Export
 module.exports = router;
 