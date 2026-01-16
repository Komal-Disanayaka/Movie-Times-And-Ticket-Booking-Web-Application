const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// Process payment and create booking
exports.processPayment = async (req, res) => {
  try {
    const { showtimeId, seats, totalAmount, email, phone, paymentDetails } = req.body;

    // Verify showtime exists
    const showtime = await Showtime.findById(showtimeId).populate('movie');
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if seats are already booked
    const alreadyBooked = seats.some(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({ message: 'One or more seats are already booked' });
    }

    // Check if enough seats available
    if (showtime.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Determine if user is logged in
    const isGuestBooking = !req.user;
    
    // Create booking
    const booking = new Booking({
      user: req.user ? req.user.id : null,
      showtime: showtimeId,
      movie: showtime.movie._id,
      seats,
      totalAmount,
      email,
      phone,
      paymentDetails: {
        cardLastFour: paymentDetails.cardNumber,
        cardName: paymentDetails.cardName
      },
      isGuestBooking
    });

    await booking.save();

    // Update showtime - block the seats
    showtime.bookedSeats.push(...seats);
    showtime.availableSeats -= seats.length;
    await showtime.save();

    // Populate booking details
    await booking.populate('movie showtime');

    res.status(201).json({ 
      message: 'Payment successful and booking confirmed',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .populate('showtime', 'startTime price')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's bookings (Registered users only)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie showtime')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booked seats for a showtime (Public)
exports.getBookedSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json({ bookedSeats: showtime.bookedSeats || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
