import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, CircularProgress } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box className="movies-loading">
        <CircularProgress size={60} sx={{ color: '#ff9800' }} />
        <Typography sx={{ mt: 2, color: 'white' }}>
          Loading movies...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="movies-page">
      <Container maxWidth="xl">
        <Box className="movies-header">
          <MovieIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
          <Typography variant="h3" className="movies-title">
            Now Showing
          </Typography>
          <Typography variant="body1" className="movies-subtitle">
            Book your tickets for the latest blockbusters
          </Typography>
        </Box>

        {movies.length === 0 ? (
          <Box className="no-movies">
            <MovieIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />
            <Typography variant="h5" className="no-movies-title">
              No Movies Available
            </Typography>
            <Typography className="no-movies-text">
              Check back soon for new releases!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Movies;
