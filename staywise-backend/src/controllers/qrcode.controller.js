const { QRCode, Room, Hotel } = require('../models');
const { generateShortCode, generateQrUrl, generateDefaultSchema, processQrSubmission } = require('../utils');

/**
 * Create a new QR code
 * @route POST /api/qrcodes
 * @access Private (admin, staff)
 */
const createQRCode = async (req, res) => {
  try {
    const {
      name,
      description,
      roomRef,
      hotelRef,
      type,
      guestInputSchema,
      redirectAfterSubmit,
      redirectUrl,
      expiresAt,
      customization
    } = req.body;
    
    // Check if hotel exists
    const hotel = await Hotel.findById(hotelRef);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Check if room exists if roomRef is provided
    if (roomRef) {
      const room = await Room.findOne({ _id: roomRef, hotelRef });
      if (!room) {
        return res.status(404).json({ message: 'Room not found or does not belong to this hotel' });
      }
    }
    
    // Generate short code for QR
    const shortCode = generateShortCode();
    
    // Generate URL for QR
    const url = generateQrUrl(shortCode);
    
    // Create default input schema if not provided
    const inputSchema = guestInputSchema || generateDefaultSchema(type);
    
    // Create QR code
    const qrCode = await QRCode.create({
      name,
      description,
      roomRef,
      hotelRef,
      url,
      shortCode,
      type: type || 'room_service',
      guestInputSchema: inputSchema,
      redirectAfterSubmit: redirectAfterSubmit || false,
      redirectUrl,
      expiresAt,
      customization,
      createdBy: req.user._id
    });
    
    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all QR codes for a hotel
 * @route GET /api/qrcodes
 * @access Private
 */
const getQRCodes = async (req, res) => {
  try {
    const { hotelId, roomId, type, active } = req.query;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Build filter
    const filter = { hotelRef: hotelId };
    
    // Room filter
    if (roomId) {
      filter.roomRef = roomId;
    }
    
    // Type filter
    if (type) {
      filter.type = type;
    }
    
    // Active filter
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    const qrCodes = await QRCode.find(filter)
      .sort({ createdAt: -1 })
      .populate('roomRef', 'roomNumber')
      .populate('createdBy', 'name');
    
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get QR code by ID
 * @route GET /api/qrcodes/:id
 * @access Private
 */
const getQRCodeById = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id)
      .populate('roomRef', 'roomNumber type')
      .populate('hotelRef', 'name')
      .populate('createdBy', 'name email');
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    res.json(qrCode);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get QR code by short code
 * @route GET /api/qrcodes/code/:shortCode
 * @access Public
 */
const getQRCodeByShortCode = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    
    const qrCode = await QRCode.findOne({ shortCode })
      .populate('hotelRef', 'name logo brandingColor');
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Check if expired
    if (qrCode.expiresAt && new Date() > new Date(qrCode.expiresAt)) {
      return res.status(410).json({ message: 'QR code has expired' });
    }
    
    // Check if active
    if (!qrCode.active) {
      return res.status(403).json({ message: 'QR code is inactive' });
    }
    
    // Increment scan count
    qrCode.scans += 1;
    await qrCode.save();
    
    // Return public data only
    const responseData = {
      id: qrCode._id,
      name: qrCode.name,
      description: qrCode.description,
      type: qrCode.type,
      hotel: qrCode.hotelRef ? {
        name: qrCode.hotelRef.name,
        logo: qrCode.hotelRef.logo,
        brandingColor: qrCode.hotelRef.brandingColor
      } : null,
      guestInputSchema: qrCode.guestInputSchema,
      customization: qrCode.customization,
      redirectAfterSubmit: qrCode.redirectAfterSubmit,
      redirectUrl: qrCode.redirectUrl
    };
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Process QR code submission
 * @route POST /api/qrcodes/submit/:shortCode
 * @access Public
 */
const submitQRCodeData = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const formData = req.body;
    
    const qrCode = await QRCode.findOne({ shortCode });
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Check if expired
    if (qrCode.expiresAt && new Date() > new Date(qrCode.expiresAt)) {
      return res.status(410).json({ message: 'QR code has expired' });
    }
    
    // Check if active
    if (!qrCode.active) {
      return res.status(403).json({ message: 'QR code is inactive' });
    }
    
    // Process submission based on QR type
    const processedData = processQrSubmission(formData, qrCode);
    
    // Here, in a real implementation, you would save the data to the appropriate collection
    // For now, we'll just return the processed data
    
    res.json({
      message: 'Submission received successfully',
      data: processedData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update QR code
 * @route PUT /api/qrcodes/:id
 * @access Private (admin, staff)
 */
const updateQRCode = async (req, res) => {
  try {
    const {
      name,
      description,
      roomRef,
      type,
      guestInputSchema,
      redirectAfterSubmit,
      redirectUrl,
      expiresAt,
      active,
      customization
    } = req.body;
    
    const qrCode = await QRCode.findById(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Check if room exists if roomRef is provided and changed
    if (roomRef && roomRef !== qrCode.roomRef.toString()) {
      const room = await Room.findOne({ _id: roomRef, hotelRef: qrCode.hotelRef });
      if (!room) {
        return res.status(404).json({ message: 'Room not found or does not belong to this hotel' });
      }
    }
    
    // Update fields
    if (name) qrCode.name = name;
    if (description) qrCode.description = description;
    if (roomRef) qrCode.roomRef = roomRef;
    if (type) qrCode.type = type;
    if (guestInputSchema) qrCode.guestInputSchema = guestInputSchema;
    if (redirectAfterSubmit !== undefined) qrCode.redirectAfterSubmit = redirectAfterSubmit;
    if (redirectUrl) qrCode.redirectUrl = redirectUrl;
    if (expiresAt) qrCode.expiresAt = expiresAt;
    if (active !== undefined) qrCode.active = active;
    if (customization) qrCode.customization = { ...qrCode.customization, ...customization };
    
    const updatedQRCode = await qrCode.save();
    
    res.json(updatedQRCode);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete QR code
 * @route DELETE /api/qrcodes/:id
 * @access Private (admin)
 */
const deleteQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    await qrCode.remove();
    
    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get QR code stats
 * @route GET /api/qrcodes/:id/stats
 * @access Private
 */
const getQRCodeStats = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Get basic stats
    const stats = {
      scans: qrCode.scans,
      submissions: qrCode.submissions,
      createdAt: qrCode.createdAt,
      lastScan: qrCode.updatedAt,
      conversionRate: qrCode.scans > 0 ? (qrCode.submissions / qrCode.scans) * 100 : 0
    };
    
    // In a real implementation, you would query the database for more detailed stats
    // For now, we'll just return the basic stats
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createQRCode,
  getQRCodes,
  getQRCodeById,
  getQRCodeByShortCode,
  submitQRCodeData,
  updateQRCode,
  deleteQRCode,
  getQRCodeStats
}; 