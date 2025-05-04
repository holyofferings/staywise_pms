const express = require('express');
const router = express.Router();
const { hotelController } = require('../controllers');
const { authenticate, authorize, uploadHotelLogo } = require('../middleware');
const { hotelValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/hotels
 * @desc    Create a new hotel
 * @access  Private (superadmin only)
 */
router.post(
  '/',
  authenticate,
  authorize('superadmin'),
  hotelValidationRules.create,
  validate,
  hotelController.createHotel
);

/**
 * @route   GET /api/hotels
 * @desc    Get all hotels
 * @access  Private (superadmin only)
 */
router.get(
  '/',
  authenticate,
  authorize('superadmin'),
  hotelController.getAllHotels
);

/**
 * @route   GET /api/hotels/:id
 * @desc    Get hotel by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  hotelValidationRules.getById,
  validate,
  hotelController.getHotelById
);

/**
 * @route   PUT /api/hotels/:id
 * @desc    Update hotel
 * @access  Private (admin, superadmin)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'superadmin']),
  hotelValidationRules.update,
  validate,
  hotelController.updateHotel
);

/**
 * @route   PUT /api/hotels/:id/subscription
 * @desc    Update hotel subscription
 * @access  Private (superadmin only)
 */
router.put(
  '/:id/subscription',
  authenticate,
  authorize('superadmin'),
  hotelValidationRules.updateSubscription,
  validate,
  hotelController.updateSubscription
);

/**
 * @route   PUT /api/hotels/:id/logo
 * @desc    Update hotel logo
 * @access  Private (admin, superadmin)
 */
router.put(
  '/:id/logo',
  authenticate,
  authorize(['admin', 'superadmin']),
  uploadHotelLogo.single('logo'),
  hotelController.updateLogo
);

/**
 * @route   GET /api/hotels/:id/staff
 * @desc    Get hotel staff
 * @access  Private (admin, superadmin)
 */
router.get(
  '/:id/staff',
  authenticate,
  authorize(['admin', 'superadmin']),
  hotelValidationRules.getById,
  validate,
  hotelController.getHotelStaff
);

/**
 * @route   DELETE /api/hotels/:id
 * @desc    Delete hotel (soft delete)
 * @access  Private (superadmin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('superadmin'),
  hotelValidationRules.getById,
  validate,
  hotelController.deleteHotel
);

module.exports = router; 