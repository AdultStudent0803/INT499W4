import React, { useEffect, useState } from 'react';
import list from '../data';

const SUBSCRIPTION_IDS = [1, 2, 3, 4];

function Cart() {
  const [cart, setCart] = useState([]);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const addToCart = (product) => {
    const isSubscription = SUBSCRIPTION_IDS.includes(product.id);

    if (isSubscription) {
      const existingSubscription = cart.find((item) =>
        SUBSCRIPTION_IDS.includes(item.id)
      );

      if (existingSubscription) {
        setWarning(
          'Only one subscription may be added to the cart at a time.'
        );

        setTimeout(() => {
          setWarning('');
        }, 3000);

        return;
      }

      const updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ];

      saveCart(updatedCart);
      return;
    }

    const existingAccessory = cart.find(
      (item) => item.id === product.id
    );

    if (existingAccessory) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      saveCart(updatedCart);
    } else {
      const updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ];

      saveCart(updatedCart);
    }
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="page">
      <h2>Cart Page 🛒</h2>

      {warning && (
        <div className="warning">
          {warning}
        </div>
      )}

      <h3>Products</h3>

      {list.map((product) => (
        <div key={product.id} className="tmdb-card">
          <img
			src={product.img}
            alt={product.service}
            className="product-image"
          />

          <h3>{product.service}</h3>

          <p>{product.serviceInfo}</p>

          <p>${product.price.toFixed(2)}</p>

          <button
            onClick={() => addToCart(product)}
          >
            Add To Cart
          </button>
        </div>
      ))}

      <h3>Current Cart</h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => {
            const isAccessory = item.id >= 5;

            return (
              <div
                key={item.id}
                className="cart-item"
              >
                <div>
                  <strong>{item.service}</strong>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <p>
                    Unit Price: $
                    {item.price.toFixed(2)}
                  </p>

                  <p>
                    Item Total: $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="cart-buttons">
                  {isAccessory && (
                    <>
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >
                        -
                      </button>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >
                        +
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
            );
          })}

          <div className="cart-summary">
            <h3>
              Total Items: {totalItems}
            </h3>

            <h3>
              Total Price: $
              {totalPrice.toFixed(2)}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;