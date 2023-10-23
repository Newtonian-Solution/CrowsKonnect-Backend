const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const orderController = require('./../controllers/orderController');
const pushController = require('../controllers/pushNotificationController');
const flwController = require('../utils/flwFeatures');
const smsController = require('../controllers/smsController')
const walletController = require('../controllers/walletController');

// Protect all routes after this middleware
router.use(authController.protect);
// Wallet Routes
router.get('/history', walletController.history);
router.get('/banks', walletController.getBanks);
router.post('/bank-details', walletController.getAccountDetails);
router.get('/verify-deposit/:id', walletController.verifyDeposit);
router.post('/verify-bvn', walletController.verifyBVN);

// Only admin have permission to access for the below APIs 


module.exports = router;