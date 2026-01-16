const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  startTime: { type: Date, required: true },
  price: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 100 },
  availableSeats: { type: Number, default: 100 },
  bookedSeats: [{ 
    type: String,  // Format: 'A-1', 'B-12', etc.
    default: []
  }]
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
