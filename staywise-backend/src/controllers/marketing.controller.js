const { Hotel } = require('../models');
const { generateMarketingTemplate } = require('../utils');

/**
 * Generate marketing templates
 * @route POST /api/marketing/templates
 * @access Private (admin)
 */
const generateTemplates = async (req, res) => {
  try {
    const {
      hotelId,
      type,
      occasion,
      targetAudience,
      specialOffer
    } = req.body;
    
    // Validate request
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    if (!type) {
      return res.status(400).json({ message: 'Template type is required (whatsapp, email, promo)' });
    }
    
    // Check if hotel exists and has marketing features enabled
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!hotel.features.marketingEnabled) {
      return res.status(403).json({ 
        message: 'Marketing features are not enabled for this hotel' 
      });
    }
    
    // Generate the marketing template with AI
    const template = generateMarketingTemplate(type, {
      hotelName: hotel.name,
      occasion,
      targetAudience,
      specialOffer
    });
    
    res.json({
      message: 'Template generated successfully',
      template
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate multiple marketing templates
 * @route POST /api/marketing/templates/batch
 * @access Private (admin)
 */
const generateMultipleTemplates = async (req, res) => {
  try {
    const {
      hotelId,
      types,
      occasion,
      targetAudience,
      specialOffer
    } = req.body;
    
    // Validate request
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    if (!types || !Array.isArray(types) || types.length === 0) {
      return res.status(400).json({ message: 'At least one template type is required' });
    }
    
    // Check if hotel exists and has marketing features enabled
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!hotel.features.marketingEnabled) {
      return res.status(403).json({ 
        message: 'Marketing features are not enabled for this hotel' 
      });
    }
    
    // Generate templates for each type
    const templates = {};
    
    for (const type of types) {
      templates[type] = generateMarketingTemplate(type, {
        hotelName: hotel.name,
        occasion,
        targetAudience,
        specialOffer
      });
    }
    
    res.json({
      message: 'Templates generated successfully',
      templates
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Check if marketing features are enabled for a hotel
 * @route GET /api/marketing/status/:hotelId
 * @access Private
 */
const checkMarketingStatus = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    
    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    res.json({
      enabled: hotel.features.marketingEnabled,
      subscription: {
        plan: hotel.subscription.plan,
        status: hotel.subscription.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get marketing template ideas
 * @route GET /api/marketing/ideas
 * @access Private (admin)
 */
const getMarketingIdeas = async (req, res) => {
  try {
    const { hotelId, type } = req.query;
    
    // Validate request
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Check if hotel exists and has marketing features enabled
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!hotel.features.marketingEnabled) {
      return res.status(403).json({ 
        message: 'Marketing features are not enabled for this hotel' 
      });
    }
    
    // Predefined ideas for each template type
    const ideas = {
      whatsapp: [
        {
          occasion: 'Weekend Getaway',
          targetAudience: 'Couples',
          specialOffer: '15% off on all room types for weekend stays'
        },
        {
          occasion: 'Summer Vacation',
          targetAudience: 'Families',
          specialOffer: 'Kids stay free when booking a suite'
        },
        {
          occasion: 'Business Trip',
          targetAudience: 'Corporate clients',
          specialOffer: 'Complimentary airport transfer and breakfast'
        }
      ],
      email: [
        {
          occasion: 'Anniversary Special',
          targetAudience: 'Past guests',
          specialOffer: 'Complimentary room upgrade and champagne'
        },
        {
          occasion: 'Monsoon Package',
          targetAudience: 'All guests',
          specialOffer: 'Book 2 nights, get 1 night free'
        },
        {
          occasion: 'Festive Season',
          targetAudience: 'Loyalty members',
          specialOffer: '20% off on all rooms plus early check-in'
        }
      ],
      promo: [
        {
          occasion: 'Flash Sale',
          targetAudience: 'Social media followers',
          specialOffer: '25% off for next 24 hours only'
        },
        {
          occasion: 'Loyalty Reward',
          targetAudience: 'Repeat guests',
          specialOffer: 'Double loyalty points on your next stay'
        },
        {
          occasion: 'Grand Opening',
          targetAudience: 'New customers',
          specialOffer: 'First-time guest special rate plus welcome amenities'
        }
      ]
    };
    
    // Return ideas for specific type or all types
    if (type && ideas[type]) {
      res.json({ ideas: ideas[type] });
    } else {
      res.json({ ideas });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateTemplates,
  generateMultipleTemplates,
  checkMarketingStatus,
  getMarketingIdeas
}; 