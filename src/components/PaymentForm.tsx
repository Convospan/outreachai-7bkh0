"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function PaymentForm() {
  const [tier, setTier] = useState('basic');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/subscribe', { tier });
      setMessage(`Subscription created. ID: ${response.data.subscription_id}`);
    } catch (error) {
      setMessage('Error subscribing');
    }
  };

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Select Your Plan</h3>
      <select
        value={tier}
        onChange={(e) => setTier(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
      >
        <option value="basic">Basic - ₹999/month (100 calls)</option>
        <option value="pro">Pro - ₹2,999/month (500 calls)</option>
        <option value="enterprise">Enterprise - ₹9,999+/month (Unlimited)</option>
      </select>
      <button
        onClick={handleSubscribe}
        className="w-full bg-gray-950 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 transition duration-300"
      >
        Subscribe Now!
      </button>
      {message && <p className="mt-4 text-center text-text-dark">{message}</p>}
    </motion.div>
  );
}
