const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');
const { orderValidationRules, validate } = require('../middleware/validator.middleware');

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  orderValidationRules.create,
  validate,
  orderController.createOrder
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  orderValidationRules.getAll,
  validate,
  orderController.getOrders
);

/**
 * @route   GET /api/orders/room/:roomId
 * @desc    Get orders for a specific room
 * @access  Private
 */
router.get(
  '/room/:roomId',
  authenticate,
  orderValidationRules.getByRoom,
  validate,
  orderController.getRoomOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  orderValidationRules.getById,
  validate,
  orderController.getOrderById
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  orderValidationRules.update,
  validate,
  orderController.updateOrder
);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private
 */
router.put(
  '/:id/status',
  authenticate,
  orderValidationRules.updateStatus,
  validate,
  orderController.updateOrderStatus
);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.put(
  '/:id/cancel',
  authenticate,
  orderValidationRules.getById,
  validate,
  orderController.cancelOrder
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order
 * @access  Private (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  orderValidationRules.getById,
  validate,
  orderController.deleteOrder
);

module.exports = router; 