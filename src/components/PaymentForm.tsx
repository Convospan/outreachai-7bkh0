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

  const handleSubscribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // Placeholder: Replace with actual API endpoint if needed
      // const response = await axios.post('/api/subscribe', { tier });
      // setMessage(`Subscription created. ID: ${response.data.subscription_id}`);
       setMessage(`Subscribed to ${tier} tier (Placeholder)`);
    } catch (error) {
      setMessage('Error subscribing (Placeholder)');
    }
  };

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold mb-4 text-center text-foreground">Select Your Plan</h3>
      <select
        value={tier}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTier(e.target.value)}
        className="w-full p-3 mb-6 border border-input bg-background rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="basic">Basic - ₹999/month (100 calls)</option>
        <option value="pro">Pro - ₹2,999/month (500 calls)</option>
        <option value="enterprise">Enterprise - ₹9,999+/month (Unlimited)</option>
      </select>
      <button
        onClick={handleSubscribe}
        className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-md hover:bg-primary/90 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-primary transition duration-300"
      >
        Subscribe Now!
      </button>
      {message && <p className="mt-4 text-center text-muted-foreground">{message}</p>}
    </motion.div>
  );
}