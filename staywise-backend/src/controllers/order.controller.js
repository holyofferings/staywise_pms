const { Order, Room, Booking } = require('../models');

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
const createOrder = async (req, res) => {
  try {
    const {
      guestName,
      roomRef,
      bookingRef,
      hotelRef,
      items,
      totalAmount,
      instructions,
      orderType,
      source,
      deliveryTime
    } = req.body;
    
    // Validate room exists and belongs to hotel
    const room = await Room.findOne({ _id: roomRef, hotelRef });
    if (!room) {
      return res.status(404).json({ message: 'Room not found or does not belong to this hotel' });
    }
    
    // Check if booking reference is valid (if provided)
    if (bookingRef) {
      const booking = await Booking.findOne({ _id: bookingRef, roomRef, hotelRef });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or does not match room/hotel' });
      }
    }
    
    // Create order
    const order = await Order.create({
      guestName,
      roomRef,
      bookingRef,
      hotelRef,
      items,
      totalAmount,
      instructions,
      orderType: orderType || 'room_service',
      source: source || 'qr_code',
      deliveryTime: {
        requested: deliveryTime
      },
      assignedTo: req.user._id // Assign to the user who creates it
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all orders
 * @route GET /api/orders
 * @access Private
 */
const getOrders = async (req, res) => {
  try {
    const {
      hotelId,
      status,
      roomId,
      startDate,
      endDate,
      orderType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;
    
    // Build filter
    const filter = {};
    
    // Hotel filter (required)
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    filter.hotelRef = hotelId;
    
    // Status filter
    if (status) {
      filter.status = status;
    }
    
    // Room filter
    if (roomId) {
      filter.roomRef = roomId;
    }
    
    // Date range filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }
    
    // Order type filter
    if (orderType) {
      filter.orderType = orderType;
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Order.countDocuments(filter);
    
    // Get orders
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('roomRef', 'roomNumber')
      .populate('assignedTo', 'name')
      .populate('bookingRef', 'guestName checkInDate checkOutDate');
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('roomRef', 'roomNumber type floor')
      .populate('bookingRef', 'guestName checkInDate checkOutDate')
      .populate('assignedTo', 'name email')
      .populate('hotelRef', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update order status
 * @route PUT /api/orders/:id/status
 * @access Private
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update status
    order.status = status;
    
    // If status is delivered, update delivery time
    if (status === 'delivered') {
      order.deliveryTime.actual = new Date();
    }
    
    // Add note if provided
    if (note) {
      order.notes.push({
        text: note,
        date: new Date(),
        user: req.user._id
      });
    }
    
    // Updated assigned user if changing from pending to confirmed
    if (status === 'confirmed' && order.status === 'pending') {
      order.assignedTo = req.user._id;
    }
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update order
 * @route PUT /api/orders/:id
 * @access Private
 */
const updateOrder = async (req, res) => {
  try {
    const {
      guestName,
      items,
      totalAmount,
      instructions,
      orderType,
      paymentMethod,
      paymentStatus,
      assignedTo,
      note
    } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Don't allow updating cancelled orders
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot update a cancelled order' });
    }
    
    // Update fields
    if (guestName) order.guestName = guestName;
    if (items) order.items = items;
    if (totalAmount) order.totalAmount = totalAmount;
    if (instructions) order.instructions = instructions;
    if (orderType) order.orderType = orderType;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (assignedTo) order.assignedTo = assignedTo;
    
    // Add note if provided
    if (note) {
      order.notes.push({
        text: note,
        date: new Date(),
        user: req.user._id
      });
    }
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Cancel order
 * @route PUT /api/orders/:id/cancel
 * @access Private
 */
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Can't cancel already delivered or cancelled orders
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Cannot cancel an order with status: ${order.status}` 
      });
    }
    
    // Update status to cancelled
    order.status = 'cancelled';
    
    // Add cancellation note
    order.notes.push({
      text: reason || 'Order cancelled',
      date: new Date(),
      user: req.user._id
    });
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get room orders
 * @route GET /api/orders/room/:roomId
 * @access Private
 */
const getRoomOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const roomId = req.params.roomId;
    
    // Get orders for the room
    const orders = await Order.find({ 
      roomRef: roomId,
      status: { $ne: 'cancelled' }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('assignedTo', 'name');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Private (admin only)
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.remove();
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  getRoomOrders,
  deleteOrder
}; 