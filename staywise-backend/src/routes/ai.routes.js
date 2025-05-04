const express = require('express');
const router = express.Router();
const { aiAgentController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');
const { aiAgentValidationRules, validate } = require('../middleware/validator.middleware');

// Agent routes
/**
 * @route   POST /api/ai/agents
 * @desc    Create a new AI agent
 * @access  Private (admin)
 */
router.post(
  '/agents',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.create,
  validate,
  aiAgentController.createAIAgent
);

/**
 * @route   GET /api/ai/agents
 * @desc    Get all AI agents for a hotel
 * @access  Private
 */
router.get(
  '/agents',
  authenticate,
  aiAgentValidationRules.getAll,
  validate,
  aiAgentController.getAIAgents
);

/**
 * @route   GET /api/ai/agents/:id
 * @desc    Get AI agent by ID
 * @access  Private
 */
router.get(
  '/agents/:id',
  authenticate,
  aiAgentValidationRules.getById,
  validate,
  aiAgentController.getAIAgentById
);

/**
 * @route   PUT /api/ai/agents/:id
 * @desc    Update AI agent
 * @access  Private (admin)
 */
router.put(
  '/agents/:id',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.update,
  validate,
  aiAgentController.updateAIAgent
);

/**
 * @route   PUT /api/ai/agents/:id/intents
 * @desc    Add or update intent
 * @access  Private (admin)
 */
router.put(
  '/agents/:id/intents',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.updateIntent,
  validate,
  aiAgentController.updateIntent
);

/**
 * @route   DELETE /api/ai/agents/:id/intents/:intentName
 * @desc    Delete intent
 * @access  Private (admin)
 */
router.delete(
  '/agents/:id/intents/:intentName',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.deleteIntent,
  validate,
  aiAgentController.deleteIntent
);

/**
 * @route   POST /api/ai/agents/:id/train
 * @desc    Train AI agent
 * @access  Private (admin)
 */
router.post(
  '/agents/:id/train',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.getById,
  validate,
  aiAgentController.trainAIAgent
);

/**
 * @route   POST /api/ai/agents/:id/test
 * @desc    Test AI agent
 * @access  Private
 */
router.post(
  '/agents/:id/test',
  authenticate,
  aiAgentValidationRules.test,
  validate,
  aiAgentController.testAIAgent
);

/**
 * @route   DELETE /api/ai/agents/:id
 * @desc    Delete AI agent
 * @access  Private (admin)
 */
router.delete(
  '/agents/:id',
  authenticate,
  authorize('admin'),
  aiAgentValidationRules.getById,
  validate,
  aiAgentController.deleteAIAgent
);

module.exports = router; 