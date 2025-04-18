'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function PaymentForm() {
  const [tier, setTier] = useState('basic');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const response = await axios.post('/api/subscribe', { tier });
      setMessage(`Subscription created. ID: ${response.data.subscription_id}`);
    } catch (error) {
      setMessage('Error subscribing');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-foreground mb-4">Choose a Plan</h2>
      <select
        className="w-full p-2 mb-4 border border-border rounded"
        value={tier}
        onChange={(e) => setTier(e.target.value)}
      >
        <option value="basic">Basic - ₹999/month (100 calls)</option>
        <option value="pro">Pro - ₹2,999/month (500 calls)</option>
        <option value="enterprise">Enterprise - ₹9,999+/month (Unlimited)</option>
      </select>
      <button
        className="bg-gradient-to-r from-[#D4A373] to-[#6EBF8B] text-white px-4 py-2 rounded-full shadow-md hover:opacity-90 transition duration-300"
        onClick={handleSubscribe}
      >
        Subscribe
      </button>
      {message && <p className="mt-4 text-foreground">{message}</p>}
    </div>
  );
}
