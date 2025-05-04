const { Booking, Room, Hotel } = require('../models');
const { sendBookingConfirmationEmail } = require('../utils');

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private
 */
const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomRef,
      checkInDate,
      checkOutDate,
      hotelRef,
      totalAmount,
      paymentStatus,
      paymentMethod,
      identityProof,
      guestCount,
      specialRequests,
      estimatedArrivalTime,
      additionalServices,
      source
    } = req.body;
    
    // Check if room exists and belongs to the specified hotel
    const room = await Room.findOne({ _id: roomRef, hotelRef });
    if (!room) {
      return res.status(404).json({ message: 'Room not found or does not belong to this hotel' });
    }
    
    // Check if room is available
    if (!room.availability) {
      return res.status(400).json({ message: 'Room is not available for booking' });
    }
    
    // Check if room is already booked for the given dates
    const conflictingBooking = await Booking.findOne({
      roomRef,
      status: { $in: ['reserved', 'checked-in'] },
      $or: [
        // Start date falls within an existing booking
        { 
          checkInDate: { $lte: new Date(checkInDate) },
          checkOutDate: { $gt: new Date(checkInDate) }
        },
        // End date falls within an existing booking
        { 
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkOutDate) }
        },
        // Booking completely spans the requested period
        { 
          checkInDate: { $gte: new Date(checkInDate) },
          checkOutDate: { $lte: new Date(checkOutDate) }
        }
      ]
    });
    
    if (conflictingBooking) {
      return res.status(400).json({
        message: 'Room is already booked for this period',
        conflictingBooking: {
          checkInDate: conflictingBooking.checkInDate,
          checkOutDate: conflictingBooking.checkOutDate
        }
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      guestName,
      guestEmail,
      guestPhone,
      roomRef,
      checkInDate,
      checkOutDate,
      hotelRef,
      totalAmount,
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'cash',
      identityProof,
      guestCount,
      specialRequests,
      estimatedArrivalTime,
      additionalServices,
      source: source || 'direct',
      createdBy: req.user._id
    });
    
    // Send confirmation email if guest email is provided
    if (guestEmail) {
      try {
        const hotel = await Hotel.findById(hotelRef);
        await sendBookingConfirmationEmail(booking, hotel, room);
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
      }
    }
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all bookings
 * @route GET /api/bookings
 * @access Private
 */
const getBookings = async (req, res) => {
  try {
    const { 
      hotelId, 
      status, 
      startDate, 
      endDate, 
      roomId,
      searchTerm,
      sortBy = 'checkInDate',
      sortOrder = 'asc',
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
    
    // Date range filter
    if (startDate && endDate) {
      filter.$or = [
        // Bookings that start within the range
        {
          checkInDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        },
        // Bookings that end within the range
        {
          checkOutDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        },
        // Bookings that span the entire range
        {
          checkInDate: { $lte: new Date(startDate) },
          checkOutDate: { $gte: new Date(endDate) }
        }
      ];
    } else if (startDate) {
      filter.checkInDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.checkOutDate = { $lte: new Date(endDate) };
    }
    
    // Room filter
    if (roomId) {
      filter.roomRef = roomId;
    }
    
    // Search term filter (guest name or phone)
    if (searchTerm) {
      filter.$or = [
        { guestName: { $regex: searchTerm, $options: 'i' } },
        { guestPhone: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    
    // Get bookings
    const bookings = await Booking.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('roomRef', 'roomNumber type price')
      .populate('createdBy', 'name');
    
    res.json({
      bookings,
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
 * Get booking by ID
 * @route GET /api/bookings/:id
 * @access Private
 */
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomRef', 'roomNumber type price images')
      .populate('hotelRef', 'name contactInfo')
      .populate('createdBy', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update booking
 * @route PUT /api/bookings/:id
 * @access Private
 */
const updateBooking = async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      status,
      totalAmount,
      paymentStatus,
      paymentMethod,
      identityProof,
      guestCount,
      specialRequests,
      estimatedArrivalTime,
      additionalServices,
      notes
    } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If dates are changing, check for conflicts
    if ((checkInDate && checkInDate !== booking.checkInDate.toISOString()) || 
        (checkOutDate && checkOutDate !== booking.checkOutDate.toISOString())) {
      
      const newCheckInDate = checkInDate ? new Date(checkInDate) : booking.checkInDate;
      const newCheckOutDate = checkOutDate ? new Date(checkOutDate) : booking.checkOutDate;
      
      const conflictingBooking = await Booking.findOne({
        roomRef: booking.roomRef,
        _id: { $ne: booking._id },
        status: { $in: ['reserved', 'checked-in'] },
        $or: [
          // Start date falls within an existing booking
          { 
            checkInDate: { $lte: newCheckInDate },
            checkOutDate: { $gt: newCheckInDate }
          },
          // End date falls within an existing booking
          { 
            checkInDate: { $lt: newCheckOutDate },
            checkOutDate: { $gte: newCheckOutDate }
          },
          // Booking completely spans the requested period
          { 
            checkInDate: { $gte: newCheckInDate },
            checkOutDate: { $lte: newCheckOutDate }
          }
        ]
      });
      
      if (conflictingBooking) {
        return res.status(400).json({
          message: 'Room is already booked for this period',
          conflictingBooking: {
            checkInDate: conflictingBooking.checkInDate,
            checkOutDate: conflictingBooking.checkOutDate
          }
        });
      }
    }
    
    // Update fields
    if (guestName) booking.guestName = guestName;
    if (guestEmail) booking.guestEmail = guestEmail;
    if (guestPhone) booking.guestPhone = guestPhone;
    if (checkInDate) booking.checkInDate = checkInDate;
    if (checkOutDate) booking.checkOutDate = checkOutDate;
    if (status) booking.status = status;
    if (totalAmount) booking.totalAmount = totalAmount;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    if (identityProof) booking.identityProof = { ...booking.identityProof, ...identityProof };
    if (guestCount) booking.guestCount = { ...booking.guestCount, ...guestCount };
    if (specialRequests) booking.specialRequests = specialRequests;
    if (estimatedArrivalTime) booking.estimatedArrivalTime = estimatedArrivalTime;
    if (additionalServices) booking.additionalServices = additionalServices;
    
    // Add note if provided
    if (notes && notes.text) {
      booking.notes.push({
        text: notes.text,
        date: new Date(),
        user: req.user._id
      });
    }
    
    const updatedBooking = await booking.save();
    
    // Handle check-in status change for the room
    if (status === 'checked-in' && booking.status !== 'checked-in') {
      const room = await Room.findById(booking.roomRef);
      if (room) {
        room.checkedInStatus = true;
        await room.save();
      }
    } else if (status === 'checked-out' && booking.status === 'checked-in') {
      const room = await Room.findById(booking.roomRef);
      if (room) {
        room.checkedInStatus = false;
        await room.save();
      }
    }
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Cancel booking
 * @route PUT /api/bookings/:id/cancel
 * @access Private
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'checked-out' || booking.status === 'cancelled') {
      return res.status(400).json({ 
        message: `Booking cannot be cancelled (current status: ${booking.status})` 
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    
    // Add cancellation note
    booking.notes.push({
      text: req.body.reason || 'Booking cancelled',
      date: new Date(),
      user: req.user._id
    });
    
    const updatedBooking = await booking.save();
    
    // If room was checked in, update room status
    if (booking.status === 'checked-in') {
      const room = await Room.findById(booking.roomRef);
      if (room) {
        room.checkedInStatus = false;
        await room.save();
      }
    }
    
    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get calendar data for bookings
 * @route GET /api/bookings/calendar
 * @access Private
 */
const getCalendarData = async (req, res) => {
  try {
    const { hotelId, startDate, endDate } = req.query;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date(new Date(start).setMonth(start.getMonth() + 1));
    
    const bookings = await Booking.find({
      hotelRef: hotelId,
      status: { $in: ['reserved', 'checked-in'] },
      $or: [
        // Bookings that start within the range
        {
          checkInDate: {
            $gte: start,
            $lte: end
          }
        },
        // Bookings that end within the range
        {
          checkOutDate: {
            $gte: start,
            $lte: end
          }
        },
        // Bookings that span the entire range
        {
          checkInDate: { $lte: start },
          checkOutDate: { $gte: end }
        }
      ]
    }).populate('roomRef', 'roomNumber type');
    
    // Format for calendar (Google Calendar compatible format)
    const calendarEvents = bookings.map(booking => ({
      id: booking._id.toString(),
      title: `${booking.guestName} - ${booking.roomRef ? booking.roomRef.roomNumber : 'Room N/A'}`,
      start: booking.checkInDate,
      end: booking.checkOutDate,
      extendedProps: {
        status: booking.status,
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
        roomNumber: booking.roomRef ? booking.roomRef.roomNumber : null,
        roomType: booking.roomRef ? booking.roomRef.type : null
      }
    }));
    
    res.json(calendarEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete booking
 * @route DELETE /api/bookings/:id
 * @access Private (admin only)
 */
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await booking.remove();
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getCalendarData,
  deleteBooking
}; 