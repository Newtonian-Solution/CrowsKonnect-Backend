const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const callController = require('./../controllers/fcmController');
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
const upload = multer({ multerStorage, limits: { fieldSize: 25 * 1024 * 1024 }});


router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/webhook', authController.webhook);

router.post('/verify-image', authController.verifyImage);
router.post('/verify-otp', authController.verifyOtp);

router.get('/push', userController.deleteUser);

// User Routes
router.get('/:id', userController.getUser);

// Protect all routes after this middleware
router.use(authController.protect);
router.post('/update-location', userController.updateUserLocaton);
router.post('/wallet/:id', userController.updateUser);
router.get('/bvn/:id', flwController.getBanks);

router.delete('/deleteMe', userController.deleteMe);


// Only admin have permission to access for the below APIs 


module.exports = router;