"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Label } from '@/components/ui/label'; // Assuming you have a Label component

export default function CampaignForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

 useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await axios.post('/api/campaigns', { name, user_id: 'user123', platforms: ['linkedin'] }); // Replace 'user123'
      // setMessage(`Campaign created with ID: ${response.data.id}`);
      setMessage(`Campaign "${name}" created successfully! (Simulated)`);
      setName(''); // Clear input after submission
    } catch (error) {
      console.error('Error creating campaign:', error);
      setMessage('Error creating campaign. Please try again.');
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
      className="mt-8 p-6 max-w-md mx-auto bg-card rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 drop-shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-6 text-center text-card-foreground">Create a New Campaign</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="campaignName" className="text-sm font-medium text-card-foreground">Campaign Name</Label>
          <Input
            id="campaignName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full"
            placeholder="E.g., Q3 Product Launch"
            disabled={isLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full text-lg py-3"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </form>
      {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-destructive' : 'text-green-600'}`}>{message}</p>}
    </motion.div>
  );
}
