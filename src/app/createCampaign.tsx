"use client";
import { useState } from 'react';
import axios from 'axios';
import {useRouter} from "next/navigation";

export default function CampaignForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/campaigns', { name, user_id: 'user123', platforms: ['linkedin'] });
      setMessage(`Campaign created with ID: ${response.data.id}`);
    } catch (error) {
      setMessage('Error creating campaign');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className="w-full p-2 mb-4 border border-border rounded"
          placeholder="Campaign Name"
        />
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-md">
          Create Campaign
        </button>
      </form>
      {message && <p className="mt-4 text-foreground">{message}</p>}
    </div>
  );
}
