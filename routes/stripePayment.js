const express = require('express');
const { makeStripePayment } = require('../controllers/stripePayment');
const router = express.Router();

router.post('/payment/stripe', makeStripePayment);

module.exports = router;