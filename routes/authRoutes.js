const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/google-signin', authController.googleSignIn);

module.exports = router;
