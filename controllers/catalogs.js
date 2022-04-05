/**
 * Catalogs controllers
 * @author Shuja Naqvi
 */
 const Catalogs = require("../models/Catalog");
 const Tailors = require("../models/Tailors");
 
 /**
  * Create catalog
  * @param {object} req
  * @param {object} res
  */
 exports.create = async (req, res) => {
   try {
     const tailorID = req.user._id;
     req.body.tailor = tailorID;
     if (req.file) {
       req.body.attachment = req.file.path; // Creating a new property called attachment in body object
     }
     const tailor = await Tailors.findById(tailorID); //get tailor
     if (!tailor) {
       return res
         .status(404)
         .json({ success: false, message: "Client do not exists" }); //if tailor not found
     }
     const catalog = await Catalogs.create(req.body); //create catalog of tailor
     res.json({ success: true, catalog }); //Done ...:)
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 /**
  * Get all Catalogs
  * @param {object} req
  * @param {object} res
  */
  exports.getAllByQuery = async (req, res) => {
   try {
     const catalogs = await Catalogs.find(req.body)
       .populate("tailor"); // Finding all the catalogs from db
     res.json({ success: true, catalogs }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
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
     const catalog = await Catalogs.findById(catalogId)
       .populate("tailor"); // Finding all the catalogs from db
     res.json({ success: true, catalog }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
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
     if (req.file) {
      req.body.attachment = req.file.path; // Creating a new property called attachment in body object
     }
     const catalog = await Catalogs.findByIdAndUpdate(catalogId, req.body, {
       new: true,
     }); // Updating the color
     res.json({ success: true, catalog }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 