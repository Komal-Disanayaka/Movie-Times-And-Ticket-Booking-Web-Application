const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

router.get('/', movieController.listMovies);
router.get('/:id', movieController.getMovie);
router.post('/', protect, admin, movieController.createMovie);
router.put('/:id', protect, admin, movieController.updateMovie);
router.delete('/:id', protect, admin, movieController.deleteMovie);

module.exports = router;
