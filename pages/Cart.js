// FILE: src/pages/Cart.js

import React, { useEffect, useState } from 'react';
import data from '../data';

function Cart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  const [warning, setWarning] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  const addToCart = (product) => {
    setWarning('');

    const existingItem = cart.find(item => item.id === product.id);

    if (product.type === 'subscription') {
      const existingSubscription = cart.find(
        item => item.type === 'subscription'
      );

      if (existingSubscription) {
        setWarning('Only one subscription may be added to the cart.');
        return;
      }

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);

      return;
    }

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart
    .reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    .toFixed(2);

  return (
    <div className="page">
      <h2>Cart Page 🛒</h2>

      {warning && (
        <div className="warning">
          {warning}
        </div>
      )}

      <h3>Product Catalog</h3>

      <div className="product-container">
        {data.map(product => (
          <div
            key={product.id}
            className="product-card"
          >
            {product.img}

            <h4>{product.service}</h4>

            <p>{product.serviceInfo}</p>

            <p>
              <strong>
                ${product.price.toFixed(2)}
              </strong>
            </p>

            <button
              onClick={() =>
                addToCart(product)
              }
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h3>Current Cart</h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.id}
              className="cart-item"
            >
              <div>
                <strong>{item.service}</strong>
                <br />
                Qty: {item.quantity}
                <br />
                Unit: $
                {item.price.toFixed(2)}
                <br />
                Total: $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </div>

              <div className="cart-buttons">
                {item.type ===
                  'accessory' && (
                  <>
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      -
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h4>Cart Summary</h4>

            <p>
              Total Items: {totalItems}
            </p>

            <p>
              Total Price: $
              {totalPrice}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
