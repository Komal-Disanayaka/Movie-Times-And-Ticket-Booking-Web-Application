const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

// Process payment - works for both logged-in and guest users
router.post('/process', async (req, res, next) => {
  // Try to authenticate, but don't require it
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Token invalid but continue as guest
      req.user = null;
    }
  }
  next();
}, paymentController.processPayment);

// Get all bookings (Admin only)
router.get('/bookings', protect, admin, paymentController.getAllBookings);

// Get user's bookings (Registered users only)
router.get('/my-bookings', protect, paymentController.getUserBookings);

// Get booked seats for a showtime (Public)
router.get('/showtime/:showtimeId/booked-seats', paymentController.getBookedSeats);

module.exports = router;
