const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers');
const { authenticate, authorize, uploadIdentityProof } = require('../middleware');
const { bookingValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  bookingValidationRules.create,
  validate,
  bookingController.createBooking
);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  bookingValidationRules.getAll,
  validate,
  bookingController.getBookings
);

/**
 * @route   GET /api/bookings/calendar
 * @desc    Get calendar data for bookings
 * @access  Private
 */
router.get(
  '/calendar',
  authenticate,
  bookingValidationRules.getCalendar,
  validate,
  bookingController.getCalendarData
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  bookingValidationRules.getById,
  validate,
  bookingController.getBookingById
);

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  bookingValidationRules.update,
  validate,
  bookingController.updateBooking
);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.put(
  '/:id/cancel',
  authenticate,
  bookingValidationRules.getById,
  validate,
  bookingController.cancelBooking
);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Delete booking
 * @access  Private (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  bookingValidationRules.getById,
  validate,
  bookingController.deleteBooking
);

module.exports = router; 