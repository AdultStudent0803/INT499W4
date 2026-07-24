
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <h2>🎥 StreamList</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/tmdb">TMDB</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default NavBar;