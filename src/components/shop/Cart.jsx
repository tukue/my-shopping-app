import { useState } from 'react';

function Cart() {
  // Basic cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 19.99,
      quantity: 1
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      quantity: 1
    }
  ]);

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {/* Cart Items */}
          {cartItems.map(item => (
            <div key={item.id} className="border-b p-4 flex justify-between">
              <div>
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Cart Total */}
          <div className="mt-4">
            <p className="font-bold">Total: ${total.toFixed(2)}</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => alert("Checkout not implemented")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
