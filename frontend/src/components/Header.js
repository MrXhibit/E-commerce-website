import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [searchQuery, setSearchQuery] = useState("");
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <>
      <header className="bg-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Free Shipping Over Rs 1000</p>
            </div>
            <div>
              <p className="text-sm">
                Hotline: <a href="tel:+1234567890" className="underline">+91 1234567890</a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                E-Shop
              </Link>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <BsSearch size={20} />
                </button>
              </form>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/wishlist" className="relative text-gray-600 hover:text-blue-600">
                <FaHeart size={20} />
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                <FaUser size={20} />
              </Link>
            </div>
          </div>
          <nav className="mt-4">
            <div className="flex space-x-8 justify-center">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium">
                Products
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header; 