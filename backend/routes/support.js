const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, supportController.sendMessage);
router.get('/my-messages', protect, supportController.getUserMessages);
router.get('/', protect, admin, supportController.listMessages);
router.put('/:id/reply', protect, admin, supportController.reply);

module.exports = router;
