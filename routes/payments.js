/**
 * Payment  routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const Payments = require("../controllers/Payments");
const express = require("express");

// Create - OTP
router.post("/Checkout", Payments.Checkout);
// post - webhook
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  Payments.Webhook
);

module.exports = router;
