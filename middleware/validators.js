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
exports.validateClient = [
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
exports.validateClientUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
  check("dob", "Date of Birth is required").notEmpty().isDate().trim(),
  check("address", "Address  is required").notEmpty().trim(),
  check("city", "city  is required").notEmpty().trim(),
  check("country", "country is required").notEmpty().trim(),
];

// Tailor Signup Validation
exports.validateTailorUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
  check("dob", "Date of Birth is required").notEmpty().isDate().trim(),
  check("address", "Address  is required").notEmpty().trim(),
  check("city", "city  is required").notEmpty().trim(),
  check("country", "country is required").notEmpty().trim(),
  check("experience", "Experience  is required").notEmpty().trim(),
  check("area_of_experience", "Area of experience  is required").notEmpty().trim(),
  check("diploma", "Diploma  is required").notEmpty().trim(),
  check("speciality", "Speciality  is required").notEmpty().trim(),
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
//create quote validation
exports.validateQuote = [
  check("order", "Order Id is required").notEmpty().trim(),
  check("price", "Price is required").notEmpty().trim(),
  check("description", "Description is required").notEmpty().trim(),
];
//create order validation
exports.validateOrder = [
  check("gender", "Gender is required").notEmpty().trim(),
  check("category", "Category is required").notEmpty().trim(),
  check("name", "Name is required").notEmpty().trim(),
  check("cut", "Cut is required").notEmpty().trim(),
  check("measurments", "Measurments is required").notEmpty().trim(),
  check("color", "Color is required").notEmpty().trim(),
  check("fabric", "Color is required").notEmpty().trim(),
  check("delivery.address", "Delivery address is required").notEmpty().trim(),
  check("delivery.country", "Delivery country is required").notEmpty().trim(),
  check("delivery.city", "Delivery city is required").notEmpty().trim(),
  check("delivery.type", "delivery type is required").notEmpty().trim(),
  check("delivery.date", "delivery date is required").notEmpty().isDate().trim(),
  check("budget.min_price", "Minimum Price is required").notEmpty().trim(),
  check("budget.max_price", "Max Price is required").notEmpty().trim(),
];
exports.validateOTPCreate = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
];
exports.validateOTPVerify = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("code", "Code is required.").notEmpty().trim(),
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
