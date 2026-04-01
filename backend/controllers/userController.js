const { validationResult } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        const { name, phone, password } = req.body;
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (password) user.password = password; // hashed by model pre-save
        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({ success: true, data: userResponse });
    } catch (error) {
        next(error);
    }
};

exports.uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({ success: true, data: { profileImage: user.profileImage } });
    } catch (error) {
        next(error);
    }
};