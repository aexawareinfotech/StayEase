const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middlewares/auth');
const upload = require('../middleware/upload');
const {
    getProfile,
    updateProfile,
    uploadProfileImage
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getProfile);

router.put('/update', protect, upload.single('image'), [
    body('name', 'Name is required').optional().isLength({ min: 2 }),
    body('phone', 'Phone should be 10 to 15 digits').optional().isLength({ min: 10, max: 15 }),
    body('password', 'Password must be at least 8 characters and include a number and special char')
        .optional()
        .isLength({ min: 8 })
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
], updateProfile);

router.post('/upload-image', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;