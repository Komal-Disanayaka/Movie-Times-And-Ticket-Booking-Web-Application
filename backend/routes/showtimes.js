const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/auth');

router.get('/', showtimeController.listShowtimes);
router.post('/', protect, admin, showtimeController.createShowtime);
router.put('/:id', protect, admin, showtimeController.updateShowtime);
router.delete('/:id', protect, admin, showtimeController.deleteShowtime);

module.exports = router;
