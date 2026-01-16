const Message = require('../models/Message');

// Get recent messages
exports.getRecentMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .lean();

    // Reverse to get oldest first (for proper display)
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save message to database
exports.saveMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    await message.save();
    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Delete old messages (optional cleanup)
exports.deleteOldMessages = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Message.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
  } catch (error) {
    console.error('Error deleting old messages:', error);
  }
};
