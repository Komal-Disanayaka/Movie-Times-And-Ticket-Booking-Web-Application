import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Login() {
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
    
    login({ email, password })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        return import('../services/auth').then((m) => m.getProfile());
      })
      .then((res) => {
        setUser(res.data);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
              Welcome Back
            </Typography>
            <Typography variant="body1" className="auth-subtitle">
              Sign in to continue to Movie Nest
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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box className="auth-divider">
              <span>or</span>
            </Box>

            <Box className="auth-footer">
              <Typography variant="body2" className="auth-footer-text">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" className="auth-link">
                  Create Account
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="auth-info">
          <Typography variant="h5" className="info-title">
            Experience Cinema Like Never Before
          </Typography>
          <Typography variant="body1" className="info-text">
            • Book tickets instantly<br/>
            • Choose your perfect seats<br/>
            • Exclusive member benefits<br/>
            • Dolby Atmos & 4K experiences
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
