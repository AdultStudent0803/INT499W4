// FILE: src/components/NavBar.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const updateCount = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cartUpdated', updateCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  return (
    <div className="navbar">
      <h2>🎥 StreamList</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/tmdb">TMDB</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
}

export default NavBar;
