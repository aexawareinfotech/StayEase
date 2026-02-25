const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long, include a number and a special character')
        .isLength({ min: 8 })
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/),
    body('phone', 'Phone number is required').optional().isString()
], register);

router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], login);

router.post('/logout', protect, logout);

router.post('/reset-password', [
    body('email', 'Please include a valid email').isEmail()
], resetPassword); // Simulated

module.exports = router;
