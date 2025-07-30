import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/200x150?text=Headphones',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    image: 'https://via.placeholder.com/200x150?text=Smart+Watch',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 59.99,
    image: 'https://via.placeholder.com/200x150?text=Speaker',
  },
];

const Products = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="mb-4 w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-lg font-bold mb-4">${product.price}</p>
            <Link to={`/products/${product.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 