import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Link as MuiLink } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <Box className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4} className="footer-content">
          <Grid item xs={12} md={3}>
            <Typography variant="h5" className="footer-title">
              MOVIE NEST
            </Typography>
            <Box className="footer-links">
              <MuiLink component={Link} to="/movies" className="footer-link">
                Buy tickets
              </MuiLink>
              <MuiLink component={Link} to="/movies" className="footer-link">
                Movies
              </MuiLink>
              <MuiLink component={Link} to="/movies" className="footer-link">
                Cinemas
              </MuiLink>
              <MuiLink component={Link} to="/contact" className="footer-link">
                Contact us
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="footer-section-title">
              General
            </Typography>
            <Box className="footer-links">
              <MuiLink href="#" className="footer-link footer-link-orange">
                Colombo City Centre
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="footer-social">
              <IconButton className="social-icon" href="https://facebook.com" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton className="social-icon" href="https://instagram.com" target="_blank">
                <Instagram />
              </IconButton>
            </Box>

            <Typography variant="h6" className="newsletter-title">
              Newsletter
            </Typography>
            <Typography className="newsletter-text">
              Join our mailing list for promotions and latest movie updates.
            </Typography>
            
            <Box component="form" onSubmit={handleSubscribe} className="newsletter-form">
              <TextField
                placeholder="Type your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                type="email"
                required
              />
              <Button type="submit" className="subscribe-btn">
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box className="footer-bottom">
          <Box className="footer-bottom-links">
            <MuiLink href="#" className="footer-bottom-link">
              Privacy policy
            </MuiLink>
            <MuiLink href="#" className="footer-bottom-link">
              Terms and conditions
            </MuiLink>
          </Box>
          <Typography className="footer-copyright">
            © 2025 Komal Dissanayaka. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
