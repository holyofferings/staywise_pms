const { AIAgent, Hotel } = require('../models');

/**
 * Create a new AI agent
 * @route POST /api/ai/agents
 * @access Private (admin)
 */
const createAIAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      platform,
      hotelRef,
      defaultLanguage,
      supportedLanguages,
      intents,
      welcomeMessage,
      fallbackMessage,
      endConversationMessage,
      contextLifespan,
      aiModel,
      customPrompt
    } = req.body;
    
    // Verify hotel exists and has AI enabled
    const hotel = await Hotel.findById(hotelRef);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    if (!hotel.features.aiEnabled) {
      return res.status(403).json({ 
        message: 'AI features are not enabled for this hotel' 
      });
    }
    
    // Create AI agent
    const agent = await AIAgent.create({
      name,
      description,
      type,
      platform,
      hotelRef,
      defaultLanguage,
      supportedLanguages,
      intents,
      welcomeMessage,
      fallbackMessage,
      endConversationMessage,
      contextLifespan,
      aiModel,
      customPrompt,
      createdBy: req.user._id
    });
    
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all AI agents for a hotel
 * @route GET /api/ai/agents
 * @access Private
 */
const getAIAgents = async (req, res) => {
  try {
    const { hotelId, type, platform, isActive } = req.query;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Build filter
    const filter = { hotelRef: hotelId };
    
    // Type filter
    if (type) {
      filter.type = type;
    }
    
    // Platform filter
    if (platform) {
      filter.platform = platform;
    }
    
    // Active filter
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    const agents = await AIAgent.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get AI agent by ID
 * @route GET /api/ai/agents/:id
 * @access Private
 */
const getAIAgentById = async (req, res) => {
  try {
    const agent = await AIAgent.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('hotelRef', 'name');
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update AI agent
 * @route PUT /api/ai/agents/:id
 * @access Private (admin)
 */
const updateAIAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      platform,
      defaultLanguage,
      supportedLanguages,
      welcomeMessage,
      fallbackMessage,
      endConversationMessage,
      contextLifespan,
      aiModel,
      customPrompt,
      isActive
    } = req.body;
    
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    // Update fields
    if (name) agent.name = name;
    if (description) agent.description = description;
    if (type) agent.type = type;
    if (platform) agent.platform = platform;
    if (defaultLanguage) agent.defaultLanguage = defaultLanguage;
    if (supportedLanguages) agent.supportedLanguages = supportedLanguages;
    if (welcomeMessage) agent.welcomeMessage = welcomeMessage;
    if (fallbackMessage) agent.fallbackMessage = fallbackMessage;
    if (endConversationMessage) agent.endConversationMessage = endConversationMessage;
    if (contextLifespan) agent.contextLifespan = contextLifespan;
    if (aiModel) agent.aiModel = aiModel;
    if (customPrompt) agent.customPrompt = customPrompt;
    if (isActive !== undefined) agent.isActive = isActive;
    
    const updatedAgent = await agent.save();
    
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add or update intent
 * @route PUT /api/ai/agents/:id/intents
 * @access Private (admin)
 */
const updateIntent = async (req, res) => {
  try {
    const { intent } = req.body;
    
    if (!intent || !intent.name) {
      return res.status(400).json({ message: 'Intent name is required' });
    }
    
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    // Find if intent already exists
    const intentIndex = agent.intents.findIndex(i => i.name === intent.name);
    
    if (intentIndex >= 0) {
      // Update existing intent
      agent.intents[intentIndex] = { ...agent.intents[intentIndex].toObject(), ...intent };
    } else {
      // Add new intent
      agent.intents.push(intent);
    }
    
    // Set training status to not started
    agent.trainingStatus = {
      status: 'not_started',
      message: 'Intent added/updated, training needed'
    };
    
    const updatedAgent = await agent.save();
    
    res.json({
      message: `Intent "${intent.name}" ${intentIndex >= 0 ? 'updated' : 'added'} successfully`,
      intents: updatedAgent.intents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete intent
 * @route DELETE /api/ai/agents/:id/intents/:intentName
 * @access Private (admin)
 */
const deleteIntent = async (req, res) => {
  try {
    const { intentName } = req.params;
    
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    // Find if intent exists
    const intentIndex = agent.intents.findIndex(i => i.name === intentName);
    
    if (intentIndex === -1) {
      return res.status(404).json({ message: `Intent "${intentName}" not found` });
    }
    
    // Remove intent
    agent.intents.splice(intentIndex, 1);
    
    // Set training status to not started
    agent.trainingStatus = {
      status: 'not_started',
      message: 'Intent deleted, training needed'
    };
    
    const updatedAgent = await agent.save();
    
    res.json({
      message: `Intent "${intentName}" deleted successfully`,
      intents: updatedAgent.intents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Start training AI agent
 * @route POST /api/ai/agents/:id/train
 * @access Private (admin)
 */
const trainAIAgent = async (req, res) => {
  try {
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    // Check if agent has intents
    if (!agent.intents || agent.intents.length === 0) {
      return res.status(400).json({ message: 'Agent must have at least one intent to train' });
    }
    
    // Update training status to in progress
    agent.trainingStatus = {
      status: 'in_progress',
      message: 'Training in progress',
      lastTrained: new Date()
    };
    
    await agent.save();
    
    // Here, in a real implementation, you would initiate a training job
    // For now, we'll simulate a successful training after a delay
    
    // Simulate training delay
    setTimeout(async () => {
      try {
        const updatedAgent = await AIAgent.findById(req.params.id);
        if (updatedAgent) {
          updatedAgent.trainingStatus = {
            status: 'completed',
            message: 'Training completed successfully',
            lastTrained: new Date()
          };
          await updatedAgent.save();
        }
      } catch (error) {
        console.error('Error updating training status:', error);
      }
    }, 5000);
    
    res.json({
      message: 'Training initiated successfully',
      trainingStatus: agent.trainingStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Test AI agent
 * @route POST /api/ai/agents/:id/test
 * @access Private
 */
const testAIAgent = async (req, res) => {
  try {
    const { input, language, context } = req.body;
    
    if (!input) {
      return res.status(400).json({ message: 'Input text is required' });
    }
    
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    // Check if agent is trained
    if (agent.trainingStatus.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Agent is not fully trained',
        trainingStatus: agent.trainingStatus
      });
    }
    
    // Here, in a real implementation, you would send the input to the AI service
    // For now, we'll simulate a response based on the agent's intents
    
    // Simulate intent matching
    let matchedIntent = null;
    let matchedResponse = '';
    
    // Simple keyword matching for demo purposes
    for (const intent of agent.intents) {
      for (const phrase of intent.trainingPhrases) {
        if (input.toLowerCase().includes(phrase.toLowerCase())) {
          matchedIntent = intent;
          matchedResponse = intent.responses[Math.floor(Math.random() * intent.responses.length)];
          break;
        }
      }
      if (matchedIntent) break;
    }
    
    // If no intent matched, use fallback
    if (!matchedIntent) {
      matchedResponse = agent.fallbackMessage;
    }
    
    res.json({
      response: matchedResponse,
      intent: matchedIntent ? matchedIntent.name : null,
      confidence: matchedIntent ? 0.85 : 0.2
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete AI agent
 * @route DELETE /api/ai/agents/:id
 * @access Private (admin)
 */
const deleteAIAgent = async (req, res) => {
  try {
    const agent = await AIAgent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    
    await agent.remove();
    
    res.json({ message: 'AI agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAIAgent,
  getAIAgents,
  getAIAgentById,
  updateAIAgent,
  updateIntent,
  deleteIntent,
  trainAIAgent,
  testAIAgent,
  deleteAIAgent
}; 