const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const walletController = require('../controllers/walletController');

router.get('/otp', walletController.otp);
// Protect all routes after this middleware
router.use(authController.protect);
// Wallet Routes
router.get('/history', walletController.history);
router.get('/banks', walletController.getBanks);
router.post('/bank-details', walletController.getAccountDetails);
router.get('/verify-deposit/:id', walletController.verifyDeposit);
router.post('/withdraw', walletController.withdrawal);


// Only admin have permission to access for the below APIs 


module.exports = router;