import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-blue-600 underline">Go to Products</Link>
        </div>
      ) : (
        <>
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-12 object-cover rounded" />
                    <span>{item.name}</span>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => dispatch(clearCart())}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Clear Cart
            </button>
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
          </div>
          <Link
            to="/checkout"
            className="w-full block bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-center"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart; 