const express = require('express');
const router = express.Router();
const { roomController } = require('../controllers');
const { authenticate, authorize, uploadRoomImages } = require('../middleware');
const { roomValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Private (admin, staff)
 */
router.post(
  '/',
  authenticate,
  authorize(['admin', 'staff']),
  uploadRoomImages.array('roomImages', 5),
  roomValidationRules.create,
  validate,
  roomController.createRoom
);

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms for a hotel
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  roomValidationRules.getAll,
  validate,
  roomController.getRooms
);

/**
 * @route   GET /api/rooms/:id
 * @desc    Get room by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  roomValidationRules.getById,
  validate,
  roomController.getRoomById
);

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update room
 * @access  Private (admin, staff)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'staff']),
  roomValidationRules.update,
  validate,
  roomController.updateRoom
);

/**
 * @route   PUT /api/rooms/:id/images
 * @desc    Update room images
 * @access  Private (admin, staff)
 */
router.put(
  '/:id/images',
  authenticate,
  authorize(['admin', 'staff']),
  uploadRoomImages.array('roomImages', 5),
  roomValidationRules.getById,
  validate,
  roomController.updateRoomImages
);

/**
 * @route   DELETE /api/rooms/:id/images/:imageIndex
 * @desc    Delete room image
 * @access  Private (admin, staff)
 */
router.delete(
  '/:id/images/:imageIndex',
  authenticate,
  authorize(['admin', 'staff']),
  roomController.deleteRoomImage
);

/**
 * @route   GET /api/rooms/:id/availability
 * @desc    Check room availability for a date range
 * @access  Private
 */
router.get(
  '/:id/availability',
  authenticate,
  roomValidationRules.checkAvailability,
  validate,
  roomController.checkRoomAvailability
);

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete room (soft delete)
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  roomValidationRules.getById,
  validate,
  roomController.deleteRoom
);

module.exports = router; 