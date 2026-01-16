import React, { useState, useContext, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { Send, Message as MessageIcon, Support as SupportIcon, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Support.css';

function Support() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      loadUserMessages();
    }
  }, [user]);

  const loadUserMessages = async () => {
    try {
      const res = await api.get('/support/my-messages');
      setMessages(res.data);
    } catch (err) {
      // Silent fail
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/support', { name, email, message });
      alert('Support message sent successfully!');
      setMessage('');
      loadUserMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="support-page">
      <Container maxWidth="lg">
        <Box className="support-header">
          <SupportIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
          <Typography variant="h3" className="support-title">
            Contact Support
          </Typography>
          <Typography variant="body1" className="support-subtitle">
            We're here to help! Send us a message and we'll get back to you soon.
          </Typography>
        </Box>

        <Box className="support-form-section">
          <Box className="form-header">
            <MessageIcon sx={{ fontSize: 28, color: '#ff9800' }} />
            <Typography variant="h5" className="form-title">
              Send a New Message
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} className="support-form">
            <Box className="form-row">
              <TextField 
                fullWidth 
                label="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled
                className="form-input"
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255, 255, 255, 0.6)' }
                }}
              />
              <TextField 
                fullWidth 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled
                className="form-input"
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255, 255, 255, 0.6)' }
                }}
              />
            </Box>

            <TextField 
              fullWidth 
              label="Your Message" 
              multiline 
              rows={6} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              className="form-textarea"
              placeholder="Describe your issue or question in detail..."
              InputProps={{
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.6)' }
              }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              className="submit-btn"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Box>

        <Box className="messages-section">
          <Typography variant="h5" className="messages-title">
            Your Message History
          </Typography>
          
          {messages.length === 0 ? (
            <Box className="no-messages">
              <MessageIcon sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
              <Typography variant="body1" className="no-messages-text">
                You haven't sent any messages yet.
              </Typography>
            </Box>
          ) : (
            <Box className="messages-list">
              {messages.map((msg) => (
                <Box key={msg._id} className="message-card">
                  <Box className="message-header">
                    <Typography className="message-date">
                      📅 {new Date(msg.createdAt).toLocaleString()}
                    </Typography>
                    <Box className={`status-badge ${msg.adminReply ? 'replied' : 'pending'}`}>
                      {msg.adminReply ? (
                        <>
                          <CheckCircle sx={{ fontSize: 16 }} />
                          Replied
                        </>
                      ) : (
                        <>
                          <HourglassEmpty sx={{ fontSize: 16 }} />
                          Pending
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box className="message-content">
                    <Typography className="message-label">Your Message:</Typography>
                    <Typography className="message-text">
                      {msg.message}
                    </Typography>
                  </Box>
                  
                  {msg.adminReply && (
                    <Box className="admin-reply">
                      <Typography className="reply-label">
                        🎬 Admin Reply:
                      </Typography>
                      <Typography className="reply-text">
                        {msg.adminReply}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Support;
