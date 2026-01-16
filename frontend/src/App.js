import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Support from './pages/Support';
import AdminPanel from './pages/AdminPanel';
import Payment from './pages/Payment';
import BookingHistory from './pages/BookingHistory';
import ContactUs from './pages/ContactUs';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <CssBaseline />
          <Box sx={{ background: '#000', minHeight: '100vh' }}>
            <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Box sx={{ mt: 4, px: 3 }}><Movies /></Box>} />
            <Route path="/movies/:id" element={<Box sx={{ mt: 4, px: 3 }}><MovieDetails /></Box>} />
            <Route path="/payment" element={<Box sx={{ mt: 4, px: 3 }}><Payment /></Box>} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Box sx={{ mt: 4, px: 3 }}><Login /></Box>} />
            <Route path="/register" element={<Box sx={{ mt: 4, px: 3 }}><Register /></Box>} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true} requireRole="user">
                  <Box sx={{ mt: 4, px: 3 }}><Profile /></Box>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking-history" 
              element={
                <ProtectedRoute requireAuth={true} requireRole="user">
                  <Box sx={{ mt: 4, px: 3 }}><BookingHistory /></Box>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support"
              element={
                <ProtectedRoute requireAuth={true} requireRole="user">
                  <Box sx={{ mt: 4, px: 3 }}><Support /></Box>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAuth={true} requireRole="admin">
                  <Box sx={{ mt: 4, px: 3 }}><AdminPanel /></Box>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </Box>
      </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
