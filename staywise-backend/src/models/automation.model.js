const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'sms', 'whatsapp', 'notification', 'status_update', 'webhook'],
    required: true
  },
  template: {
    type: String,
    required: function() {
      return ['email', 'sms', 'whatsapp'].includes(this.type);
    }
  },
  subject: {
    type: String,
    required: function() {
      return this.type === 'email';
    }
  },
  to: {
    type: String,
    enum: ['guest', 'staff', 'admin', 'custom'],
    default: 'guest'
  },
  customRecipient: {
    type: String,
    required: function() {
      return this.to === 'custom';
    }
  },
  status: {
    type: String,
    required: function() {
      return this.type === 'status_update';
    }
  },
  webhookUrl: {
    type: String,
    required: function() {
      return this.type === 'webhook';
    }
  },
  delay: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'minutes'
    }
  }
});

const automationSchema = new mongoose.Schema(
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
    trigger: {
      event: {
        type: String,
        enum: [
          'booking_created', 
          'booking_updated', 
          'check_in', 
          'check_out', 
          'order_placed',
          'guest_message',
          'scheduled_time'
        ],
        required: true
      },
      conditions: [{
        field: String,
        operator: {
          type: String,
          enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than']
        },
        value: mongoose.Schema.Types.Mixed
      }],
      scheduledTime: {
        time: String,
        days: [{
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }]
      }
    },
    actions: {
      type: [actionSchema],
      required: true,
      validate: {
        validator: function(actions) {
          return actions.length > 0;
        },
        message: 'Automation must have at least one action'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastExecuted: Date,
    executionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
automationSchema.index({ hotelRef: 1, 'trigger.event': 1, isActive: 1 });

const Automation = mongoose.model('Automation', automationSchema);

module.exports = Automation; 