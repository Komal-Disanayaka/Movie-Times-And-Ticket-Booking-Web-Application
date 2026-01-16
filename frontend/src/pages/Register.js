import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { register } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    register({ name, email, password })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        return import('../services/auth').then((m) => m.getProfile());
      })
      .then((res) => {
        setUser(res.data);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
        setLoading(false);
      });
  };

  return (
    <Box className="auth-container">
      <Box className="auth-background" />
      
      <Box className="auth-content">
        <Box className="auth-card">
          <Box className="auth-header">
            <Typography variant="h3" className="auth-title">
              Join Movie Nest
            </Typography>
            <Typography variant="body1" className="auth-subtitle">
              Create your account and start booking tickets
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="auth-alert">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="visibility-icon"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box className="auth-divider">
              <span>or</span>
            </Box>

            <Box className="auth-footer">
              <Typography variant="body2" className="auth-footer-text">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" className="auth-link">
                  Sign In
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="auth-info">
          <Typography variant="h5" className="info-title">
            Unlock Premium Features
          </Typography>
          <Typography variant="body1" className="info-text">
            • Priority seat selection<br/>
            • Early access to new releases<br/>
            • Special discounts & offers<br/>
            • Personalized recommendations
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
