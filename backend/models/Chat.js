const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  requestId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message',
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatSchema.index({ participants: 1 });
chatSchema.index({ requestId: 1 }, { unique: true });
chatSchema.index({ lastActivity: -1 });

// Ensure participants array has exactly 2 users
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Chat must have exactly 2 participants'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);