//File: TMDB-services.js

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export async function getTrendingMovies() {
  if (!API_KEY) {
    throw new Error('TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your environment.');
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('TMDB request failed.');
  }

  const data = await response.json();

  return data.results;
}