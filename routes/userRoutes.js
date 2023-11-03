const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const orderController = require('./../controllers/orderController');
const pushController = require('../controllers/pushNotificationController');
const flwController = require('../utils/flwFeatures');
const smsController = require('../controllers/smsController')
const multer = require("multer");
const path = require("path");
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../upload'));
//     },
//     });
const multerStorage = multer.memoryStorage();
const upload = multer({ multerStorage });

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.post('/verify-image',upload.single("picture"), authController.verifyImage);
router.post('/verify-otp', authController.verifyOtp);

router.get('/push', orderController.deleteAll);

// Protect all routes after this middleware
router.use(authController.protect);

// User Routes
router.get('/:id', userController.getUser);
router.post('/wallet/:id', userController.updateUser);
router.get('/bvn/:id', flwController.getBanks);

router.delete('/deleteMe', userController.deleteMe);


// Only admin have permission to access for the below APIs 


module.exports = router;