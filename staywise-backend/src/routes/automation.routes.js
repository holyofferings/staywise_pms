const express = require('express');
const router = express.Router();
const { automationController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');
const { automationValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/automations
 * @desc    Create a new automation
 * @access  Private (admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  automationValidationRules.create,
  validate,
  automationController.createAutomation
);

/**
 * @route   GET /api/automations
 * @desc    Get all automations for a hotel
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  automationValidationRules.getAll,
  validate,
  automationController.getAutomations
);

/**
 * @route   GET /api/automations/trigger/:event
 * @desc    Get active automations by trigger event
 * @access  Private
 */
router.get(
  '/trigger/:event',
  authenticate,
  automationValidationRules.getByTrigger,
  validate,
  automationController.getAutomationsByTrigger
);

/**
 * @route   GET /api/automations/:id
 * @desc    Get automation by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  automationValidationRules.getById,
  validate,
  automationController.getAutomationById
);

/**
 * @route   PUT /api/automations/:id
 * @desc    Update automation
 * @access  Private (admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  automationValidationRules.update,
  validate,
  automationController.updateAutomation
);

/**
 * @route   PUT /api/automations/:id/toggle
 * @desc    Toggle automation active status
 * @access  Private (admin)
 */
router.put(
  '/:id/toggle',
  authenticate,
  authorize('admin'),
  automationValidationRules.getById,
  validate,
  automationController.toggleAutomation
);

/**
 * @route   POST /api/automations/:id/execute
 * @desc    Execute automation manually
 * @access  Private (admin)
 */
router.post(
  '/:id/execute',
  authenticate,
  authorize('admin'),
  automationValidationRules.execute,
  validate,
  automationController.executeAutomation
);

/**
 * @route   DELETE /api/automations/:id
 * @desc    Delete automation
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  automationValidationRules.getById,
  validate,
  automationController.deleteAutomation
);

module.exports = router; 