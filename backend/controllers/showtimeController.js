const Showtime = require('../models/Showtime');

exports.createShowtime = async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    await showtime.save();
    res.json(showtime);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.listShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate('movie');
    res.json(showtimes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(showtime);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteShowtime = async (req, res) => {
  try {
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Showtime removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
