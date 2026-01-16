import React, { createContext, useState, useContext } from 'react';
import LiveChat from '../components/LiveChat';
import ChatButton from '../components/ChatButton';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { user } = useAuth();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasNewMessage(false);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    setHasNewMessage(false);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat, openChat, closeChat, setHasNewMessage }}>
      {children}
      {user && (
        <>
          <ChatButton onClick={toggleChat} hasNewMessage={hasNewMessage} />
          <LiveChat isOpen={isChatOpen} onClose={closeChat} user={user} />
        </>
      )}
    </ChatContext.Provider>
  );
};
