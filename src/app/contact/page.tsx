'use client';

import React, { useState } from 'react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmissionResult(null); // Clear previous results

    try {
      // Simulate sending data to tewari.85 (replace with actual API call if needed)
      const formData = { name, email, message };
      console.log('Form Data:', formData);

      // In a real implementation, you would send this data to a backend
      // endpoint that would then forward it to tewari.85.  Since this is a
      // front-end only simulation, we're just logging the data.

      // Simulate success
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionResult('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      }, 2000); // Simulate a 2-second delay
    } catch (error: any) {
      setIsSubmitting(false);
      setSubmissionResult(`Error sending message: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h1>
      <p className="mb-4 text-foreground">
        We would love to hear from you! Send us a message and we will get back to you as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2 text-foreground">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-input border-border text-foreground"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2 text-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-input border-border text-foreground"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-bold mb-2 text-foreground">
            Message
          </label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-input border-border text-foreground"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {submissionResult && (
          <p className="mt-4 text-center text-muted-foreground">{submissionResult}</p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
