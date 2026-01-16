import React from 'react';
import './ChatButton.css';

const ChatButton = ({ onClick, hasNewMessage }) => {
  return (
    <button className="floating-chat-btn" onClick={onClick}>
      {hasNewMessage && <span className="notification-badge"></span>}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"/>
      </svg>
      <span className="chat-btn-text">Live Chat</span>
    </button>
  );
};

export default ChatButton;
