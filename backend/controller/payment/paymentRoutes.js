// BackendFolder > controller > payment > paymentRoutes.js
const express = require('express');
const { createOrder, handlePaymentSuccess } = require('./PaymentController');
const router = express.Router();

router.post('/create-order', createOrder);
router.post('/payment-success', handlePaymentSuccess);

module.exports = router;