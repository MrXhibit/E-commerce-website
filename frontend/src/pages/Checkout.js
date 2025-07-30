import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postal: '',
    country: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setOrderPlaced(true);
    dispatch(clearCart());
    setTimeout(() => navigate('/'), 2500);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
        <p className="mb-4">Thank you for your purchase. You will be redirected to the homepage.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Address</label>
            <input name="address" value={form.address} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">City</label>
            <input name="city" value={form.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Postal Code</label>
            <input name="postal" value={form.postal} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Country</label>
            <input name="country" value={form.country} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Place Order</button>
        </form>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 