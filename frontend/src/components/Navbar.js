import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">
        <Link to="/">E-Shop</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/cart" className="hover:underline relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-2 py-0.5 font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/login" className="hover:bg-blue-700 px-3 py-1 rounded transition">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar; 