import React from "react";
import "./styles/MainPage.css";

const Cart = ({ cartOpen, cartItems, setCartOpen, updateCartQuantity, removeFromCart }) => {
  const handleCartOutsideClick = (event) => {
    if (event.target.classList.contains("cart-overlay")) {
      setCartOpen(false);
    }
  };
  
  return (
    <>
      {cartOpen && (
        <div className="cart-overlay" onClick={handleCartOutsideClick}>
          <div className="cart-sidebar">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <img className="cart-item-icon" src={item.image_url} alt={item.crop_variety} />
                    <span>{item.crop_variety} </span>
                    <span> ({item.seller_name})</span>
                    <div className="quantity-controls">
                      <button onClick={() => updateCartQuantity(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(index, 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <button className="checkout-btn">Proceed to Buy</button>
            <button className="cancel-btn" onClick={() => setCartOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart; 
