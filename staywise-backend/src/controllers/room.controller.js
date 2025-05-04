const { Room, Booking, Hotel } = require('../models');

/**
 * Create a new room
 * @route POST /api/rooms
 * @access Private (admin, staff)
 */
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      price,
      capacity,
      amenities,
      description,
      floor,
      size,
      sizeUnit,
      viewType,
      bedType,
      hotelRef
    } = req.body;
    
    // Check if room with same number already exists in the hotel
    const existingRoom = await Room.findOne({ roomNumber, hotelRef });
    if (existingRoom) {
      return res.status(400).json({ 
        message: `Room ${roomNumber} already exists in this hotel` 
      });
    }
    
    // Check hotel subscription room limit
    const hotel = await Hotel.findById(hotelRef);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const roomCount = await Room.countDocuments({ hotelRef });
    if (roomCount >= hotel.subscription.maxRooms) {
      return res.status(400).json({ 
        message: `Room limit reached (${hotel.subscription.maxRooms}). Please upgrade subscription.` 
      });
    }
    
    // Create room
    const room = await Room.create({
      roomNumber,
      type,
      price,
      capacity,
      amenities,
      description,
      floor,
      size,
      sizeUnit,
      viewType,
      bedType,
      hotelRef,
      createdBy: req.user._id
    });
    
    // Process uploaded images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/rooms/${file.filename}`);
      room.images = imagePaths;
      await room.save();
    }
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all rooms for a hotel
 * @route GET /api/rooms
 * @access Private
 */
const getRooms = async (req, res) => {
  try {
    const { hotelId, available, type, minPrice, maxPrice } = req.query;
    
    // Build filter
    const filter = {};
    
    // Hotel filter (required)
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    filter.hotelRef = hotelId;
    
    // Availability filter
    if (available) {
      filter.availability = available === 'true';
    }
    
    // Type filter
    if (type) {
      filter.type = type;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.base = { $gte: Number(minPrice) };
      if (maxPrice) filter.price.base = { ...filter.price.base, $lte: Number(maxPrice) };
    }
    
    // Only active rooms
    filter.active = true;
    
    const rooms = await Room.find(filter)
      .sort({ roomNumber: 1 })
      .populate('createdBy', 'name email');
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get room by ID
 * @route GET /api/rooms/:id
 * @access Private
 */
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('hotelRef', 'name contactInfo.address');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update room
 * @route PUT /api/rooms/:id
 * @access Private (admin, staff)
 */
const updateRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      price,
      capacity,
      availability,
      amenities,
      description,
      floor,
      size,
      sizeUnit,
      viewType,
      bedType,
      maintenanceStatus
    } = req.body;
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // If room number is changing, check for duplicates
    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ 
        roomNumber, 
        hotelRef: room.hotelRef,
        _id: { $ne: room._id }
      });
      
      if (existingRoom) {
        return res.status(400).json({ 
          message: `Room ${roomNumber} already exists in this hotel` 
        });
      }
    }
    
    // Update fields
    if (roomNumber) room.roomNumber = roomNumber;
    if (type) room.type = type;
    if (price) {
      room.price = {
        ...room.price,
        ...price
      };
    }
    if (capacity) {
      room.capacity = {
        ...room.capacity,
        ...capacity
      };
    }
    if (availability !== undefined) room.availability = availability;
    if (amenities) room.amenities = amenities;
    if (description) room.description = description;
    if (floor) room.floor = floor;
    if (size) room.size = size;
    if (sizeUnit) room.sizeUnit = sizeUnit;
    if (viewType) room.viewType = viewType;
    if (bedType) room.bedType = bedType;
    if (maintenanceStatus) {
      room.maintenanceStatus = {
        ...room.maintenanceStatus,
        ...maintenanceStatus
      };
    }
    
    const updatedRoom = await room.save();
    
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update room images
 * @route PUT /api/rooms/:id/images
 * @access Private (admin, staff)
 */
const updateRoomImages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }
    
    // Process uploaded images
    const imagePaths = req.files.map(file => `/uploads/rooms/${file.filename}`);
    
    // Add new images to existing ones
    room.images = [...room.images, ...imagePaths];
    await room.save();
    
    res.json({
      message: 'Room images updated successfully',
      images: room.images
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete room image
 * @route DELETE /api/rooms/:id/images/:imageIndex
 * @access Private (admin, staff)
 */
const deleteRoomImage = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= room.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    
    // Remove image at the specified index
    room.images.splice(imageIndex, 1);
    await room.save();
    
    res.json({
      message: 'Image deleted successfully',
      images: room.images
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Check room availability for a date range
 * @route GET /api/rooms/:id/availability
 * @access Private
 */
const checkRoomAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room is generally available
    if (!room.availability) {
      return res.json({ available: false, reason: 'Room is not available for booking' });
    }
    
    // Check if room is under maintenance
    if (room.maintenanceStatus.isUnderMaintenance) {
      const maintenanceEndDate = new Date(room.maintenanceStatus.maintenanceEndDate);
      const queryStartDate = new Date(startDate);
      
      if (!room.maintenanceStatus.maintenanceEndDate || queryStartDate <= maintenanceEndDate) {
        return res.json({ 
          available: false, 
          reason: 'Room is under maintenance',
          endDate: room.maintenanceStatus.maintenanceEndDate
        });
      }
    }
    
    // Check if room is already booked for the given date range
    const conflictingBooking = await Booking.findOne({
      roomRef: req.params.id,
      status: { $in: ['reserved', 'checked-in'] },
      $or: [
        // Case 1: Start date falls within an existing booking
        { 
          checkInDate: { $lte: new Date(startDate) },
          checkOutDate: { $gt: new Date(startDate) }
        },
        // Case 2: End date falls within an existing booking
        { 
          checkInDate: { $lt: new Date(endDate) },
          checkOutDate: { $gte: new Date(endDate) }
        },
        // Case 3: Booking completely spans the requested period
        { 
          checkInDate: { $gte: new Date(startDate) },
          checkOutDate: { $lte: new Date(endDate) }
        }
      ]
    }).select('checkInDate checkOutDate guestName');
    
    if (conflictingBooking) {
      return res.json({
        available: false,
        reason: 'Room is already booked for this period',
        conflictingBooking: {
          checkInDate: conflictingBooking.checkInDate,
          checkOutDate: conflictingBooking.checkOutDate
        }
      });
    }
    
    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete room (soft delete)
 * @route DELETE /api/rooms/:id
 * @access Private (admin)
 */
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      roomRef: req.params.id,
      status: { $in: ['reserved', 'checked-in'] }
    });
    
    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with active bookings' 
      });
    }
    
    // Soft delete
    room.active = false;
    await room.save();
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  updateRoomImages,
  deleteRoomImage,
  checkRoomAvailability,
  deleteRoom
}; 