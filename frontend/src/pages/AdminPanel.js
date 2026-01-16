import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import {
  Dashboard,
  People,
  Movie,
  Schedule,
  Support,
  BookOnline,
  Assessment,
  Menu as MenuIcon,
  ChevronLeft,
  Logout,
  Settings,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminPanel.css';

const drawerWidth = 280;

function AdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [showtimeOpen, setShowtimeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});
  const [currentShowtime, setCurrentShowtime] = useState({});
  const [currentMessage, setCurrentMessage] = useState({});
  const [adminReply, setAdminReply] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
    api.get('/movies').then((res) => setMovies(res.data)).catch(() => {});
    api.get('/showtimes').then((res) => setShowtimes(res.data)).catch(() => {});
    api.get('/support').then((res) => setMessages(res.data)).catch(() => {});
    api.get('/payments/bookings').then((res) => setBookings(res.data)).catch(() => {});
  };

  const handleAddMovie = () => {
    setCurrentMovie({});
    setOpen(true);
  };

  const handleSaveMovie = () => {
    if (currentMovie._id) {
      api.put(`/movies/${currentMovie._id}`, currentMovie).then((res) => {
        setMovies(movies.map((m) => (m._id === res.data._id ? res.data : m)));
      });
    } else {
      api.post('/movies', currentMovie).then((res) => setMovies([...movies, res.data]));
    }
    setOpen(false);
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      api.delete(`/movies/${id}`).then(() => setMovies(movies.filter((m) => m._id !== id)));
    }
  };

  const handleAddShowtime = () => {
    setCurrentShowtime({});
    setShowtimeOpen(true);
  };

  const handleSaveShowtime = () => {
    if (currentShowtime._id) {
      api.put(`/showtimes/${currentShowtime._id}`, currentShowtime).then(() => {
        loadData();
      });
    } else {
      api.post('/showtimes', currentShowtime).then(() => {
        loadData();
      });
    }
    setShowtimeOpen(false);
  };

  const handleDeleteShowtime = (id) => {
    if (window.confirm('Are you sure you want to delete this showtime?')) {
      api.delete(`/showtimes/${id}`).then(() => loadData());
    }
  };

  const handleReplyMessage = (msg) => {
    setCurrentMessage(msg);
    setAdminReply(msg.adminReply || '');
    setReplyOpen(true);
  };

  const handleSendReply = () => {
    api.put(`/support/${currentMessage._id}/reply`, { adminReply }).then((res) => {
      setMessages(messages.map((m) => (m._id === res.data._id ? res.data : m)));
      setReplyOpen(false);
    });
  };

  const menuItems = [
    { icon: <Dashboard />, label: 'Dashboard', value: 0 },
    { icon: <People />, label: 'Users', value: 1 },
    { icon: <Movie />, label: 'Movies', value: 2 },
    { icon: <Schedule />, label: 'Showtimes', value: 3 },
    { icon: <Support />, label: 'Support', value: 4 },
    { icon: <BookOnline />, label: 'Bookings', value: 5 },
    { icon: <Assessment />, label: 'Reports', value: 6 },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <Box className="admin-access-denied">
        <Typography variant="h4" className="access-denied-text">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="admin-panel">
      <Drawer
        variant="permanent"
        className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        sx={{
          width: sidebarOpen ? drawerWidth : 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : 70,
            boxSizing: 'border-box',
            background: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 152, 0, 0.2)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Box className="sidebar-header">
          <Box className="logo-section">
            {sidebarOpen && (
              <Typography variant="h6" className="admin-logo">
                🎬 ADMIN
              </Typography>
            )}
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
              {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 152, 0, 0.2)' }} />

        <List className="menu-list">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`menu-item ${tab === item.value ? 'active' : ''}`}
            >
              <ListItemIcon className="menu-icon">
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText 
                  primary={item.label} 
                  className="menu-text"
                />
              )}
            </ListItem>
          ))}
        </List>

        <Box className="sidebar-footer">
          <Divider sx={{ borderColor: 'rgba(255, 152, 0, 0.2)', mb: 2 }} />
          
          <ListItem button className="menu-item">
            <ListItemIcon className="menu-icon">
              <Settings />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Settings" className="menu-text" />}
          </ListItem>

          <ListItem button className="menu-item logout" onClick={logout}>
            <ListItemIcon className="menu-icon">
              <Logout />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Logout" className="menu-text" />}
          </ListItem>
        </Box>
      </Drawer>

      <Box className="admin-content" sx={{ marginLeft: sidebarOpen ? `${drawerWidth}px` : '70px' }}>
        {tab === 0 && (
          <Box className="content-section">
            <Typography variant="h4" className="section-title">
              Dashboard Overview
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-card">
                  <People sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="stat-number">{users.length}</Typography>
                  <Typography className="stat-label">Total Users</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-card">
                  <Movie sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="stat-number">{movies.length}</Typography>
                  <Typography className="stat-label">Total Movies</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-card">
                  <Schedule sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="stat-number">{showtimes.length}</Typography>
                  <Typography className="stat-label">Showtimes</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-card">
                  <BookOnline sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="stat-number">{bookings.length}</Typography>
                  <Typography className="stat-label">Total Bookings</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {tab === 1 && (
          <Box className="content-section">
            <Box className="section-header">
              <Typography variant="h4" className="section-title">
                User Management
              </Typography>
            </Box>
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Created At</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip label={u.role} color={u.role === 'admin' ? 'error' : 'primary'} size="small" />
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {tab === 2 && (
          <Box className="content-section">
            <Box className="section-header">
              <Typography variant="h4" className="section-title">
                Movie Management
              </Typography>
              <Button 
                variant="contained" 
                className="add-btn"
                startIcon={<AddIcon />}
                onClick={handleAddMovie}
              >
                Add Movie
              </Button>
            </Box>
            <Stack spacing={3} mt={3}>
              {movies.map((m) => (
                <Paper key={m._id} className="movie-card">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      {m.poster && <img src={m.poster} alt={m.title} className="movie-poster" />}
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" className="movie-title">{m.title}</Typography>
                      <Typography className="movie-description">{m.description}</Typography>
                      <Typography variant="body2" className="movie-duration">
                        ⏱️ Duration: {m.duration} mins
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Stack spacing={1}>
                        <Button
                          variant="outlined"
                          className="edit-btn"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setCurrentMovie(m);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          className="delete-btn"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteMovie(m._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
        
        {tab === 3 && (
          <Box className="content-section">
            <Box className="section-header">
              <Typography variant="h4" className="section-title">
                Showtime Management
              </Typography>
              <Button 
                variant="contained" 
                className="add-btn"
                startIcon={<AddIcon />}
                onClick={handleAddShowtime}
              >
                Add Showtime
              </Button>
            </Box>
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Movie</strong></TableCell>
                    <TableCell><strong>Start Time</strong></TableCell>
                    <TableCell><strong>Price</strong></TableCell>
                    <TableCell><strong>Available Seats</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showtimes.map((st) => (
                    <TableRow key={st._id}>
                      <TableCell>{st.movie?.title || 'N/A'}</TableCell>
                      <TableCell>{new Date(st.startTime).toLocaleString()}</TableCell>
                      <TableCell>LKR {st.price}</TableCell>
                      <TableCell>{st.availableSeats} / {st.totalSeats}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          className="action-btn edit"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setCurrentShowtime(st);
                            setShowtimeOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          className="action-btn delete"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteShowtime(st._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {tab === 4 && (
          <Box className="content-section">
            <Typography variant="h4" className="section-title">
              Support Messages
            </Typography>
            <Stack spacing={3} mt={3}>
              {messages.map((msg) => (
                <Paper key={msg._id} className="support-card">
                  <Typography variant="subtitle1" className="support-user">
                    <strong>{msg.name || msg.user?.name}</strong> ({msg.email})
                  </Typography>
                  <Typography className="support-message">{msg.message}</Typography>
                  {msg.adminReply && (
                    <Paper className="admin-reply-box">
                      <Typography className="admin-reply-text">
                        <strong>Admin Reply:</strong> {msg.adminReply}
                      </Typography>
                    </Paper>
                  )}
                  <Button 
                    variant="contained" 
                    size="small" 
                    className="reply-btn"
                    onClick={() => handleReplyMessage(msg)}
                  >
                    {msg.adminReply ? 'Edit Reply' : 'Reply'}
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
        
        {tab === 5 && (
          <Box className="content-section">
            <Typography variant="h4" className="section-title">
              All Bookings
            </Typography>
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Booking ID</strong></TableCell>
                    <TableCell><strong>Movie</strong></TableCell>
                    <TableCell><strong>Date & Time</strong></TableCell>
                    <TableCell><strong>Seats</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>User Type</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking._id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>{booking.movie?.title || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(booking.showtime?.startTime).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{booking.seats.join(', ')}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.phone}</TableCell>
                      <TableCell>LKR {booking.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={booking.isGuestBooking ? 'Guest' : 'Registered'} 
                          color={booking.isGuestBooking ? 'default' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={booking.status} 
                          color={booking.status === 'confirmed' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {bookings.length === 0 && (
              <Typography className="no-data-text">No bookings found</Typography>
            )}
          </Box>
        )}
        
        {tab === 6 && (
          <Box className="content-section">
            <Typography variant="h4" className="section-title">
              Reports & Statistics
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="report-card">
                  <People sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="report-number">{users.length}</Typography>
                  <Typography className="report-label">Total Users</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="report-card">
                  <Movie sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="report-number">{movies.length}</Typography>
                  <Typography className="report-label">Total Movies</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="report-card">
                  <Schedule sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="report-number">{showtimes.length}</Typography>
                  <Typography className="report-label">Showtimes</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="report-card">
                  <BookOnline sx={{ fontSize: 50, color: '#ff9800' }} />
                  <Typography variant="h3" className="report-number">{bookings.length}</Typography>
                  <Typography className="report-label">Bookings</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className="activity-table">
                  <Typography variant="h6" className="activity-title">Recent User Activities</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>User</strong></TableCell>
                          <TableCell><strong>Email</strong></TableCell>
                          <TableCell><strong>Joined</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.filter(u => u.role !== 'admin').slice(0, 10).map((u) => (
                          <TableRow key={u._id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Movie Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={currentMovie.title || ''} onChange={(e) => setCurrentMovie({ ...currentMovie, title: e.target.value })} margin="normal" />
          <TextField fullWidth label="Description" multiline rows={3} value={currentMovie.description || ''} onChange={(e) => setCurrentMovie({ ...currentMovie, description: e.target.value })} margin="normal" />
          <TextField fullWidth label="Duration (mins)" type="number" value={currentMovie.duration || ''} onChange={(e) => setCurrentMovie({ ...currentMovie, duration: e.target.value })} margin="normal" />
          <TextField fullWidth label="Language" value={currentMovie.language || ''} onChange={(e) => setCurrentMovie({ ...currentMovie, language: e.target.value })} margin="normal" />
          <TextField fullWidth label="Poster URL" value={currentMovie.poster || ''} onChange={(e) => setCurrentMovie({ ...currentMovie, poster: e.target.value })} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMovie} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showtimeOpen} onClose={() => setShowtimeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Showtime Form</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Movie"
            value={currentShowtime.movie || ''}
            onChange={(e) => setCurrentShowtime({ ...currentShowtime, movie: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={currentShowtime.startTime ? new Date(currentShowtime.startTime).toISOString().slice(0, 16) : ''}
            onChange={(e) => setCurrentShowtime({ ...currentShowtime, startTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={currentShowtime.price || ''}
            onChange={(e) => setCurrentShowtime({ ...currentShowtime, price: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Total Seats"
            type="number"
            value={currentShowtime.totalSeats || ''}
            onChange={(e) => setCurrentShowtime({ ...currentShowtime, totalSeats: e.target.value, availableSeats: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowtimeOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveShowtime} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to Support Message</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle2">User Message:</Typography>
            <Typography>{currentMessage.message}</Typography>
          </Paper>
          <TextField
            fullWidth
            label="Admin Reply"
            multiline
            rows={4}
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyOpen(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained">Send Reply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;
