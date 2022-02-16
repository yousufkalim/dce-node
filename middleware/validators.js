/**
 * All the validation
 * @author Shuja Naqvi
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.").notEmpty().trim(),
];
exports.validatePassword = [
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];
// User Signup Validation
exports.validateUserUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
  check("dob", "Date of Birth is required").notEmpty().isDate().trim(),
  check("address.city", "city  is required").notEmpty().trim(),
  check("address.country", "country is required").notEmpty().trim(),
  check("address.lat", "latitude is required").notEmpty().trim(),
  check("address.lng", "longitude is required").notEmpty().trim(),
  check("address.postal_code", "postal_code is required").notEmpty().trim(),
];

// Tailor Signup Validation
exports.validateTailorUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
  check("dob", "Date of Birth is required").notEmpty().isDate().trim(),
  check("diploma", "diploma  is required").notEmpty().trim(),
  check("speciality", "Speciality  is required").notEmpty().trim(),
  check("area_of_expertise", "area_of_expertise  is required")
    .notEmpty()
    .trim(),
  check("physical_store", "Store_info   is required").notEmpty().trim(),
  check("address.city", "city  is required").notEmpty().trim(),
  check("address.country", "country is required").notEmpty().trim(),
  check("address.lat", "latitude is required").notEmpty().trim(),
  check("address.lng", "longitude is required").notEmpty().trim(),
  check("address.postal_code", "postal_code is required").notEmpty().trim(),
];

// Login validation
exports.validateLogin = [
  check("email", "Email is required").notEmpty().isEmail().trim().toLowerCase(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", "Old Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", "New password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Confirm password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];
//create qoute validation
exports.validateQoute = [
  check("tailor", "TailorId is required").notEmpty().trim(),
  check("order", "Order Id is required").notEmpty().trim(),
  check("budget.max_amount", "Max Amount is required").notEmpty().trim(),
  check("offer", "Offer  is required").notEmpty().trim(),
  check("budget.min_amount", "Minimum Amount is required").notEmpty().trim(),
];
//create fabric validation
exports.validateFabric = [
  check("name", "Fabric_name is required").notEmpty().trim(),
  check("detail", "Fabric detail is required").notEmpty().trim(),
];
//create order validation
exports.validateAd = [
  check("name", "Name of order is required").notEmpty().trim(),
  check("client", "Client Id is required").notEmpty().trim(),
  check("gender", "Gender required").notEmpty().trim(),
  check("category", "order category required").notEmpty().trim(),
  check("measurments", "measurments  required").notEmpty().trim(),
  check("cut", "cut  required").notEmpty().trim(),
  check("color", "color is required").notEmpty().trim(),
  check("fabric", "color is required").notEmpty().trim(),
  check("budget.max_amount", "Max Amount is required").notEmpty().trim(),
  check("budget.min_amount", "Minimum Amount is required").notEmpty().trim(),
  check("address.city", "city  is required").notEmpty().trim(),
  check("address.country", "country is required").notEmpty().trim(),
  check("address.lat", "latitude is required").notEmpty().trim(),
  check("address.lng", "longitude is required").notEmpty().trim(),
  check("address.postal_code", "postal_code is required").notEmpty().trim(),
  check("delivery.name", "delivery name  is required").notEmpty().trim(),
  check("delivery.date", "delivery date is required").notEmpty().trim(),
  check("delivery.type", "delivery type is required").notEmpty().trim(),
];
/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    res.status(400).send({ success: false, message: errors.array()[0] }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
