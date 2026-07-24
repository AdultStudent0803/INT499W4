//File: TMDB-pages.js

import React, { useEffect, useState } from 'react';
import { getTrendingMovies } from '../services/TMDB-services';

function TMDB() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      const results = await getTrendingMovies();
      setMovies(results);
    } catch (err) {
      setError('Unable to retrieve movie data.');
    } finally {
      setLoading(false);
    }
  }

  function addToWatchList(movie) {
    let savedMovies = [];
    try {
      const stored = localStorage.getItem('movies');
      if (stored) {
        savedMovies = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse movies from localStorage:', e);
      savedMovies = [];
    }

    const exists = savedMovies.some(
      (savedMovie) =>
        savedMovie.title.toLowerCase() ===
        movie.title.toLowerCase()
    );

    if (exists) {
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: movie.title,
      completed: false
    };

    localStorage.setItem(
      'movies',
      JSON.stringify([...savedMovies, newMovie])
    );
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Loading Movies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>TMDB Trending Movies 🎬</h2>

      {movies.map((movie) => (
        <div
          key={movie.id}
          className="tmdb-card"
        >
          <h3>{movie.title}</h3>

          <p>
            <strong>Release Date:</strong>{' '}
            {movie.release_date}
          </p>

          <p>
            <strong>Rating:</strong>{' '}
            {movie.vote_average}
          </p>

          <p>
            <strong>Overview:</strong>{' '}
            {movie.overview}
          </p>

          <button
            onClick={() => addToWatchList(movie)}
          >
            Add to Watch List
          </button>
        </div>
      ))}
    </div>
  );
}

export default TMDB;