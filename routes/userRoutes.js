const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const orderController = require('./../controllers/orderController');
const pushController = require('../controllers/pushNotificationController');
const flwController = require('../controllers/flwController');
const smsController = require('../controllers/smsController')
const multer = require("multer");
const path = require("path");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../upload'));
    },
    });
const upload = multer({ storage });

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/push', orderController.deleteAll);

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/verify',upload.single("picture"), authController.verify);

// Order Routes
router.get('/orders', orderController.orders);
router.get('/order/:id', orderController.getOrder);
router.post('/order', orderController.order);
router.post('/order/:id', orderController.applyOrder);

// User Routes
router.get('/:id', userController.getUser);
router.post('/wallet/:id', userController.updateUser);

router.delete('/deleteMe', userController.deleteMe);

// Only admin have permission to access for the below APIs 


module.exports = router;