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
    
      
        Select Your Plan
        
          <option value="basic">Basic - ₹999/month (100 calls)</option>
          <option value="pro">Pro - ₹2,999/month (500 calls)</option>
          <option value="enterprise">Enterprise - ₹9,999+/month (Unlimited)</option>
        
        
          Subscribe Now!
        
        {message &&  {message}}
      
    
  );
}
