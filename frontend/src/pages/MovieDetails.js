import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Chip, Container, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { AccessTime, EventSeat, Favorite, FavoriteBorder, PlayArrow, Close } from '@mui/icons-material';
import api from '../services/api';
import SeatCountModal from '../components/SeatCountModal';
import SeatSelectionModal from '../components/SeatSelectionModal';
import './MovieDetails.css';

// Showtime Selection Modal Component
function ShowtimeModal({ open, onClose, showtimes, onSelectShowtime }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'showtime-modal-paper'
      }}
    >
      <DialogTitle className="showtime-modal-title">
        <Typography variant="h5" className="modal-title-text">
          Select Showtime
        </Typography>
        <Button onClick={onClose} className="modal-close-btn">
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent className="showtime-modal-content">
        {showtimes.length === 0 ? (
          <Typography className="no-showtimes">No showtimes available</Typography>
        ) : (
          <Box className="showtimes-modal-grid">
            {showtimes.map((st) => (
              <Box 
                key={st._id} 
                className="showtime-modal-card"
                onClick={() => onSelectShowtime(st)}
              >
                <Box className="showtime-time">
                  <AccessTime className="showtime-icon" />
                  <Typography variant="h6" className="showtime-datetime">
                    {new Date(st.startTime).toLocaleDateString()} at {new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                <Box className="showtime-details">
                  <Typography variant="h5" className="showtime-price">
                    ${st.price}
                  </Typography>
                  <Box className="showtime-seats">
                    <EventSeat className="showtime-icon" />
                    <Typography variant="body1">
                      {st.availableSeats} seats
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showShowtimeModal, setShowShowtimeModal] = useState(false);
  const [showSeatCountModal, setShowSeatCountModal] = useState(false);
  const [showSeatSelectionModal, setShowSeatSelectionModal] = useState(false);
  const [requiredSeats, setRequiredSeats] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => {
      setMovie(res.data);
    });
    api.get('/showtimes').then((res) => {
      const movieShowtimes = res.data.filter(st => st.movie?._id === id || st.movie === id);
      setShowtimes(movieShowtimes);
    });
  }, [id]);

  const handleBookNow = () => {
    setShowShowtimeModal(true);
  };

  const handleShowtimeSelected = (showtime) => {
    setSelectedShowtime(showtime);
    setShowShowtimeModal(false);
    setShowSeatCountModal(true);
  };

  const handleSeatCountSelected = (count) => {
    setRequiredSeats(count);
    setShowSeatCountModal(false);
    setShowSeatSelectionModal(true);
  };

  const handleCloseSeatSelection = () => {
    setShowSeatSelectionModal(false);
    setRequiredSeats(0);
  };

  if (!movie) return <Box className="movie-details-loading">Loading...</Box>;

  return (
    <Box className="movie-details-container">
      {/* Hero Background */}
      <Box 
        className="movie-details-hero"
        sx={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%), 
                           url(${movie.poster || 'https://via.placeholder.com/1920x1080'})`,
        }}
      />

      <Container maxWidth="xl" className="movie-details-content">
        <Box className="movie-details-main">
          {/* Left Side - Movie Poster */}
          <Box className="movie-poster-section">
            <img 
              src={movie.poster || 'https://via.placeholder.com/400x600?text=Movie'} 
              alt={movie.title}
              className="movie-poster-large"
            />
          </Box>

          {/* Right Side - Movie Info */}
          <Box className="movie-info-section">
            <Typography variant="h2" className="movie-title">
              {movie.title}
            </Typography>

            <Box className="movie-meta">
              {movie.language && (
                <Chip label={`US | ${movie.language}`} className="meta-chip language-chip" />
              )}
              {movie.duration && (
                <Chip 
                  icon={<AccessTime />} 
                  label={movie.duration} 
                  className="meta-chip"
                />
              )}
            </Box>

            {movie.genre && movie.genre.length > 0 && (
              <Box className="movie-genres">
                {movie.genre.map((g, i) => (
                  <Chip key={i} label={g} className="genre-chip" />
                ))}
              </Box>
            )}

            <Typography variant="body1" className="movie-description">
              {movie.description || 'Experience this incredible cinematic journey. A story that will captivate your imagination and touch your heart.'}
            </Typography>

            {/* Rating */}
            <Box className="movie-rating">
              <Box className="rating-icon" onClick={() => setIsFavorite(!isFavorite)}>
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </Box>
              <Typography variant="h3" className="rating-percent">
                99%
              </Typography>
              <Typography variant="body2" className="rating-label">
                liked it
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box className="movie-actions">
              <Button 
                variant="contained" 
                className="action-btn primary-btn"
                startIcon={<PlayArrow />}
              >
                Watch Trailer
              </Button>
              <Button 
                variant="contained" 
                className="action-btn secondary-btn"
                onClick={handleBookNow}
              >
                Book Tickets
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Showtime Selection Modal */}
      <ShowtimeModal
        open={showShowtimeModal}
        onClose={() => setShowShowtimeModal(false)}
        showtimes={showtimes}
        onSelectShowtime={handleShowtimeSelected}
      />

      {/* Seat Count Modal */}
      <SeatCountModal 
        open={showSeatCountModal}
        onClose={() => setShowSeatCountModal(false)}
        onSelectSeats={handleSeatCountSelected}
      />

      {/* Seat Selection Modal */}
      <SeatSelectionModal 
        open={showSeatSelectionModal}
        onClose={handleCloseSeatSelection}
        requiredSeats={requiredSeats}
        showtime={selectedShowtime}
        movieTitle={movie?.title}
      />
    </Box>
  );
}

export default MovieDetails;
