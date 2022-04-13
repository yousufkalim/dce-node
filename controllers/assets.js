/**
 * Upload file
 * @param {object} req
 * @param {object} res
 */
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File must be provided" });
    }
    res.json({ success: true, file: req.file.path }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
