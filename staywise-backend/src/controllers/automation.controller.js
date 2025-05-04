const { Automation, Hotel } = require('../models');
const { runAutomation } = require('../utils');

/**
 * Create a new automation
 * @route POST /api/automations
 * @access Private (admin)
 */
const createAutomation = async (req, res) => {
  try {
    const {
      name,
      description,
      trigger,
      actions,
      hotelRef
    } = req.body;
    
    // Verify hotel exists and has automations enabled
    const hotel = await Hotel.findById(hotelRef);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!hotel.features.automationsEnabled) {
      return res.status(403).json({ 
        message: 'Automations feature is not enabled for this hotel' 
      });
    }
    
    // Create automation
    const automation = await Automation.create({
      name,
      description,
      trigger,
      actions,
      hotelRef,
      createdBy: req.user._id
    });
    
    res.status(201).json(automation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all automations for a hotel
 * @route GET /api/automations
 * @access Private
 */
const getAutomations = async (req, res) => {
  try {
    const { hotelId, event } = req.query;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Build filter
    const filter = { hotelRef: hotelId };
    
    // Filter by event type if provided
    if (event) {
      filter['trigger.event'] = event;
    }
    
    const automations = await Automation.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json(automations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get automation by ID
 * @route GET /api/automations/:id
 * @access Private
 */
const getAutomationById = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    res.json(automation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update automation
 * @route PUT /api/automations/:id
 * @access Private (admin)
 */
const updateAutomation = async (req, res) => {
  try {
    const {
      name,
      description,
      trigger,
      actions,
      isActive
    } = req.body;
    
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    // Update fields
    if (name) automation.name = name;
    if (description) automation.description = description;
    if (trigger) automation.trigger = trigger;
    if (actions) automation.actions = actions;
    if (isActive !== undefined) automation.isActive = isActive;
    
    const updatedAutomation = await automation.save();
    
    res.json(updatedAutomation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Toggle automation active status
 * @route PUT /api/automations/:id/toggle
 * @access Private (admin)
 */
const toggleAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    // Toggle isActive status
    automation.isActive = !automation.isActive;
    
    const updatedAutomation = await automation.save();
    
    res.json({
      message: `Automation ${updatedAutomation.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: updatedAutomation.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete automation
 * @route DELETE /api/automations/:id
 * @access Private (admin)
 */
const deleteAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    await automation.remove();
    
    res.json({ message: 'Automation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Execute automation manually
 * @route POST /api/automations/:id/execute
 * @access Private (admin)
 */
const executeAutomation = async (req, res) => {
  try {
    const { testData } = req.body;
    
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    // Check if automation is active
    if (!automation.isActive) {
      return res.status(400).json({ message: 'Cannot execute inactive automation' });
    }
    
    // Run automation with provided test data
    const result = await runAutomation(automation, testData || {});
    
    // Update execution count
    automation.executionCount += 1;
    automation.lastExecuted = new Date();
    await automation.save();
    
    res.json({
      message: 'Automation executed successfully',
      result
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get active automations by trigger event
 * @route GET /api/automations/trigger/:event
 * @access Private
 */
const getAutomationsByTrigger = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const { event } = req.params;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Find active automations for the given trigger event
    const automations = await Automation.find({
      hotelRef: hotelId,
      'trigger.event': event,
      isActive: true
    });
    
    res.json(automations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAutomation,
  getAutomations,
  getAutomationById,
  updateAutomation,
  toggleAutomation,
  deleteAutomation,
  executeAutomation,
  getAutomationsByTrigger
}; 