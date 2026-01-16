import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Chip
} from '@mui/material';
import { 
  Movie as MovieIcon, 
  EventSeat, 
  CalendarToday, 
  AccessTime,
  LocalAtm,
  ConfirmationNumber
} from '@mui/icons-material';
import api from '../services/api';
import './BookingHistory.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments/my-bookings');
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load booking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="booking-loading">
        <CircularProgress size={60} sx={{ color: '#ff9800' }} />
        <Typography sx={{ mt: 2, color: 'white' }}>
          Loading your bookings...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="booking-error">
        <Container maxWidth="lg">
          <Box className="error-content">
            <Typography variant="h5" className="error-message">
              {error}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="booking-history-page">
      <Container maxWidth="lg">
        <Box className="booking-header">
          <ConfirmationNumber sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
          <Typography variant="h3" className="booking-title">
            My Booking History
          </Typography>
          <Typography variant="body1" className="booking-subtitle">
            View all your past and upcoming movie bookings
          </Typography>
        </Box>
        
        {bookings.length === 0 ? (
          <Box className="no-bookings">
            <MovieIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />
            <Typography variant="h5" className="no-bookings-title">
              No Bookings Yet
            </Typography>
            <Typography className="no-bookings-text">
              You haven't made any bookings yet. Start exploring movies now!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Box className="booking-card">
                  <Box className="booking-card-header">
                    <Box className="booking-id-section">
                      <ConfirmationNumber sx={{ color: '#ff9800', mr: 1 }} />
                      <Typography className="booking-id">
                        #{booking._id.slice(-8).toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={new Date(booking.showtime?.startTime) > new Date() ? 'Upcoming' : 'Completed'} 
                      className={`status-chip ${new Date(booking.showtime?.startTime) > new Date() ? 'upcoming' : 'completed'}`}
                      size="medium"
                    />
                  </Box>

                  <Grid container spacing={3} className="booking-details">
                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="detail-item">
                        <Box className="detail-icon">
                          <MovieIcon sx={{ color: '#ff9800' }} />
                        </Box>
                        <Box>
                          <Typography className="detail-label">Movie</Typography>
                          <Typography className="detail-value">
                            {booking.movie?.title || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="detail-item">
                        <Box className="detail-icon">
                          <CalendarToday sx={{ color: '#ff9800' }} />
                        </Box>
                        <Box>
                          <Typography className="detail-label">Show Date</Typography>
                          <Typography className="detail-value">
                            {booking.showtime?.startTime ? (
                              new Date(booking.showtime.startTime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            ) : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Box className="detail-item">
                        <Box className="detail-icon">
                          <AccessTime sx={{ color: '#ff9800' }} />
                        </Box>
                        <Box>
                          <Typography className="detail-label">Show Time</Typography>
                          <Typography className="detail-value">
                            {booking.showtime?.startTime ? (
                              new Date(booking.showtime.startTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            ) : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Box className="detail-item">
                        <Box className="detail-icon">
                          <EventSeat sx={{ color: '#ff9800' }} />
                        </Box>
                        <Box>
                          <Typography className="detail-label">Seats</Typography>
                          <Typography className="detail-value">
                            {booking.seats.join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Box className="detail-item">
                        <Box className="detail-icon">
                          <LocalAtm sx={{ color: '#ff9800' }} />
                        </Box>
                        <Box>
                          <Typography className="detail-label">Total</Typography>
                          <Typography className="detail-value amount">
                            LKR {booking.totalAmount.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box className="booking-footer">
                    <Typography className="booking-date">
                      Booked on {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default BookingHistory;
