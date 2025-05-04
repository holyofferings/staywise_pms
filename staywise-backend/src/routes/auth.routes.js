const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authenticate } = require('../middleware');
const { userValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', userValidationRules.create, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', userValidationRules.login, validate, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, userValidationRules.update, validate, authController.updateProfile);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot password request
 * @access  Public
 */
router.post('/forgot-password', userValidationRules.forgotPassword, validate, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', userValidationRules.resetPassword, validate, authController.resetPassword);

/**
 * @route   GET /api/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.get('/google', (req, res) => {
  // In a real implementation, this would redirect to Google OAuth
  res.status(501).json({ message: 'Google OAuth not implemented' });
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', authController.googleAuthCallback);

/**
 * @route   POST /api/auth/otp
 * @desc    Phone OTP login
 * @access  Public
 */
router.post('/otp', userValidationRules.otpLogin, validate, authController.otpLogin);

module.exports = router; 