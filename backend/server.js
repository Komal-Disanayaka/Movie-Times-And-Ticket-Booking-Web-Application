const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { saveMessage } = require('./controllers/chatController');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/support', require('./routes/support'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => res.send({ message: 'Movie Time & Ticket Booking API' }));

// Socket.io middleware for authentication
const User = require('./models/User');

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('No token provided');
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('Decoded token:', decoded);
    socket.userId = decoded.id;
    
    // Fetch user name from database
    const user = await User.findById(decoded.id).select('name');
    socket.username = user ? user.name : 'Anonymous';
    console.log('User connected:', socket.username);
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.username} (${socket.id})`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, {
    socketId: socket.id,
    username: socket.username,
    userId: socket.userId
  });
  
  // Broadcast online users count
  io.emit('onlineUsers', onlineUsers.size);
  
  // Handle new message
  socket.on('sendMessage', async (data) => {
    try {
      console.log('Received message from', socket.username, '(ID:', socket.userId, '):', data.message);
      
      if (!data.message || !data.message.trim()) {
        console.log('Empty message rejected');
        return;
      }
      
      const messageData = {
        user: socket.userId,
        username: socket.username,
        message: data.message.trim(),
        avatar: data.avatar || socket.username.charAt(0).toUpperCase(),
        timestamp: new Date()
      };
      
      // Save to database
      const savedMessage = await saveMessage(messageData);
      console.log('Message saved to DB:', savedMessage._id);
      
      // Broadcast to all connected clients
      const broadcastData = {
        _id: savedMessage._id,
        username: messageData.username,
        message: messageData.message,
        avatar: messageData.avatar,
        timestamp: savedMessage.timestamp,
        userId: socket.userId
      };
      console.log('Broadcasting message to all clients:', broadcastData);
      io.emit('newMessage', broadcastData);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle user typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', {
      username: socket.username,
      isTyping: data.isTyping
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username} (${socket.id})`);
    onlineUsers.delete(socket.userId);
    io.emit('onlineUsers', onlineUsers.size);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
