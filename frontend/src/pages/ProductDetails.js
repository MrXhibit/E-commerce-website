import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/400x300?text=Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    image: 'https://via.placeholder.com/400x300?text=Smart+Watch',
    description: 'Feature-rich smart watch with health tracking and notifications.',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 59.99,
    image: 'https://via.placeholder.com/400x300?text=Speaker',
    description: 'Portable Bluetooth speaker with deep bass and clear sound.',
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-blue-600 underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded mb-6" />
      <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
      <p className="text-lg mb-4">{product.description}</p>
      <p className="text-2xl font-bold mb-6">${product.price}</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-4"
        onClick={() => dispatch(addToCart(product))}
      >
        Add to Cart
      </button>
      <div>
        <Link to="/products" className="text-blue-600 underline">Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetails; 