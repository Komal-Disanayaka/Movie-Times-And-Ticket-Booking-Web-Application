const express = require('express');
const router = express.Router();
const { getRecentMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Get recent messages (protected route)
router.get('/messages', protect, getRecentMessages);

module.exports = router;
