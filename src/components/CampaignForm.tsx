"use client";

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase'; // Import client-side auth

export default function CampaignForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  // const [error, setError] = useState(''); // Optional: for more specific error UI

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    // setError(''); // Clear previous errors if using a separate error state

    if (!auth.currentUser) {
      setMessage('Error: You must be logged in to create a campaign.');
      // Or use a toast notification:
      // toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const userId = auth.currentUser.uid;
    let token;
    try {
      token = await auth.currentUser.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      setMessage('Error: Could not authenticate your session. Please try logging in again.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/campaigns',
        {
          name,
          user_id: userId, // Use the actual user ID
          platforms: ['linkedin'] // Example platform
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage(`Campaign created with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Error creating campaign: ${error.response.data.error || error.message}. Ensure you are logged in and try again.`);
      } else {
        setMessage('Error creating campaign. Ensure you are logged in and try again.');
      }
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className="w-full p-3 border border-input bg-background rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-primary transition duration-300"
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