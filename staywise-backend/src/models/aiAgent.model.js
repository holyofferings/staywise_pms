const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  trainingPhrases: {
    type: [String],
    validate: {
      validator: function(phrases) {
        return phrases.length > 0;
      },
      message: 'At least one training phrase is required'
    }
  },
  responses: {
    type: [String],
    validate: {
      validator: function(responses) {
        return responses.length > 0;
      },
      message: 'At least one response is required'
    }
  },
  parameters: [{
    name: String,
    entityType: String,
    required: Boolean
  }],
  webhookEnabled: {
    type: Boolean,
    default: false
  },
  webhookUrl: String
});

const aiAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['chatbot', 'email_assistant', 'sales_agent', 'custom'],
      default: 'chatbot'
    },
    platform: {
      type: String,
      enum: ['whatsapp', 'website', 'facebook', 'multi'],
      default: 'website'
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    defaultLanguage: {
      type: String,
      default: 'en'
    },
    supportedLanguages: {
      type: [String],
      default: ['en']
    },
    intents: {
      type: [intentSchema],
      default: []
    },
    welcomeMessage: {
      type: String,
      default: 'Hello! How can I assist you today?'
    },
    fallbackMessage: {
      type: String,
      default: "I'm sorry, I couldn't understand that. Could you please rephrase?"
    },
    endConversationMessage: {
      type: String,
      default: 'Thank you for chatting with me. Have a great day!'
    },
    contextLifespan: {
      type: Number,
      default: 5 // Number of conversation turns to remember context
    },
    aiModel: {
      type: String,
      enum: ['basic', 'advanced'],
      default: 'basic'
    },
    customPrompt: {
      type: String,
      trim: true
    },
    trainingStatus: {
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'failed'],
        default: 'not_started'
      },
      lastTrained: Date,
      message: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    statistics: {
      totalConversations: {
        type: Number,
        default: 0
      },
      averageRating: {
        type: Number,
        default: 0
      },
      successRate: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
aiAgentSchema.index({ hotelRef: 1, type: 1 });
aiAgentSchema.index({ hotelRef: 1, isActive: 1 });

const AIAgent = mongoose.model('AIAgent', aiAgentSchema);

module.exports = AIAgent; 