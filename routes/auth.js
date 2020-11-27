var express = require('express');

var router = express.Router();

var RegisterController = require('../controllers/auth/register');
var LoginController = require('../controllers/auth/login');

var RegisterValidator = require('../validators/auth/register/register');

// Register page
router.get('/register', RegisterController.showRegisterForm);
router.post('/register', RegisterValidator.validate, RegisterController.register);

// Login page
router.get('/login', LoginController.showLoginForm);
router.post('/login', LoginController.login);

// Logout
router.post('/logout', LoginController.logout);

module.exports = router;