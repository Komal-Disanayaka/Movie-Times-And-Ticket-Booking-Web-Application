const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - null for guest bookings
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: String, required: true }],  // Array of seat IDs like ['A-1', 'A-2']
  totalAmount: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentDetails: {
    cardLastFour: String,
    cardName: String
  },
  bookingDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  isGuestBooking: { type: Boolean, default: false }
});

module.exports = mongoose.model('Booking', BookingSchema);
