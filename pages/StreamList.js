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

  const handleDelete = (id) => {
    setMovies(
      movies.filter((movie) => movie.id !== id)
    );
  };

  const handleEdit = (movie) => {
    setInput(movie.title);
    setEditId(movie.id);
  };

  const handleComplete = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, completed: !movie.completed }
          : movie
      )
    );
  };

  const completedCount = movies.filter(
    (movie) => movie.completed
  ).length;

  return (
    <div className="page">
      <h1>Welcome to StreamList 🎬</h1>

      <p>Keep track of your favorite movies and shows.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a movie or show..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      <div className="stats">
        <p>Total Titles: {movies.length}</p>
        <p>Completed: {completedCount}</p>
      </div>

      <h3>To Watch</h3>

      {movies.length === 0 ? (
        <p>No titles added yet.</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className={movie.completed ? 'completed' : ''}
            >
              <span>{movie.title}</span>

              <div className="actions">
                <button
                  type="button"
                  onClick={() => handleComplete(movie.id)}
                >
                  <span className="material-symbols-outlined">
                    task_alt
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(movie)}
                >
                  <span className="material-symbols-outlined">
                    edit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(movie.id)}
                >
                  <span className="material-symbols-outlined">
                    delete
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StreamList;