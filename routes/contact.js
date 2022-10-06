// Init
const router = require('express').Router();
const { createContact, getAllContact } = require('../controllers/contact');

// Routes
router.post('/', createContact);
router.get('/', getAllContact);

// Export
module.exports = router;
