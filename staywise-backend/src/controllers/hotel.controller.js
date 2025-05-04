const { Hotel, User } = require('../models');

/**
 * Create a new hotel
 * @route POST /api/hotels
 * @access Private (superadmin only)
 */
const createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      contactInfo,
      features,
      subscription,
      settings
    } = req.body;
    
    // Create hotel
    const hotel = await Hotel.create({
      name,
      description,
      contactInfo,
      features,
      subscription,
      settings
    });
    
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all hotels
 * @route GET /api/hotels
 * @access Private (superadmin only)
 */
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });
    
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get hotel by ID
 * @route GET /api/hotels/:id
 * @access Private
 */
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update hotel
 * @route PUT /api/hotels/:id
 * @access Private (admin, superadmin)
 */
const updateHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      contactInfo,
      features,
      settings
    } = req.body;
    
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Update fields
    if (name) hotel.name = name;
    if (description) hotel.description = description;
    if (contactInfo) {
      hotel.contactInfo = {
        ...hotel.contactInfo,
        ...contactInfo
      };
    }
    if (features) {
      hotel.features = {
        ...hotel.features,
        ...features
      };
    }
    if (settings) {
      hotel.settings = {
        ...hotel.settings,
        ...settings
      };
    }
    
    const updatedHotel = await hotel.save();
    
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update hotel subscription
 * @route PUT /api/hotels/:id/subscription
 * @access Private (superadmin only)
 */
const updateSubscription = async (req, res) => {
  try {
    const { plan, status, trialEnds, maxRooms, maxSubAccounts } = req.body;
    
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Update subscription fields
    if (plan) hotel.subscription.plan = plan;
    if (status) hotel.subscription.status = status;
    if (trialEnds) hotel.subscription.trialEnds = trialEnds;
    if (maxRooms) hotel.subscription.maxRooms = maxRooms;
    if (maxSubAccounts) hotel.subscription.maxSubAccounts = maxSubAccounts;
    
    const updatedHotel = await hotel.save();
    
    res.json(updatedHotel.subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update hotel logo
 * @route PUT /api/hotels/:id/logo
 * @access Private (admin, superadmin)
 */
const updateLogo = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Get file path
    const filePath = `/uploads/hotels/${req.file.filename}`;
    
    // Update hotel logo
    hotel.logo = filePath;
    const updatedHotel = await hotel.save();
    
    res.json({
      message: 'Logo updated successfully',
      logo: updatedHotel.logo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get hotel staff
 * @route GET /api/hotels/:id/staff
 * @access Private (admin, superadmin)
 */
const getHotelStaff = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const staff = await User.find({ hotelRef: req.params.id }).select('-password');
    
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete hotel (soft delete)
 * @route DELETE /api/hotels/:id
 * @access Private (superadmin only)
 */
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Soft delete
    hotel.active = false;
    await hotel.save();
    
    res.json({ message: 'Hotel deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  updateSubscription,
  updateLogo,
  getHotelStaff,
  deleteHotel
}; 