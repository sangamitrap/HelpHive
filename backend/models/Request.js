const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Requester ID is required']
  },
  helperId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Helper ID is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  helpRequirements: {
    type: String,
    required: [true, 'Help requirements are required'],
    maxlength: [1000, 'Help requirements cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'household', 'transportation', 'shopping', 'medical', 'other'],
    default: 'general'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: null
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
requestSchema.index({ requesterId: 1, status: 1 });
requestSchema.index({ helperId: 1, status: 1 });
requestSchema.index({ location: '2dsphere' });
requestSchema.index({ createdAt: -1 });

// Virtual for requester details
requestSchema.virtual('requester', {
  ref: 'User',
  localField: 'requesterId',
  foreignField: '_id',
  justOne: true
});

// Virtual for helper details
requestSchema.virtual('helper', {
  ref: 'User',
  localField: 'helperId',
  foreignField: '_id',
  justOne: true
});

// Update updatedAt on save
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Request', requestSchema);