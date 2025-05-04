const express = require('express');
const router = express.Router();
const { qrcodeController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');
const { qrcodeValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/qrcodes
 * @desc    Create a new QR code
 * @access  Private (admin, staff)
 */
router.post(
  '/',
  authenticate,
  authorize(['admin', 'staff']),
  qrcodeValidationRules.create,
  validate,
  qrcodeController.createQRCode
);

/**
 * @route   GET /api/qrcodes
 * @desc    Get all QR codes for a hotel
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  qrcodeValidationRules.getAll,
  validate,
  qrcodeController.getQRCodes
);

/**
 * @route   GET /api/qrcodes/code/:shortCode
 * @desc    Get QR code by short code
 * @access  Public
 */
router.get(
  '/code/:shortCode',
  qrcodeValidationRules.getByShortCode,
  validate,
  qrcodeController.getQRCodeByShortCode
);

/**
 * @route   POST /api/qrcodes/submit/:shortCode
 * @desc    Submit data for a QR code
 * @access  Public
 */
router.post(
  '/submit/:shortCode',
  qrcodeValidationRules.submit,
  validate,
  qrcodeController.submitQRCodeData
);

/**
 * @route   GET /api/qrcodes/:id
 * @desc    Get QR code by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  qrcodeValidationRules.getById,
  validate,
  qrcodeController.getQRCodeById
);

/**
 * @route   PUT /api/qrcodes/:id
 * @desc    Update QR code
 * @access  Private (admin, staff)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'staff']),
  qrcodeValidationRules.update,
  validate,
  qrcodeController.updateQRCode
);

/**
 * @route   GET /api/qrcodes/:id/stats
 * @desc    Get QR code statistics
 * @access  Private
 */
router.get(
  '/:id/stats',
  authenticate,
  qrcodeValidationRules.getById,
  validate,
  qrcodeController.getQRCodeStats
);

/**
 * @route   DELETE /api/qrcodes/:id
 * @desc    Delete QR code
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  qrcodeValidationRules.getById,
  validate,
  qrcodeController.deleteQRCode
);

module.exports = router; 