import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  Email,
  Phone,
  EventSeat,
  Movie as MovieIcon,
  CalendarToday,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { bookingData } = location.state || {};
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      navigate('/movies');
    }
  }, [bookingData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.cardName) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!expiryRegex.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const paymentData = {
        ...bookingData,
        email: formData.email,
        phone: formData.phone,
        paymentDetails: {
          cardNumber: formData.cardNumber.slice(-4),
          cardName: formData.cardName
        }
      };
      
      const response = await api.post('/payments/process', paymentData);
      
      setPaymentSuccess(true);
      
      setTimeout(() => {
        alert(`Payment Successful!\n\nBooking ID: ${response.data.booking._id}\nSeats: ${bookingData.seats.join(', ')}\nTotal: LKR ${bookingData.totalAmount}\n\nConfirmation sent to ${formData.email}`);
        navigate('/movies');
      }, 1500);
      
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <Box className="payment-success">
        <Container maxWidth="sm">
          <Box className="success-content">
            <CheckCircle sx={{ fontSize: 100, color: '#4caf50', mb: 3 }} />
            <Typography variant="h4" className="success-title">
              Payment Successful!
            </Typography>
            <Typography className="success-message">
              Your seats have been booked successfully.
            </Typography>
            <CircularProgress sx={{ mt: 3, color: '#ff9800' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="payment-page">
      <Container maxWidth="lg">
        <Box className="payment-header">
          <Typography variant="h3" className="payment-title">
            Complete Your Payment
          </Typography>
          <Typography variant="body1" className="payment-subtitle">
            Secure checkout for your movie experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Booking Summary */}
          <Grid item xs={12} md={5}>
            <Box className="summary-card sticky-summary">
              <Typography variant="h5" className="summary-title">
                🎬 Booking Summary
              </Typography>
              
              <Box className="summary-items">
                <Box className="summary-item">
                  <Box className="item-icon">
                    <MovieIcon sx={{ color: '#ff9800' }} />
                  </Box>
                  <Box>
                    <Typography className="item-label">Movie</Typography>
                    <Typography className="item-value">
                      {bookingData.movieTitle}
                    </Typography>
                  </Box>
                </Box>

                <Box className="summary-item">
                  <Box className="item-icon">
                    <CalendarToday sx={{ color: '#ff9800' }} />
                  </Box>
                  <Box>
                    <Typography className="item-label">Date</Typography>
                    <Typography className="item-value">
                      {new Date(bookingData.showtime.startTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box className="summary-item">
                  <Box className="item-icon">
                    <AccessTime sx={{ color: '#ff9800' }} />
                  </Box>
                  <Box>
                    <Typography className="item-label">Time</Typography>
                    <Typography className="item-value">
                      {new Date(bookingData.showtime.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box className="summary-item">
                  <Box className="item-icon">
                    <EventSeat sx={{ color: '#ff9800' }} />
                  </Box>
                  <Box>
                    <Typography className="item-label">Seats</Typography>
                    <Typography className="item-value">
                      {bookingData.seats.join(', ')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="summary-total">
                <Typography className="total-label">Total Amount</Typography>
                <Typography className="total-amount">
                  LKR {bookingData.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Payment Form */}
          <Grid item xs={12} md={7}>
            <Box className="payment-form-card">
              <form onSubmit={handlePayment}>
                <Box className="form-section">
                  <Typography variant="h6" className="section-title">
                    📧 Contact Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        className="payment-input"
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: '#ff9800' }} />,
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        placeholder="0771234567"
                        className="payment-input"
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: '#ff9800' }} />,
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box className="form-section">
                  <Typography variant="h6" className="section-title">
                    💳 Payment Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        className="payment-input"
                        InputProps={{
                          startAdornment: <CreditCard sx={{ mr: 1, color: '#ff9800' }} />,
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        inputProps={{ maxLength: 19 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                        placeholder="John Doe"
                        className="payment-input"
                        InputProps={{
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        placeholder="MM/YY"
                        className="payment-input"
                        InputProps={{
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        inputProps={{ maxLength: 5 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        placeholder="123"
                        className="payment-input"
                        InputProps={{
                          style: { color: 'white' }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255, 255, 255, 0.6)' }
                        }}
                        inputProps={{ maxLength: 3 }}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  className="pay-now-btn"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay LKR ${bookingData.totalAmount.toFixed(2)}`
                  )}
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Payment;
