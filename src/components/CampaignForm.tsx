"use client";

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CampaignForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/campaigns', { name, user_id: 'user123', platforms: ['linkedin'] });
      setMessage(`Campaign created with ID: ${response.data.id}`);
    } catch (error) {
      setMessage('Error creating campaign');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-6 max-w-md mx-auto bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Create a Campaign</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-input bg-background rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Campaign Name"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-md hover:bg-primary/90 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-primary transition duration-300"
        >
          Create Campaign
        </button>
      </form>
      {message && <p className="mt-4 text-center text-muted-foreground">{message}</p>}
    </motion.div>
  );
}