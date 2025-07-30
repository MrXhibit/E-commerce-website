import React from 'react';

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register; 