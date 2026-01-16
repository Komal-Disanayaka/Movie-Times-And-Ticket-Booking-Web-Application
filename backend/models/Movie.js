const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  genre: [String],
  language: String,
  poster: String,
  showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', MovieSchema);
