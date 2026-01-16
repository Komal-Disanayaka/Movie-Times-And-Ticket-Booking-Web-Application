import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Paper, MenuItem, Snackbar, Alert } from '@mui/material';
import { Phone, Email, LocationOn, Send } from '@mui/icons-material';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [open, setOpen] = useState(false);

  const subjects = [
    'General Inquiry',
    'Movie Distribution',
    'Advertising & Partnerships',
    'Technical Support',
    'Feedback',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here to send contact form
    console.log('Form submitted:', formData);
    setOpen(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: ''
    });
  };

  return (
    <Box className="contact-us-page">
      <Box className="contact-hero">
        <Container maxWidth="lg">
          <Typography variant="h2" className="contact-hero-title">
            Get in Touch
          </Typography>
          <Typography variant="h6" className="contact-hero-subtitle">
            Whether you are a movie distributor, an aspiring producer or looking to advertise your brand at our cinemas, or simply feedback on your experience, we would love to hear from you.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" className="contact-content">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper className="contact-info-card">
              <Box className="contact-icon-wrapper">
                <Phone className="contact-icon" />
              </Box>
              <Typography variant="h6" className="contact-info-title">
                Phone
              </Typography>
              <Typography className="contact-info-text">
                +94 11 234 5678
              </Typography>
              <Typography className="contact-info-text">
                +94 77 123 4567
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="contact-info-card">
              <Box className="contact-icon-wrapper">
                <Email className="contact-icon" />
              </Box>
              <Typography variant="h6" className="contact-info-title">
                Email
              </Typography>
              <Typography className="contact-info-text">
                info@kccmultiplex.com
              </Typography>
              <Typography className="contact-info-text">
                support@kccmultiplex.com
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="contact-info-card">
              <Box className="contact-icon-wrapper">
                <LocationOn className="contact-icon" />
              </Box>
              <Typography variant="h6" className="contact-info-title">
                Location
              </Typography>
              <Typography className="contact-info-text">
                123 Cinema Boulevard
              </Typography>
              <Typography className="contact-info-text">
                Colombo 03, Sri Lanka
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper className="contact-form-wrapper">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography className="form-label">Name</Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="Enter your name"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography className="form-label">Select your subject</Typography>
                <TextField
                  select
                  fullWidth
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="contact-input"
                >
                  {subjects.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography className="form-label">Email</Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="Enter your email"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography className="form-label">Phone number</Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="Enter your phone number"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography className="form-label">Type your message here</Typography>
                <TextField
                  fullWidth
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={6}
                  className="contact-input contact-textarea"
                  placeholder="Write your message..."
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  className="submit-btn"
                  endIcon={<Send />}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Thank you for contacting us! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactUs;
