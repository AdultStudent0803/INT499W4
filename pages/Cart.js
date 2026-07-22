import React, { useEffect, useState } from 'react';
import data from '../data';

function Cart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  const [warning, setWarning] = useState('');

  const isSubscription = (item) => item.id >= 1 && item.id <= 4;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  const addToCart = (product) => {
    setWarning('');

    if (isSubscription(product)) {
      const hasSubscription = cart.some((item) =>
        isSubscription(item)
      );

      if (hasSubscription) {
        setWarning(
          'Only one subscription may be added to the cart.'
        );
        return;
      }
    }

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart
    .reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    )
    .toFixed(2);

  const hasSubscription = cart.some((item) =>
    isSubscription(item)
  );

  return (
    <div className="page">
      <h2>Cart Page 🛒</h2>

      {warning && (
        <div className="warning">
          {warning}
        </div>
      )}

      <h3>Available Products</h3>

      <div className="product-container">
        {data.map((product) => {
          const disableSubscription =
            isSubscription(product) &&
            hasSubscription &&
            !cart.find(
              (item) => item.id === product.id
            );

          return (
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
                disabled={disableSubscription}
                onClick={() =>
                  addToCart(product)
                }
              >
                {disableSubscription
                  ? 'Subscription Selected'
                  : 'Add To Cart'}
              </button>
            </div>
          );
        })}
      </div>

      <h3>Your Cart</h3>

      {cart.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          {cart.map((item) => (
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
                {!isSubscription(item) && (
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
            <h3>Cart Summary</h3>

            <p>
              Total Items: {totalItems}
            </p>

            <p>
              Total Price: ${totalPrice}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
