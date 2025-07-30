import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 999.99,
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200?text=Headphones',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 1499.99,
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 599.99,
      rating: 4.2,
      image: 'https://via.placeholder.com/300x200?text=Speaker',
    },
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', count: 150 },
    { name: 'Fashion', icon: '👕', count: 200 },
    { name: 'Home & Garden', icon: '🏠', count: 100 },
    { name: 'Sports', icon: '⚽', count: 80 },
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to E-Shop
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter for the latest products and exclusive offers.
          </p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home; 