const fs = require('fs');
const path = require('path');
const { promises } = require('fs');

exports.upload = (req, res) => {
  res.json({ success: true, image: req.file.path });
};

exports.getAllImages = async (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads/blogImages');
  try {
    const files = await promises.readdir(directoryPath);

    res.send(files);
  } catch (error) {
    res.status(500).send(error);
  }
};
