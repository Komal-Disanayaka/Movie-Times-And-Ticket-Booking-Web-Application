import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="movie-card"
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      <Box className="movie-card-image-container">
        <CardMedia 
          component="img" 
          image={movie.poster || 'https://via.placeholder.com/300x450?text=Movie'} 
          alt={movie.title}
          className="movie-card-image"
        />
        <Box className="movie-card-overlay">
          <Button 
            variant="contained" 
            className="overlay-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie._id}`);
            }}
          >
            Buy tickets
          </Button>
          <Button 
            variant="outlined" 
            className="overlay-btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie._id}`);
            }}
          >
            Watch trailer
          </Button>
        </Box>
      </Box>
      
      <CardContent className="movie-card-content">
        <Typography variant="h6" className="movie-card-title">
          {movie.title}
        </Typography>
        
        <Box className="movie-card-meta">
          <Typography variant="body2" className="movie-card-year">
            {movie.releaseYear || '2025'}
          </Typography>
          <Typography variant="body2" className="movie-card-rating">
            {movie.rating || 'NR'}
          </Typography>
          <Typography variant="body2" className="movie-card-duration">
            {movie.duration || '2h 0m'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default MovieCard;