const router = require('express').Router();
const { upload, getAllImages } = require('../controllers/images');
const { blogImageUpload } = require('../middleware/imageUpload');

// Image Upload
router.post('/', blogImageUpload.single('image'), upload);
router.get('/', getAllImages);

module.exports = router;
