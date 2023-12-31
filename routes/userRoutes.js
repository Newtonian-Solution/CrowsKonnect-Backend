const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const orderController = require('./../controllers/orderController');
const pushController = require('../controllers/pushNotificationController');
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

router.get('/push', pushController.pushNotification);

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/verify',upload.single("picture"), authController.verify);

// Order Routes
router.get('/orders', orderController.orders);
router.get('/order/:id', orderController.getOrder);
router.post('/order', orderController.order);
router.post('/order/:id', orderController.applyOrder);

router.delete('/deleteMe', userController.deleteMe);

// Only admin have permission to access for the below APIs 
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers);


router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;