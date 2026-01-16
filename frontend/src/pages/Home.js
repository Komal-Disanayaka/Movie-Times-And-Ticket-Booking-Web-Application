import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import './Home.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/movies').then((res) => setMovies(res.data)).catch(() => {});
  }, []);

  // Auto-slide for hero section
  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % Math.min(movies.length, 5));
          setIsTransitioning(false);
        }, 500);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentSlide];

  return (
    <Box className="home-container">
      {/* Hero Section */}
      {currentMovie && (
        <Box className="hero-section">
          <Box 
            className={`hero-background ${isTransitioning ? 'transitioning' : ''}`}
            sx={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.3) 70%), url(${currentMovie.poster || 'https://via.placeholder.com/1920x1080'})`,
            }}
          />
          
          <Container className="hero-content">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box className={`hero-poster ${isTransitioning ? 'transitioning' : ''}`}>
                  <img 
                    src={currentMovie.poster || 'https://via.placeholder.com/400x600'} 
                    alt={currentMovie.title}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Box className={`hero-info ${isTransitioning ? 'transitioning' : ''}`}>
                  <Typography variant="h2" className="hero-title">
                    {currentMovie.title}
                  </Typography>
                  
                  <Typography variant="body1" className="hero-description">
                    {currentMovie.description || 'Experience the magic of cinema with this incredible film. A journey that will captivate your heart and mind.'}
                  </Typography>
                  
                  <Box className="hero-meta">
                    {currentMovie.genre && (
                      <Chip label={currentMovie.genre} className="meta-chip" />
                    )}
                    {currentMovie.language && (
                      <Chip label={currentMovie.language} className="meta-chip" />
                    )}
                    {currentMovie.duration && (
                      <Chip label={currentMovie.duration} className="meta-chip" />
                    )}
                  </Box>
                  
                  <Box className="cinema-info">
                    <Typography variant="body2" className="cinema-text">
                      Now showing at Movie Nest
                    </Typography>
                    <Typography variant="body2" className="cinema-tech">
                      Dolby Atmos • 4K Digital Projection
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    className="buy-tickets-btn"
                    onClick={() => navigate(`/movies/${currentMovie._id}`)}
                  >
                    Buy Tickets
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
          
          {/* Slide Indicators */}
          <Box className="slide-indicators">
            {featuredMovies.map((_, index) => (
              <Box
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Now Showing Section */}
      <Box className="now-showing-section">
        <Container>
          <Box className="section-header">
            <Typography variant="h4" className="section-title">
              Now Showing
            </Typography>
            <Button 
              className="view-all-btn"
              onClick={() => navigate('/movies')}
            >
              View all
            </Button>
          </Box>
          
          <Grid container spacing={3} className="movie-grid">
            {movies.slice(0, 8).map((movie) => (
              <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
