/**
 * User auth routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const auth = require('../controllers/auth');
const { checkAuth } = require('../middleware/checkAuth');
const { validateLogin, isValidated, changePasswordValidate } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post('/client_login', validateLogin, isValidated, auth.clientLogin); // client login
router.post('/tailor_login', validateLogin, isValidated, auth.tailorLogin); // client login
router.get('/', checkAuth, auth.confirmAuth); // Authentication
router.put('/password/:userId', changePasswordValidate, isValidated, auth.changePassword); // Change password route

// Export
module.exports = router;
