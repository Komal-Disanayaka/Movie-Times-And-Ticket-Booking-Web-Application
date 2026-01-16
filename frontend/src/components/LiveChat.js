import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import socketService from '../services/socket';
import axios from 'axios';

const LiveChat = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      initializeChat();
    }

    return () => {
      if (socketService.getSocket()) {
        socketService.off('newMessage');
        socketService.off('userTyping');
        socketService.off('onlineUsers');
      }
    };
  }, [isOpen, user]);

  const initializeChat = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Connect socket
      socketService.connect(token);
      setIsConnected(true);

      // Load recent messages
      const response = await axios.get('http://localhost:5000/api/chat/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('📥 Loaded messages from DB:', response.data);
      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }

      // Listen for new messages
      socketService.on('newMessage', (message) => {
        console.log('📨 New message received:', message);
        console.log('Message text:', message.message);
        console.log('Message username:', message.username);
        setMessages(prev => {
          const updated = [...prev, message];
          console.log('📋 Updated messages array:', updated);
          return updated;
        });
      });

      // Listen for typing indicator
      socketService.on('userTyping', (data) => {
        if (data.isTyping) {
          setTypingUser(data.username);
          setIsTyping(true);
        } else {
          setIsTyping(false);
          setTypingUser('');
        }
      });

      // Listen for online users count
      socketService.on('onlineUsers', (count) => {
        setOnlineCount(count);
      });

    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() && isConnected) {
      socketService.emit('sendMessage', {
        message: inputMessage.trim(),
        avatar: user?.name?.charAt(0).toUpperCase() || 'U'
      });
      
      setInputMessage('');
      
      // Stop typing indicator
      socketService.emit('typing', { isTyping: false });
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Typing indicator
    socketService.emit('typing', { isTyping: true });
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('typing', { isTyping: false });
    }, 1000);
  };

  const getAvatarColor = (username) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="live-chat-container">
      <div className="live-chat-window">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span className="live-text">LIVE CHAT</span>
            </div>
            <span className="online-count">{onlineCount} online</span>
          </div>
          <button className="close-chat-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>Welcome to the live chat!</p>
              <p>Start the conversation 👋</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              console.log(`Rendering message ${index}:`, msg);
              return (
                <div key={msg._id || index} className="chat-message">
                  <div 
                    className="message-avatar"
                    style={{ backgroundColor: getAvatarColor(msg.username) }}
                  >
                    {msg.avatar || msg.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-username">{msg.username}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                </div>
              );
            })
          )}
          
          {isTyping && (
            <div className="typing-indicator">
              <span>{typingUser} is typing</span>
              <span className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Say something..."
              value={inputMessage}
              onChange={handleInputChange}
              className="chat-input"
              maxLength={500}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputMessage.trim() || !isConnected}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
