exports.upload = (req, res) => {
  res.json({ success: true, image: req.file.path });
};
