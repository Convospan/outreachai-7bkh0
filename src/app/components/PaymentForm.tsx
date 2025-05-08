"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export default function PaymentForm() {
  const [tier, setTier] = useState('basic');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubscribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await axios.post('/api/subscribe', { tier, userId: 'user123' }); // Replace 'user123' with actual user ID
      // setMessage(`Successfully subscribed to ${tier} tier. Subscription ID: ${response.data.subscription_id}`);
      setMessage(`Successfully subscribed to ${tier} tier. (Simulated)`);
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Error subscribing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 drop-shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-6 text-center text-card-foreground">Select Your Plan</h3>
      <div className="space-y-4">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full p-3 border border-input bg-background rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
          disabled={isLoading}
        >
          <option value="basic">Basic - ₹999/month (100 calls)</option>
          <option value="pro">Pro - ₹2,999/month (500 calls)</option>
          <option value="enterprise">Enterprise - ₹9,999+/month (Unlimited)</option>
        </select>
        <Button
          onClick={handleSubscribe}
          className="w-full text-lg py-3"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Subscribe Now!'}
        </Button>
      </div>
      {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-destructive' : 'text-green-600'}`}>{message}</p>}
    </motion.div>
  );
}
