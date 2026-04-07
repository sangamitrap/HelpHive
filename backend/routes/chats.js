const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'fullName profileImage status')
    .populate('requestId', 'helpRequirements status')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== req.user._id.toString());

      return {
        id: chat._id,
        userId: otherParticipant._id,
        userName: otherParticipant.fullName,
        userStatus: otherParticipant.status,
        userImage: otherParticipant.profileImage || '👤',
        requestId: chat.requestId._id,
        helpRequirements: chat.requestId.helpRequirements,
        requestStatus: chat.requestId.status,
        lastMessage: chat.lastMessage ? {
          content: chat.lastMessage.content,
          timestamp: chat.lastMessage.timestamp,
          isRead: chat.lastMessage.isRead
        } : null,
        lastActivity: chat.lastActivity
      };
    });

    res.json({
      success: true,
      count: formattedChats.length,
      data: formattedChats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get chat messages
// @route   GET /api/chats/:id/messages
// @access  Private
router.get('/:id/messages', protect, async (req, res) => {
  try {
    // Check if user is participant in this chat
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    const messages = await Message.find({ chatId: req.params.id })
      .populate('sender', 'fullName profileImage')
      .sort({ timestamp: 1 });

    const formattedMessages = messages.map(message => ({
      id: message._id,
      senderId: message.sender._id,
      senderName: message.sender.fullName,
      senderImage: message.sender.profileImage || '👤',
      content: message.content,
      timestamp: message.timestamp,
      isRead: message.isRead,
      messageType: message.messageType
    }));

    res.json({
      success: true,
      count: formattedMessages.length,
      data: formattedMessages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send message
// @route   POST /api/chats/:id/messages
// @access  Private
router.post('/:id/messages', protect, [
  require('express-validator').body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters')
], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;

    // Check if user is participant in this chat
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Create message
    const message = await Message.create({
      chatId: req.params.id,
      sender: req.user._id,
      content,
      messageType: 'text'
    });

    // Update chat's last message and activity
    await Chat.findByIdAndUpdate(req.params.id, {
      lastMessage: message._id,
      lastActivity: new Date()
    });

    // Populate sender details
    await message.populate('sender', 'fullName profileImage');

    // Emit to other participants via socket.io (will be handled by socket connection)
    const io = require('../server').io;
    io.to(req.params.id).emit('new-message', {
      chatId: req.params.id,
      message: {
        id: message._id,
        senderId: message.sender._id,
        senderName: message.sender.fullName,
        senderImage: message.sender.profileImage || '👤',
        content: message.content,
        timestamp: message.timestamp,
        isRead: false,
        messageType: 'text'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: {
          id: message._id,
          senderId: message.sender._id,
          senderName: message.sender.fullName,
          senderImage: message.sender.profileImage || '👤',
          content: message.content,
          timestamp: message.timestamp,
          isRead: false,
          messageType: 'text'
        }
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark messages as read
// @route   PUT /api/chats/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    // Check if user is participant in this chat
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Mark all unread messages from other participants as read
    await Message.updateMany(
      {
        chatId: req.params.id,
        sender: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;