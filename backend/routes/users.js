const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (admin)
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if email is already taken by another user
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
