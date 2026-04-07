const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const Chat = require('../models/Chat');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a new help request
// @route   POST /api/requests
// @access  Private
router.post('/', protect, [
  body('helperId').isMongoId().withMessage('Valid helper ID is required'),
  body('helpRequirements').trim().isLength({ min: 5, max: 1000 }).withMessage('Help requirements must be 5-1000 characters'),
  body('category').optional().isIn(['general', 'technical', 'household', 'transportation', 'shopping', 'medical', 'other']),
  body('urgency').optional().isIn(['low', 'medium', 'high']),
  body('longitude').optional().isNumeric(),
  body('latitude').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { helperId, helpRequirements, category = 'general', urgency = 'medium', longitude, latitude, address } = req.body;

    // Check if helper exists and is active
    const helper = await require('../models/User').findById(helperId);
    if (!helper || !helper.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found or inactive'
      });
    }

    // Check if user is not requesting help from themselves
    if (req.user._id.toString() === helperId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request help from yourself'
      });
    }

    // Check if there's already a pending/accepted request between these users
    const existingRequest = await Request.findOne({
      $or: [
        { requesterId: req.user._id, helperId: helperId },
        { requesterId: helperId, helperId: req.user._id }
      ],
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'There is already an active request between you and this user'
      });
    }

    // Create the request
    const request = await Request.create({
      requesterId: req.user._id,
      helperId,
      helpRequirements,
      category,
      urgency,
      location: longitude && latitude ? {
        type: 'Point',
        coordinates: [longitude, latitude],
        address: address || ''
      } : undefined
    });

    // Populate user details
    await request.populate('requester', 'fullName');
    await request.populate('helper', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Help request sent successfully',
      data: {
        request: {
          id: request._id,
          requesterId: request.requesterId,
          helperId: request.helperId,
          requesterName: request.requester.fullName,
          helperName: request.helper.fullName,
          status: request.status,
          helpRequirements: request.helpRequirements,
          category: request.category,
          urgency: request.urgency,
          createdAt: request.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get requests for current user (sent and received)
// @route   GET /api/requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query; // 'sent', 'received', or undefined for all

    let query = {};

    if (type === 'sent') {
      query.requesterId = req.user._id;
    } else if (type === 'received') {
      query.helperId = req.user._id;
    } else {
      query.$or = [
        { requesterId: req.user._id },
        { helperId: req.user._id }
      ];
    }

    const requests = await Request.find(query)
      .populate('requester', 'fullName')
      .populate('helper', 'fullName')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      id: request._id,
      requesterId: request.requesterId,
      helperId: request.helperId,
      requesterName: request.requester.fullName,
      helperName: request.helper.fullName,
      status: request.status,
      helpRequirements: request.helpRequirements,
      category: request.category,
      urgency: request.urgency,
      createdAt: request.createdAt,
      acceptedAt: request.acceptedAt,
      completedAt: request.completedAt
    }));

    res.json({
      success: true,
      count: formattedRequests.length,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private
router.put('/:id', protect, [
  body('status').isIn(['accepted', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review cannot be more than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, rating, review } = req.body;

    // Find the request
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is authorized to update this request
    const userId = req.user._id.toString();
    const isRequester = request.requesterId.toString() === userId;
    const isHelper = request.helperId.toString() === userId;

    if (!isRequester && !isHelper) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Validate status transitions
    if (status === 'accepted' && !isHelper) {
      return res.status(403).json({
        success: false,
        message: 'Only the helper can accept the request'
      });
    }

    if ((status === 'completed' || status === 'cancelled') && !isRequester && !isHelper) {
      return res.status(403).json({
        success: false,
        message: 'Only participants can complete or cancel the request'
      });
    }

    // Update the request
    const updates = { status };

    if (status === 'accepted') {
      updates.acceptedAt = new Date();
    } else if (status === 'completed') {
      updates.completedAt = new Date();
      if (rating) updates.rating = rating;
      if (review) updates.review = review;
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('requester', 'fullName').populate('helper', 'fullName');

    // If request is accepted, create a chat
    if (status === 'accepted') {
      const existingChat = await Chat.findOne({ requestId: request._id });
      if (!existingChat) {
        await Chat.create({
          participants: [request.requesterId, request.helperId],
          requestId: request._id
        });
      }
    }

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: {
        request: {
          id: updatedRequest._id,
          requesterId: updatedRequest.requesterId,
          helperId: updatedRequest.helperId,
          requesterName: updatedRequest.requester.fullName,
          helperName: updatedRequest.helper.fullName,
          status: updatedRequest.status,
          helpRequirements: updatedRequest.helpRequirements,
          category: updatedRequest.category,
          urgency: updatedRequest.urgency,
          createdAt: updatedRequest.createdAt,
          acceptedAt: updatedRequest.acceptedAt,
          completedAt: updatedRequest.completedAt
        }
      }
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'fullName email phone')
      .populate('helper', 'fullName email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is authorized to view this request
    const userId = req.user._id.toString();
    const isParticipant = [request.requesterId.toString(), request.helperId.toString()].includes(userId);

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: {
        request: {
          id: request._id,
          requesterId: request.requesterId,
          helperId: request.helperId,
          requesterName: request.requester.fullName,
          helperName: request.helper.fullName,
          status: request.status,
          helpRequirements: request.helpRequirements,
          category: request.category,
          urgency: request.urgency,
          createdAt: request.createdAt,
          acceptedAt: request.acceptedAt,
          completedAt: request.completedAt,
          rating: request.rating,
          review: request.review
        }
      }
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;