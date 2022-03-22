/**
 * quote routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const quotes = require("../controllers/quotes");
const { checkAuth }  = require("../middleware/checkAuth");
const { validateQuote, validateAcceptQuote, isValidated } = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post add quotes
 * @method get get quotes
 * @method put change quotes
 * @method delete delete quotes
 */
// Create - New quotes
router.post("/", checkAuth, validateQuote, isValidated, quotes.create);
// Accept - quotes
router.post("/accept", checkAuth, validateAcceptQuote, isValidated, quotes.acceptQuote);
//Get-quote by Id
router.get("/:quoteId", checkAuth, quotes.getById);
// Export
module.exports = router;
