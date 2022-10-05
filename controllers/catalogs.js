/**
 * Catalogs controllers
 * @author Shuja Naqvi
 */
const Catalogs = require('../models/Catalogs');
const Tailors = require('../models/Tailors');

/**
 * Create catalog
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const tailorID = req.user._id;
    req.body.tailor = tailorID;

    // Handle attachments
    const attachments = req.files ?? [];
    req.body.attachments = [];
    for (let i = 0; i < attachments.length; i++) {
      req.body.attachments.push(attachments[i].path);
    }

    const tailor = await Tailors.findById(tailorID); //get tailor
    if (!tailor) {
      return res.status(404).json({ success: false, message: 'Client do not exists' }); //if tailor not found
    }
    const catalog = await Catalogs.create(req.body); //create catalog of tailor
    res.json({ success: true, catalog }); //Done ...:)
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all catalogs
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const catalogs = await Catalogs.find().populate('tailor'); // Finding all the tailors from db
    res.json({ success: true, catalogs }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all Catalogs
 * @param {object} req
 * @param {object} res
 */
exports.getAllByQuery = async (req, res) => {
  try {
    const catalogs = await Catalogs.find(req.body).populate('tailor'); // Finding all the catalogs from db
    res.json({ success: true, catalogs }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get catalog by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const catalogId = req.params.catalogId; // Getting catalog id from URL parameter
    const catalog = await Catalogs.findById(catalogId).populate('tailor'); // Finding all the catalogs from db
    res.json({ success: true, catalog }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update catalog
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const catalogId = req.params.catalogId; // Getting catalog id from URL parameter

    // Handle attachments
    const attachments = req.files ?? [];
    const parsedAttachments = [];

    // check if existing images
    if (req.body.images) {
      if (typeof req.body.images === 'string') {
        parsedAttachments.push(req.body.images);
      } else {
        for (let i = 0; i < req.body.images.length; i++) {
          parsedAttachments.push(req.body.images[i]);
        }
      }
    }
    for (let i = 0; i < attachments.length; i++) {
      parsedAttachments.push(attachments[i].path);
    }

    const oldCatalog = await Catalogs.findById(catalogId);
    if (!oldCatalog) {
      res.status(400).json({ success: false, message: 'Not catalog found.' }); // Success
      return;
    }

    if (oldCatalog.attachments.length >= 5 && attachments.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Max attachments limit reached. No more attachments can be added.'
      }); // Success
      return;
    }

    const catalog = await Catalogs.findByIdAndUpdate(
      catalogId,
      {
        ...req.body,
        attachments: parsedAttachments
        // ...{ $push: { attachments: parsedAttachments } }
      },
      {
        new: true
      }
    ); // Updating the color
    res.json({ success: true, catalog }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
