const Movie = require('../models/Movie');

exports.listMovies = async (req, res) => {
  try {
    const movies = await Movie.find().limit(100);
    res.json(movies);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('showtimes');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
