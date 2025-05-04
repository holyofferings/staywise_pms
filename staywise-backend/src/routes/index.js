const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const hotelRoutes = require('./hotel.routes');
const roomRoutes = require('./room.routes');
const bookingRoutes = require('./booking.routes');
const orderRoutes = require('./order.routes');
const automationRoutes = require('./automation.routes');
const qrcodeRoutes = require('./qrcode.routes');
const aiRoutes = require('./ai.routes');
const marketingRoutes = require('./marketing.routes');

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Staywise CRM API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/automations', automationRoutes);
router.use('/qrcodes', qrcodeRoutes);
router.use('/ai', aiRoutes);
router.use('/marketing', marketingRoutes);

module.exports = router; 