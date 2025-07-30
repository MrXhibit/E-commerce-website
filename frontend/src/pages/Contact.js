import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaPhone className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">+1 (234) 567-890</p>
                <p className="text-gray-600">+1 (234) 567-891</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaEnvelope className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">info@eshop.com</p>
                <p className="text-gray-600">support@eshop.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Shopping Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaClock className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Our Location</h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">How can I track my order?</h3>
            <p className="text-gray-600">
              You can track your order by logging into your account and visiting the "My Orders" section.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What is your return policy?</h3>
            <p className="text-gray-600">
              We offer a 30-day return policy for most items. Please check the product page for specific details.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
            <p className="text-gray-600">
              Yes, we ship to most countries. Shipping costs and delivery times vary by location.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How can I contact customer support?</h3>
            <p className="text-gray-600">
              You can reach our customer support team via email, phone, or through the contact form above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 