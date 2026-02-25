const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

exports.registerUser = async (userData) => {
    const { name, email, password, phone, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ErrorResponse('Email already exists', 400);
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role
    });

    const token = generateToken(user._id);

    return { user, token };
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    if (user.isLocked()) {
        throw new ErrorResponse('Account locked. Please try again later.', 403);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        }
        await user.save();
        throw new ErrorResponse('Invalid credentials', 401);
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = generateToken(user._id);

    return { user, token };
};

exports.resetPasswordSimulated = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorResponse('User not found with this email', 404);
    }

    // Simulated password reset
    const fakeResetToken = "fake-reset-token-123";
    return fakeResetToken;
};
