import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EventSeat } from '@mui/icons-material';
import api from '../services/api';
import './SeatSelectionModal.css';

// Define seat layout structure
const SEAT_LAYOUT = [
  { row: 'P', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], category: 'SUPERIOR', priceMultiplier: 1.5 },
  { row: 'N', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'SUPERIOR', priceMultiplier: 1.5 },
  { row: 'M', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'SUPERIOR', priceMultiplier: 1.5 },
  { row: 'L', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'SUPERIOR', priceMultiplier: 1.5 },
  { row: 'K', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'SUPERIOR', priceMultiplier: 1.5 },
  { row: 'J', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'H', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'G', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'F', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'E', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'D', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'PRIME', priceMultiplier: 1.2 },
  { row: 'C', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'CLASSIC', priceMultiplier: 1.0 },
  { row: 'B', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'CLASSIC', priceMultiplier: 1.0 },
  { row: 'A', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], category: 'CLASSIC', priceMultiplier: 1.0 },
];

function SeatSelectionModal({ open, onClose, requiredSeats, showtime, movieTitle }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && showtime) {
      fetchBookedSeats();
      setSelectedSeats([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, showtime]);

  const fetchBookedSeats = async () => {
    if (!showtime || !showtime._id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/payments/showtime/${showtime._id}/booked-seats`);
      setBookedSeats(response.data.bookedSeats || []);
    } catch (error) {
      setBookedSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (row, seat) => {
    const seatId = `${row}-${seat}`;
    
    if (bookedSeats.includes(seatId)) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatStatus = (row, seat) => {
    const seatId = `${row}-${seat}`;
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const calculateTotalPrice = () => {
    if (!showtime || !showtime.price) return '0.00';
    let total = 0;
    selectedSeats.forEach(seatId => {
      const row = seatId.split('-')[0];
      const rowData = SEAT_LAYOUT.find(r => r.row === row);
      if (rowData) {
        total += showtime.price * rowData.priceMultiplier;
      }
    });
    return total.toFixed(2);
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length !== requiredSeats) {
      alert(`Please select exactly ${requiredSeats} seat(s)`);
      return;
    }

    const bookingData = {
      showtimeId: showtime._id,
      seats: selectedSeats,
      totalAmount: parseFloat(calculateTotalPrice()),
      movieTitle: movieTitle,
      showtime: showtime
    };

    navigate('/payment', { state: { bookingData } });
    onClose();
  };

  const getCategoryPrice = (category) => {
    if (!showtime || !showtime.price) return '0.00';
    const rowData = SEAT_LAYOUT.find(r => r.category === category);
    if (rowData) {
      return (showtime.price * rowData.priceMultiplier).toFixed(2);
    }
    return showtime.price.toFixed(2);
  };

  if (!showtime) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        className: 'seat-modal-paper'
      }}
    >
      <DialogContent className="seat-modal-content">
        {loading ? (
          <Box className="seat-loading">
            <CircularProgress size={60} sx={{ color: '#ff9800' }} />
          </Box>
        ) : (
          <>
            {/* Header */}
            <Box className="seat-header">
              <Typography variant="h4" className="seat-title">
                Select Your Seats
              </Typography>
              <Typography variant="body1" className="seat-subtitle">
                {movieTitle} - {new Date(showtime?.startTime).toLocaleDateString()} at {new Date(showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>

            {/* Pricing Info */}
            <Box className="pricing-chips">
              <Chip 
                label={`SUPERIOR - LKR ${getCategoryPrice('SUPERIOR')}`}
                className="price-chip superior-chip"
              />
              <Chip 
                label={`PRIME - LKR ${getCategoryPrice('PRIME')}`}
                className="price-chip prime-chip"
              />
              <Chip 
                label={`CLASSIC - LKR ${getCategoryPrice('CLASSIC')}`}
                className="price-chip classic-chip"
              />
            </Box>

            {/* Screen */}
            <Box className="screen-container">
              <Box className="screen-text">
                🎬 All eyes this way please! 🎬
              </Box>
              <Box className="screen-label">
                SCREEN
              </Box>
            </Box>

            {/* Seat Layout */}
            <Box className="seats-container">
              {SEAT_LAYOUT.map((rowData, index) => (
                <Box key={rowData.row} className="seat-row-container">
                  {/* Category Header */}
                  {(index === 0 || SEAT_LAYOUT[index - 1].category !== rowData.category) && (
                    <Box className="category-header">
                      <Box className="category-line" />
                      <Typography className="category-label">
                        {rowData.category} - LKR {getCategoryPrice(rowData.category)}
                      </Typography>
                      <Box className="category-line" />
                    </Box>
                  )}
                  
                  {/* Seat Row */}
                  <Box className="seat-row">
                    <Typography className="row-label">
                      {rowData.row}
                    </Typography>
                    <Box className="seats-grid">
                      {rowData.seats.map((seat) => {
                        const status = getSeatStatus(rowData.row, seat);
                        return (
                          <Button
                            key={seat}
                            onClick={() => handleSeatClick(rowData.row, seat)}
                            disabled={status === 'booked'}
                            className={`seat-button ${status}`}
                          >
                            {seat}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Legend */}
            <Box className="legend-container">
              <Box className="legend-item">
                <Box className="legend-box available" />
                <Typography className="legend-text">Available</Typography>
              </Box>
              <Box className="legend-item">
                <Box className="legend-box selected" />
                <Typography className="legend-text">Selected</Typography>
              </Box>
              <Box className="legend-item">
                <Box className="legend-box booked" />
                <Typography className="legend-text">Booked</Typography>
              </Box>
            </Box>

            {/* Booking Summary */}
            <Box className="booking-summary">
              <Box className="summary-left">
                <Typography className="summary-label">
                  Selected Seats ({selectedSeats.length}/{requiredSeats}):
                </Typography>
                <Typography className="summary-value">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </Typography>
              </Box>
              <Box className="summary-right">
                <Typography className="summary-label">
                  Total Amount:
                </Typography>
                <Typography className="summary-price">
                  LKR {selectedSeats.length > 0 ? calculateTotalPrice() : '0.00'}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="action-buttons">
              <Button 
                variant="outlined" 
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                className="pay-btn"
                onClick={handleConfirmBooking}
                disabled={selectedSeats.length !== requiredSeats}
                startIcon={<EventSeat />}
              >
                {selectedSeats.length === requiredSeats ? 'Pay Now' : `Select ${requiredSeats - selectedSeats.length} More Seat(s)`}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SeatSelectionModal;
