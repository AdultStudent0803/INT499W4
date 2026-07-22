
import React, { useState, useEffect } from 'react';

function StreamList() {
  const [input, setInput] = useState('');

  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem('movies');
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (editId !== null) {
      setMovies(
        movies.map((movie) =>
          movie.id === editId
            ? { ...movie, title: input }
            : movie
        )
      );

      setEditId(null);
    } else {
      const newMovie = {
        id: Date.now(),
        title: input,
        completed: false
      };

      setMovies([...movies, newMovie]);
    }

    setInput('');
  };

  const handleEdit = (movie) => {
    setInput(movie.title);
    setEditId(movie.id);
  };

  const handleDelete = (id) => {
    setMovies(
      movies.filter((movie) => movie.id !== id)
    );
  };

  const handleComplete = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              completed: !movie.completed
            }
          : movie
      )
    );
  };

  return (
    <div className="page">
      <h1>Welcome to StreamList 🎥</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a movie or show..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? 'Update' : 'Add'}
        </button>
      </form>

      <h3>Movie List</h3>

      <ul className="movie-list">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className={
              movie.completed ? 'completed' : ''
            }
          >
            <span>{movie.title}</span>

            <div className="actions">
              <button
                type="button"
                onClick={() =>
                  handleComplete(movie.id)
                }
              >
                Complete
              </button>

              <button
                type="button"
                onClick={() =>
                  handleEdit(movie)
                }
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(movie.id)
                }
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
