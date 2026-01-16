const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [check('name').notEmpty(), check('email').isEmail(), check('password').isLength({ min: 6 })], authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getProfile);

module.exports = router;
