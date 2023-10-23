const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const orderController = require('./../controllers/orderController');
const pushController = require('../controllers/pushNotificationController');
const flwController = require('../utils/flwFeatures');
const smsController = require('../controllers/smsController')
// Protect all routes after this middleware
router.use(authController.protect);

// Order Routes
router.get('/', orderController.orders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.order);
router.post('/:id', orderController.applyOrder);

// Only admin have permission to access for the below APIs 


module.exports = router;