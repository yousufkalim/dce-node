const router = require("express").Router();
const { upload } = require("../controllers/images");
const { blogImageUpload } = require("../middleware/imageUpload");

// Image Upload
router.post("/", blogImageUpload.single("image"), upload);

module.exports = router;
