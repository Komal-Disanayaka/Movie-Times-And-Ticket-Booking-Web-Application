import React, { useContext } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Person, Email, AdminPanelSettings, CheckCircle } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <Box className="profile-page">
      <Container maxWidth="lg">
        <Box className="profile-header">
          <Typography variant="h3" className="profile-title">
            My Profile
          </Typography>
          <Typography variant="body1" className="profile-subtitle">
            Manage your account information
          </Typography>
        </Box>

        <Box className="profile-content">
          <Box className="profile-avatar-section">
            <Box className="avatar-circle">
              <Person sx={{ fontSize: 80, color: '#ff9800' }} />
            </Box>
            <Typography variant="h5" className="user-name">
              {user?.name || 'Guest User'}
            </Typography>
            <Typography variant="body2" className="user-role">
              {user?.role === 'admin' ? 'Administrator' : 'Member'}
            </Typography>
          </Box>

          <Grid container spacing={3} className="info-grid">
            <Grid item xs={12} md={6}>
              <Box className="info-card">
                <Box className="info-icon-wrapper">
                  <Person sx={{ fontSize: 28, color: '#ff9800' }} />
                </Box>
                <Box>
                  <Typography className="info-label">Full Name</Typography>
                  <Typography className="info-value">
                    {user?.name || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="info-card">
                <Box className="info-icon-wrapper">
                  <Email sx={{ fontSize: 28, color: '#ff9800' }} />
                </Box>
                <Box>
                  <Typography className="info-label">Email Address</Typography>
                  <Typography className="info-value">
                    {user?.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="info-card">
                <Box className="info-icon-wrapper">
                  <AdminPanelSettings sx={{ fontSize: 28, color: '#ff9800' }} />
                </Box>
                <Box>
                  <Typography className="info-label">Account Role</Typography>
                  <Typography className="info-value" sx={{ textTransform: 'capitalize' }}>
                    {user?.role || 'User'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="info-card">
                <Box className="info-icon-wrapper">
                  <CheckCircle sx={{ fontSize: 28, color: '#4caf50' }} />
                </Box>
                <Box>
                  <Typography className="info-label">Account Status</Typography>
                  <Typography className="info-value" sx={{ color: '#4caf50' }}>
                    Active
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box className="profile-footer">
            <Typography variant="body2" className="footer-text">
              💡 To view your booking history, navigate to "Booking History" in the menu.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Profile;
