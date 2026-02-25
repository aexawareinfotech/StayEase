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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    try {
        const token = await authService.resetPasswordSimulated(req.body.email);
        res.status(200).json({ success: true, message: 'Password reset link sent (simulated)', token });
    } catch (error) {
        next(error);
    }
};
