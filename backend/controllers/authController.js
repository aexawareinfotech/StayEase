const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    try {
        const { user, token } = await authService.registerUser(req.body);
        res.status(201).json({ success: true, token, data: user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;
    try {
        const { user, token } = await authService.loginUser(email, password);
        res.status(200).json({ success: true, token, data: user });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        const User = require('../models/User');
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = newPassword; 
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
