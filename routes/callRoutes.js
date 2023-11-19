const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const callController = require('../controllers/callController');


// Protect all routes after this middleware
router.use(authController.protect);
router.get('/token/:id', callController.createToken);

// Only admin have permission to access for the below APIs 


module.exports = router;