const express = require('express');
const router = express.Router();
const { marketingController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');
const { marketingValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/marketing/templates
 * @desc    Generate marketing templates
 * @access  Private (admin)
 */
router.post(
  '/templates',
  authenticate,
  authorize('admin'),
  marketingValidationRules.generateTemplates,
  validate,
  marketingController.generateTemplates
);

/**
 * @route   POST /api/marketing/templates/batch
 * @desc    Generate multiple marketing templates
 * @access  Private (admin)
 */
router.post(
  '/templates/batch',
  authenticate,
  authorize('admin'),
  marketingValidationRules.generateMultipleTemplates,
  validate,
  marketingController.generateMultipleTemplates
);

/**
 * @route   GET /api/marketing/status/:hotelId
 * @desc    Check if marketing features are enabled for a hotel
 * @access  Private
 */
router.get(
  '/status/:hotelId',
  authenticate,
  marketingValidationRules.getById,
  validate,
  marketingController.checkMarketingStatus
);

/**
 * @route   GET /api/marketing/ideas
 * @desc    Get marketing template ideas
 * @access  Private (admin)
 */
router.get(
  '/ideas',
  authenticate,
  authorize('admin'),
  marketingValidationRules.getIdeas,
  validate,
  marketingController.getMarketingIdeas
);

module.exports = router; 